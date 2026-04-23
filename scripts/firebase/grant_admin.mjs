import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

async function run() {
  const serviceAccount = JSON.parse(await readFile('./serviceAccountKey.json', 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  const auth = getAuth();
  const db = getFirestore();

  try {
    const user = await auth.getUserByEmail('theskinboutique.dev@gmail.com');
    await db.collection('admins').doc(user.uid).set({
      email: user.email,
      role: 'superadmin',
      grantedAt: FieldValue.serverTimestamp()
    });
    console.log(`Successfully granted admin privileges to UID: ${user.uid}`);
  } catch (error) {
    console.error("Failed to grant admin:", error);
  }
}

run();
