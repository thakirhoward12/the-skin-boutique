import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, Gift, ShoppingBag, Sparkles, Users, Clock, Filter } from 'lucide-react';
import ShopLayout from '../components/ShopLayout';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { ROUTINE_PACKAGES, type RoutinePackage, type PackageStep } from '../data/packages';
import { type Product } from '../types';
import { Link } from 'react-router-dom';

const SKIN_TYPE_FILTERS = [
  { id: 'all', label: 'All Skin Types' },
  { id: 'dry', label: 'Dry' },
  { id: 'oily', label: 'Oily' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'acne-prone', label: 'Acne-Prone' },
  { id: 'mature', label: 'Mature' },
];

export default function PackagesPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  // Match package product slugs to actual catalog products
  const resolvedPackages = useMemo(() => {
    return ROUTINE_PACKAGES.map(pkg => {
      const resolvedSteps = pkg.steps.map(step => {
        const match = products.find(p =>
          p.name.toLowerCase().includes(step.productMatch.toLowerCase())
        );
        return { ...step, product: match || null };
      });

      const allResolved = resolvedSteps.every(s => s.product !== null);
      const totalRetail = resolvedSteps.reduce((sum, s) => sum + (s.product?.price || 0), 0);
      const packagePrice = totalRetail * (1 - pkg.discountPercent);
      const savings = totalRetail - packagePrice;

      return {
        ...pkg,
        resolvedSteps,
        allResolved,
        totalRetail,
        packagePrice,
        savings,
      };
    });
  }, [products]);

  const filteredPackages = useMemo(() => {
    if (activeFilter === 'all') return resolvedPackages;
    return resolvedPackages.filter(pkg =>
      pkg.skinTypes.includes(activeFilter) || pkg.skinTypes.includes('all')
    );
  }, [resolvedPackages, activeFilter]);

  const handleAddPackageToCart = (pkg: typeof resolvedPackages[number]) => {
    const bundleId = `pkg-${pkg.id}-${Date.now().toString(36)}`;

    pkg.resolvedSteps.forEach(step => {
      if (!step.product) return;
      const discountedPrice = step.product.price * (1 - pkg.discountPercent);
      addToCart({
        id: `pkg-${step.product.id}`,
        title: `[${pkg.name.toUpperCase()}] ${step.product.name}`,
        price: discountedPrice,
        image: step.product.image,
        quantity: 1,
        sku: step.product.sku || String(step.product.id),
        supplierId: step.product.supplierId as any,
        bundleId,
        sourceUrl: step.product.sourceUrl,
        sourcePrice: step.product.sourcePrice,
      });
    });
  };

  return (
    <ShopLayout
      pageTitle="Packages"
      subtitle="Ready-made routines curated by our K-Beauty experts. Every step chosen for synergy, every product proven to work."
    >
      {/* ─── Skin Type Filter ─── */}
      <div className="sticky top-24 z-30 bg-white/90 backdrop-blur-lg border-b border-ink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-ink-400 shrink-0 mr-1" />
            {SKIN_TYPE_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-ink-900 text-white shadow-md'
                    : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Package Cards ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPackages.map((pkg, idx) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={idx}
              isExpanded={expandedPackage === pkg.id}
              onToggleExpand={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
              onAddToCart={() => handleAddPackageToCart(pkg)}
              formatPrice={formatPrice}
            />
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl font-serif text-ink-300">No packages for this skin type yet</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-sm text-pastel-pink-dark hover:underline"
            >
              Show all packages
            </button>
          </div>
        )}
      </div>

      {/* ─── Gift CTA ─── */}
      <div className="bg-gradient-to-br from-pastel-pink/30 via-white to-pink-50 py-16 border-t border-ink-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Gift className="w-12 h-12 text-pastel-pink-dark mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif text-ink-900 mb-4">
            Gift a Routine
          </h2>
          <p className="text-ink-500 font-light mb-8 max-w-xl mx-auto">
            Know someone who deserves a glow-up? Our packages make the perfect gift — no guessing which products to buy.
          </p>
          <Link
            to="/build"
            className="inline-block px-8 py-4 bg-ink-900 text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-ink-700 transition-colors"
          >
            Or Build a Custom Set
          </Link>
        </div>
      </div>
    </ShopLayout>
  );
}

// ═══════════════════════════════════════════════════════
// PackageCard — Individual routine package
// ═══════════════════════════════════════════════════════

interface PackageCardProps {
  pkg: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    gradient: string;
    badge?: string;
    discountPercent: number;
    resultsTimeline: string;
    socialProof: number;
    concerns: string[];
    resolvedSteps: (PackageStep & { product: Product | null })[];
    allResolved: boolean;
    totalRetail: number;
    packagePrice: number;
    savings: number;
  };
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddToCart: () => void;
  formatPrice: (priceInZAR: number) => string;
  key?: React.Key;
}

function PackageCard({ pkg, index, isExpanded, onToggleExpand, onAddToCart, formatPrice }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative bg-gradient-to-br ${pkg.gradient} rounded-3xl border border-white shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-xl`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
            pkg.badge === 'BESTSELLER' ? 'bg-amber-400 text-amber-900' :
            pkg.badge === 'NEW' ? 'bg-emerald-400 text-emerald-900' :
            pkg.badge === 'GIFT READY' ? 'bg-pink-400 text-pink-900' :
            'bg-ink-900 text-white'
          }`}>
            {pkg.badge}
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <h3 className="text-2xl md:text-3xl font-serif text-ink-900 mb-1">{pkg.name}</h3>
        <p className="text-sm text-ink-600 font-light mb-2">{pkg.tagline}</p>

        {/* Social Proof */}
        <div className="flex items-center gap-4 text-xs text-ink-500 mb-6">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {pkg.socialProof.toLocaleString()} women use this
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {pkg.resolvedSteps.length} steps
          </span>
        </div>

        {/* Concern Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {pkg.concerns.map(c => (
            <span key={c} className="text-[10px] font-medium uppercase tracking-wider bg-white/60 text-ink-600 px-3 py-1 rounded-full border border-white/80">
              {c}
            </span>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {pkg.resolvedSteps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 transition-all hover:bg-white/80"
            >
              {/* Step Number */}
              <div className="w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {step.step}
              </div>

              {/* Product Image */}
              {step.product && (
                <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 border border-ink-50">
                  <img
                    src={step.product.image}
                    alt={step.product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">{step.label}</p>
                <p className="text-sm font-medium text-ink-900 truncate">
                  {step.product?.name || 'Product unavailable'}
                </p>
              </div>

              {/* Price */}
              {step.product && (
                <span className="text-sm font-semibold text-ink-900 shrink-0">
                  {formatPrice(step.product.price)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* "Why this works" expandable */}
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors mb-6"
        >
          <Sparkles className="w-4 h-4" />
          {isExpanded ? 'Hide details' : 'Why this routine works'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-6 space-y-4">
                <p className="text-sm text-ink-600 leading-relaxed">{pkg.description}</p>

                {/* Results Timeline */}
                <div className="bg-white/50 rounded-2xl p-4 border border-white/80">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Expected Results</p>
                  <p className="text-sm text-ink-700 leading-relaxed">{pkg.resultsTimeline}</p>
                </div>

                {/* Per-step explanations */}
                {pkg.resolvedSteps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-semibold text-ink-900">{step.label}: </span>
                      <span className="text-sm text-ink-600">{step.why}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing & CTA */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-500">Retail value</span>
            <span className="text-sm text-ink-400 line-through">{formatPrice(pkg.totalRetail)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-ink-900 flex items-center gap-2">
              Package savings
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {(pkg.discountPercent * 100).toFixed(0)}% OFF
              </span>
            </span>
            <span className="text-sm font-semibold text-emerald-600">-{formatPrice(pkg.savings)}</span>
          </div>
          <div className="flex items-end justify-between mb-6">
            <span className="text-xl font-serif text-ink-900">Package Price</span>
            <span className="text-3xl font-serif font-semibold text-ink-900">{formatPrice(pkg.packagePrice)}</span>
          </div>

          <button
            onClick={onAddToCart}
            disabled={!pkg.allResolved}
            className="w-full py-4 bg-ink-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase transition-all hover:bg-ink-700 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            Add Complete Routine to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
