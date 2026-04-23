/**
 * Pricing Engine — The "Source of Truth" for The Skin Boutique
 * 
 * All margin calculations, shipping logic, and pricing guards
 * flow from this single utility. No other file should hardcode
 * pricing constants.
 * 
 * Core Formula: RetailPrice = (LandedCost + Shipping + Fees) / (1 - TARGET_MARGIN)
 * Target Margin: 45% net profit
 */

// ─── Configuration ──────────────────────────────────────────────

/** Target net profit margin (45%) */
export const TARGET_MARGIN = 0.45;

/** Minimum acceptable margin before flagging (40%) */
export const MIN_SAFE_MARGIN = 0.40;

/** Free shipping threshold in ZAR */
export const FREE_SHIPPING_THRESHOLD = 800;

/** Default flat-rate shipping in ZAR when threshold isn't met */
export const DEFAULT_SHIPPING = 120;

/** Default transaction fee rate (Yoco ~2.6% + 0.5% forex buffer) */
export const DEFAULT_TRANSACTION_FEE_RATE = 0.031;

/** Source price change threshold (%) — only trigger update if delta exceeds this */
export const PRICE_DELTA_THRESHOLD = 0.02; // 2%

/** Large price swing threshold — requires manual review */
export const PRICE_REVIEW_THRESHOLD = 0.10; // 10%

/** South African VAT rate */
export const SA_VAT_RATE = 0.15;

/** Default lead time for dropship items (business days) */
export const DROPSHIP_LEAD_TIME_DAYS = { min: 3, max: 5 };

/** Default lead time for wholesale items (business days) */
export const WHOLESALE_LEAD_TIME_DAYS = { min: 5, max: 8 };

/** Default lead time for local items (business days) */
export const LOCAL_LEAD_TIME_DAYS = { min: 1, max: 2 };

// ─── Types ──────────────────────────────────────────────────────

export interface PricingConfig {
  targetMargin: number;
  minSafeMargin: number;
  freeShippingThreshold: number;
  defaultShipping: number;
  transactionFeeRate: number;
}

export interface MarginReport {
  retailPrice: number;
  landedCost: number;
  grossProfit: number;
  margin: number;
  isSafe: boolean;
  needsReview: boolean;
}

export interface PurchaseLedgerEntry {
  orderId: string;
  orderNumber: string;
  productId: string | number;
  productName: string;
  sku: string;
  quantity: number;
  sourceUrl: string;
  maxBuyPrice: number;
  currentSourcePrice: number;
  retailPrice: number;
  margin: number;
  bundleId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'purchased' | 'out_of_stock' | 'price_changed';
  createdAt: Date;
}

export interface PriceAuditEntry {
  productId: string | number;
  productName: string;
  previousPrice: number;
  newPrice: number;
  deltaPercent: number;
  source: string;
  status: 'auto_updated' | 'review_required' | 'no_change' | 'scrape_failed';
  checkedAt: string;
}

// ─── Core Pricing Functions ─────────────────────────────────────

/**
 * Calculate the retail price needed to achieve the target margin.
 * 
 * Formula: Price = (COGS + Shipping + Fees) / (1 - targetMargin)
 * 
 * @param landedCost - The total cost to acquire the product (COGS)
 * @param shippingEstimate - Estimated shipping cost per unit (default: 0)
 * @param transactionFeeRate - Payment processor fee rate (default: 3.1%)
 * @param targetMargin - Desired net profit margin (default: 45%)
 * @returns The minimum retail price in ZAR
 */
export function calculateRetailPrice(
  landedCost: number,
  shippingEstimate: number = 0,
  transactionFeeRate: number = DEFAULT_TRANSACTION_FEE_RATE,
  targetMargin: number = TARGET_MARGIN
): number {
  if (landedCost <= 0) return 0;
  
  const totalCost = landedCost + shippingEstimate;
  // Account for transaction fees being taken from the retail price
  // Price = totalCost / (1 - margin - feeRate)
  const divisor = 1 - targetMargin - transactionFeeRate;
  
  if (divisor <= 0) {
    // If margin + fees >= 100%, return a 3x markup as fallback
    return totalCost * 3;
  }
  
  return Math.ceil(totalCost / divisor * 100) / 100; // Round up to nearest cent
}

/**
 * Calculate the actual margin on a product.
 * 
 * @param retailPrice - The price the customer pays (ZAR)
 * @param landedCost - The total cost to acquire the product (ZAR)
 * @param transactionFeeRate - Payment processor fee rate
 * @returns Margin as a decimal (e.g., 0.45 = 45%)
 */
export function calculateMargin(
  retailPrice: number,
  landedCost: number,
  transactionFeeRate: number = DEFAULT_TRANSACTION_FEE_RATE
): number {
  if (retailPrice <= 0) return 0;
  const fees = retailPrice * transactionFeeRate;
  const profit = retailPrice - landedCost - fees;
  return profit / retailPrice;
}

/**
 * Check if the current margin is above the safety threshold.
 */
export function isMarginSafe(
  retailPrice: number,
  landedCost: number,
  minMargin: number = MIN_SAFE_MARGIN
): boolean {
  return calculateMargin(retailPrice, landedCost) >= minMargin;
}

/**
 * Generate a full margin report for a product.
 */
export function getMarginReport(
  retailPrice: number,
  landedCost: number
): MarginReport {
  const margin = calculateMargin(retailPrice, landedCost);
  return {
    retailPrice,
    landedCost,
    grossProfit: retailPrice - landedCost,
    margin,
    isSafe: margin >= MIN_SAFE_MARGIN,
    needsReview: margin < MIN_SAFE_MARGIN || margin > 0.80, // Also flag if suspiciously high
  };
}

// ─── Price Change Detection ─────────────────────────────────────

/**
 * Determine if a source price change warrants updating the store.
 * 
 * @param currentRetail - Current retail price on our store
 * @param newSourceCost - New cost from the source supplier
 * @param deltaThreshold - Minimum % change to trigger update (default: 2%)
 * @returns Object indicating if update is needed and if manual review is required
 */
export function needsPriceUpdate(
  currentRetail: number,
  newSourceCost: number,
  deltaThreshold: number = PRICE_DELTA_THRESHOLD
): { shouldUpdate: boolean; requiresReview: boolean; deltaPercent: number; suggestedRetail: number } {
  if (currentRetail <= 0 || newSourceCost <= 0) {
    return { shouldUpdate: false, requiresReview: false, deltaPercent: 0, suggestedRetail: currentRetail };
  }

  // Calculate what the source cost "should be" based on current retail
  const impliedSourceCost = currentRetail * (1 - TARGET_MARGIN - DEFAULT_TRANSACTION_FEE_RATE);
  const deltaPercent = Math.abs(newSourceCost - impliedSourceCost) / impliedSourceCost;
  const suggestedRetail = calculateRetailPrice(newSourceCost);

  return {
    shouldUpdate: deltaPercent > deltaThreshold,
    requiresReview: deltaPercent > PRICE_REVIEW_THRESHOLD,
    deltaPercent,
    suggestedRetail,
  };
}

// ─── Shipping Logic ─────────────────────────────────────────────

/**
 * Calculate shipping cost based on cart total.
 * Free if above threshold, otherwise flat rate.
 */
export function calculateShipping(cartTotal: number): number {
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return DEFAULT_SHIPPING;
}

/**
 * Calculate how much more the customer needs to spend for free shipping.
 */
export function freeShippingRemaining(cartTotal: number): number {
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
  return remaining > 0 ? remaining : 0;
}

/**
 * Get progress toward free shipping as a percentage (0-100).
 */
export function freeShippingProgress(cartTotal: number): number {
  return Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
}

/**
 * Estimate total bundle weight for shipping calculations.
 * Uses a rough approximation: skincare products average ~200g each.
 */
export function calculateBundleWeight(itemCount: number, avgWeightGrams: number = 200): number {
  return itemCount * avgWeightGrams;
}

// ─── VAT & Display ──────────────────────────────────────────────

/**
 * Format a ZAR price as VAT-inclusive.
 * South African VAT is 15%.
 */
export function formatVATInclusive(priceZAR: number): string {
  // Prices are already displayed as VAT-inclusive (built into the retail price)
  return `R${priceZAR.toFixed(2)}`;
}

/**
 * Calculate the max price you should pay at the source to maintain margin.
 */
export function getMaxBuyPrice(
  retailPrice: number,
  targetMargin: number = TARGET_MARGIN
): number {
  // maxBuy = retail * (1 - margin - fees)
  return retailPrice * (1 - targetMargin - DEFAULT_TRANSACTION_FEE_RATE);
}

// ─── Lead Time Helpers ──────────────────────────────────────────

/**
 * Get a human-readable lead time label based on supplier type.
 */
export function getLeadTimeLabel(
  supplierId?: 'teemdrop' | 'abw' | 'local' | string
): string {
  switch (supplierId) {
    case 'teemdrop':
      return `Ships in ${DROPSHIP_LEAD_TIME_DAYS.min}-${DROPSHIP_LEAD_TIME_DAYS.max} business days`;
    case 'abw':
    case 'kcosw':
      return `Ships in ${WHOLESALE_LEAD_TIME_DAYS.min}-${WHOLESALE_LEAD_TIME_DAYS.max} business days`;
    case 'local':
      return `Ships in ${LOCAL_LEAD_TIME_DAYS.min}-${LOCAL_LEAD_TIME_DAYS.max} business days`;
    default:
      return `Ships in ${DROPSHIP_LEAD_TIME_DAYS.min}-${DROPSHIP_LEAD_TIME_DAYS.max} business days`;
  }
}

/**
 * Get the longest lead time from a mixed cart for setting customer expectations.
 */
export function getCartLeadTime(
  supplierIds: (string | undefined)[]
): { min: number; max: number; label: string } {
  let maxMin = LOCAL_LEAD_TIME_DAYS.min;
  let maxMax = LOCAL_LEAD_TIME_DAYS.max;

  for (const sid of supplierIds) {
    switch (sid) {
      case 'teemdrop':
        maxMin = Math.max(maxMin, DROPSHIP_LEAD_TIME_DAYS.min);
        maxMax = Math.max(maxMax, DROPSHIP_LEAD_TIME_DAYS.max);
        break;
      case 'abw':
      case 'kcosw':
        maxMin = Math.max(maxMin, WHOLESALE_LEAD_TIME_DAYS.min);
        maxMax = Math.max(maxMax, WHOLESALE_LEAD_TIME_DAYS.max);
        break;
    }
  }

  return {
    min: maxMin,
    max: maxMax,
    label: `Estimated delivery: ${maxMin}-${maxMax} business days`,
  };
}
