import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getProductSlug } from '../utils/slug';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Features from '../components/Features';
import Banner from '../components/Banner';
import DiscountCalendar from '../components/DiscountCalendar';
import Footer from '../components/Footer';
import MarqueeBanner from '../components/MarqueeBanner';
import CartDrawer from '../components/CartDrawer';
import QuizSection from '../components/QuizSection';
import ProductScanner from '../components/ProductScanner';
import FAQSection from '../components/FAQSection';
import TieredBundles from '../components/TieredBundles';
import NewArrivals from '../components/NewArrivals';
import NewsletterSignup from '../components/NewsletterSignup';
import { type Product } from '../data/products';
import { getActiveTheme } from '../utils/theme';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { Grid3X3, Package, Sparkles, FlaskConical, ArrowRight } from 'lucide-react';

// Lazy load heavy modals to optimize initial bundle
const WishlistModal = lazy(() => import('../components/WishlistModal'));
const CheckoutModal = lazy(() => import('../components/CheckoutModal'));
const TrackingModal = lazy(() => import('../components/TrackingModal'));
const CurrencyModal = lazy(() => import('../components/CurrencyModal'));
const AffiliateModal = lazy(() => import('../components/AffiliateModal'));
const SkinQuizModal = lazy(() => import('../components/SkinQuizModal'));
const BundleBuilderModal = lazy(() => import('../components/BundleBuilderModal'));
const AuthModal = lazy(() => import('../components/AuthModal'));
const ContactModal = lazy(() => import('../components/ContactModal'));

export default function StoreFront() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [builderRecommendations, setBuilderRecommendations] = useState<Product[]>([]);

  const { slug: urlSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isCheckoutOpen, closeCheckout, openCheckout } = useCart();
  const { products } = useProducts();

  // Handle deep-linking from URL
  useEffect(() => {
    if (urlSlug && products.length > 0) {
      const product = products.find(p => getProductSlug(p) === urlSlug);
      if (product) {
        setSelectedProduct(product);
      } else if (urlSlug === 'undefined') {
        // Handle legacy or broken links gracefully
        navigate('/', { replace: true });
      }
    } else if (!urlSlug && selectedProduct) {
      setSelectedProduct(null);
    }
  }, [urlSlug, products, navigate]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    const slug = getProductSlug(product);
    navigate(`/product/${slug}`, { replace: true });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    navigate('/', { replace: true });
  };


  useEffect(() => {
    // Capture referral code from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referralCode', ref);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    const theme = getActiveTheme();
    if (theme !== 'theme-default') {
      document.body.classList.add(theme);
    }
    return () => {
      if (theme !== 'theme-default') {
        document.body.classList.remove(theme);
      }
    };
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      <SEO 
        title={selectedProduct ? selectedProduct.name : undefined}
        description={selectedProduct ? selectedProduct.description : undefined}
        product={selectedProduct || undefined}
      />
      <ProductScanner />
      <div className="relative min-h-[100dvh] flex flex-col">
          <Navbar 
            favoritesCount={favorites.size} 
            onOpenWishlist={() => setIsWishlistOpen(true)} 
            onOpenCheckout={openCheckout}
            onOpenCurrency={() => setIsCurrencyOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAffiliate={() => setIsAffiliateOpen(true)}
          />
          <main className="relative flex-grow">
            <Hero isProductActive={!!selectedProduct} />
            <MarqueeBanner />
            <QuizSection onOpenQuiz={() => setIsQuizOpen(true)} />
            {/* ─── Shop Navigation CTA Cards ─── */}
            <section className="py-32 relative overflow-hidden bg-[#faf8f5]">
              {/* Ambient Orbs for Glass Refraction */}
              <div className="absolute top-10 left-10 w-96 h-96 bg-[var(--color-pastel-pink)] rounded-full ambient-orb"></div>
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--color-taupe)] rounded-full ambient-orb" style={{ animationDelay: '-10s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full ambient-orb" style={{ opacity: 0.8, animationDuration: '30s' }}></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Asymmetric Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-xl"
                  >
                    <h2 className="text-4xl md:text-6xl font-serif text-ink-900 leading-tight">How Do You Want to Shop?</h2>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-md lg:pb-2"
                  >
                    <p className="text-lg text-ink-500 font-light leading-relaxed">
                      From curated packages to custom routines — choose your path to glass skin.
                    </p>
                  </motion.div>
                </div>

                <motion.div 
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {[
                    { to: '/shop', title: 'Browse All', desc: 'Explore 1,000+ products by category', icon: Grid3X3 },
                    { to: '/packages', title: 'Packages', desc: 'Ready-made routines with bundle savings', icon: Package },
                    { to: '/bundles', title: 'Bundles', desc: 'Products designed to work together', icon: Sparkles },
                    { to: '/build', title: 'Build Routine', desc: 'Pick your own products & save up to 25%', icon: FlaskConical },
                  ].map(card => (
                    <motion.div
                      key={card.to}
                      variants={{
                        hidden: { opacity: 0, y: 40, scale: 0.95 },
                        show: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: { type: "spring", stiffness: 300, damping: 24 }
                        }
                      }}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 20 }
                      }}
                      className="h-full"
                    >
                      <Link
                        to={card.to}
                        className="group relative flex flex-col h-full p-10 premium-glass grainy focus-visible:ring-2 focus-visible:ring-ink-900 outline-none overflow-hidden rounded-[2rem]"
                      >
                        <div className="mb-10 text-ink-900 transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                          <card.icon strokeWidth={1} size={32} />
                        </div>
                        <h3 className="text-3xl font-serif text-ink-900 mb-4">{card.title}</h3>
                        <p className="text-sm text-ink-500 font-light mb-12 flex-grow leading-relaxed">{card.desc}</p>
                        <div className="mt-auto flex items-center gap-3 text-ink-900 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500">
                          <span className="relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-ink-900 after:transform after:scale-x-0 after:origin-right after:transition-transform after:duration-500 group-hover:after:scale-x-100 group-hover:after:origin-left">Explore</span>
                          <ArrowRight size={14} strokeWidth={1.5} className="transform transition-transform duration-500 group-hover:translate-x-2" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
            <Features />
            <NewArrivals 
              products={products} 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
              onOpenProduct={handleOpenProduct} 
            />
            <ProductGrid 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
              selectedProductSlug={urlSlug}
              onProductOpen={handleOpenProduct}
              onProductClose={handleCloseProduct}
            />
            <Banner />
            <DiscountCalendar />
            <FAQSection />
            <NewsletterSignup />
          </main>
          <Footer onOpenAffiliate={() => setIsAffiliateOpen(true)} onOpenContact={() => setIsContactOpen(true)} />
          
          <CartDrawer />

          <Suspense fallback={null}>
            {isWishlistOpen && (
              <WishlistModal 
                isOpen={isWishlistOpen} 
                onClose={() => setIsWishlistOpen(false)} 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
              />
            )}

            {isCheckoutOpen && (
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={closeCheckout}
                onOpenTracking={() => setIsTrackingOpen(true)}
              />
            )}

            {isTrackingOpen && (
              <TrackingModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
              />
            )}

            {isCurrencyOpen && (
              <CurrencyModal
                isOpen={isCurrencyOpen}
                onClose={() => setIsCurrencyOpen(false)}
              />
            )}

            {isAffiliateOpen && (
              <AffiliateModal
                isOpen={isAffiliateOpen}
                onClose={() => setIsAffiliateOpen(false)}
              />
            )}

            {isQuizOpen && (
              <SkinQuizModal
                isOpen={isQuizOpen}
                onClose={() => setIsQuizOpen(false)}
                onOpenBuilder={(recs) => {
                  setBuilderRecommendations(recs);
                  setActiveTier(null);
                  setIsBuilderOpen(true);
                }}
              />
            )}

            {isBuilderOpen && (
              <BundleBuilderModal
                isOpen={isBuilderOpen}
                onClose={() => {
                  setIsBuilderOpen(false);
                  setTimeout(() => setActiveTier(null), 300);
                }}
                initialRecommended={builderRecommendations}
                initialTierIndex={activeTier}
              />
            )}

            {isAuthOpen && (
              <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
              />
            )}

            {isContactOpen && (
              <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
              />
            )}
          </Suspense>
        </div>
    </>
  );
}
