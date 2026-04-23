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

async function diagnose() {
  console.log("--- Firestore Product Diagnosis ---");
  const snapshot = await db.collection('products').limit(5).get();
  
  if (snapshot.empty) {
    console.log("No products found in Firestore.");
  } else {
    snapshot.forEach(doc => {
      const p = doc.data();
      console.log(`ID: ${doc.id} | Title: ${p.title} | Price: ${p.price} | Brand: ${p.brand}`);
    });
  }

  console.log("\n--- Local products.json Diagnosis ---");
  if (fs.existsSync('./public/data/products.json')) {
    const local = JSON.parse(fs.readFileSync('./public/data/products.json', 'utf8'));
    console.log(`Local items: ${local.length}`);
    if (local.length > 0) {
      const p = local[0];
      console.log(`First Local ID: ${p.id} | Price: ${p.price}`);
    }
  } else {
    console.log("products.json NOT found.");
  }
}

diagnose().catch(console.error);
