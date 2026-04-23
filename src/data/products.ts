import { Product } from '../types';

// No longer importing brand files to keep bundle size small and fix build memory issues.
// The catalog is now loaded dynamically from /public/data/products.json or Firestore.
const allProducts: Product[] = [];

export const products: Product[] = allProducts;
