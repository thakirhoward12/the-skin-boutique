import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Package, Sparkles, Moon, Sun, Beaker, AlertCircle } from 'lucide-react';
import { type Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useProducts } from '../contexts/ProductContext';
import { detectClashes, type BundleItem, type UsageTime } from '../utils/skincareCompatibility';

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecommended?: Product[];
  initialTierIndex?: number | null;
}

const CATEGORIES = [
  { id: 'cleanser', title: 'Cleanser', keywords: ['cleanser', 'wash', 'cleansing'] },
  { id: 'toner', title: 'Toner', keywords: ['toner', 'essence', 'mist'] },
  { id: 'serum', title: 'Serum', keywords: ['serum', 'ampoule', 'treatment', 'vitamin c', 'cica', 'retinol', 'bha'] },
  { id: 'moisturizer', title: 'Moisturizer', keywords: ['moisturizer', 'cream', 'lotion', 'gel', 'hydrate'] },
  { id: 'spf', title: 'SPF', keywords: ['spf', 'sunscreen', 'sun'] }
];

export default function BundleBuilderModal({ isOpen, onClose, initialTierIndex = null }: BundleBuilderModalProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<BundleItem[]>([]);
  
  const { addToCart } = useCart();
  const { formatPrice, exchangeRate } = useCurrency();
  const { products } = useProducts();

  // Determine Max Items based on tier (Fallback to 5 if just opened randomly)
  const maxItems = useMemo(() => {
    if (initialTierIndex === 0) return 2; // Starter
    if (initialTierIndex === 1) return 3; // Essential
    if (initialTierIndex === 2) return 4; // Advanced
    if (initialTierIndex === 3) return 5; // Ritual
    return 5;
  }, [initialTierIndex]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
      setActiveCategoryIndex(0);
    }
  }, [isOpen]);

  const activeCategory = CATEGORIES[activeCategoryIndex];

  // Filter products for the current active tab
  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products.slice(0, 12);
    return products.filter(p => {
      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();
      return activeCategory.keywords.some(kw => text.includes(kw.toLowerCase()));
    }).slice(0, 20); 
  }, [activeCategory, products]);

  const handleToggleProduct = (product: Product) => {
    const existsIndex = selectedItems.findIndex(item => item.product.id === product.id);
    
    if (existsIndex >= 0) {
      // Remove it
      setSelectedItems(prev => prev.filter((_, i) => i !== existsIndex));
    } else {
      // Add it if there's room
      if (selectedItems.length >= maxItems) {
        alert(`Your bundle is full! You can only select up to ${maxItems} items for this tier. Please remove an item first.`);
        return;
      }
      setSelectedItems(prev => [
        ...prev,
        {
          id: Date.now().toString() + Math.random().toString(), // Unique slot ID
          product,
          usageTime: 'BOTH'
        }
      ]);
    }
  };

  const updateUsageTime = (id: string, newTime: UsageTime) => {
    setSelectedItems(prev => prev.map(item => 
      item.id === id ? { ...item, usageTime: newTime } : item
    ));
  };

  // Engine Validation
  const compatibilityIssues = useMemo(() => detectClashes(selectedItems), [selectedItems]);

  const selectedCount = selectedItems.length;
  
  let discountPercentage = 0;
  if (selectedCount >= 5) discountPercentage = 0.25;
  else if (selectedCount === 4) discountPercentage = 0.20;
  else if (selectedCount === 3) discountPercentage = 0.15;
  else if (selectedCount === 2) discountPercentage = 0.10;

  const rawTotal: number = selectedItems.reduce((total, item) => {
    const priceNum = item.product.options && item.product.options.length > 0 ? Number(item.product.options[0].price) : Number(item.product.price);
    return total + priceNum;
  }, 0);

  const discountedTotal: number = rawTotal * (1 - discountPercentage);

  const handleAddToCart = () => {
    if (selectedCount < 2) return; 

    selectedItems.forEach(({ product }) => {
      const basePrice = product.options && product.options.length > 0 
        ? Number(product.options[0].price)
        : Number(product.price);
      const discountedPrice = basePrice * (1 - discountPercentage);

      addToCart({
        id: `bundle-${product.id}`,
        title: `[BUNDLE] ${product.options && product.options.length > 0 ? `${product.name} - ${product.options[0].size}` : product.name}`,
        price: discountedPrice,
        image: product.image,
        quantity: 1
      });
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 rounded-full hover:bg-white transition-colors border border-white/40 shadow-sm"
            >
              <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
            </button>

            {/* Header */}
            <div className="p-8 border-b border-white/40 bg-white/50 shadow-sm flex-shrink-0 z-10 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pastel-pink/40 rounded-full flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-pastel-pink-dark stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-ink-900">Custom Sandbox Configurator</h2>
                  <p className="text-sm text-ink-500">Pick exactly what you want. We'll verify the ingredients for you.</p>
                </div>
              </div>

              {/* Filtering Toggles */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {CATEGORIES.map((cat, idx) => {
                  const isActive = idx === activeCategoryIndex;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full border transition-all text-sm font-medium ${
                        isActive 
                          ? 'bg-ink-900 text-white border-ink-900 shadow-md' 
                          : 'bg-white/60 text-ink-600 border-white/50 hover:bg-white hover:text-ink-900'
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              {/* Product Library Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white/10 custom-scrollbar">
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => {
                    const isSelected = selectedItems.some(i => i.product.id === product.id);
                    return (
                      <div 
                        key={product.id}
                        className={`relative group border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                          isSelected 
                            ? 'border-pastel-pink-dark ring-2 ring-pastel-pink-dark/50 shadow-md bg-white' 
                            : 'border-white/50 bg-white/50 hover:bg-white hover:border-ink-200'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-pastel-pink-dark rounded-full flex items-center justify-center z-10 shadow-sm">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="aspect-[4/5] overflow-hidden p-4 relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 border-t border-white/50 bg-white/60 flex-1 flex flex-col">
                          <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
                          <h4 className="text-xs sm:text-sm font-medium text-ink-900 line-clamp-2 mb-2">{product.name}</h4>
                          <p className="text-pastel-pink-dark font-semibold text-xs sm:text-sm mb-4">
                            {formatPrice(product.price)}
                          </p>
                          <div className="mt-auto">
                            <button
                              onClick={() => handleToggleProduct(product)}
                              className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                                isSelected 
                                  ? 'bg-ink-100 text-ink-900 hover:bg-ink-200' 
                                  : 'bg-ink-900 text-white hover:bg-ink-800 shadow-sm'
                              }`}
                            >
                              {isSelected ? 'Remove' : 'Select'}
                            </button>
                          </div>
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

              {/* Sidebar: Slotted Items & Compatibility Engine */}
              <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-white/40 bg-white/60 flex flex-col flex-shrink-0 z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
                
                {/* Scrollable Items Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-serif text-ink-900">
                      Your Bundle <span className="text-ink-500 text-sm ml-1 font-sans">({selectedItems.length}/{maxItems})</span>
                    </h3>
                  </div>

                  {Array.from({ length: maxItems }).map((_, idx) => {
                    const item = selectedItems[idx];
                    
                    if (item) {
                      return (
                        <div key={item.id} className="flex flex-col gap-2 p-3 bg-white border border-ink-100 rounded-2xl shadow-sm relative group overflow-visible">
                          <div className="flex gap-3 items-center">
                            <div className="w-14 h-14 bg-ink-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">{item.product.category}</p>
                              <p className="text-sm font-medium text-ink-900 line-clamp-1">{item.product.name}</p>
                              <p className="text-xs text-pastel-pink-dark font-semibold mt-1">{formatPrice(item.product.price)}</p>
                            </div>
                            <button 
                              onClick={() => handleToggleProduct(item.product)}
                              className="absolute top-2 right-2 p-1.5 bg-white border border-ink-100 rounded-full text-ink-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                              title="Remove item"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* AM/PM Usage Toggles */}
                          <div className="flex items-center gap-1 mt-1 bg-ink-50/50 p-1.5 rounded-xl border border-ink-50">
                            <button
                              onClick={() => updateUsageTime(item.id, 'AM')}
                              className={`flex-1 py-1 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${item.usageTime === 'AM' ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200' : 'text-ink-400 hover:bg-ink-100'}`}
                            >
                              <Sun className="w-3 h-3" /> AM
                            </button>
                            <button
                              onClick={() => updateUsageTime(item.id, 'PM')}
                              className={`flex-1 py-1 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${item.usageTime === 'PM' ? 'bg-indigo-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-ink-400 hover:bg-ink-100'}`}
                            >
                              <Moon className="w-3 h-3" /> PM
                            </button>
                            <button
                              onClick={() => updateUsageTime(item.id, 'BOTH')}
                              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all ${item.usageTime === 'BOTH' ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-200' : 'text-ink-400 hover:bg-ink-100'}`}
                            >
                              Both
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={`empty-${idx}`} className="flex items-center justify-center p-6 border-2 border-dashed border-ink-200/60 rounded-2xl bg-white/40">
                        <span className="text-xs font-medium text-ink-400 tracking-widest uppercase">Empty Slot</span>
                      </div>
                    );
                  })}

                  {/* Chemistry Engine UI */}
                  {selectedItems.length > 0 && (
                    <div className="mt-6">
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-400 mb-3 border-b border-ink-100 pb-2">
                        <Beaker className="w-4 h-4" /> Routine Analysis
                      </h4>
                      {compatibilityIssues.length === 0 ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-900 mb-1">Perfect Harmony</p>
                            <p className="text-xs text-emerald-700 leading-relaxed">Your selected ingredients and usage times work safely together without severe clashing.</p>
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
                                  {issue.severity === 'warning' ? 'Active Clash Warning' : 'Formulation Caution'}
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

                {/* Fixed Pricing Footer */}
                <div className="p-6 bg-white border-t border-ink-100 z-20">
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
                    className="w-full py-4 bg-ink-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-ink-800 transition-all transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {selectedCount < 2 ? 'Add 2+ to Unlock Bundle' : 'Checkout Selection'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
