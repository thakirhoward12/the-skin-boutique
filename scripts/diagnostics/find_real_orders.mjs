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

async function findNonTestOrders() {
  console.log('Searching for non-test orders...');
  const snapshot = await db.collection('orders').get();
  
  let count = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.customerName !== 'Test User' && data.customerEmail !== 'test@example.com') {
      console.log('FOUND REAL ORDER:', doc.id);
      console.log('Customer:', data.customerName, '(', data.customerEmail, ')');
      console.log('Status:', data.status);
      console.log('Sync Status:', data.shopifySyncStatus || 'N/A');
      count++;
    }
  });

  if (count === 0) {
    console.log('NO REAL ORDERS FOUND IN FIRESTORE.');
  }
}

findNonTestOrders();
