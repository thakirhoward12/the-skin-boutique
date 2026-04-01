import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

async function run() {
  const serviceAccount = JSON.parse(await readFile('./serviceAccountKey.json', 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();
  const ordersRef = await db.collection('orders').get();
  
  console.log(`Found ${ordersRef.docs.length} total orders.`);
  
  ordersRef.docs.forEach(doc => {
    const data = doc.data();
    console.log(`Order ID: ${doc.id}`);
    console.log(`Status: ${data.status}`);
    console.log(`Total: ${data.total}`);
    console.log(`Created: ${data.createdAt ? new Date(data.createdAt._seconds * 1000) : 'Unknown'}`);
    console.log('---');
  });
}

run().catch(console.error);
