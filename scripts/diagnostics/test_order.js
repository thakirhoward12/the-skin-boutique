import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function createTestOrder() {
  const orderData = {
    items: [
      {
        id: 'test-item-1',
        sku: 'TEST-SKU-001',
        name: 'Test Product',
        price: 100,
        quantity: 1,
      }
    ],
    subtotal: 100,
    shipping: 10,
    total: 110,
    status: 'paid', // explicitly mark as paid to trigger function
    paymentMethod: 'wallet',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    shippingAddress: {
      firstName: 'Test',
      lastName: 'User',
      address1: '123 Test St',
      city: 'Test City',
      province: 'Test Province',
      country: 'South Africa',
      zipCode: '1234'
    },
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await db.collection('orders').add(orderData);
    console.log('Successfully created test order with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating test order:', error);
  }
}

createTestOrder();
