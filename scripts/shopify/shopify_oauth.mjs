import http from 'http';
import url from 'url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

// Shopify Credentials
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const SHOP = process.env.SHOPIFY_SHOP || '0tm11j-01.myshopify.com';
const REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI || 'http://localhost:3000/callback';
const SCOPES = 'write_orders,read_orders,write_customers,read_customers,read_products,write_products';

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/login') {
    const installUrl = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
    res.writeHead(302, { 'Location': installUrl });
    res.end();
  } 
  else if (reqUrl.pathname === '/callback') {
    const code = reqUrl.query.code;
    
    if (!code) {
      res.writeHead(400);
      res.end('Missing code parameter. OAuth failed. Did you approve the installation?');
      return;
    }

    try {
      console.log('🔄 Got authorization code, exchanging for access token...');
      
      const response = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code
        })
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        console.error('❌ Failed to get access token:', data);
        res.writeHead(400);
        res.end(`Failed to get access token: ${JSON.stringify(data)}`);
        return;
      }

      console.log('✅ Access token received!');
      
      // Save directly to Firestore config
      await db.collection('config').doc('shopify').set({
        shop: SHOP,
        accessToken: data.access_token,
        updatedAt: new Date()
      }, { merge: true });

      console.log('✅ SUCCESS! Shopify token saved securely to Firestore.');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; text-align: center;">
            <h1 style="color: #4CAF50;">Authentication Successful! 🎉</h1>
            <p style="font-size: 18px;">The Skin Boutique backend is now fully connected to Shopify.</p>
            <p style="color: #666;">The permanent access token has been securely injected into your Firestore database. You can close this window and stop the terminal script.</p>
        </div>
      `);
      
      // Gracefully exit the script after saving
      setTimeout(() => process.exit(0), 1500);

    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end('Internal Server Error while saving to Firestore.');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
    console.log('=====================================================');
    console.log('🚀 Local Shopify OAuth Server is running!');
    console.log('=====================================================');
    console.log('STEP 1: Go to your Shopify Partners Dashboard -> Apps -> Your App -> "App setup"');
    console.log('STEP 2: Under "Allowed redirection URL(s)", add this exact URL and click Save:');
    console.log('\x1b[36mhttp://localhost:3000/callback\x1b[0m');
    console.log('-----------------------------------------------------');
    console.log('STEP 3: Click the link below to install/authenticate the app on your store!');
    console.log('\x1b[32mhttp://localhost:3000/login\x1b[0m');
    console.log('=====================================================');
});
