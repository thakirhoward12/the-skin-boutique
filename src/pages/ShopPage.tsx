import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Filter, Flame, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import ShopLayout from '../components/ShopLayout';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { SHOP_SECTIONS, groupProductsBySection, type ShopSection } from '../data/categoryTaxonomy';
import { type Product } from '../data/products';
import { getProductSlug } from '../utils/slug';
import { Link } from 'react-router-dom';

// ─── Concern-Based Quick Filters (Female Purchase Psychology: shop by problem) ───
const CONCERN_FILTERS = [
  { id: 'all', label: 'All Products', emoji: '✨' },
  { id: 'acne', label: 'Acne & Breakouts', emoji: '🎯', keywords: ['acne', 'bha', 'salicylic', 'blemish', 'breakout', 'pimple', 'blackhead', 'tea tree'] },
  { id: 'dark-spots', label: 'Dark Spots', emoji: '🌟', keywords: ['brightening', 'vitamin c', 'niacinamide', 'kojic', 'dark spot', 'tone', 'whitening', 'glow'] },
  { id: 'dryness', label: 'Dry & Dehydrated', emoji: '💧', keywords: ['hydrat', 'moisture', 'hyaluronic', 'ceramide', 'barrier', 'soothing', 'centella'] },
  { id: 'aging', label: 'Fine Lines & Aging', emoji: '⏳', keywords: ['collagen', 'retinol', 'anti-aging', 'wrinkle', 'firming', 'pdrn', 'peptide', 'lifting'] },
  { id: 'pores', label: 'Large Pores', emoji: '🔍', keywords: ['pore', 'aha', 'bha', 'exfoli', 'peeling', 'blackhead', 'sebum', 'oil control'] },
  { id: 'sensitivity', label: 'Sensitive Skin', emoji: '🛡️', keywords: ['sensitive', 'calming', 'soothing', 'centella', 'cica', 'barrier', 'gentle', 'mild'] },
];

// Social proof generator — deterministic per product ID
function getSocialProof(id: number): number {
  return 47 + ((id * 7 + 13) % 200);
}

function isTrending(product: Product): boolean {
  const text = `${product.name} ${product.brand}`.toLowerCase();
  const trendingTerms = ['snail', 'pdrn', 'heartleaf', 'centella', 'glass skin', 'rice', 'mucin'];
  return trendingTerms.some(t => text.includes(t));
}

export default function ShopPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [activeConcern, setActiveConcern] = useState('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Filter products by concern
  const filteredProducts = useMemo(() => {
    if (activeConcern === 'all') return products;
    const filter = CONCERN_FILTERS.find(c => c.id === activeConcern);
    if (!filter || !filter.keywords) return products;
    return products.filter(p => {
      const text = `${p.name} ${p.category} ${p.description} ${p.ingredients || ''}`.toLowerCase();
      return filter.keywords!.some(kw => text.includes(kw));
    });
  }, [products, activeConcern]);

  // Group filtered products by section
  const groupedProducts = useMemo(() => groupProductsBySection(filteredProducts), [filteredProducts]);

  const handleQuickAdd = (product: Product) => {
    addToCart({
      id: String(product.id),
      title: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sku: product.sku || String(product.id),
      supplierId: product.supplierId as any,
      sourceUrl: product.sourceUrl,
      sourcePrice: product.sourcePrice,
    });
  };

  return (
    <ShopLayout
      pageTitle="Shop"
      subtitle="Browse 1,000+ authentic K-Beauty products — organised by category, filtered by concern."
    >
      {/* ─── Concern Filters ─── */}
      <div className="sticky top-24 z-30 bg-white/90 backdrop-blur-lg border-b border-ink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-ink-400 shrink-0 mr-1" />
            {CONCERN_FILTERS.map(concern => (
              <button
                key={concern.id}
                onClick={() => setActiveConcern(concern.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeConcern === concern.id
                    ? 'bg-ink-900 text-white shadow-md'
                    : 'bg-ink-50 text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <span className="mr-1.5">{concern.emoji}</span>
                {concern.label}
              </button>
            ))}
          </div>
          {activeConcern !== 'all' && (
            <p className="text-xs text-ink-400 mt-2">
              Showing {filteredProducts.length} products for "{CONCERN_FILTERS.find(c => c.id === activeConcern)?.label}"
            </p>
          )}
        </div>
      </div>

      {/* ─── Category Sections (Game Store Rows) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {SHOP_SECTIONS.map(section => {
          const sectionProducts = groupedProducts.get(section.id);
          if (!sectionProducts || sectionProducts.length === 0) return null;

          const isExpanded = expandedSection === section.id;
          const displayProducts = isExpanded ? sectionProducts : sectionProducts.slice(0, 12);

          return (
            <CategoryRow
              key={section.id}
              section={section}
              products={displayProducts}
              totalCount={sectionProducts.length}
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedSection(isExpanded ? null : section.id)}
              onQuickAdd={handleQuickAdd}
              formatPrice={formatPrice}
            />
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl font-serif text-ink-300">No products match this concern</p>
            <button
              onClick={() => setActiveConcern('all')}
              className="mt-4 text-sm text-pastel-pink-dark hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Bottom CTA ─── */}
      <div className="bg-ink-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-white/60 mb-8 font-light">
            Let us build the perfect routine for your skin type and concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/packages"
              className="px-8 py-4 bg-white text-ink-900 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-pastel-pink transition-colors"
            >
              Browse Ready-Made Packages
            </Link>
            <Link
              to="/build"
              className="px-8 py-4 border border-white/30 text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
            >
              Build Your Own Routine
            </Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

// ═══════════════════════════════════════════════════════
// CategoryRow — Horizontal scrollable product row
// ═══════════════════════════════════════════════════════

interface CategoryRowProps {
  section: ShopSection;
  products: Product[];
  totalCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onQuickAdd: (product: Product) => void;
  formatPrice: (priceInZAR: number) => string;
}

function CategoryRow({ section, products, totalCount, isExpanded, onToggleExpand, onQuickAdd, formatPrice }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{section.emoji}</span>
            <h2 className="text-2xl md:text-3xl font-serif text-ink-900">{section.label}</h2>
            <span className="text-sm text-ink-400 font-medium bg-ink-50 px-3 py-1 rounded-full">
              {totalCount}
            </span>
          </div>
          <p className="text-sm text-ink-500 font-light">{section.description}</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-ink-50 hover:bg-ink-100 text-ink-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-ink-50 hover:bg-ink-100 text-ink-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Cards — Horizontal scroll or grid if expanded */}
      {isExpanded ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={onQuickAdd}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {products.map(product => (
            <div key={product.id} className="snap-start shrink-0 w-[240px] sm:w-[260px]">
              <ProductCard
                product={product}
                onQuickAdd={onQuickAdd}
                formatPrice={formatPrice}
              />
            </div>
          ))}
        </div>
      )}

      {/* View All / Collapse */}
      {totalCount > 12 && (
        <button
          onClick={onToggleExpand}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors group"
        >
          {isExpanded ? 'Collapse' : `View all ${totalCount} products`}
          <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
        </button>
      )}
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════
// ProductCard — Individual product tile
// ═══════════════════════════════════════════════════════

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
  formatPrice: (priceInZAR: number) => string;
  key?: React.Key;
}

function ProductCard({ product, onQuickAdd, formatPrice }: ProductCardProps) {
  const trending = isTrending(product);
  const proofCount = getSocialProof(product.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-ink-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-ink-200">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {trending && (
          <span className="flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Flame className="w-3 h-3" /> TRENDING
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${getProductSlug(product)}`} className="aspect-square overflow-hidden p-4 bg-ink-50/30">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4 border-t border-ink-50">
        <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <Link
          to={`/product/${getProductSlug(product)}`}
          className="text-sm font-medium text-ink-900 line-clamp-2 mb-2 hover:text-pastel-pink-dark transition-colors"
        >
          {product.name}
        </Link>

        {/* Social Proof */}
        <p className="text-[10px] text-ink-400 flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {proofCount} women bought this
        </p>

        <div className="mt-auto flex items-end justify-between">
          <span className="text-lg font-serif font-semibold text-ink-900">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => { e.preventDefault(); onQuickAdd(product); }}
            className="p-2.5 rounded-xl bg-ink-900 text-white hover:bg-ink-700 transition-colors shadow-sm group/btn"
            title="Quick add to cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
