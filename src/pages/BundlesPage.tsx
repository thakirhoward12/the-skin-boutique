import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Layers, ShoppingBag, Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import ShopLayout from '../components/ShopLayout';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { PRODUCT_ECOSYSTEMS, type ProductEcosystem } from '../data/complementaryProducts';
import { type Product } from '../types';
import { getProductSlug } from '../utils/slug';
import { Link } from 'react-router-dom';

export default function BundlesPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  // Resolve ecosystems: match hero + companions against real catalog
  const resolvedEcosystems = useMemo(() => {
    return PRODUCT_ECOSYSTEMS
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(eco => {
        const hero = products.find(p =>
          p.name.toLowerCase().includes(eco.heroProductMatch.toLowerCase())
        );
        const companions = eco.companionMatches
          .map(match => products.find(p =>
            p.name.toLowerCase().includes(match.toLowerCase())
          ))
          .filter(Boolean) as Product[];

        return {
          ...eco,
          heroProduct: hero || null,
          companionProducts: companions,
          allProducts: hero ? [hero, ...companions] : companions,
          totalPrice: (hero?.price || 0) + companions.reduce((s, p) => s + p.price, 0),
        };
      })
      .filter(e => e.heroProduct !== null); // Only show ecosystems with a valid hero
  }, [products]);

  return (
    <ShopLayout
      pageTitle="Bundles"
      subtitle="Products designed to work together. Complete your system for maximum results."
    >
      {/* ─── Completion Bias Banner ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-6 py-4">
          <Layers className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Complete your set</span> — products in the same system are formulated to amplify each other.
            Using the full system delivers 2-3× better results than individual products.
          </p>
        </div>
      </div>

      {/* ─── Ecosystem Cards ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {resolvedEcosystems.map((eco, idx) => (
          <EcosystemCard
            key={eco.id}
            ecosystem={eco}
            index={idx}
            addToCart={addToCart}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* ─── Bottom CTA ─── */}
      <div className="bg-ink-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Want a custom combination?
          </h2>
          <p className="text-white/60 mb-8 font-light">
            Mix products from different brands in our interactive routine builder.
          </p>
          <Link
            to="/build"
            className="inline-block px-8 py-4 bg-white text-ink-900 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-pastel-pink transition-colors"
          >
            Open Routine Builder
          </Link>
        </div>
      </div>
    </ShopLayout>
  );
}

// ═══════════════════════════════════════════════════════
// EcosystemCard — Brand product system showcase
// ═══════════════════════════════════════════════════════

interface EcosystemCardProps {
  ecosystem: ProductEcosystem & {
    heroProduct: Product | null;
    companionProducts: Product[];
    allProducts: Product[];
    totalPrice: number;
  };
  index: number;
  addToCart: (item: any) => void;
  formatPrice: (priceInZAR: number) => string;
  key?: React.Key;
}

function EcosystemCard({ ecosystem, index, addToCart, formatPrice }: EcosystemCardProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const hero = ecosystem.heroProduct!;

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(ecosystem.allProducts.map(p => p.id)));
  };

  const handleAddSelected = () => {
    const bundleId = `eco-${ecosystem.id}-${Date.now().toString(36)}`;
    const selectedProducts = ecosystem.allProducts.filter(p => selectedIds.has(p.id));

    // 15% bundle discount when adding 2+ from same ecosystem
    const discount = selectedProducts.length >= 2 ? 0.15 : 0;

    selectedProducts.forEach(product => {
      addToCart({
        id: `eco-${product.id}`,
        title: `[${ecosystem.brand.toUpperCase()}] ${product.name}`,
        price: product.price * (1 - discount),
        image: product.image,
        quantity: 1,
        sku: product.sku || String(product.id),
        supplierId: product.supplierId as any,
        bundleId,
        sourceUrl: product.sourceUrl,
        sourcePrice: product.sourcePrice,
      });
    });

    setSelectedIds(new Set());
  };

  const selectedTotal = ecosystem.allProducts
    .filter(p => selectedIds.has(p.id))
    .reduce((s, p) => s + p.price, 0);
  const selectedDiscount = selectedIds.size >= 2 ? 0.15 : 0;
  const discountedTotal = selectedTotal * (1 - selectedDiscount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-white rounded-3xl border border-ink-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-500"
    >
      {/* Ecosystem Header */}
      <div className="p-8 pb-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400 mb-2">{ecosystem.brand}</p>
            <h3 className="text-2xl md:text-3xl font-serif text-ink-900">{ecosystem.name}</h3>
          </div>
          {ecosystem.badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shrink-0 ${
              ecosystem.badge === 'PREMIUM' ? 'bg-amber-100 text-amber-800' :
              ecosystem.badge === 'BESTSELLER' ? 'bg-emerald-100 text-emerald-800' :
              ecosystem.badge === 'TRENDING' ? 'bg-orange-100 text-orange-800' :
              ecosystem.badge === 'NEW' ? 'bg-blue-100 text-blue-800' :
              'bg-ink-100 text-ink-600'
            }`}>
              {ecosystem.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-ink-500 font-light mb-2">{ecosystem.tagline}</p>
      </div>

      {/* Hero + Companions Layout */}
      <div className="p-8 flex flex-col lg:flex-row gap-8">
        {/* Hero Product (2× larger) */}
        <div className="lg:w-2/5 shrink-0">
          <div
            onClick={() => toggleProduct(hero.id)}
            className={`relative cursor-pointer rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
              selectedIds.has(hero.id)
                ? 'border-pastel-pink-dark ring-2 ring-pastel-pink-dark/30 shadow-md'
                : 'border-ink-100 hover:border-ink-200 hover:shadow-sm'
            }`}
          >
            {selectedIds.has(hero.id) && (
              <div className="absolute top-4 right-4 z-10 w-7 h-7 bg-pastel-pink-dark rounded-full flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-ink-900 text-white px-3 py-1 rounded-full">
                Hero Product
              </span>
            </div>
            <div className="aspect-square p-8 bg-ink-50/30">
              <img
                src={hero.image}
                alt={hero.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="p-5 border-t border-ink-50 bg-white">
              <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider mb-1">{hero.brand}</p>
              <p className="text-base font-medium text-ink-900 mb-2">{hero.name}</p>
              <p className="text-lg font-serif font-semibold text-ink-900">{formatPrice(hero.price)}</p>
            </div>
          </div>
        </div>

        {/* Companions Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-ink-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pastel-pink-dark" />
              Works better together
            </p>
            <button
              onClick={selectAll}
              className="text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors underline decoration-dashed underline-offset-4"
            >
              Select all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ecosystem.companionProducts.map(product => (
              <div
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`relative cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
                  selectedIds.has(product.id)
                    ? 'border-pastel-pink-dark ring-1 ring-pastel-pink-dark/30 shadow-sm bg-white'
                    : 'border-ink-100 hover:border-ink-200 bg-white/50 hover:bg-white'
                }`}
              >
                {selectedIds.has(product.id) && (
                  <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-pastel-pink-dark rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="aspect-square p-3 bg-ink-50/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="p-3 border-t border-ink-50">
                  <p className="text-[9px] text-ink-400 font-semibold uppercase tracking-wider">{product.category}</p>
                  <p className="text-xs font-medium text-ink-900 line-clamp-2 mt-0.5">{product.name}</p>
                  <p className="text-sm font-semibold text-ink-900 mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Synergy Note */}
          <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-xs text-emerald-800 leading-relaxed">
              <span className="font-semibold">Why these work together: </span>
              {ecosystem.synergyNote}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Footer */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-ink-100 bg-ink-50/50 p-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-600">
                <span className="font-semibold text-ink-900">{selectedIds.size} items</span> selected
                {selectedIds.size >= 2 && (
                  <span className="ml-2 bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    15% BUNDLE DISCOUNT
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-1">
                {selectedDiscount > 0 && (
                  <span className="text-sm text-ink-400 line-through">{formatPrice(selectedTotal)}</span>
                )}
                <span className="text-xl font-serif font-semibold text-ink-900">{formatPrice(discountedTotal)}</span>
              </div>
            </div>
            <button
              onClick={handleAddSelected}
              className="px-8 py-3.5 bg-ink-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-ink-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Add {selectedIds.size === ecosystem.allProducts.length ? 'Complete System' : 'Selected'} to Cart
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
