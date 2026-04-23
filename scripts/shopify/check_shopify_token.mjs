import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkShopifyToken() {
  try {
    const configDoc = await db.collection('config').doc('shopify').get();
    
    if (!configDoc.exists) {
      console.log('❌ Shopify config document does not exist.');
      return;
    }
    
    const data = configDoc.data();
    const shop = data.shop;
    const token = data.accessToken;
    
    if (!shop || !token) {
      console.log('❌ Shopify config is missing shop or accessToken fields.');
      console.log('Current Data:', data);
      return;
    }

    console.log(`✅ Found Shopify config for shop: ${shop}`);
    console.log(`Checking token validity with Shopify API...`);

    // Verify token by fetching store information
    const response = await fetch(`https://${shop}/admin/api/2023-10/shop.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const shopData = await response.json();
      console.log(`✅ Token is VALID for store: ${shopData.shop.name} (${shopData.shop.domain})`);
    } else {
      console.log(`❌ Token is INVALID or Expired. Shopify API returned status: ${response.status}`);
      const errBody = await response.text();
      console.log(`Error details: ${errBody}`);
    }

  } catch (error) {
    console.error('❌ Error checking Shopify token:', error);
  }
}

checkShopifyToken();
