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

async function inspectLastOrder() {
  const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(1).get();
  if (snapshot.empty) return;

  const doc = snapshot.docs[0];
  console.log('FULL ORDER JSON:');
  console.log(JSON.stringify(doc.data(), null, 2));
}

inspectLastOrder();
