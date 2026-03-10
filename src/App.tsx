/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Features from './components/Features';
import Banner from './components/Banner';
import DiscountCalendar from './components/DiscountCalendar';
import Footer from './components/Footer';
import MarqueeBanner from './components/MarqueeBanner';
import WishlistModal from './components/WishlistModal';
import CheckoutModal from './components/CheckoutModal';
import TrackingModal from './components/TrackingModal';
import CurrencyModal from './components/CurrencyModal';
import CustomCursor from './components/CustomCursor';
import CartDrawer from './components/CartDrawer';
import AffiliateModal from './components/AffiliateModal';
import SkinQuizModal from './components/SkinQuizModal';
import QuizSection from './components/QuizSection';
import ProductScanner from './components/ProductScanner';
import AuthModal from './components/AuthModal';
import { getActiveTheme } from './utils/theme';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
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
    <CurrencyProvider>
      <CartProvider>
        <CustomCursor />
        <ProductScanner />
        <div className="relative min-h-screen flex flex-col">
          <Navbar 
            favoritesCount={favorites.size} 
            onOpenWishlist={() => setIsWishlistOpen(true)} 
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onOpenCurrency={() => setIsCurrencyOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
          <main className="relative flex-grow">
            <Hero />
            <MarqueeBanner />
            <QuizSection onOpenQuiz={() => setIsQuizOpen(true)} />
            <Features />
            <ProductGrid 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
            />
            <Banner />
            <DiscountCalendar />
          </main>
          <Footer onOpenAffiliate={() => setIsAffiliateOpen(true)} />
          
          <CartDrawer />

          <WishlistModal 
            isOpen={isWishlistOpen} 
            onClose={() => setIsWishlistOpen(false)} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
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
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        </div>
      </CartProvider>
    </CurrencyProvider>
  );
}
