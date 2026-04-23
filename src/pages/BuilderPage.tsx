import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Beaker, Moon, Sun, AlertCircle, ShoppingBag, Sparkles, ArrowRight, Package } from 'lucide-react';
import ShopLayout from '../components/ShopLayout';
import { type Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useProducts } from '../contexts/ProductContext';
import { detectClashes, type BundleItem, type UsageTime } from '../utils/skincareCompatibility';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', title: 'All Products', keywords: [] as string[], excludeKeywords: [] as string[] },
  { id: 'cleanser', title: 'Cleanser', keywords: ['cleanser', 'wash', 'cleansing'], excludeKeywords: ['shampoo', 'hair', 'scalp'] },
  { id: 'toner', title: 'Toner', keywords: ['toner', 'essence', 'mist'], excludeKeywords: ['hair toner', 'hair', 'scalp', 'shampoo', 'conditioner'] },
  { id: 'serum', title: 'Serum', keywords: ['serum', 'ampoule', 'treatment', 'vitamin c', 'cica', 'retinol', 'bha'], excludeKeywords: ['hair serum', 'scalp serum', 'hair', 'shampoo', 'conditioner'] },
  { id: 'moisturizer', title: 'Moisturizer', keywords: ['moisturizer', 'cream', 'lotion', 'gel', 'hydrate'], excludeKeywords: ['hair', 'body lotion', 'hand cream', 'shampoo', 'conditioner', 'scalp'] },
  { id: 'spf', title: 'SPF', keywords: ['spf', 'sunscreen', 'sun'], excludeKeywords: [] },
  { id: 'devices', title: 'Devices', keywords: ['device', 'gua sha', 'guasha', 'roller', 'massager', 'led mask', 'age-r', 'pro mini'], excludeKeywords: [] },
];

const MAX_ITEMS = 7;

export default function BuilderPage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<BundleItem[]>([]);

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { products } = useProducts();

  const activeCategory = CATEGORIES[activeCategoryIndex];

  // Deduplicate products
  const deduplicatedProducts = useMemo(() => {
    const seen = new Map<string, Product>();
    const sizePattern = /\b(\d+\s*ml|\d+\s*g|\d+\s*oz|value|set|pack|duo|trio)\b/i;

    for (const p of products) {
      const baseName = p.name.toLowerCase()
        .replace(sizePattern, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
      const key = `${p.brand.toLowerCase()}-${baseName}`;

      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, p);
      } else {
        const existingHasSize = sizePattern.test(existing.name);
        const currentHasSize = sizePattern.test(p.name);
        if (existingHasSize || currentHasSize) {
          const fullKey = `${p.brand.toLowerCase()}-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          seen.set(fullKey, p);
        }
      }
    }
    return Array.from(seen.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return deduplicatedProducts;

    if (activeCategory.id === 'all') {
      return deduplicatedProducts.filter(p => {
        const hardExclude = ['haircare', 'hair care', 'fragrance'];
        return !hardExclude.some(exc => (p.category || '').toLowerCase().includes(exc));
      });
    }

    return deduplicatedProducts.filter(p => {
      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();
      const matches = activeCategory.keywords.some(kw => text.includes(kw.toLowerCase()));
      if (!matches) return false;
      const hardExclude = ['haircare', 'hair care', 'body care', 'bath & body', 'fragrance'];
      if (hardExclude.some(exc => (p.category || '').toLowerCase().includes(exc))) return false;
      const excluded = activeCategory.excludeKeywords.some(ek => text.includes(ek.toLowerCase()));
      return !excluded;
    });
  }, [activeCategory, deduplicatedProducts]);

  const handleToggleProduct = (product: Product) => {
    const existsIndex = selectedItems.findIndex(item => item.product.id === product.id);

    if (existsIndex >= 0) {
      setSelectedItems(prev => prev.filter((_, i) => i !== existsIndex));
    } else {
      if (selectedItems.length >= MAX_ITEMS) return;
      setSelectedItems(prev => [
        ...prev,
        {
          id: Date.now().toString() + Math.random().toString(),
          product,
          usageTime: 'BOTH' as UsageTime,
        },
      ]);
    }
  };

  const updateUsageTime = (id: string, newTime: UsageTime) => {
    setSelectedItems(prev => prev.map(item =>
      item.id === id ? { ...item, usageTime: newTime } : item
    ));
  };

  const compatibilityIssues = useMemo(() => detectClashes(selectedItems), [selectedItems]);

  const selectedCount = selectedItems.length;

  let discountPercentage = 0;
  if (selectedCount >= 5) discountPercentage = 0.25;
  else if (selectedCount === 4) discountPercentage = 0.20;
  else if (selectedCount === 3) discountPercentage = 0.15;
  else if (selectedCount === 2) discountPercentage = 0.10;

  const rawTotal = selectedItems.reduce((total, item) => {
    const priceNum = item.product.options?.length ? Number(item.product.options[0].price) : Number(item.product.price);
    return total + priceNum;
  }, 0);

  const discountedTotal = rawTotal * (1 - discountPercentage);

  const handleAddToCart = () => {
    if (selectedCount < 2) return;

    const bundleId = `bnd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;

    selectedItems.forEach(({ product }) => {
      const basePrice = product.options?.length
        ? Number(product.options[0].price)
        : Number(product.price);
      const discountedPrice = basePrice * (1 - discountPercentage);

      addToCart({
        id: `bundle-${product.id}`,
        title: `[BUNDLE] ${product.options?.length ? `${product.name} - ${product.options[0].size}` : product.name}`,
        price: discountedPrice,
        image: product.image,
        quantity: 1,
        sku: product.sku || String(product.id),
        supplierId: product.supplierId as any,
        bundleId,
        sourceUrl: product.sourceUrl,
        sourcePrice: product.sourcePrice,
      });
    });

    setSelectedItems([]);
  };

  return (
    <ShopLayout
      pageTitle="Build Your Routine"
      subtitle="Pick products, check ingredient compatibility, and save with tiered bundle discounts."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Discount Tiers Info */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { count: '2 items', discount: '10%', active: selectedCount >= 2 },
            { count: '3 items', discount: '15%', active: selectedCount >= 3 },
            { count: '4 items', discount: '20%', active: selectedCount >= 4 },
            { count: '5+ items', discount: '25%', active: selectedCount >= 5 },
          ].map(tier => (
            <div
              key={tier.count}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                tier.active
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-ink-50/50 border-ink-100 text-ink-400'
              }`}
            >
              <span className="font-bold">{tier.discount} off</span>
              <span className="text-xs ml-1.5 opacity-70">{tier.count}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left: Product Library ─── */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-ink-100">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    idx === activeCategoryIndex
                      ? 'bg-ink-900 text-white shadow-md'
                      : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const isSelected = selectedItems.some(i => i.product.id === product.id);
                return (
                  <div
                    key={product.id}
                    className={`relative group border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                      isSelected
                        ? 'border-pastel-pink-dark ring-2 ring-pastel-pink-dark/50 shadow-md bg-white'
                        : 'border-ink-100 bg-white/50 hover:bg-white hover:border-ink-200 hover:shadow-sm'
                    }`}
                    onClick={() => handleToggleProduct(product)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-pastel-pink-dark rounded-full flex items-center justify-center z-10 shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="aspect-[4/5] overflow-hidden p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 border-t border-ink-50 bg-white flex-1 flex flex-col">
                      <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
                      <h4 className="text-xs sm:text-sm font-medium text-ink-900 line-clamp-2 mb-2">{product.name}</h4>
                      <p className="text-pastel-pink-dark font-semibold text-sm mt-auto">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-ink-400">
                  No matching products found in this category.
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: Builder Sidebar ─── */}
          <div className="lg:w-[400px] shrink-0 lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white rounded-3xl border border-ink-100 shadow-sm overflow-hidden">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-ink-100 bg-ink-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pastel-pink/40 rounded-full flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-pastel-pink-dark stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif text-ink-900">Your Routine</h2>
                    <p className="text-xs text-ink-500">{selectedItems.length}/{MAX_ITEMS} slots used</p>
                  </div>
                </div>
              </div>

              {/* Selected Items */}
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {Array.from({ length: MAX_ITEMS }).map((_, idx) => {
                  const item = selectedItems[idx];

                  if (item) {
                    return (
                      <div key={item.id} className="relative group flex flex-col gap-2 p-3 bg-ink-50/50 border border-ink-100 rounded-2xl">
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center p-1 border border-ink-50">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">{item.product.category}</p>
                            <p className="text-sm font-medium text-ink-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-pastel-pink-dark font-semibold mt-0.5">{formatPrice(item.product.price)}</p>
                          </div>
                          <button
                            onClick={() => handleToggleProduct(item.product)}
                            className="absolute top-2 right-2 p-1 bg-white border border-ink-100 rounded-full text-ink-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* AM/PM Toggle */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-ink-50">
                          <button
                            onClick={() => updateUsageTime(item.id, 'AM')}
                            className={`flex-1 py-1 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${item.usageTime === 'AM' ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200' : 'text-ink-400 hover:bg-ink-50'}`}
                          >
                            <Sun className="w-3 h-3" /> AM
                          </button>
                          <button
                            onClick={() => updateUsageTime(item.id, 'PM')}
                            className={`flex-1 py-1 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${item.usageTime === 'PM' ? 'bg-indigo-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-ink-400 hover:bg-ink-50'}`}
                          >
                            <Moon className="w-3 h-3" /> PM
                          </button>
                          <button
                            onClick={() => updateUsageTime(item.id, 'BOTH')}
                            className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${item.usageTime === 'BOTH' ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-200' : 'text-ink-400 hover:bg-ink-50'}`}
                          >
                            Both
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`empty-${idx}`} className="flex items-center justify-center p-5 border-2 border-dashed border-ink-100 rounded-2xl bg-ink-50/20">
                      <span className="text-xs font-medium text-ink-300 tracking-widest uppercase">Empty Slot</span>
                    </div>
                  );
                })}

                {/* Compatibility Engine */}
                {selectedItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-400 mb-3 border-b border-ink-100 pb-2">
                      <Beaker className="w-4 h-4" /> Routine Analysis
                    </h4>
                    {compatibilityIssues.length === 0 ? (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-900 mb-1">Perfect Harmony</p>
                          <p className="text-xs text-emerald-700 leading-relaxed">Your ingredients work safely together without clashing.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {compatibilityIssues.map((issue, idx) => (
                          <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 ${
                            issue.severity === 'warning' ? 'bg-red-50 border-red-100 text-red-900' : 'bg-orange-50 border-orange-100 text-orange-900'
                          }`}>
                            <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${issue.severity === 'warning' ? 'text-red-500' : 'text-orange-500'}`} />
                            <div>
                              <p className="text-sm font-semibold mb-1">
                                {issue.severity === 'warning' ? 'Active Clash' : 'Caution'}
                              </p>
                              <p className={`text-xs leading-relaxed ${issue.severity === 'warning' ? 'text-red-700' : 'text-orange-800'}`}>
                                {issue.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing Footer */}
              <div className="p-6 bg-ink-50/30 border-t border-ink-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-ink-500">Retail Value</span>
                  <span className="text-sm text-ink-400 line-through">{formatPrice(rawTotal)}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-ink-900 flex items-center gap-2">
                    Bundle Discount
                    {discountPercentage > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-bold">
                        {(discountPercentage * 100).toFixed(0)}% OFF
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    -{formatPrice(rawTotal - discountedTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <span className="text-xl font-serif text-ink-900">Total</span>
                  <span className="text-3xl font-serif text-ink-900 font-semibold">{formatPrice(discountedTotal)}</span>
                </div>

                <button
                  disabled={selectedCount < 2}
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-ink-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-ink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {selectedCount < 2 ? 'Add 2+ to Unlock Bundle' : 'Add Routine to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
