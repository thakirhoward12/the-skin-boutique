import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkOrder() {
  const orderId = 'rvHnMlPxAVaZ0TIoPZTm'; // The ID we just generated
  const doc = await db.collection('orders').doc(orderId).get();
  
  if (doc.exists) {
    const data = doc.data();
    console.log('Order status:', data.status);
    console.log('Shopify Sync Status:', data.shopifySyncStatus);
    console.log('Shopify Order ID:', data.shopifyOrderId);
    if (data.shopifySyncError) {
      console.log('Shopify Sync Error:', data.shopifySyncError);
    }
  } else {
    console.log('Order not found!');
  }
}

checkOrder();
