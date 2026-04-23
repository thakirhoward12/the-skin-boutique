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

async function checkRecentOrders() {
  console.log('Fetching last 5 orders from Firestore...');
  const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(5).get();
  
  if (snapshot.empty) {
    console.log('No orders found.');
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('--- Order ID:', doc.id, '---');
    console.log('Order Number:', data.orderNumber);
    console.log('Status:', data.status);
    console.log('Payment Method:', data.paymentMethod);
    console.log('Shopify Sync Status:', data.shopifySyncStatus || 'N/A');
    console.log('Shopify Sync Error:', data.shopifySyncError || 'N/A');
    console.log('Shopify Order ID:', data.shopifyOrderId || 'N/A');
    console.log('Items Count:', data.items?.length || 0);
    console.log('Created At:', data.createdAt?.toDate?.() || data.createdAt);
  });
}

checkRecentOrders();
