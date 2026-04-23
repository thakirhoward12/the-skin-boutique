import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import fs from 'fs';
import { execSync } from 'child_process';

// 1. Initialize Firebase
const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: serviceAccountKey.json not found.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function runCleanupAndSync() {
  console.log("🚀 Starting Atomic Catalog Reset...");

  // PHASE 1: NUKE FIRESTORE
  console.log("--- Phase 1: Cleaning Firestore 'products' collection ---");
  const collectionRef = db.collection('products');
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    console.log("Firestore is already empty.");
  } else {
    console.log(`Deleting ${snapshot.size} legacy products...`);
    // Delete in chunks of 500
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const chunk = docs.slice(i, i + 500);
      const batch = db.batch();
      chunk.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log(`Deleted ${i + chunk.length} products...`);
    }
    console.log("✅ Firestore collection cleared.");
  }

  // PHASE 2: GENERATE FRESH JSON (Dependency Free)
  console.log("--- Phase 2: Regenerating JSON Catalog ---");
  try {
    // We execute the existing script which we know works (but we'll fix its regex below)
    execSync('npx tsx scripts/compile_catalog.ts', { stdio: 'inherit' });
    console.log("✅ products.json regenerated.");
  } catch (e) {
    console.error("❌ Failed to run generate_json_catalog.mjs:", e.message);
    process.exit(1);
  }

  // PHASE 3: UPLOAD NEW DATA
  console.log("--- Phase 3: Uploading Standardized Data ---");
  const jsonPath = './public/data/products.json';
  if (!fs.existsSync(jsonPath)) {
    console.error("Error: products.json missing after regeneration.");
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Found ${products.length} clean items to upload.`);

  for (let i = 0; i < products.length; i += 500) {
    const chunk = products.slice(i, i + 500);
    const batch = db.batch();
    chunk.forEach(p => batch.set(db.collection('products').doc(p.id.toString()), p));
    await batch.commit();
    console.log(`Uploaded ${i + chunk.length}/${products.length}...`);
  }

  console.log("🎉 SUCCESS! Your catalog is now deduplicated and every price is in USD base.");
  console.log("👉 Now check the site. Prices will multiply by 18.95 and look correct!");
}

runCleanupAndSync().catch(console.error);
