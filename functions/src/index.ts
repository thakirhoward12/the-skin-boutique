import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI, Type } from "@google/genai";
import * as admin from "firebase-admin";

const allowedOrigins = [
  "https://the-skin-boutique.web.app",
  "https://the-skin-boutique.firebaseapp.com",
  "http://localhost:5173"
];

admin.initializeApp();

// Ensure function is deployed in the same region as the database
setGlobalOptions({ maxInstances: 10 });

// Securely grab Yoco Secret Key from .env variables
const getYOCOSecret = () => {
    const key = process.env.YOCO_SECRET_KEY;
    if (!key) throw new Error("YOCO_SECRET_KEY is utterly missing from backend configuration.");
    return key;
};

/**
 * Cloud Function to create a Yoco checkout session.
 * Called by the frontend to get a redirectUrl for payment.
 */
export const createYocoCheckout = onRequest(
    { 
        region: "africa-south1",
        cors: allowedOrigins 
    },
    async (req, res) => {
        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        const { amountInCents, currency, metadata } = req.body;

        if (!amountInCents || !currency) {
            res.status(400).json({ error: "Missing required fields: amountInCents, currency" });
            return;
        }

        try {
            // Determine the base URL for redirects
            const origin = req.headers.origin || req.headers.referer || "https://the-skin-boutique.web.app";
            const baseUrl = origin.replace(/\/$/, "");

            const checkoutPayload = {
                amount: amountInCents,
                currency: currency,
                successUrl: `${baseUrl}/?payment=success`,
                cancelUrl: `${baseUrl}/?payment=cancelled`,
                failureUrl: `${baseUrl}/?payment=failed`,
                metadata: metadata || {}
            };

            logger.info("Creating Yoco checkout session", { payload: checkoutPayload });

            const response = await fetch("https://payments.yoco.com/api/checkouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getYOCOSecret()}`
                },
                body: JSON.stringify(checkoutPayload)
            });

            const data = await response.json();

            if (!response.ok) {
                logger.error("Yoco API Error", { data });
                res.status(response.status).json({ error: data });
                return;
            }

            logger.info("Yoco checkout session created successfully", { sessionId: data.id });
            res.status(200).json({
                id: data.id,
                redirectUrl: data.redirectUrl
            });

        } catch (error) {
            logger.error("Failed to create Yoco checkout", { error });
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Unknown error" 
            });
        }
    }
);

// Helper to read Shopify credentials securely from the environment config
const getShopifyClientConfig = () => {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error("Missing Shopify API configurations in backend environment variables.");
    }
    return { clientId, clientSecret };
};

/**
 * Cloud Function to initiate Shopify OAuth flow.
 * Redirects the merchant to the Shopify permissions authorization screen.
 */
export const shopifyAuth = onRequest({ region: "africa-south1", cors: true }, (req, res) => {
    const shop = req.query.shop;
    if (!shop || typeof shop !== 'string') {
        res.status(400).send('Missing "shop" query parameter. Provide it like ?shop=yourstore.myshopify.com');
        return;
    }
    const redirectUri = `https://${req.get("host")}/shopifyCallback`;
    const scopes = "write_orders,read_orders,write_products,read_products";
    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${getShopifyClientConfig().clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    res.redirect(installUrl);
});

/**
 * Cloud Function to handle the Shopify OAuth callback.
 * Exchanges the code for a permanent offline access token and saves it to Firestore.
 */
export const shopifyCallback = onRequest({ region: "africa-south1", cors: true }, async (req, res) => {
    const { shop, code } = req.query;
    if (!shop || !code || typeof shop !== 'string' || typeof code !== 'string') {
        res.status(400).send('Missing shop or code parameter');
        return;
    }
    try {
        const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: getShopifyClientConfig().clientId,
                client_secret: getShopifyClientConfig().clientSecret,
                code
            })
        });
        const data = await response.json();
        
        if (data.access_token) {
            await admin.firestore().collection('config').doc('shopify').set({
                accessToken: data.access_token,
                shop: shop,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            res.send('Successfully installed Shopify App! The backend is now connected. You can close this window.');
        } else {
            console.error("Token exchange failed:", data);
            res.status(400).send('Failed to get access token: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Callback error:", error);
        res.status(500).send('Error during callback');
    }
});

/**
 * Cloud Function to listen for new paid orders in Firestore 
 * and automatically forward them to Shopify so our suppliers can fulfill them.
 */
export const syncOrderToShopify = onDocumentCreated(
    {
        document: "orders/{orderId}",
        region: "africa-south1" // explicitly set to match firestore's implied region from error log
    }, 
    async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const orderData = snapshot.data();
    logger.info(`Processing new order for Shopify sync`, { orderId: event.params.orderId });

    // Ensure we only process paid orders (or however your application flags them)
    if (orderData.status !== 'paid' && orderData.status !== 'processing') {
        logger.info(`Order ${event.params.orderId} is not paid. Status: ${orderData.status}. Skipping Shopify sync.`);
        return;
    }

    try {
        // 1. Map Firestore cart items to Shopify line items
        const lineItems = orderData.items.map((item: any) => ({
            // It is CRITICAL that the SKU matches the SKU generated by our suppliers in Shopify
            sku: item.sku || item.id,
            title: item.name,
            price: item.price.toString(),
            quantity: item.quantity,
            requires_shipping: true
        }));

        // 2. Map Firestore shipping address to Shopify shipping address
        const shippingAddress = orderData.shippingAddress || {};
        const customerName = orderData.customerName || '';
        
        // 3. Construct the Payload for Shopify's REST Admin API
        const shopifyOrderPayload = {
            order: {
                line_items: lineItems,
                customer: {
                    first_name: shippingAddress.firstName || customerName.split(' ')[0] || '',
                    last_name: shippingAddress.lastName || customerName.split(' ')[1] || '',
                    email: orderData.customerEmail,
                },
                billing_address: {
                    first_name: shippingAddress.firstName || '',
                    last_name: shippingAddress.lastName || '',
                    address1: shippingAddress.address1 || '',
                    address2: shippingAddress.address2 || '',
                    city: shippingAddress.city || '',
                    province: shippingAddress.state || '',
                    country: shippingAddress.country || 'South Africa',
                    zip: shippingAddress.zipCode || ''
                },
                shipping_address: {
                    first_name: shippingAddress.firstName || '',
                    last_name: shippingAddress.lastName || '',
                    address1: shippingAddress.address1 || '',
                    address2: shippingAddress.address2 || '',
                    city: shippingAddress.city || '',
                    province: shippingAddress.state || '',
                    country: shippingAddress.country || 'South Africa',
                    zip: shippingAddress.zipCode || ''
                },
                email: orderData.customerEmail,
                financial_status: "paid", // Tell our suppliers it's already paid so it triggers fulfillment
                tags: "OurSuppliers_Import, Firebase_Sync",
                note: `Imported from The Skin Boutique Firebase. Original Order Number: ${orderData.orderNumber || event.params.orderId}`,
                send_receipt: false, // Don't send a shopify receipt, we handle emails
                send_fulfillment_receipt: false
            }
        };

        // Fetch Shopify config dynamically from Firestore so it works with OAuth tokens
        const configDoc = await admin.firestore().collection('config').doc('shopify').get();
        if (!configDoc.exists) {
            throw new Error("Shopify backend not connected. Please install the OAuth app first.");
        }
        
        const SHOPIFY_ACCESS_TOKEN = configDoc.data()?.accessToken;
        const SHOPIFY_DOMAIN = configDoc.data()?.shop;

        if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_DOMAIN) {
            throw new Error("Shopify backend configuration is missing the access token or shop domain.");
        }

        // 4. Send the Request to Shopify
        const shopifyEndpoint = `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json`;
        
        logger.info(`Sending compiled payload to Shopify REST destination`, { url: shopifyEndpoint });

        const response = await fetch(shopifyEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
            },
            body: JSON.stringify(shopifyOrderPayload)
        });

        const responseData = await response.json();

        if (!response.ok) {
            logger.error('Shopify API Order Creation Error', { responseData });
            throw new Error(`Shopify API failed: ${JSON.stringify(responseData)}`);
        }

        logger.info(`Successfully synchronized Shopify Order!`, { shopifyOrderId: responseData.order.id, firebaseOrderId: event.params.orderId });

        // 5. Update Firebase document to mark it as synced
        await snapshot.ref.update({
            shopifyOrderId: responseData.order.id,
            shopifySyncStatus: 'success',
            shopifySyncTimestamp: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
        console.error('Failed to sync order to Shopify:', error);
        
        // Update Firebase document to mark the sync failure
        await snapshot.ref.update({
            shopifySyncStatus: 'failed',
            shopifySyncError: error instanceof Error ? error.message : 'Unknown error',
            shopifySyncTimestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    }
});

/**
 * Cloud Function to process product images securely on the server via the Gemini API
 * Accepts image URLs from the frontend client and returns the parsed JSON product data.
 */
export const analyzeProductImage = onCall({ region: "africa-south1" }, async (request) => {
    // Only allow authenticated administrators to run extreme inference if desired, 
    // or log analytics so we can trace quota abuse. Right now, it's globally open explicitly for scanner.
    const { imageUrls } = request.data;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new HttpsError("invalid-argument", "Missing or invalid 'imageUrls' parameter.");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        logger.error("GEMINI_API_KEY missing in cloud config!");
        throw new HttpsError("internal", "Server missing Gemini configuration.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey as string });
        const prompt = "Identify the skincare products in these images. For each product, provide: brand, name, category, price (estimate if not clear), description, and ingredients (list). Return as a JSON array.";

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    parts: [
                        { text: prompt },
                        ...imageUrls.map(url => ({ text: `Image: ${url}` }))
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            brand: { type: Type.STRING },
                            name: { type: Type.STRING },
                            category: { type: Type.STRING },
                            price: { type: Type.NUMBER },
                            description: { type: Type.STRING },
                            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["brand", "name", "category", "price", "description", "ingredients"]
                    }
                }
            }
        });

        const products = JSON.parse(response.text || "[]");
        return { products };
    } catch (error: any) {
        logger.error("Gemini AI API execution failed", { error });
        throw new HttpsError("internal", "Failed to parse image data via Gemini", error);
    }
});

/**
 * Secures the referral program.
 * Listens to when a new user signs up with a valid reference code,
 * attributes the signup, credits the referrer, and logs the transaction.
 */
export const handleUserReferralReward = onDocumentCreated(
    { document: "users/{userId}", region: "africa-south1" },
    async (event) => {
        const snapshot = event.data;
        if (!snapshot) return;

        const newUser = snapshot.data();
        const referralCode = newUser.referredBy;

        if (!referralCode) {
            return; // No referral to process
        }

        try {
            logger.info(`Processing referral code ${referralCode} for new user ${event.params.userId}`);
            const usersRef = admin.firestore().collection('users');
            const q = usersRef.where('affiliateCode', '==', referralCode);
            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                logger.warn(`Referral code ${referralCode} is invalid. No referrer found.`);
                return;
            }

            const referrerDoc = querySnapshot.docs[0];
            const referrerId = referrerDoc.id;
            const referrerData = referrerDoc.data();
            
            // Cannot refer themselves (technically prevented by logic flow, but good practice)
            if (referrerId === event.params.userId) {
                return;
            }

            const currentCount = (referrerData.referralCount || 0) + 1;

            // Determine reward amount based on tier
            let rewardAmount = 50; // Bronze default
            let newTier = referrerData.tier || 'Bronze';

            if (currentCount >= 50) {
              newTier = 'Gold';
            } else if (currentCount >= 10) {
              newTier = 'Silver';
            }

            if (newTier === 'Gold') rewardAmount = 100;
            else if (newTier === 'Silver') rewardAmount = 75;

            logger.info(`Rewarding referrer ${referrerId} with ${rewardAmount} for tier ${newTier}`);

            const batch = admin.firestore().batch();

            // 1. Reward the referrer and update their count/tier
            batch.update(usersRef.doc(referrerId), {
                walletBalance: admin.firestore.FieldValue.increment(rewardAmount),
                referralCount: admin.firestore.FieldValue.increment(1),
                tier: newTier
            });

            // 2. Log the transaction securely on the backend
            const txRef = admin.firestore().collection('walletTransactions').doc();
            batch.set(txRef, {
                userId: referrerId,
                amount: rewardAmount,
                type: 'credit',
                description: `Referral reward for ${newUser.email} (${newTier} tier)`,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            logger.info(`Successfully completed referral reward logic for ${referrerId}.`);

        } catch (error) {
            logger.error(`Error processing referral for ${event.params.userId}:`, error);
        }
    }
);
