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
  
  let deletedCount = 0;
  for (const doc of ordersRef.docs) {
    await doc.ref.delete();
    deletedCount++;
    console.log(`Deleted order: ${doc.id}`);
  }
  
  console.log(`Successfully wiped ${deletedCount} test orders. Revenue tracker is now reset to 0.`);
}

run().catch(console.error);
