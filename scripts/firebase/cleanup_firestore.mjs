import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import fs from 'fs';

const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: serviceAccountKey.json not found.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function cleanupDuplicates() {
  console.log("Starting surgical cleanup of stale Firestore entries...");
  
  // 1. Load valid IDs from local products.json
  const products = JSON.parse(fs.readFileSync('./public/data/products.json', 'utf8'));
  const validIds = new Set(products.map(p => p.id.toString()));
  
  console.log(`Loaded ${validIds.size} valid product IDs from local catalog.`);

  // 2. Fetch all current documents from Firestore
  const snapshot = await db.collection('products').get();
  console.log(`Found ${snapshot.size} total entries in Firestore products collection.`);

  let deletedCount = 0;
  const batchLimit = 500;
  let batch = db.batch();
  let operationCount = 0;

  for (const doc of snapshot.docs) {
    if (!validIds.has(doc.id)) {
      // This is a stale entry or an old ID schema result
      batch.delete(doc.ref);
      deletedCount++;
      operationCount++;

      if (operationCount >= batchLimit) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
        console.log(`Committed deletion batch (${deletedCount} total deletions so far)...`);
      }
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  console.log(`Cleanup complete! Deleted ${deletedCount} stale entries.`);
  console.log(`Expected remaining in Firestore: ${snapshot.size - deletedCount}`);
}

cleanupDuplicates().catch(console.error);
