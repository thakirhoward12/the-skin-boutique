import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, CheckCircle2, X, Star, SlidersHorizontal, Minus, Plus, Play, Info, FolderOpen, ArrowLeft } from 'lucide-react';
import { type Product } from '../data/products';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useProducts } from '../contexts/ProductContext';
import SEO from './SEO';


const INGREDIENT_GLOSSARY: Record<string, string> = {
  // Core Actives
  'Niacinamide': 'Vitamin B3. Brightens skin, reduces redness, minimizes pores, and strengthens the skin barrier.',
  'Retinol': 'Vitamin A derivative. Stimulates cell turnover, reduces fine lines, and boosts collagen production.',
  'Ascorbic Acid': 'Pure Vitamin C. A potent antioxidant that brightens, fights UV damage, and boosts collagen.',
  'Tocopherol': 'Vitamin E. Protects skin from free radical damage and deeply moisturizes.',
  'Panthenol': 'Provitamin B5. Deeply hydrates, calms irritation, and accelerates skin healing.',
  'Adenosine': 'A naturally occurring molecule that reduces wrinkles and improves skin elasticity.',
  'Allantoin': 'Soothes irritation, promotes cell regeneration, and softens the skin.',
  
  // Acids & Exfoliants
  'Salicylic Acid': 'A BHA that penetrates pores to dissolve oil and clear breakouts and blackheads.',
  'Glycolic Acid': 'An AHA that exfoliates surface dead skin cells to improve texture and brightness.',
  'Lactic Acid': 'A gentle AHA that exfoliates while also hydrating the skin — great for sensitive types.',
  'Hyaluronic Acid': 'A powerful humectant that holds 1000x its weight in water, keeping skin plump and hydrated.',
  'Kojic Acid': 'A natural brightening agent that inhibits melanin production to fade dark spots.',
  'Tranexamic Acid': 'Reduces hyperpigmentation and dark spots by blocking melanin transfer.',
  'Succinic Acid': 'An antibacterial acid that helps control acne and remove dead skin cells.',
  'Citric Acid': 'An AHA that gently exfoliates and helps balance pH levels in the skin.',
  'Ferulic Acid': 'A plant-based antioxidant that enhances the stability and efficacy of Vitamins C and E.',
  
  // Botanicals & Extracts
  'Centella Asiatica': 'Also known as Tiger Grass or Cica. Highly soothing, calms inflammation, and repairs the skin barrier.',
  'Madecassoside': 'A compound from Centella Asiatica that powerfully soothes irritated and sensitive skin.',
  'Camellia Sinensis': 'Green Tea extract. Rich in antioxidants that fight aging and soothe inflammation.',
  'Artemisia': 'Mugwort extract. A traditional Korean herb that calms sensitive, acne-prone skin.',
  'Houttuynia Cordata': 'Heartleaf extract. Anti-inflammatory and antibacterial — excellent for acne-prone skin.',
  'Propolis': 'Bee propolis. A natural antibacterial that heals blemishes and deeply nourishes skin.',
  'Calendula': 'Anti-inflammatory flower extract that soothes redness and promotes skin healing.',
  'Snail Secretion Filtrate': 'A K-Beauty powerhouse that hydrates, repairs damage, and fades dark spots.',
  'Oryza Sativa': 'Rice extract. Rich in vitamins and antioxidants that brighten and soften the skin.',
  'Tea Tree': 'Antibacterial and anti-inflammatory. Targets acne-causing bacteria without over-drying.',
  'Aloe': 'Deeply hydrating and soothing. Calms sunburns, irritation, and redness.',
  'Turmeric': 'Anti-inflammatory and antioxidant-rich. Brightens skin tone and calms redness.',
  'Ginseng': 'Revitalizes dull skin, boosts circulation, and has powerful anti-aging properties.',
  
  // Hydrators & Barrier
  'Ceramide': 'Essential lipids that form the skin\'s protective barrier and lock in moisture.',
  'Squalane': 'A lightweight, plant-derived oil that mimics the skin\'s natural sebum for deep hydration.',
  'Glycerin': 'A gentle humectant that draws water to the skin for lasting hydration.',
  'Beta-Glucan': 'A soothing hydrator that calms redness and strengthens the skin\'s natural defenses.',
  'Sodium Hyaluronate': 'A smaller form of Hyaluronic Acid that penetrates deeper for intense hydration.',
  'Betaine': 'An amino acid that provides osmotic hydration and soothes sensitive skin.',
  'Collagen': 'A structural protein that improves skin firmness, elasticity, and moisture retention.',
  'Trehalose': 'A natural sugar that protects skin cells from dehydration and environmental stress.',
  
  // Peptides & Growth Factors
  'Peptide': 'Short chains of amino acids that signal skin to produce more collagen and repair itself.',
  'Copper Tripeptide': 'A powerful peptide that accelerates wound healing and stimulates collagen synthesis.',
  'EGF': 'Epidermal Growth Factor. Stimulates cell renewal for smoother, younger-looking skin.',
  
  // Emollients & Oils
  'Butyrospermum Parkii': 'Shea Butter. An excellent emollient that deeply moisturizes and nourishes the skin.',
  'Jojoba': 'A lightweight oil that closely mimics natural skin oils, balancing hydration without clogging pores.',
  
  // Brighteners
  'Arbutin': 'A natural brightening agent derived from bearberry that fades dark spots gently.',
  'Glutathione': 'A master antioxidant that brightens skin and evens out skin tone.',
  
  // Other Common
  'Zinc PCA': 'Controls excess sebum production and has antibacterial properties for acne-prone skin.',
  'Caffeine': 'Reduces puffiness and dark circles by constricting blood vessels and boosting circulation.',
  'PDRN': 'Salmon DNA. Promotes cell regeneration, improves skin texture, and boosts hydration.',
  'Papain': 'A natural enzyme from papaya that gently dissolves dead skin cells for smoother texture.',
};

export default function ProductGrid({ 
  favorites, 
  toggleFavorite 
}: { 
  favorites: Set<number>;
  toggleFavorite: (e: React.MouseEvent, id: number) => void;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedBrandFolder, setSelectedBrandFolder] = useState<string | null>(null);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { profile } = useUser();
  const { products, isLoading, searchQuery } = useProducts();

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    if (filterBrand !== 'All') {
      result = result.filter(p => p.brand === filterBrand);
    }

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [filterCategory, filterBrand, sortBy, searchQuery, products]);

  const handleAddToCart = (e: React.MouseEvent, product: Product, quantity: number = 1, optionIndex: number = 0) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Use numeric price directly from product or option
    const priceNumber = product.options && product.options.length > 0 
      ? product.options[optionIndex].price 
      : product.price;
    
    addToCart({
      id: product.options && product.options.length > 0 ? `${product.id}-${optionIndex}` : product.id.toString(),
      title: product.options && product.options.length > 0 ? `${product.name} - ${product.options[optionIndex].size}` : product.name,
      price: priceNumber,
      image: product.image,
      quantity: quantity
    });
    
    setToastMessage(`${quantity} ${product.name} added to cart`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    toggleFavorite(e, product.id);
    const isAdding = !favorites.has(product.id);
    if (isAdding) {
      setToastMessage(`${product.name} added to wishlist`);
    } else {
      setToastMessage(`${product.name} removed from wishlist`);
    }
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedOptionIndex(0);
    setModalQuantity(1);
    setIsPlayingVideo(false);
  };

  const isPerfectMatch = (product: Product) => {
    if (!profile || !product.idealFor) return false;
    const matchesSkinType = product.idealFor.some(match => match.skinType && match.skinType.includes(profile.skinType));
    const matchesConcern = product.idealFor.some(match => match.concern && match.concern.includes(profile.concern));
    return matchesSkinType && matchesConcern;
  };

  const renderIngredients = (ingredientsString: string) => {
    const ingredientsList = ingredientsString.split(',').map(i => i.trim());
    
    return (
      <div className="flex flex-wrap gap-1">
        {ingredientsList.map((ingredient, idx) => {
          // Check if this ingredient (or a part of it) is in our glossary
          const glossaryKey = Object.keys(INGREDIENT_GLOSSARY).find(key => 
            ingredient.toLowerCase().includes(key.toLowerCase())
          );
          
          if (glossaryKey) {
            return (
              <span 
                key={idx} 
                className="relative inline-block group cursor-help"
                onMouseEnter={() => setHoveredIngredient(glossaryKey)}
                onMouseLeave={() => setHoveredIngredient(null)}
              >
                <span className="border-b border-dashed border-ink-400 text-ink-900 font-medium">
                  {ingredient}{idx < ingredientsList.length - 1 ? ',' : ''}
                </span>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredIngredient === glossaryKey && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink-900 text-white text-xs rounded-xl shadow-xl z-50 pointer-events-none"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <Info className="w-3 h-3 text-pastel-pink shrink-0 mt-0.5" />
                        <span className="font-medium">{glossaryKey}</span>
                      </div>
                      <p className="text-white/80 font-light leading-relaxed">
                        {INGREDIENT_GLOSSARY[glossaryKey]}
                      </p>
                      {/* Triangle pointer */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-900"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            );
          }
          
          return (
            <span key={idx}>
              {ingredient}{idx < ingredientsList.length - 1 ? ',' : ''}
            </span>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    // 120,000 ms = 2 minutes cycle
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 6 >= products.length ? 0 : prev + 6));
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <>
      <SEO 
        title={selectedProduct ? selectedProduct.name : "Curated K-Beauty Collections"} 
        description={selectedProduct ? selectedProduct.description : "Discover premium Korean skincare at The Skin Boutique. Curated favorites for every skin concern."}
        product={selectedProduct || undefined}
      />
      <section id="products" className="py-24 bg-ivory-50 scroll-mt-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Products Carousel */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-ink-900 sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {products.slice(featuredIndex, featuredIndex + 6).map((product, index) => (
              <motion.div
                key={`featured-${product.id}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-none w-72 sm:w-80 snap-start group cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div className="relative overflow-hidden rounded-[2rem] h-[380px] bg-white shadow-sm group-hover:shadow-2xl group-hover:shadow-pastel-pink-dark/20 transition-all duration-500 mb-6">
                  <img
                    src={product.image}
                    alt={`${product.brand} - ${product.name}`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                  {/* Grainy Noise Overlay */}
                  <div 
                    className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
                    style={{ 
                      backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
                    }}
                  ></div>
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-ink-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Featured
                    </span>
                    {isPerfectMatch(product) && (
                      <span className="bg-pastel-pink-dark text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Perfect Match
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleToggleFavorite(e, product)}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/70 backdrop-blur-md hover:bg-white transition-colors z-10 shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-pastel-pink-dark text-pastel-pink-dark' : 'text-ink-900'}`} />
                  </button>
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-white/90 backdrop-blur-md text-ink-900 py-3.5 rounded-full font-medium hover:bg-ink-900 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 flex flex-col items-center text-center">
                  <p className="text-[10px] text-ink-500 font-medium mb-1 uppercase tracking-[0.2em]">{product.brand}</p>
                  <h3 className="text-xl font-serif text-ink-900 group-hover:text-pastel-pink-dark transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-medium text-ink-900 mt-2">{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif text-ink-900 sm:text-4xl mb-4">
              Trending Now
            </h2>
            <p className="text-lg text-ink-700 font-light">
              Shop our most loved products from top-rated global skincare brands.
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-ink-100 gap-4">
          {selectedBrandFolder ? (
            <button 
              onClick={() => setSelectedBrandFolder(null)}
              className="flex items-center gap-2 text-ink-900 font-medium hover:text-pastel-pink-dark transition-colors px-4 py-2 rounded-full border border-ink-200 hover:border-pastel-pink-dark/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Brands Directory
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center text-ink-500 mr-2">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium uppercase tracking-wider">Filter</span>
              </div>
              
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent border border-ink-200 text-ink-900 text-sm rounded-full px-4 py-2 focus:outline-none focus:border-pastel-blue-dark focus:ring-1 focus:ring-pastel-blue-dark appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>
                ))}
              </select>

              <select 
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="bg-transparent border border-ink-200 text-ink-900 text-sm rounded-full px-4 py-2 focus:outline-none focus:border-pastel-blue-dark focus:ring-1 focus:ring-pastel-blue-dark appearance-none cursor-pointer"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center w-full sm:w-auto">
            <span className="text-sm font-medium text-ink-500 uppercase tracking-wider mr-3">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-b border-ink-200 text-ink-900 text-sm py-1 pr-6 focus:outline-none focus:border-pastel-blue-dark appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          <AnimatePresence mode="popLayout">
            {!selectedBrandFolder && filterBrand === 'All' && filterCategory === 'All' ? (
              brands.filter(b => b !== 'All').map((brand, index) => (
                <motion.div
                  layout
                  key={`folder-${brand}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  onClick={() => setSelectedBrandFolder(brand)}
                  className="group cursor-pointer bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-pastel-pink-dark/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[250px] border border-ink-100"
                >
                  <h3 className="text-xl font-serif text-ink-900 text-center">{brand}</h3>
                  <p className="text-xs text-ink-500 mt-2 uppercase tracking-widest">{products.filter(p => p.brand === brand).length} Products</p>
                </motion.div>
              ))
            ) : (
              filteredAndSortedProducts
                .filter(p => !selectedBrandFolder || p.brand === selectedBrandFolder)
                .map((product) => (
                <motion.div 
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 250, damping: 25 },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                    y: { duration: 0.25 }
                  }}
                  className="group relative"
                >
                  <div 
                    className="relative w-full h-[400px] bg-white rounded-[2rem] overflow-hidden cursor-pointer group-hover:shadow-2xl group-hover:shadow-pastel-pink-dark/20 transition-all duration-500"
                    onClick={() => openModal(product)}
                  >
                    <img
                      src={product.image}
                      alt={`${product.brand} - ${product.name}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
                      style={{ 
                        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-ink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <button 
                      onClick={(e) => handleToggleFavorite(e, product)}
                      className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/70 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                      aria-label="Add to favorites"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${favorites.has(product.id) ? 'fill-pastel-pink-dark text-pastel-pink-dark' : 'text-ink-700'}`} />
                    </button>

                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-ink-900 px-8 py-3.5 rounded-full font-medium text-sm flex items-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-ink-900 hover:text-white z-10"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                  <div className="mt-6 flex flex-col items-center text-center">
                    <h3 className="text-[10px] text-ink-500 mb-2 uppercase tracking-[0.2em] font-medium">
                      {product.brand}
                    </h3>
                    <p className="text-xl font-serif text-ink-900 cursor-pointer hover:text-pastel-pink-dark transition-colors line-clamp-1" onClick={() => openModal(product)}>
                      {product.name}
                    </p>
                    <p className="text-sm text-ink-500 mt-1 mb-2 font-light">{product.category}</p>
                    <p className="text-lg font-medium text-ink-900">{formatPrice(product.price)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center bg-ink-900 text-white px-6 py-3 rounded-full shadow-lg"
          >
            {toastMessage.includes('wishlist') ? (
              <Heart className="w-5 h-5 mr-3 text-pastel-pink-dark fill-pastel-pink-dark" />
            ) : (
              <CheckCircle2 className="w-5 h-5 mr-3 text-pastel-green" />
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors border border-ink-100"
              >
                <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-ink-50 overflow-hidden group">
                {isPlayingVideo && selectedProduct.textureVideo ? (
                  <video 
                    src={selectedProduct.textureVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                   <img 
                    src={selectedProduct.image} 
                    alt={`${selectedProduct.brand} - ${selectedProduct.name}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                )}

                
                {selectedProduct.textureVideo && !isPlayingVideo && (
                  <button 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-ink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-white/90 backdrop-blur-md text-ink-900 px-6 py-3 rounded-full font-medium text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-ink-900" /> View Texture
                    </div>
                  </button>
                )}
                {isPlayingVideo && (
                  <button 
                    onClick={() => setIsPlayingVideo(false)}
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-ink-900 px-4 py-2 rounded-full font-medium text-[10px] tracking-widest uppercase shadow-sm hover:bg-white transition-colors"
                  >
                    View Product
                  </button>
                )}
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] text-ink-500 uppercase tracking-[0.2em] font-medium">
                      {selectedProduct.brand}
                    </h3>
                    {isPerfectMatch(selectedProduct) && (
                      <span className="bg-pastel-pink-dark/10 text-pastel-pink-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Star className="w-3 h-3 fill-pastel-pink-dark" /> Perfect Match
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-ink-900 mb-4 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xl font-light text-ink-700 mb-8">
                    {formatPrice(
                      selectedProduct.options && selectedProduct.options.length > 0
                        ? selectedProduct.options[selectedOptionIndex].price
                        : selectedProduct.price
                    )}
                  </p>
                  
                  {selectedProduct.options && selectedProduct.options.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-[10px] font-medium text-ink-900 tracking-[0.2em] uppercase mb-4">Select Size</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedOptionIndex(idx)}
                            className={`px-6 py-3 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 border ${
                              selectedOptionIndex === idx
                                ? 'bg-ink-900 text-white border-ink-900'
                                : 'bg-transparent text-ink-500 border-ink-200 hover:border-ink-900 hover:text-ink-900'
                            }`}
                          >
                            {option.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                    <div className="flex items-center border border-ink-200 rounded-full h-12 w-full sm:w-auto shrink-0">
                      <button 
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="px-6 h-full text-ink-500 hover:text-ink-900 transition-colors flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 stroke-[1.5]" />
                      </button>
                      <span className="w-10 text-center font-medium text-ink-900 text-sm">{modalQuantity}</span>
                      <button 
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="px-6 h-full text-ink-500 hover:text-ink-900 transition-colors flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>

                    <button 
                      onClick={(e) => handleAddToCart(e, selectedProduct, modalQuantity, selectedOptionIndex)}
                      className="w-full bg-ink-900 text-white h-12 rounded-full font-medium flex items-center justify-center hover:bg-ink-800 transition-colors text-xs tracking-widest uppercase"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-medium text-ink-900 tracking-[0.2em] uppercase mb-4 border-b border-ink-100 pb-3">Description</h4>
                    <p className="text-ink-500 font-light text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-medium text-ink-900 tracking-[0.2em] uppercase mb-4 border-b border-ink-100 pb-3">Ingredients</h4>
                    <div className="text-ink-500 font-light text-xs leading-relaxed">
                      {renderIngredients(selectedProduct.ingredients)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-medium text-ink-900 tracking-[0.2em] uppercase mb-6 border-b border-ink-100 pb-3">Customer Reviews</h4>
                    <div className="space-y-6">
                      {selectedProduct.reviews.map((review, idx) => (
                        <div key={idx} className="bg-ink-50 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-ink-900 text-xs tracking-wide">{review.user}</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-ink-900 text-ink-900' : 'text-ink-200'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-ink-500 font-light text-sm italic">"{review.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Products Section */}
                  <div className="pt-10 border-t border-ink-100">
                    <h4 className="text-[10px] font-medium text-ink-900 tracking-[0.2em] uppercase mb-6">More from {selectedProduct.brand}</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {products
                        .filter(p => p.brand === selectedProduct.brand && p.id !== selectedProduct.id)
                        .slice(0, 3)
                        .map((relatedProduct) => (
                          <div 
                            key={relatedProduct.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(relatedProduct);
                              setModalQuantity(1);
                              setSelectedOptionIndex(0);
                            }}
                            className="group cursor-pointer"
                          >
                            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-2 border border-ink-50 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <img 
                                src={relatedProduct.image} 
                                alt={relatedProduct.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <h5 className="text-[9px] font-medium text-ink-900 line-clamp-1 group-hover:text-pastel-pink-dark transition-colors">
                              {relatedProduct.name}
                            </h5>
                            <p className="text-[9px] text-ink-500">{formatPrice(relatedProduct.price)}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
    </>
  );
}
