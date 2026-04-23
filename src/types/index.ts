import { Timestamp } from 'firebase/firestore';

// ─── Product Types ────────────────────────────────────────────────
export interface Product {
  id: string;
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
  sourcePrice?: number;
  sourceUrl?: string;
  lastPriceCheck?: string;
  priceStatus?: 'verified' | 'review_required' | 'stale';
  leadTimeDays?: number;
  sourceDomain?: string;
}

// ─── Cart Types ──────────────────────────────────────────────────
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
  supplierId?: 'teemdrop' | 'abw' | 'local';
  bundleId?: string;
  sourceUrl?: string;
  sourcePrice?: number;
}

// ─── Order Types ──────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'fulfilled';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
  supplierId?: 'teemdrop' | 'abw' | 'local';
  sourceUrl?: string;
  sourcePrice?: number;
  bundleId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  customerEmail: string;
  customerName?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentReference?: string;
  shopifySyncStatus?: 'success' | 'failed';
  shopifySyncError?: string;
  shopifyOrderId?: string | number;
  shopifySyncTimestamp?: Timestamp | Date;
  purchaseLedgerStatus?: 'pending' | 'generated' | 'fulfilled';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ─── User & Profile Types ──────────────────────────────────────────
export type SkinType = 'All' | 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive' | 'Combo' | 'Acne-Prone' | 'Mature';
export type Concern = 'Acne & Blemishes' | 'Anti-Aging' | 'Redness & Sensitivity' | 'Dryness & Hydration' | 'Dullness' | 'Pores';

export type AffiliateTier = 'Bronze' | 'Silver' | 'Gold';

export interface SkinProfile {
  skinType: SkinType | string;
  concern: Concern | string;
  walletBalance: number;
  affiliateCode: string;
  referredBy?: string;
  displayName?: string;
  email?: string;
  tier: AffiliateTier;
  referralCount: number;
  hasUsedReferralDiscount: boolean;
}
