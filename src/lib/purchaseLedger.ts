/**
 * Purchase Ledger — Post-Purchase Fulfillment Signal System
 * 
 * When a customer pays, this module generates a "what to buy" list
 * for the store operator, ensuring each item is sourced within the
 * 45% margin target.
 */

import { collection, addDoc, Timestamp, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { getMaxBuyPrice, calculateMargin, TARGET_MARGIN } from './pricingEngine';
import type { PurchaseLedgerEntry } from './pricingEngine';

/**
 * Generate purchase ledger entries for a paid order.
 * Each item in the order gets its own entry with:
 * - Source URL (if known)
 * - Maximum price to pay at source to maintain margin
 * - Customer shipping details
 */
export async function generatePurchaseLedger(order: {
  id: string;
  orderNumber: string;
  items: Array<{
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    sku?: string;
    supplierId?: string;
    sourceUrl?: string;
    sourcePrice?: number;
    bundleId?: string;
  }>;
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
}): Promise<string[]> {
  const ledgerIds: string[] = [];

  for (const item of order.items) {
    const maxBuyPrice = getMaxBuyPrice(item.price);
    const currentMargin = item.sourcePrice 
      ? calculateMargin(item.price, item.sourcePrice)
      : TARGET_MARGIN; // Assume target if source price unknown

    const entry: Omit<PurchaseLedgerEntry, 'createdAt'> & { createdAt: Timestamp } = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      productId: String(item.id),
      productName: item.title,
      sku: item.sku || String(item.id),
      quantity: item.quantity,
      sourceUrl: item.sourceUrl || '',
      maxBuyPrice: Math.round(maxBuyPrice * 100) / 100,
      currentSourcePrice: item.sourcePrice || 0,
      retailPrice: item.price,
      margin: Math.round(currentMargin * 10000) / 100, // Store as percentage
      bundleId: item.bundleId,
      customerName: order.customerName || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
      customerEmail: order.customerEmail,
      shippingAddress: {
        firstName: order.shippingAddress?.firstName || '',
        lastName: order.shippingAddress?.lastName || '',
        address1: order.shippingAddress?.address1 || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        zipCode: order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || 'South Africa',
      },
      status: 'pending',
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'purchaseLedger'), entry);
      ledgerIds.push(docRef.id);
    } catch (error) {
      console.error(`Failed to create ledger entry for ${item.title}:`, error);
    }
  }

  return ledgerIds;
}

/**
 * Get all pending purchase ledger entries (items that need to be bought).
 */
export async function getPendingPurchases(): Promise<(PurchaseLedgerEntry & { docId: string })[]> {
  try {
    const q = query(collection(db, 'purchaseLedger'), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      docId: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() || new Date(),
    })) as any;
  } catch (error) {
    console.error('Failed to fetch pending purchases:', error);
    return [];
  }
}

/**
 * Mark a purchase ledger entry as purchased.
 */
export async function markAsPurchased(docId: string, actualPrice?: number): Promise<void> {
  try {
    const updates: any = {
      status: 'purchased',
      purchasedAt: Timestamp.now(),
    };
    if (actualPrice !== undefined) {
      updates.actualPurchasePrice = actualPrice;
    }
    await updateDoc(doc(db, 'purchaseLedger', docId), updates);
  } catch (error) {
    console.error('Failed to mark as purchased:', error);
    throw error;
  }
}

/**
 * Mark a purchase ledger entry as out of stock at source.
 */
export async function markAsOutOfStock(docId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'purchaseLedger', docId), {
      status: 'out_of_stock',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to mark as out of stock:', error);
    throw error;
  }
}
