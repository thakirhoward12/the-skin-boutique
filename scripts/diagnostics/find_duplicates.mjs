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

async function findDuplicates() {
  console.log("Searching for duplicate products by Name...");
  const snapshot = await db.collection('products').get();
  
  const seenNames = new Map();
  const duplicates = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const name = (data.name || data.title || '').trim().toLowerCase();
    
    if (seenNames.has(name)) {
      duplicates.push({ id: doc.id, name: data.name || data.title });
    } else {
      seenNames.set(name, doc.id);
    }
  });

  console.log(`Found ${duplicates.length} duplicate products.`);
  duplicates.slice(0, 10).forEach(d => console.log(` - Duplicate: ${d.name} (ID: ${d.id})`));
  
  if (duplicates.length > 0) {
      console.log("\nSuggested action: node cleanup_duplicates.mjs");
  }
}

findDuplicates().catch(console.error);
