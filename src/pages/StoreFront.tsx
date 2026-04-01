import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Features from '../components/Features';
import Banner from '../components/Banner';
import DiscountCalendar from '../components/DiscountCalendar';
import Footer from '../components/Footer';
import MarqueeBanner from '../components/MarqueeBanner';
import WishlistModal from '../components/WishlistModal';
import CheckoutModal from '../components/CheckoutModal';
import TrackingModal from '../components/TrackingModal';
import CurrencyModal from '../components/CurrencyModal';
import CartDrawer from '../components/CartDrawer';
import AffiliateModal from '../components/AffiliateModal';
import SkinQuizModal from '../components/SkinQuizModal';
import QuizSection from '../components/QuizSection';
import ProductScanner from '../components/ProductScanner';
import AuthModal from '../components/AuthModal';
import ContactModal from '../components/ContactModal';
import FAQSection from '../components/FAQSection';
import TieredBundles from '../components/TieredBundles';
import BundleBuilderModal from '../components/BundleBuilderModal';
import { type Product } from '../data/products';
import { getActiveTheme } from '../utils/theme';
import { useCart } from '../contexts/CartContext';

export default function StoreFront() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [builderRecommendations, setBuilderRecommendations] = useState<Product[]>([]);

  const { isCheckoutOpen, closeCheckout, openCheckout } = useCart();


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
      <ProductScanner />
      <div className="relative min-h-screen flex flex-col">
          <Navbar 
            favoritesCount={favorites.size} 
            onOpenWishlist={() => setIsWishlistOpen(true)} 
            onOpenCheckout={openCheckout}
            onOpenCurrency={() => setIsCurrencyOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAffiliate={() => setIsAffiliateOpen(true)}
          />
          <main className="relative flex-grow">
            <Hero />
            <MarqueeBanner />
            <QuizSection onOpenQuiz={() => setIsQuizOpen(true)} />
            <TieredBundles onOpenBuilder={(tierIndex) => {
              setBuilderRecommendations([]);
              setActiveTier(tierIndex);
              setIsBuilderOpen(true);
            }} />
            <Features />
            <ProductGrid 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
            />
            <Banner />
            <DiscountCalendar />
            <FAQSection />
          </main>
          <Footer onOpenAffiliate={() => setIsAffiliateOpen(true)} onOpenContact={() => setIsContactOpen(true)} />
          
          <CartDrawer />

          <WishlistModal 
            isOpen={isWishlistOpen} 
            onClose={() => setIsWishlistOpen(false)} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={closeCheckout}
            onOpenTracking={() => setIsTrackingOpen(true)}
          />

          <TrackingModal
            isOpen={isTrackingOpen}
            onClose={() => setIsTrackingOpen(false)}
          />

          <CurrencyModal
            isOpen={isCurrencyOpen}
            onClose={() => setIsCurrencyOpen(false)}
          />

          <AffiliateModal
            isOpen={isAffiliateOpen}
            onClose={() => setIsAffiliateOpen(false)}
          />

          <SkinQuizModal
            isOpen={isQuizOpen}
            onClose={() => setIsQuizOpen(false)}
            onOpenBuilder={(recs) => {
              setBuilderRecommendations(recs);
              setActiveTier(null);
              setIsBuilderOpen(true);
            }}
          />

          <BundleBuilderModal
            isOpen={isBuilderOpen}
            onClose={() => {
              setIsBuilderOpen(false);
              setTimeout(() => setActiveTier(null), 300);
            }}
            initialRecommended={builderRecommendations}
            initialTierIndex={activeTier}
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />

          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </div>
    </>
  );
}
