import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import fs from 'fs';

// ----------------------------------------------------------------------------
// IMPORTANT INSTRUCTIONS FOR THE USER:
// 1. Go to your Firebase Console -> Project Settings -> Service Accounts
// 2. Click "Generate new private key".
// 3. Save the downloaded JSON file as `serviceAccountKey.json` in the 
//    root of your project (c:\Users\thaki\.gemini\antigravity\playground\golden-glenn\the-skin-boutique\serviceAccountKey.json)
// ----------------------------------------------------------------------------

const serviceAccountPath = './serviceAccountKey.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: serviceAccountKey.json not found.");
  console.error("Please download it from Firebase Console -> Project Settings -> Service accounts -> Generate new private key, and place it in the root folder.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// We will dynamically import the products array just to execute the TS file
// But since the current Node context won't easily execute TS directly, we can use the js compiled version, 
// Or just read the TS file... wait, products.ts is quite complex.
// The easiest way is to use `ts-node` or `tsx` to run this script. We already have `tsx` installed.

async function uploadProducts() {
  console.log("Loading products from local file...");
  // Import products dynamically (requires running with tsx)
  const module = await import('./src/data/products.ts');
  const products = module.products;

  console.log(`Found ${products.length} products to upload.`);

  const batchSize = 500; // max batch size for firestore
  let count = 0;
  
  // We can write sequentially or in batches. Sequential is safer and easier to debug for ~300 items.
  for (const product of products) {
    try {
      // Use the product's numeric ID as the document ID in Firestore for easy indexing
      const docRef = db.collection('products').doc(product.id.toString());
      await docRef.set(product);
      count++;
      if (count % 50 === 0) console.log(`Uploaded ${count}/${products.length}...`);
    } catch (e) {
      console.error(`Failed to upload product ${product.id} : ${product.name}`, e);
    }
  }

  console.log("Finished uploading all products to Firestore!");
}

uploadProducts().catch(console.error);
