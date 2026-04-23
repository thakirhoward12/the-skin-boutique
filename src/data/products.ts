export interface Product {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  image: string;
  textureVideo?: string;
  description: string;
  ingredients: string;
  options?: { size: string; price: number }[];
  idealFor?: { skinType: string[]; concern: string[] }[];
  reviews: { user: string; rating: number; text: string }[];
  supplierId?: 'teemdrop' | 'abw' | 'local';
  sku?: string;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'discontinued' | 'review_required';

  // ─── Arbitrage Tracking Fields ─────────────────────────
  /** Cost price at the source supplier (USD) */
  sourcePrice?: number;
  /** URL to purchase from the source supplier */
  sourceUrl?: string;
  /** ISO timestamp of last price verification */
  lastPriceCheck?: string;
  /** Price verification status */
  priceStatus?: 'verified' | 'review_required' | 'stale';
  /** Estimated lead time in business days for sourcing */
  leadTimeDays?: number;
  /** Source supplier domain for scraper routing */
  sourceDomain?: string;
}

// No longer importing brand files to keep bundle size small and fix build memory issues.
// The catalog is now loaded dynamically from /public/data/products.json or Firestore.
const allProducts: Product[] = [];

export const products: Product[] = allProducts;
