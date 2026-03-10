import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { products } from './src/data/products.ts';
import fs from 'fs';
import { resolve } from 'path';

const serviceAccountPath = resolve('./serviceAccountKey.json');

try {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("serviceAccountKey.json not found in the root directory.");
  }
  
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();

  async function uploadData() {
    console.log(`Starting upload of ${products.length} products to Firestore...`);
    const batch = db.batch();
    const productsRef = db.collection('products');
    
    let count = 0;
    for (const product of products) {
      const docRef = productsRef.doc(product.id.toString());
      batch.set(docRef, product);
      count++;
    }
    
    await batch.commit();
    console.log(`Successfully uploaded ${count} products to Firestore!`);
  }

  uploadData().catch(console.error);

} catch (error) {
  console.error("\n❌ Error:", error.message);
  console.error("To run this migration, you must authenticate as an Admin.");
  console.error("1. Go to Firebase Console -> Project Settings -> Service Accounts");
  console.error("2. Click 'Generate new private key'");
  console.error("3. Save the downloaded file as 'serviceAccountKey.json' in this folder.");
  console.error("4. Run `npx tsx upload_to_firestore.ts` again.\n");
}
