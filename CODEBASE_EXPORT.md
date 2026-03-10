# Skincare Store Codebase Export

This document contains the core source code for the Skincare Store application. It is formatted specifically to be easily read by LLMs like Claude.

## src/App.tsx
``tsx
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
import { getActiveTheme } from './utils/theme';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
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
        </div>
      </CartProvider>
    </CurrencyProvider>
  );
}

``

## src/index.css
``css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
@import "tailwindcss";

@property --color-pastel-pink {
  syntax: "<color>";
  initial-value: #F9F6F0;
  inherits: true;
}

@property --color-pastel-pink-dark {
  syntax: "<color>";
  initial-value: #D4C5B9;
  inherits: true;
}

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  
  --color-pastel-pink: #F9F6F0;
  --color-pastel-pink-dark: #D4C5B9;
  --color-pastel-blue: #F0F4F8;
  --color-pastel-blue-dark: #BCCCDC;
  --color-pastel-green: #F2F5F0;
  --color-pastel-green-dark: #C2D1C2;
  --color-pastel-peach: #FDF8F5;
  --color-pastel-peach-dark: #E8D5C4;
  --color-pastel-lilac: #F7F5FA;
  --color-pastel-lilac-dark: #D1C7DF;
  --color-pastel-yellow: #FDFCF0;
  --color-pastel-yellow-dark: #E8E5C4;
  
  --color-ink-900: #1A1A1A;
  --color-ink-700: #4A4A4A;
  --color-ink-500: #8C8C8C;
  --color-ink-300: #D1D1D1;
  --color-ink-200: #E5E5E5;
  --color-ink-100: #F2F2F2;
  --color-ink-50: #FAFAFA;

  --animate-neon-marquee: neon-marquee 30s linear infinite;
}

@keyframes neon-marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.neon-text {
  /* Removed neon effect per request */
}

.theme-valentines {
  --color-pastel-pink: #FFF1F2;
  --color-pastel-pink-dark: #FB7185;
}

.theme-womens-day {
  --color-pastel-pink: #FAF5FF;
  --color-pastel-pink-dark: #C084FC;
}

.theme-pride {
  --color-pastel-pink: #FFFFF0;
  --color-pastel-pink-dark: #FBBF24;
}

.theme-christmas {
  --color-pastel-pink: #F0FDF4;
  --color-pastel-pink-dark: #4ADE80;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-pastel-pink text-ink-900 font-sans antialiased;
  transition: --color-pastel-pink 1s ease-in-out, --color-pastel-pink-dark 1s ease-in-out, background-color 1s ease-in-out, color 1s ease-in-out, border-color 1s ease-in-out;
}

@media (min-width: 768px) {
  * {
    cursor: none !important;
  }
}

h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}

``

## src/main.tsx
``tsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

``

## src/components/AffiliateModal.tsx
``tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, Users, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AffiliateModal({ isOpen, onClose }: AffiliateModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors border border-ink-100"
            >
              <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
            </button>

            <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-ink-900 text-white p-12 flex flex-col justify-center">

              <div className="relative z-10">
                <h2 className="text-[10px] font-medium text-pastel-pink tracking-[0.3em] uppercase mb-6">
                  Brand Ambassador
                </h2>
                <h3 className="text-4xl font-serif leading-tight mb-6">
                  Share the glow. <br/>Earn rewards.
                </h3>
                <p className="text-white/70 font-light text-sm leading-relaxed mb-10">
                  Join The Skin Boutique affiliate program and earn commissions on every sale you refer.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pastel-pink/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-pastel-pink stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">15% Commission</h4>
                      <p className="text-xs text-white/60 font-light">Earn on every qualifying purchase.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pastel-pink/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-pastel-pink stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Exclusive Access</h4>
                      <p className="text-xs text-white/60 font-light">Get early access to new brand launches.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pastel-pink/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-pastel-pink stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Dedicated Support</h4>
                      <p className="text-xs text-white/60 font-light">Access to our affiliate management team.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto bg-white">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-pastel-green/20 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-10 h-10 text-pastel-green-dark stroke-[1.5]" />
                  </div>
                  <h3 className="text-3xl font-serif text-ink-900">Application Received</h3>
                  <p className="text-ink-500 font-light max-w-sm">
                    Thank you for your interest in joining our affiliate program. Our team will review your application and get back to you within 48 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif text-ink-900 mb-2">Apply Now</h3>
                    <p className="text-sm text-ink-500 font-light">Fill out the form below to get started.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm"
                          placeholder="Jane"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm"
                        placeholder="jane@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="social" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">Primary Social Media Handle</label>
                      <input
                        type="text"
                        id="social"
                        required
                        className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm"
                        placeholder="@janedoe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">Website / Blog (Optional)</label>
                      <input
                        type="url"
                        id="website"
                        className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm"
                        placeholder="https://janedoe.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-xs font-medium text-ink-900 uppercase tracking-wider">Why do you want to join?</label>
                      <textarea
                        id="message"
                        rows={3}
                        required
                        className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:border-ink-900 transition-colors text-sm resize-none"
                        placeholder="Tell us a bit about yourself and your audience..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-8 py-4 bg-ink-900 text-white rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors"
                    >
                      Submit Application
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

``

## src/components/Banner.tsx
``tsx
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Banner() {
  return (
    <section id="journal" className="relative bg-ink-900 py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Spa and skincare"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-[10px] font-medium text-pastel-pink tracking-[0.3em] uppercase mb-8">
            The Inner Circle
          </h2>
          <p className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-8">
            Elevate your <br className="hidden sm:block" />
            <span className="italic font-light text-pastel-pink">daily ritual.</span>
          </p>
          <p className="text-lg text-white/70 font-light mb-12 max-w-xl mx-auto">
            Join our community and receive 15% off your first order, plus exclusive access to new brand launches and expert skincare advice.
          </p>
          
          <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-pastel-pink rounded-full transition-colors"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="flex-shrink-0 flex items-center justify-center px-8 py-4 border border-pastel-pink text-ink-900 bg-pastel-pink hover:bg-white hover:border-white rounded-full transition-all duration-300 font-medium tracking-wide uppercase text-xs"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

``

## src/components/CartDrawer.tsx
``tsx
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { currency } = useCurrency();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/30">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-ink-900" />
                <span className="font-serif text-xl font-semibold text-ink-900">Your Cart</span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-ink-900" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-pastel-pink-dark" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink-900">Your cart is empty</h3>
                  <p className="text-ink-500 font-light">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-8 py-3 bg-ink-900 text-white rounded-full font-medium hover:bg-pastel-pink-dark hover:text-ink-900 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-ink-100 pb-6 last:border-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-pastel-pink/20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-ink-900 line-clamp-2">{item.title}</h4>
                          <p className="text-pastel-pink-dark font-semibold mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-ink-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-ink-200 rounded-full bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-ink-500 hover:text-ink-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-ink-500 hover:text-ink-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-ink-100 bg-ink-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-ink-500 font-medium uppercase tracking-wider text-sm">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl font-semibold text-ink-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-ink-500 mb-6 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <button className="w-full py-4 bg-ink-900 text-white rounded-full font-medium text-lg hover:bg-pastel-pink-dark hover:text-ink-900 transition-colors flex items-center justify-center gap-2">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

``

## src/components/CheckoutModal.tsx
``tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Wallet, Apple, CheckCircle2, Smartphone, ShieldCheck, Lock, Mail } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onOpenTracking }: CheckoutModalProps) {
  const { formatPrice } = useCurrency();
  const { cartCount, cartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'paypal' | 'apple' | 'google'>('credit');
  const [checkoutState, setCheckoutState] = useState<'idle' | 'encrypting' | 'processing' | 'success'>('idle');

  // Real total price based on cart
  const subtotal = cartTotal;
  const shipping = cartCount > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setCheckoutState('encrypting');
    
    // Simulate secure encryption process
    setTimeout(() => {
      const mockPayload = {
        method: paymentMethod,
        amount: total,
        timestamp: Date.now()
      };
      console.log("🔒 Secure Payment Details Encrypted:", btoa(JSON.stringify(mockPayload)));
      
      setCheckoutState('processing');
      
      // Simulate API call
      setTimeout(() => {
        setCheckoutState('success');
        // Removed auto-close so user can click Track Order
      }, 1500);
    }, 1200);
  };

  const handleClose = () => {
    setCheckoutState('idle');
    onClose();
  };

  const handleTrackOrder = () => {
    setCheckoutState('idle');
    onClose();
    onOpenTracking();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {checkoutState === 'success' ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
                </motion.div>
                <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-2">Payment Successful!</h2>
                <p className="text-ink-500 mb-6">Thank you for your purchase.</p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-ink-50 p-4 rounded-xl mb-8 w-full text-left flex items-start gap-3"
                >
                  <Mail className="text-pastel-pink-dark w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm text-ink-700">
                    Order confirmation and tracking details have been sent to your email and via SMS.
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleTrackOrder}
                  className="w-full bg-ink-900 text-white py-4 rounded-xl font-medium hover:bg-ink-800 transition-colors mb-3"
                >
                  Track Your Order
                </motion.button>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={handleClose}
                  className="w-full text-ink-500 py-2 font-medium hover:text-ink-900 transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </div>
            ) : checkoutState === 'encrypting' || checkoutState === 'processing' ? (
              <div className="p-12 flex flex-col items-center justify-center text-center h-[500px]">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: checkoutState === 'encrypting' ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mb-6 relative"
                >
                  {checkoutState === 'encrypting' ? (
                    <div className="relative">
                      <ShieldCheck className="w-20 h-20 text-pastel-pink-dark" />
                      <motion.div 
                        className="absolute inset-0 border-4 border-pastel-pink-dark rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-4 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
                  )}
                </motion.div>
                <h2 className="text-xl font-serif font-semibold text-ink-900 mb-2">
                  {checkoutState === 'encrypting' ? 'Securing Payment...' : 'Processing...'}
                </h2>
                <p className="text-ink-500 text-sm">
                  {checkoutState === 'encrypting' 
                    ? 'End-to-end encrypting your details' 
                    : 'Please do not close this window'}
                </p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/20">
                  <h2 className="text-xl font-serif font-semibold text-ink-900">Checkout</h2>
                  <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-ink-500" />
                  </button>
                </div>

                <div className="p-6">
                  {cartCount === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-ink-500">Your cart is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-ink-50 rounded-2xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-2">Order Summary</h3>
                        <div className="flex justify-between text-sm text-ink-700">
                          <span>Items ({cartCount})</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-ink-700">
                          <span>Shipping</span>
                          <span>{formatPrice(shipping)}</span>
                        </div>
                        <div className="pt-3 border-t border-ink-200 flex justify-between font-medium text-ink-900">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-3">Payment Method</h3>
                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'credit' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="credit" 
                              checked={paymentMethod === 'credit'}
                              onChange={() => setPaymentMethod('credit')}
                              className="sr-only"
                            />
                            <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'credit' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <span className={`font-medium ${paymentMethod === 'credit' ? 'text-ink-900' : 'text-ink-700'}`}>Credit Card</span>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'credit' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'credit' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>

                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'debit' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="debit" 
                              checked={paymentMethod === 'debit'}
                              onChange={() => setPaymentMethod('debit')}
                              className="sr-only"
                            />
                            <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'debit' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <span className={`font-medium ${paymentMethod === 'debit' ? 'text-ink-900' : 'text-ink-700'}`}>Debit Card</span>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'debit' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'debit' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>

                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="paypal" 
                              checked={paymentMethod === 'paypal'}
                              onChange={() => setPaymentMethod('paypal')}
                              className="sr-only"
                            />
                            <Wallet className={`w-5 h-5 mr-3 ${paymentMethod === 'paypal' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <span className={`font-medium ${paymentMethod === 'paypal' ? 'text-ink-900' : 'text-ink-700'}`}>PayPal</span>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>

                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'apple' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="apple" 
                              checked={paymentMethod === 'apple'}
                              onChange={() => setPaymentMethod('apple')}
                              className="sr-only"
                            />
                            <Apple className={`w-5 h-5 mr-3 ${paymentMethod === 'apple' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <span className={`font-medium ${paymentMethod === 'apple' ? 'text-ink-900' : 'text-ink-700'}`}>Apple Pay</span>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'apple' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'apple' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>

                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'google' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="google" 
                              checked={paymentMethod === 'google'}
                              onChange={() => setPaymentMethod('google')}
                              className="sr-only"
                            />
                            <Smartphone className={`w-5 h-5 mr-3 ${paymentMethod === 'google' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <span className={`font-medium ${paymentMethod === 'google' ? 'text-ink-900' : 'text-ink-700'}`}>Google Pay</span>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'google' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'google' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Card Details (Conditional) */}
                      <AnimatePresence>
                        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pt-2">
                              <div>
                                <label className="block text-xs font-medium text-ink-500 mb-1">Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:border-pastel-pink-dark focus:ring-1 focus:ring-pastel-pink-dark text-sm" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-ink-500 mb-1">Expiry Date</label>
                                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:border-pastel-pink-dark focus:ring-1 focus:ring-pastel-pink-dark text-sm" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-ink-500 mb-1">CVC</label>
                                  <input type="text" placeholder="123" className="w-full px-4 py-2 bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:border-pastel-pink-dark focus:ring-1 focus:ring-pastel-pink-dark text-sm" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-3">
                        <button
                          onClick={handleCheckout}
                          disabled={checkoutState !== 'idle'}
                          className="w-full bg-ink-900 text-white py-4 rounded-xl font-medium hover:bg-ink-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Lock className="w-4 h-4 mr-2 opacity-70" />
                          Pay {formatPrice(total)} securely
                        </button>
                        <p className="text-center text-xs text-ink-400 flex items-center justify-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Payments are end-to-end encrypted
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

``

## src/components/CurrencyModal.tsx
``tsx
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Check } from 'lucide-react';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies: { code: Currency; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
];

export default function CurrencyModal({ isOpen, onClose }: CurrencyModalProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-blue/20">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-ink-900" />
                <h2 className="text-xl font-serif font-semibold text-ink-900">Regional Settings</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-ink-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-ink-500 mb-6">
                Select your preferred currency. Prices will be updated across the store.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      currency === c.code 
                        ? 'border-pastel-blue-dark bg-pastel-blue/10' 
                        : 'border-ink-200 hover:border-pastel-blue-dark/50 hover:bg-ink-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        currency === c.code ? 'bg-pastel-blue-dark text-ink-900' : 'bg-ink-100 text-ink-600'
                      }`}>
                        {c.symbol}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold text-sm ${currency === c.code ? 'text-ink-900' : 'text-ink-700'}`}>
                          {c.code}
                        </p>
                        <p className="text-xs text-ink-500">{c.name}</p>
                      </div>
                    </div>
                    {currency === c.code && (
                      <Check className="w-5 h-5 text-pastel-blue-dark" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

``

## src/components/CustomCursor.tsx
``tsx
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-pastel-pink-dark rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-pastel-pink-dark rounded-full pointer-events-none z-[99] hidden md:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
      />
    </>
  );
}

``

## src/components/DiscountCalendar.tsx
``tsx
import { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, CalendarHeart, Star } from 'lucide-react';

export default function DiscountCalendar() {
  const [birthdayMonth, setBirthdayMonth] = useState<string>(() => localStorage.getItem('birthdayMonth') || '');
  const [birthdayDay, setBirthdayDay] = useState<string>(() => localStorage.getItem('birthdayDay') || '');

  useEffect(() => {
    localStorage.setItem('birthdayMonth', birthdayMonth);
  }, [birthdayMonth]);

  useEffect(() => {
    localStorage.setItem('birthdayDay', birthdayDay);
  }, [birthdayDay]);

  const currentMonth = new Date().getMonth() + 1; // 1-12
  const isBirthdayMonth = birthdayMonth ? parseInt(birthdayMonth) === currentMonth : false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Valentine's Day: Feb 14
  const valentinesStart = new Date(currentYear, 1, 7); // Feb 7
  const valentinesEnd = new Date(currentYear, 1, 14, 23, 59, 59); // End of Feb 14
  const isValentinesVisible = currentDate >= valentinesStart && currentDate <= valentinesEnd;
  const isValentinesActive = currentDate.getMonth() === 1 && currentDate.getDate() === 14;

  // Women's Day: March 8
  const womensDayStart = new Date(currentYear, 2, 1); // March 1 (7 days before)
  const womensDayEnd = new Date(currentYear, 2, 8, 23, 59, 59); // End of March 8
  const isWomensDayVisible = currentDate >= womensDayStart && currentDate <= womensDayEnd;
  const isWomensDayActive = currentDate.getMonth() === 2 && currentDate.getDate() === 8;

  // Pride Month: June 1 - June 30
  const prideMonthStart = new Date(currentYear, 4, 25); // May 25 (7 days before June 1)
  const prideMonthEnd = new Date(currentYear, 5, 30, 23, 59, 59); // End of June 30
  const isPrideMonthVisible = currentDate >= prideMonthStart && currentDate <= prideMonthEnd;
  const isPrideMonthActive = currentDate.getMonth() === 5;

  // Christmas: Dec 25
  const christmasStart = new Date(currentYear, 11, 18); // Dec 18 (7 days before)
  const christmasEnd = new Date(currentYear, 11, 25, 23, 59, 59); // End of Dec 25
  const isChristmasVisible = currentDate >= christmasStart && currentDate <= christmasEnd;
  const isChristmasActive = currentDate.getMonth() === 11 && currentDate.getDate() === 25;

  const events = [
    {
      title: "Valentine's Day",
      date: "February 14th",
      discount: "20% OFF",
      description: "Treat yourself or a loved one to something special this Valentine's Day.",
      icon: Heart,
      color: "bg-pastel-pink-dark",
      isActive: isValentinesActive,
      isVisible: isValentinesVisible
    },
    {
      title: "Women's Day",
      date: "March 8th",
      discount: "20% OFF",
      description: "Celebrate women's achievements with a special discount on all self-care essentials.",
      icon: Sparkles,
      color: "bg-pastel-blue",
      isActive: isWomensDayActive,
      isVisible: isWomensDayVisible
    },
    {
      title: "Pride Month",
      date: "All of June",
      discount: "15% OFF",
      description: "Love is love. Celebrate Pride Month with us and enjoy a storewide discount all month long.",
      icon: Heart,
      color: "bg-pastel-pink-dark",
      isActive: isPrideMonthActive,
      isVisible: isPrideMonthVisible
    },
    {
      title: "Christmas",
      date: "December 25th",
      discount: "25% OFF",
      description: "Get into the festive spirit with our biggest holiday sale of the year.",
      icon: Star,
      color: "bg-pastel-green",
      isActive: isChristmasActive,
      isVisible: isChristmasVisible
    },
    {
      title: "Your Birthday",
      date: birthdayMonth ? `${new Date(0, parseInt(birthdayMonth) - 1).toLocaleString('default', { month: 'long' })} ${birthdayDay ? birthdayDay : ''}` : "Your Special Month",
      discount: "UP TO 35% OFF",
      description: "Join our rewards program and treat yourself to our biggest discount of the year on your birthday.",
      icon: Gift,
      color: "bg-pastel-green",
      isActive: isBirthdayMonth,
      isVisible: true
    }
  ].filter(event => event.isVisible);

  return (
    <section className="py-32 bg-pastel-pink/20 border-t border-ink-100 transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex justify-center mb-6">
            <CalendarHeart className="h-6 w-6 text-ink-900 stroke-[1.5]" />
          </div>
          <h2 className="text-[10px] font-medium text-ink-500 tracking-[0.2em] uppercase mb-4">
            Special Occasions
          </h2>
          <p className="text-4xl sm:text-5xl font-serif text-ink-900 font-light leading-tight mb-6">
            Our Discount Calendar
          </p>
          <p className="text-base text-ink-500 font-light max-w-xl mx-auto">
            Mark your calendars. We love celebrating special moments with you. Enjoy these exclusive discounts during our favorite times of the year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={index} className={`bg-white rounded-[2rem] p-10 text-center hover:-translate-y-2 transition-transform duration-500 border ${event.isActive ? 'border-ink-900 shadow-xl' : 'border-ink-100 shadow-sm'} relative flex flex-col`}>
                {event.isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] font-medium tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                    Active Now
                  </div>
                )}
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-8 ${event.color}`}>
                  <Icon className="h-6 w-6 text-ink-900 stroke-[1.5]" />
                </div>
                <p className="text-[10px] font-medium text-ink-500 uppercase tracking-[0.2em] mb-3">{event.date}</p>
                <h3 className="text-2xl font-serif text-ink-900 mb-4">{event.title}</h3>
                <div className="mb-6">
                  <div className={`inline-block text-xs tracking-widest uppercase font-medium px-4 py-1.5 rounded-full ${event.isActive ? 'bg-ink-900 text-white' : 'bg-pastel-pink text-ink-900'}`}>
                    {event.discount}
                  </div>
                </div>
                <p className="text-sm text-ink-500 font-light leading-relaxed mb-8 flex-grow">
                  {event.description}
                </p>
                
                {event.title === "Your Birthday" && (
                  <div className="mt-auto pt-8 border-t border-ink-100">
                    <p className="text-[10px] text-ink-500 mb-4 font-medium uppercase tracking-[0.2em]">Enter your birthday</p>
                    <div className="flex gap-3 justify-center">
                      <select 
                        value={birthdayMonth} 
                        onChange={(e) => setBirthdayMonth(e.target.value)}
                        className="text-sm border border-ink-200 rounded-full px-4 py-2 bg-transparent text-ink-900 focus:outline-none focus:border-ink-900 cursor-pointer hover:bg-ink-50 transition-colors appearance-none text-center"
                      >
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                        ))}
                      </select>
                      <select 
                        value={birthdayDay} 
                        onChange={(e) => setBirthdayDay(e.target.value)}
                        className="text-sm border border-ink-200 rounded-full px-4 py-2 bg-transparent text-ink-900 focus:outline-none focus:border-ink-900 cursor-pointer hover:bg-ink-50 transition-colors appearance-none text-center"
                      >
                        <option value="">Day</option>
                        {Array.from({length: 31}, (_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

``

## src/components/Features.tsx
``tsx
import { Star, ShieldCheck, MessageCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    name: 'Curated Selection',
    description: 'We handpick only the most effective products from globally recognized brands.',
    icon: Star,
  },
  {
    name: 'Authorized Retailer',
    description: '100% authentic products sourced directly from the brands you trust.',
    icon: ShieldCheck,
  },
  {
    name: 'Expert Guidance',
    description: 'Our skincare specialists are here to help you build your perfect routine.',
    icon: MessageCircle,
  },
  {
    name: 'Premium Delivery',
    description: 'Fast, beautifully packaged shipping straight to your door.',
    icon: Package,
  },
];

export default function Features() {
  return (
    <section id="about" className="py-32 bg-white transition-colors duration-1000 border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-[10px] font-medium text-ink-500 tracking-[0.2em] uppercase mb-4">The Boutique Experience</h2>
          <p className="text-4xl sm:text-5xl font-serif text-ink-900 font-light leading-tight">
            Why shop your favorite brands with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group"
            >
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full border border-ink-100 text-ink-900 mb-8 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-white transition-all duration-500">
                <feature.icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif text-ink-900 mb-4">{feature.name}</h3>
              <p className="text-sm text-ink-500 font-light leading-relaxed max-w-[250px] mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

``

## src/components/Footer.tsx
``tsx
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface FooterProps {
  onOpenAffiliate?: () => void;
}

export default function Footer({ onOpenAffiliate }: FooterProps) {
  return (
    <footer className="bg-ink-900 text-white pt-24 pb-12 transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 pb-24 border-b border-white/10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Join The Inner Circle</h2>
            <p className="text-white/60 font-light text-sm max-w-md">
              Subscribe to receive exclusive access to new launches, expert skincare advice, and private sales.
            </p>
          </div>
          <div className="flex items-center">
            <form className="w-full max-w-md flex relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-transparent border-b border-white/30 pb-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-white/40"
              />
              <button type="submit" className="absolute right-0 bottom-3 text-white hover:text-pastel-pink transition-colors">
                <ArrowRight className="w-5 h-5 stroke-[1.5]" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-1 md:col-span-4">
            <span className="font-serif text-3xl font-light tracking-tight text-white block mb-8">
              The Skin Boutique
            </span>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-8 max-w-xs">
              Your premier destination for the world's most coveted skincare brands. Expertly curated for the modern beauty enthusiast.
            </p>
            <div className="flex space-x-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5 stroke-[1.5]" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Shop</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">All Brands</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Best Sellers</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Gift Cards</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">About</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Our Story</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Our Brands</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Sustainability</a></li>
              <li><button onClick={onOpenAffiliate} className="text-sm text-white/80 hover:text-white transition-colors font-light">Affiliate Program</button></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Journal</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">FAQ</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Contact Us</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Track Order</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/40 font-light">
            &copy; {new Date().getFullYear()} The Skin Boutique. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-light">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

``

## src/components/Hero.tsx
``tsx
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-[95vh] flex items-center bg-ink-900">
      {/* Grainy Image Underlay */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-[120%] object-cover absolute top-[-10%] object-top opacity-60"
          src="https://images.unsplash.com/photo-1615397323731-9e19519129e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Skincare background"
          referrerPolicy="no-referrer"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900/90 mix-blend-multiply"></div>
        {/* Grainy Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
          }}
        ></div>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-end h-full mt-20">
        <div className="w-full flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <span className="font-sans text-xs tracking-[0.3em] text-pastel-pink uppercase font-medium border border-pastel-pink/30 px-6 py-2 rounded-full backdrop-blur-sm">
              Curated Korean Skincare
            </span>
          </motion.div>

          <div className="relative z-10 w-full overflow-hidden">
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] tracking-tighter font-serif text-pastel-pink leading-[0.85] font-light"
            >
              <span className="block italic pr-8">Glass Skin</span>
              <span className="block pl-12 sm:pl-24">Redefined.</span>
            </motion.h1>
          </div>
          
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-8 border-t border-pastel-pink/20 pt-8">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-base sm:text-lg text-pastel-pink/80 font-light max-w-md text-left"
            >
              Discover our expertly curated selection of the world's most sought-after K-Beauty brands, designed to give you a flawless, radiant complexion.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-4"
            >
              <a
                href="#products"
                className="group relative flex items-center justify-center w-32 h-32 rounded-full border border-pastel-pink/30 text-pastel-pink hover:bg-pastel-pink hover:text-ink-900 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 font-sans text-xs uppercase tracking-widest font-medium group-hover:-translate-y-1 transition-transform duration-300">Shop Now</span>
                <div className="absolute inset-0 bg-pastel-pink scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out origin-center"></div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

``

## src/components/MarqueeBanner.tsx
``tsx
import { Sparkles } from 'lucide-react';

export default function MarqueeBanner() {
  const text = "GLOWING SKIN IS ALWAYS IN • CRUELTY FREE • VEGAN • DERMATOLOGIST TESTED • ";
  
  return (
    <div className="bg-pastel-pink text-ink-900 py-8 overflow-hidden relative flex items-center border-y border-ink-100">
      <div className="flex whitespace-nowrap animate-neon-marquee w-max items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center mx-4">
            <span className="font-sans text-3xl md:text-5xl font-light tracking-widest uppercase text-ink-900">
              {text}
            </span>
            <Sparkles className="w-8 h-8 mx-8 text-ink-900 stroke-[1.5]" />
          </div>
        ))}
      </div>
    </div>
  );
}

``

## src/components/Navbar.tsx
``tsx
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, Heart, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency, Currency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar({ 
  favoritesCount, 
  onOpenWishlist,
  onOpenCheckout,
  onOpenCurrency
}: { 
  favoritesCount: number;
  onOpenWishlist: () => void;
  onOpenCheckout: () => void;
  onOpenCurrency: () => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currency, setCurrency } = useCurrency();
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-ink-100 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            
            {/* Left Side: Menu Button */}
            <div className="flex-1 flex items-center justify-start">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} transition-colors p-2 -ml-2`}
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 flex items-center justify-center">
            <a href="#" className={`font-serif text-2xl sm:text-3xl font-light tracking-tight ${isScrolled ? 'text-ink-900' : 'text-white'} whitespace-nowrap transition-colors`}>
              The Skin Boutique
            </a>
          </div>

          {/* Right Side: Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
            <div className="relative hidden sm:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-transparent border-b ${isScrolled ? 'border-ink-200 text-ink-900' : 'border-white/50 text-white placeholder-white/50'} py-1 px-2 text-sm focus:outline-none focus:border-pastel-pink-dark`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200`}
              >
                {isSearchOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Search className="h-5 w-5" strokeWidth={1.5} />}
              </button>
            </div>
            
            <button className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block relative`} onClick={onOpenWishlist}>
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pastel-pink-dark text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button 
              onClick={onOpenCurrency}
              className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:flex items-center gap-1`}
            >
              <Globe className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-xs font-medium">{currency}</span>
            </button>
            <button className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block`}>
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button 
              className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 relative`}
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pastel-pink-dark text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Sidebar Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/30">
                <span className="font-serif text-xl font-semibold text-ink-900">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-ink-900" />
                </button>
              </div>
              
              <div className="p-6 flex flex-col space-y-6 flex-grow overflow-y-auto">
                {/* Currency Selector */}
                <div className="flex flex-col space-y-3 pb-6 border-b border-ink-100">
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Regional Settings
                  </span>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCurrency();
                    }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-ink-50 text-ink-900 hover:bg-pastel-pink/50 transition-colors"
                  >
                    <span className="font-medium">Currency</span>
                    <span className="text-sm font-semibold bg-white px-2 py-1 rounded-md shadow-sm">{currency}</span>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-4">
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Navigation</span>
                  <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors">Shop</a>
                  <a href="#brands" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors">Brands</a>
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors">About</a>
                  <a href="#journal" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors">Journal</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

``

## src/components/ProductGrid.tsx
``tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, CheckCircle2, X, Star, SlidersHorizontal, Minus, Plus, Play, Info } from 'lucide-react';
import { products, type Product } from '../data/products';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

const INGREDIENT_GLOSSARY: Record<string, string> = {
  'Snail Secretion Filtrate': 'A powerhouse ingredient that hydrates, repairs skin damage, and fades dark spots.',
  'Niacinamide': 'Vitamin B3. Brightens skin, reduces redness, and minimizes the appearance of pores.',
  'Centella Asiatica': 'Also known as Tiger Grass. Highly soothing and excellent for calming inflammation and redness.',
  'Salicylic Acid': 'A BHA that exfoliates inside the pore to clear breakouts and blackheads.',
  'Hyaluronic Acid': 'A humectant that draws moisture into the skin, keeping it plump and hydrated.',
  'Ceramide': 'Lipids that help form the skin\'s barrier and retain moisture.',
  'Glycolic Acid': 'An AHA that exfoliates the surface of the skin to improve texture and brightness.',
  'Lactic Acid': 'A gentle AHA that exfoliates while also hydrating the skin.',
  'Zinc PCA': 'Helps control sebum production and has antibacterial properties.',
  'Oryza Sativa (Rice) Extract': 'Rich in antioxidants and helps to brighten and soften the skin.',
  'Butyrospermum Parkii (Shea) Butter': 'An excellent emollient that deeply moisturizes and nourishes the skin.'
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
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { profile } = useUser();

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
      result.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
    }

    return result;
  }, [filterCategory, filterBrand, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product, quantity: number = 1, optionIndex: number = 0) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Parse price string to number for the cart
    const priceString = product.options && product.options.length > 0 
      ? product.options[optionIndex].price 
      : product.price;
    const priceNumber = parseFloat(priceString.replace('$', ''));
    
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
    const matchesSkinType = product.idealFor.skinType.includes(profile.skinType);
    const matchesConcern = product.idealFor.concern.includes(profile.concern);
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
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <section id="products" className="py-24 bg-pastel-pink transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Products Carousel */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-ink-900 sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {products.slice(0, 6).map((product, index) => (
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
                    alt={product.name}
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
            {filteredAndSortedProducts.map((product, index) => (
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
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                {/* Grainy Noise Overlay */}
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
          ))}
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
                    alt={selectedProduct.name}
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
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

``

## src/components/ProductScanner.tsx
``tsx
import React, { useEffect, useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const IMAGE_URLS = [
  "https://lh3.googleusercontent.com/pw/AP1GczPeHNFhgVg4nMQQ3s6AiOeOMoWlwurFyh9DC94MSF0vKBDBl2g4fnRtwEgsHN2XAZu2zMXxp34v2vzDOHZO-0fyg2YlUvvUrCtwO_E8fPE5F5BEUBI",
  "https://lh3.googleusercontent.com/pw/AP1GczMLG8J5Y7wVoz4JL1_fy9O0cMMgrb_1vaL2wA9nyxubHOOwMOAmuTluJhAV6VOn9d9KjJrm6VOKOIezQAUe4gwfVW-_ucYFlK4mKDecIC1AFTk_4zs",
  "https://lh3.googleusercontent.com/pw/AP1GczN98zc2wOBolzvaUWDMQWlkDH76WNO3eqe2mXVxyygGb4q1PDsE9nGmrYO6owTUsuGulNgLHsDM-wRSKuMVB6FzZ8Gms-pSDxD2P1RKuaATX66BXjY",
  "https://lh3.googleusercontent.com/pw/AP1GczMhNVoMrOxN11BN5oegKfcBnone_NKIZrx5kW0idf1sgSsLEUBscrt77aQ4yCp0EEhJkeHNQaaxc-6ViN-0MJ1YYqOvKMe2_5yKpFkL0bsgIiMIqEA",
  "https://lh3.googleusercontent.com/pw/AP1GczP3uasBt4xEGiGHrbabUrozIHZBQPwyy-4L6k2FyH15PLmN4AOqcHD5rtvJ3U0aEKnfidX4pbA252DS_8pFJ_Dw9cpGDPMFAoJV5g10NM0D4YH3EYQ",
  "https://lh3.googleusercontent.com/pw/AP1GczN_49-BmKxmrcnYTDQc4JlpoPR31pF_GGFk3lH9sAxLmDMDXXjdntJMcjFKGg01DWRQKredxyoISUOx-PS4IAbw_FHM_TWwKe8vFe3DucTo7umzNiE",
  "https://lh3.googleusercontent.com/pw/AP1GczPs5G-bVyVPoJ4T0CMokHFOGhuMPt5XGYc2b5S3ij_p27VDYaVEgABh2CBr3s3ciHfchmYy7kACYt-jfXJJpI_evbYr7QL8Il9_evOPKXjB2OA4Fg8",
  "https://lh3.googleusercontent.com/pw/AP1GczPWfE6gL5lQaB2OI60pAFCf8GE9Pp1S98KKlsNQP2yYsC1DWssbh6yezbl_REDP2jvjKCdiT8s45-paI3vbvA0v7M0QRTpBDxS6ZW8lRILiAKmwUYE"
];

export default function ProductScanner() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'saving' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scanProducts = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Scanner: API Key present:", !!apiKey);
    
    if (!apiKey) {
      setError("Gemini API key is missing. Please ensure it is set in the environment.");
      setStatus('error');
      return;
    }

    setStatus('scanning');
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = "Identify the skincare products in these images. For each product, provide: brand, name, category, price (estimate if not clear), description, and ingredients (list). Return as a JSON array.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              ...IMAGE_URLS.map(url => ({ text: `Image: ${url}` }))
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                price: { type: Type.NUMBER },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["brand", "name", "category", "price", "description", "ingredients"]
            }
          }
        }
      });

      const products = JSON.parse(response.text);
      setResults(products);
      
      setStatus('saving');
      const saveResponse = await fetch('/api/update-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });

      if (saveResponse.ok) {
        setStatus('done');
        // Clear the flag so it doesn't run again
        localStorage.setItem('scanner_done', 'true');
      } else {
        throw new Error('Failed to save products');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    fetch('/api/update-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ name: "Scanner Ping", brand: "System", category: "Log", price: 0, description: "Scanner mounted", ingredients: [] }])
    });

    const isDone = localStorage.getItem('scanner_done');
    if (!isDone && status === 'idle') {
      scanProducts();
    }
  }, []);

  if (status === 'idle' || status === 'scanning' || status === 'saving') {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-indigo-100 z-50 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-700">
            {status === 'scanning' ? 'Scanning album for new products...' : 'Saving identified products...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 p-4 rounded-lg shadow-xl border border-red-100 z-50 max-w-sm">
        <p className="text-sm font-medium text-red-700">Error: {error}</p>
        <button 
          onClick={scanProducts}
          className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="fixed bottom-4 right-4 bg-emerald-50 p-4 rounded-lg shadow-xl border border-emerald-100 z-50 max-w-sm">
        <p className="text-sm font-medium text-emerald-700">Successfully added {results.length} new products!</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs text-emerald-600 hover:underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}

``

## src/components/QuizSection.tsx
``tsx
import { Sparkles, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function QuizSection({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const { profile, clearProfile } = useUser();

  return (
    <section className="py-24 bg-ink-900 text-white relative overflow-hidden transition-colors duration-1000">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      
      {/* Grainy Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
        }}
      ></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <Sparkles className="w-12 h-12 text-pastel-pink mx-auto mb-6 stroke-[1.5]" />
        
        {profile ? (
          <>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Welcome back.</h2>
            <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
              We've customized your experience for <span className="text-pastel-pink font-medium">{profile.skinType}</span> skin targeting <span className="text-pastel-pink font-medium">{profile.concern}</span>. Look for the "Perfect Match" badge on products below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onOpenQuiz} 
                className="bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-pastel-pink transition-colors"
              >
                Update Profile
              </button>
              <button 
                onClick={clearProfile} 
                className="border border-white/30 text-white px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Clear Profile
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Not sure where to start?</h2>
            <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
              Take our 3-minute diagnostic to uncover your personalized skincare ritual, curated by our experts.
            </p>
            <button 
              onClick={onOpenQuiz} 
              className="bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-pastel-pink transition-colors inline-flex items-center"
            >
              Take The Skin Quiz <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

``

## src/components/SkinQuizModal.tsx
``tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { products, type Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Normal';
type Concern = 'Acne & Blemishes' | 'Anti-Aging' | 'Redness & Sensitivity' | 'Dryness & Hydration';

export default function SkinQuizModal({ isOpen, onClose }: SkinQuizModalProps) {
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concern, setConcern] = useState<Concern | null>(null);
  const [isSensitive, setIsSensitive] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { saveProfile } = useUser();

  const handleNext = () => {
    if (step === 2) {
      // Analyze and get recommendations
      setIsAnalyzing(true);
      setStep(3);
      
      if (skinType && concern) {
        saveProfile(skinType, concern);
      }
      
      setTimeout(() => {
        generateRecommendations();
        setIsAnalyzing(false);
        setStep(4);
      }, 2500);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const generateRecommendations = () => {
    let recs: Product[] = [];
    
    // Always recommend a cleanser (CeraVe - ID 8) and SPF (Beauty of Joseon - ID 2)
    const cleanser = products.find(p => p.id === 8);
    const spf = products.find(p => p.id === 2);
    
    // Pick a targeted treatment based on concern
    let treatment;
    if (concern === 'Acne & Blemishes') {
      treatment = products.find(p => p.id === 6); // Paula's Choice BHA
    } else if (concern === 'Anti-Aging') {
      treatment = products.find(p => p.id === 10); // Drunk Elephant Framboos
    } else if (concern === 'Redness & Sensitivity') {
      treatment = products.find(p => p.id === 5); // Dr. Jart+ Cicapair
    } else {
      treatment = products.find(p => p.id === 1); // Snail Mucin
    }

    if (cleanser) recs.push(cleanser);
    if (treatment) recs.push(treatment);
    if (spf) recs.push(spf);
    
    setRecommendations(recs);
  };

  const handleAddRoutineToCart = () => {
    recommendations.forEach(product => {
      const priceString = product.options && product.options.length > 0 
        ? product.options[0].price 
        : product.price;
      const priceNumber = parseFloat(priceString.replace('$', ''));
      
      addToCart({
        id: product.options && product.options.length > 0 ? `${product.id}-0` : product.id.toString(),
        title: product.options && product.options.length > 0 ? `${product.name} - ${product.options[0].size}` : product.name,
        price: priceNumber,
        image: product.image,
        quantity: 1
      });
    });
    onClose();
  };

  const resetQuiz = () => {
    setStep(0);
    setSkinType(null);
    setConcern(null);
    setIsSensitive(null);
    setRecommendations([]);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetQuiz, 500); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col min-h-[500px]"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 p-2 bg-ink-50 rounded-full hover:bg-ink-100 transition-colors"
            >
              <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
            </button>

            {/* Progress Bar */}
            {step < 3 && (
              <div className="absolute top-0 left-0 w-full h-1 bg-ink-50">
                <motion.div 
                  className="h-full bg-pastel-pink-dark"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((step + 1) / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                {/* Step 0: Intro */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-pastel-pink/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-pastel-pink-dark stroke-[1.5]" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-ink-900 mb-4">Discover Your Routine</h2>
                    <p className="text-ink-500 font-light mb-8 max-w-md mx-auto">
                      Take our 3-minute quiz to get a personalized skincare routine curated by our experts, tailored specifically to your skin's unique needs.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-ink-900 text-white px-8 py-4 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors inline-flex items-center"
                    >
                      Start Quiz <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 1: Skin Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">What is your skin type?</h2>
                    <p className="text-ink-500 font-light text-sm mb-8">Select the one that best describes your skin on a typical day.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['Oily', 'Dry', 'Combination', 'Normal'] as SkinType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => { setSkinType(type); handleNext(); }}
                          className="p-6 border border-ink-200 rounded-2xl text-left hover:border-ink-900 hover:bg-ink-50 transition-all group"
                        >
                          <h3 className="font-medium text-ink-900 mb-1 group-hover:text-pastel-pink-dark transition-colors">{type}</h3>
                          <p className="text-xs text-ink-500 font-light">
                            {type === 'Oily' && 'Shiny all over, prone to breakouts.'}
                            {type === 'Dry' && 'Feels tight, flaky, or rough.'}
                            {type === 'Combination' && 'Oily T-zone, dry or normal cheeks.'}
                            {type === 'Normal' && 'Well-balanced, rarely breaks out.'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Primary Concern */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">What is your primary skin concern?</h2>
                    <p className="text-ink-500 font-light text-sm mb-8">We'll target this with a specialized treatment.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['Acne & Blemishes', 'Anti-Aging', 'Redness & Sensitivity', 'Dryness & Hydration'] as Concern[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => { setConcern(c); handleNext(); }}
                          className="p-6 border border-ink-200 rounded-2xl text-left hover:border-ink-900 hover:bg-ink-50 transition-all group"
                        >
                          <h3 className="font-medium text-ink-900 group-hover:text-pastel-pink-dark transition-colors">{c}</h3>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Analyzing */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center flex flex-col items-center justify-center h-full"
                  >
                    <div className="relative w-24 h-24 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-pastel-pink-dark/30 border-t-pastel-pink-dark rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-pastel-pink-dark animate-pulse" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">Curating Your Routine...</h2>
                    <p className="text-ink-500 font-light text-sm">Analyzing your profile for {skinType?.toLowerCase()} skin.</p>
                  </motion.div>
                )}

                {/* Step 4: Results */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-ink-900 mb-2">Your Custom Routine</h2>
                      <p className="text-ink-500 font-light text-sm">
                        Perfectly balanced for {skinType?.toLowerCase()} skin targeting {concern?.toLowerCase()}.
                      </p>
                    </div>

                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                      {recommendations.map((product, idx) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 bg-ink-50/50">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-ink-500 uppercase tracking-wider font-medium mb-1">Step {idx + 1}</p>
                            <h4 className="text-sm font-medium text-ink-900 truncate">{product.name}</h4>
                            <p className="text-xs text-ink-500 mt-1">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAddRoutineToCart}
                        className="flex-1 bg-ink-900 text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors flex items-center justify-center"
                      >
                        Add Routine to Cart
                      </button>
                      <button
                        onClick={resetQuiz}
                        className="px-8 py-4 rounded-full text-xs font-medium tracking-widest uppercase text-ink-900 border border-ink-200 hover:border-ink-900 transition-colors"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

``

## src/components/TrackingModal.tsx
``tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Truck, MapPin, Home, CheckCircle2, Clock, Map } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRACKING_STEPS = [
  { id: 1, title: 'Order Placed', description: 'We have received your order', location: 'Online', icon: Package },
  { id: 2, title: 'Processing', description: 'Your order is being prepared', location: 'Fulfillment Center', icon: CheckCircle2 },
  { id: 3, title: 'Shipped', description: 'Your package is on the way', location: 'Los Angeles, CA', icon: Truck },
  { id: 4, title: 'Out for Delivery', description: 'Arriving soon', location: 'Local Distribution', icon: MapPin },
  { id: 5, title: 'Delivered', description: 'Package has been delivered', location: 'Front Porch', icon: Home },
];

export default function TrackingModal({ isOpen, onClose }: TrackingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderNumber] = useState(() => `#ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [stepTimes, setStepTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setStepTimes([]);
      return;
    }

    // Record time for the current step if it doesn't exist
    if (currentStep >= stepTimes.length) {
      setStepTimes(prev => [...prev, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })]);
    }

    // Simulate real-time tracking updates
    if (currentStep < TRACKING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3500); // Advance every 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, stepTimes.length]);

  const progressPercentage = currentStep / (TRACKING_STEPS.length - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-blue/20 shrink-0">
              <h2 className="text-xl font-serif font-semibold text-ink-900">Track Your Order</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-ink-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="mb-6 bg-ink-50 rounded-2xl p-4 border border-ink-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="text-lg font-mono font-semibold text-ink-900">{orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-1">Carrier</p>
                    <p className="text-sm font-semibold text-ink-900 flex items-center gap-1 justify-end">
                      <Map className="w-4 h-4 text-pastel-blue-dark" /> Express
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-ink-200">
                  <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 
                    {currentStep === TRACKING_STEPS.length - 1 ? 'Delivered Today' : 'Estimated Delivery: Today by 8:00 PM'}
                  </p>
                </div>
              </div>

              <div className="relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-ink-100 rounded-full" />
                
                {/* Animated Progress Line */}
                <motion.div 
                  className="absolute left-8 top-6 w-0.5 bg-pastel-blue-dark rounded-full origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: progressPercentage }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  style={{ bottom: '24px' }}
                />

                <div className="space-y-8 relative">
                  {TRACKING_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    
                    return (
                      <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-6 relative"
                      >
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-sm transition-colors duration-500 ${
                          isCompleted ? 'bg-pastel-blue-dark text-ink-900' : 
                          isActive ? 'bg-pastel-pink-dark text-white' : 
                          'bg-ink-100 text-ink-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                          {isActive && (
                            <motion.div 
                              className="absolute inset-0 rounded-full border-2 border-pastel-pink-dark"
                              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                        </div>
                        
                        <div className="pt-1.5 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold transition-colors duration-500 ${isActive ? 'text-pastel-pink-dark' : isCompleted ? 'text-ink-900' : 'text-ink-400'}`}>
                              {step.title}
                            </h3>
                            {(isCompleted || isActive) && stepTimes[index] && (
                              <span className="text-xs font-medium text-ink-400">
                                {stepTimes[index]}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm transition-colors duration-500 ${isActive || isCompleted ? 'text-ink-600' : 'text-ink-400'}`}>
                            {step.description}
                          </p>
                          {(isCompleted || isActive) && (
                            <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {step.location}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-ink-100 bg-ink-50 shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-ink-900 text-white py-3 rounded-xl font-medium hover:bg-ink-800 transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

``

## src/components/WishlistModal.tsx
``tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { products } from '../data/products';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';

export default function WishlistModal({ 
  isOpen, 
  onClose, 
  favorites, 
  toggleFavorite
}: { 
  isOpen: boolean; 
  onClose: () => void;
  favorites: Set<number>;
  toggleFavorite: (e: React.MouseEvent, id: number) => void;
}) {
  const favoriteProducts = products.filter(product => favorites.has(product.id));
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const getQuantity = (id: number) => quantities[id] || 1;

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, getQuantity(id) + delta)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/30">
              <h2 className="text-2xl font-serif text-ink-900 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-pastel-pink-dark fill-pastel-pink-dark" />
                Your Wishlist
              </h2>
              <button 
                onClick={onClose}
                className="p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-ink-900" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-ink-200 mb-4" />
                  <p className="text-ink-700 text-lg">Your wishlist is currently empty.</p>
                  <p className="text-ink-500 text-sm mt-2">Explore our products and tap the heart icon to add them here.</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 bg-pastel-blue-dark text-ink-900 px-6 py-3 rounded-full font-medium hover:bg-pastel-blue transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {favoriteProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 hover:border-pastel-pink-dark/50 transition-colors">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-pastel-pink-dark/20 flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xs text-ink-500 uppercase tracking-wider font-medium mb-1">{product.brand}</h3>
                        <h4 className="text-lg font-serif text-ink-900">{product.name}</h4>
                        <p className="text-ink-900 font-medium mt-1">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-ink-200 rounded-full h-10">
                          <button 
                            onClick={() => updateQuantity(product.id, -1)}
                            className="px-3 text-ink-500 hover:text-ink-900 transition-colors h-full flex items-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-medium text-ink-900 text-sm">{getQuantity(product.id)}</span>
                          <button 
                            onClick={() => updateQuantity(product.id, 1)}
                            className="px-3 text-ink-500 hover:text-ink-900 transition-colors h-full flex items-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => {
                              addToCart({
                                id: product.id.toString(),
                                title: product.name,
                                price: parseFloat(product.price.replace('$', '')),
                                image: product.image,
                                quantity: getQuantity(product.id)
                              });
                              // Reset quantity after adding
                              setQuantities(prev => ({...prev, [product.id]: 1}));
                            }}
                            className="bg-ink-900 text-white p-2 rounded-full hover:bg-ink-800 transition-colors"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => toggleFavorite(e, product.id)}
                            className="bg-pastel-pink/50 text-pastel-pink-dark p-2 rounded-full hover:bg-pastel-pink transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

``

## src/contexts/CartContext.tsx
``tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // Product ID
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        cartCount,
        cartTotal,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

``

## src/contexts/CurrencyContext.tsx
``tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'ZAR' | 'JPY' | 'RUB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: string | number) => string;
}

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52,
  ZAR: 18.95,
  JPY: 150.25,
  RUB: 92.50,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  ZAR: 'R',
  JPY: '¥',
  RUB: '₽',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = (priceInUSD: string | number) => {
    let numericPrice = 0;
    if (typeof priceInUSD === 'string') {
      numericPrice = parseFloat(priceInUSD.replace(/[^0-9.]/g, ''));
    } else {
      numericPrice = priceInUSD;
    }

    const convertedPrice = numericPrice * exchangeRates[currency];
    return `${currencySymbols[currency]}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

``

## src/contexts/UserContext.tsx
``tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SkinProfile = {
  skinType: string;
  concern: string;
};

interface UserContextType {
  profile: SkinProfile | null;
  saveProfile: (type: string, concern: string) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SkinProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('skinProfile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse skin profile', e);
      }
    }
  }, []);

  const saveProfile = (skinType: string, concern: string) => {
    const newProfile = { skinType, concern };
    setProfile(newProfile);
    localStorage.setItem('skinProfile', JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('skinProfile');
  };

  return (
    <UserContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

``

## src/data/products.ts
``tsx
export type Product = {
  id: number;
  brand: string;
  name: string;
  category: string;
  price: string;
  image: string;
  textureVideo?: string;
  description: string;
  ingredients: string;
  reviews: { user: string; rating: number; text: string }[];
  options?: { size: string; price: string }[];
  idealFor?: { skinType: string[]; concern: string[] };
};

export const products: Product[] = [
  // --- K-BEAUTY (KOREAN SKINCARE) ---
  {
    id: 1,
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    category: "Essences",
    price: "$25.00",
    image: "https://www.cosrx.com/cdn/shop/files/james_800x1067_1_1_4e9750cc-2cd6-4817-ace5-be2305a85806_360x.jpg?v=1763111577",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A cult-favorite, lightweight essence formulated with 96% Snail Secretion Filtrate. It protects the skin from moisture loss while keeping the skin texture smooth and healthy. Highly effective for repairing a damaged skin barrier and fading dark spots.",
    ingredients:
      "Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Phenoxyethanol, Sodium Hyaluronate, Allantoin, Ethyl Hexanediol, Carbomer, Panthenol, Arginine.",
    options: [
      { size: "100ml", price: "$25.00" },
      { size: "150ml", price: "$35.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Dryness & Hydration", "Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "Sarah M.",
        rating: 5,
        text: "The holy grail of K-Beauty! My skin has never felt so plump and hydrated. The texture is stringy but absorbs beautifully.",
      },
      {
        user: "Jessica T.",
        rating: 4,
        text: "Great for healing acne scars. A staple in my routine.",
      },
    ],
  },
  {
    id: 2,
    brand: "Beauty of Joseon",
    name: "Relief Sun : Rice + Probiotics (SPF50+ PA++++)",
    category: "Sun Care",
    price: "$18.00",
    image:
      "https://i0.wp.com/seouloftokyo.co.za/wp-content/uploads/2022/05/beauty-of-joseon-relief-sun-rice-and-probiotics.jpeg?resize=800%2C800&ssl=1",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A viral, lightweight and creamy organic sunscreen that's comfortable on the skin. Even if you apply a large amount several times, it is not sticky and gives a moist finish like that of a light moisturizing cream. Contains 30% rice extract and grain fermented extracts.",
    ingredients:
      "Water, Oryza Sativa (Rice) Extract (30%), Dibutyl Adipate, Propanediol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Polymethylsilsesquioxane, Ethylhexyl Triazone, Niacinamide, Methylene Bis-benzotriazolyl Tetramethylbutylphenol, Coco-caprylate/Caprate.",
    options: [
      { size: "50ml", price: "$18.00" },
      { size: "Twin Pack (2 x 50ml)", price: "$32.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: [
        "Anti-Aging",
        "Redness & Sensitivity",
        "Dryness & Hydration",
        "Acne & Blemishes",
      ],
    },
    reviews: [
      {
        user: "Emily R.",
        rating: 5,
        text: "The best sunscreen I have ever used. No white cast, doesn't pill under makeup, and leaves a gorgeous dewy glow.",
      },
      {
        user: "Amanda B.",
        rating: 5,
        text: "Finally a sunscreen that doesn't break me out. Love the probiotics.",
      },
    ],
  },
  {
    id: 3,
    brand: "Laneige",
    name: "Lip Sleeping Mask",
    category: "Lip Care",
    price: "$24.00",
    image:
      "https://us.laneige.com/cdn/shop/files/PDPImage_1000x1000_LSM.jpg?v=1771426377&width=1080",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A leave-on lip mask that delivers intense moisture and antioxidants while you sleep with its Berry Mix Complexâ„¢, leaving lips visibly smoother and baby-soft.",
    ingredients:
      "Diisostearyl Malate, Hydrogenated Polyisobutene, Phytosteryl/Isostearyl/Cetyl/Stearyl/Behenyl Dimer Dilinoleate, Hydrogenated Poly(C6-14 Olefin), Polybutene, Microcrystalline Wax / Cera Microcristallina / Cire Microcristalline, Butyrospermum Parkii (Shea) Butter.",
    options: [
      { size: "20g", price: "$24.00" },
      { size: "Mini (8g)", price: "$12.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Chloe K.",
        rating: 5,
        text: "I wake up with the softest lips. The berry scent is incredible.",
      },
      {
        user: "Mia L.",
        rating: 4,
        text: "A bit thick, but it truly works overnight to heal chapped lips.",
      },
    ],
  },
  {
    id: 4,
    brand: "Sulwhasoo",
    name: "First Care Activating Serum",
    category: "Serums",
    price: "$89.00",
    image: "https://amc.apglobal.com/image/384224417642/image_9v9jd51n4t16f6agi1p7v7gp59/-FJPG/fcas6th_img_04_pc_int_230213.jpg",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "The secret to glowing, glass skin. This luxurious post-cleanse, preparatory serum is formulated with the JAUM Activatorâ„¢ to improve the look of hydration, brightness, radiance, and visible wrinkles.",
    ingredients:
      "Water / Aqua / Eau, Alcohol Denat., Butylene Glycol, Betaine, 1,2-Hexanediol, Bis-Peg-18 Methyl Ether Dimethyl Silane, Glyceryl Polymethacrylate, Carbomer, Peg-60 Hydrogenated Castor Oil, Tromethamine, Propanediol, Glyceryl Caprylate, Juglans Regia (Walnut) Seed Extract, Dextrin.",
    options: [
      { size: "60ml", price: "$89.00" },
      { size: "90ml", price: "$118.00" },
      { size: "120ml", price: "$150.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Anti-Aging", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Olivia P.",
        rating: 5,
        text: "Luxury in a bottle. The herbal scent is so relaxing, and it makes all my other skincare absorb better.",
      },
      {
        user: "Grace H.",
        rating: 5,
        text: "Worth every penny. My skin looks so much healthier and radiant.",
      },
    ],
  },
  {
    id: 5,
    brand: "Dr. Jart+",
    name: "Cicapair Tiger Grass Color Correcting Treatment",
    category: "Treatments",
    price: "$52.00",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A green-to-beige color-correcting treatment that corrects redness and helps protect skin from environmental aggressors. Formulated with Centella Asiatica (Tiger Grass) to soothe sensitive skin.",
    ingredients:
      "Water/Aqua/Eau, Cyclopentasiloxane, Titanium Dioxide (Ci 77891), Dimethicone, Eryngium Maritimum Callus Culture Filtrate, Butylene Glycol, Butylene Glycol Dicaprylate/Dicaprate, Pentaerythrityl Tetraethylhexanoate, Cetyl Peg/Ppg-10/1 Dimethicone, Glycerin.",
    options: [
      { size: "50ml", price: "$52.00" },
      { size: "15ml", price: "$21.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "Sophia W.",
        rating: 4,
        text: "Magic for my rosacea! It completely neutralizes the redness. Can be a bit heavy for oily skin though.",
      },
    ],
  },

  // --- GLOBAL BESTSELLERS ---
  {
    id: 6,
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Exfoliants",
    price: "$34.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A daily leave-on exfoliant with 2% salicylic acid that sweeps away dead skin cells, unclogs pores, and visibly smooths wrinklesâ€”practically overnight.",
    ingredients:
      "Water (Aqua), Methylpropanediol (hydration), Butylene Glycol (hydration), Salicylic Acid (beta hydroxy acid/exfoliant), Polysorbate 20 (stabilizer), Camellia Oleifera (Green Tea) Leaf Extract (skin calming/antioxidant), Sodium Hydroxide (pH balancer), Tetrasodium EDTA (stabilizer).",
    options: [
      { size: "118ml", price: "$34.00" },
      { size: "30ml", price: "$13.00" },
    ],
    idealFor: {
      skinType: ["Oily", "Combination", "Normal"],
      concern: ["Acne & Blemishes"],
    },
    reviews: [
      {
        user: "Emma D.",
        rating: 5,
        text: "Completely cleared my blackheads and textured skin. A must-have.",
      },
      {
        user: "Lily C.",
        rating: 5,
        text: "I've repurchased this 5 times. Nothing else compares for keeping my pores clear.",
      },
    ],
  },
  {
    id: 7,
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    category: "Serums",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A high-strength vitamin and mineral blemish formula. Niacinamide (Vitamin B3) reduces the appearance of skin blemishes and congestion, while Zinc balances visible sebum activity.",
    ingredients:
      "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.",
    options: [
      { size: "30ml", price: "$6.00" },
      { size: "60ml", price: "$10.60" },
    ],
    idealFor: {
      skinType: ["Oily", "Combination"],
      concern: ["Acne & Blemishes", "Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "Ava T.",
        rating: 4,
        text: "Incredible value. It really helped regulate my oil production and fade dark spots.",
      },
    ],
  },
  {
    id: 9,
    brand: "La Mer",
    name: "CrÃ¨me de la Mer",
    category: "Moisturizers",
    price: "$380.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "The moisturizer that started it all. With a heart of cell-renewing Miracle Brothâ„¢ and antioxidant Lime Tea, this ultra-rich cream delivers healing moisture, daily protection, and energized natural renewal.",
    ingredients:
      "Algae Extract, Mineral Oil, Petrolatum, Glycerin, Isohexadecane, Microcrystalline Wax, Lanolin Alcohol, Citrus Aurantifolia (Lime) Peel Extract, Sesamum Indicum (Sesame) Seed Oil, Eucalyptus Globulus (Eucalyptus) Leaf Oil, Sesamum Indicum (Sesame) Seed Powder, Medicago Sativa (Alfalfa) Seed Powder, Helianthus Annuus (Sunflower) Seedcake, Prunus Amygdalus Dulcis (Sweet Almond) Seed Meal, Sodium Gluconate, Copper Gluconate, Calcium Gluconate, Magnesium Gluconate, Zinc Gluconate, Magnesium Sulfate, Paraffin, Tocopheryl Succinate, Niacin, Water, Beta-Carotene, Decyl Oleate, Aluminum Distearate, Octyldodecanol, Citric Acid, Cyanocobalamin, Magnesium Stearate, Panthenol, Zea Mays (Corn) Oil, Limonene, Geraniol, Linalool, Hydroxycitronellal, Citronellol, Benzyl Salicylate, Benzyl Benzoate, Sodium Benzoate, Amyl Cinnamal, Hexyl Cinnamal, Coumarin, Eugenol, Pelargonium Graveolens (Geranium) Flower Oil, Citrus Aurantium Dulcis (Orange) Peel Oil, Juniperus Virginiana Oil, Rosmarinus Officinalis (Rosemary) Leaf Oil, Citrus Grandis (Grapefruit) Peel Oil, Anthemis Nobilis (Chamomile) Flower Oil, Linalool, Limonene, Fragrance.",
    options: [
      { size: "60ml", price: "$380.00" },
      { size: "30ml", price: "$200.00" },
      { size: "15ml", price: "$100.00" },
      { size: "100ml", price: "$570.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal"],
      concern: ["Anti-Aging", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Victoria S.",
        rating: 5,
        text: "An absolute splurge, but nothing heals my winter skin like this. You have to warm it up in your fingers first!",
      },
    ],
  },
  {
    id: 10,
    brand: "Drunk Elephant",
    name: "T.L.C. Framboos Glycolic Night Serum",
    category: "Serums",
    price: "$90.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A high-tech AHA/BHA gel that resurfaces dull, congested skin by gently lifting away dead skin cells, dramatically improving the appearance of skin's tone and texture, fine lines, wrinkles, and pores.",
    ingredients:
      "Water/Aqua/Eau, Glycolic Acid, Butylene Glycol, Glycerin, Sodium Hydroxide, Lactic Acid, Salicylic Acid, Tartaric Acid, Vitis Vinifera (Grape) Juice Extract, Aloe Barbadensis Leaf Juice, Opuntia Ficus-Indica Extract, Aesculus Hippocastanum (Horse Chestnut) Seed Extract, Camellia Sinensis Leaf Extract, Rubus Idaeus (Raspberry) Fruit Extract, Saccharomyces Cerevisiae Extract, Buddleja Davidii Meristem Cell Culture, Sclerocarya Birrea Seed Oil, Sodium Hyaluronate Crosspolymer, Allantoin, Hydroxyethylcellulose, Galactoarabinan, Propanediol, Citric Acid, Tetrasodium Glutamate Diacetate, Xanthan Gum, Hexylene Glycol, Phenoxyethanol, Sodium Benzoate, Caprylyl Glycol, Potassium Sorbate, Pentylene Glycol, Sodium Carbonate, Sodium Chloride, Disodium Phosphate, Sodium Phosphate, Ethylhexylglycerin.",
    options: [
      { size: "30ml", price: "$90.00" },
      { size: "50ml", price: "$134.00" },
    ],
    idealFor: {
      skinType: ["Oily", "Combination", "Normal"],
      concern: ["Anti-Aging", "Acne & Blemishes"],
    },
    reviews: [
      {
        user: "Megan F.",
        rating: 5,
        text: "Tingled a bit at first, but the results the next morning are undeniable. My skin is so smooth.",
      },
      {
        user: "Rachel K.",
        rating: 4,
        text: "Very effective chemical exfoliant. I use it twice a week to keep breakouts at bay.",
      },
    ],
  },
  {
    id: 11,
    brand: "COSRX",
    name: "Low pH Good Morning Gel Cleanser",
    category: "Cleansers",
    price: "$14.00",
    image: "https://www.cosrx.com/cdn/shop/files/low-ph-good-morning-gel-cleanser-cosrx-official-1_360x.jpg?v=1768785801",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A gentle gel cleanser with a mildly acidic pH level to help maintain the skin's natural barrier while effectively removing impurities.",
    ingredients:
      "Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Polysorbate 20, Styrax Japonicus Gum Extract, Saccharomyces Ferment, Cryptomeria Japonica Leaf Extract, Nelumbo Nucifera Leaf Extract, Pinus Palustris Leaf Extract, Ulmus Davidiana Root Extract, Oenothera Biennis (Evening Primrose) Flower Extract, Pueraria Lobata Root Extract, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Allantoin, Caprylyl Glycol, Ethylhexylglycerin, Betaine Salicylate, Citric Acid, Ethyl Hexanediol, 1,2-Hexanediol, Trisodium Ethylenediamine Disuccinate, Sodium Benzoate, Disodium EDTA.",
    options: [{ size: "150ml", price: "$14.00" }],
    idealFor: {
      skinType: ["Oily", "Combination", "Normal", "Sensitive"],
      concern: ["Acne & Blemishes", "Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "Kevin H.",
        rating: 5,
        text: "Perfect morning cleanser. Doesn't strip my skin.",
      },
    ],
  },
  {
    id: 12,
    brand: "The Ordinary",
    name: "Hyaluronic Acid 2% + B5",
    category: "Serums",
    price: "$8.90",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A hydration support formula with ultra-pure, vegan hyaluronic acid.",
    ingredients:
      "Aqua (Water), Sodium Hyaluronate, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid, Isoceteth-20, Ethoxydiglycol, Ethylhexylglycerin, Hexylene Glycol, 1,2-Hexanediol, Phenoxyethanol, Caprylyl Glycol.",
    options: [
      { size: "30ml", price: "$8.90" },
      { size: "60ml", price: "$15.70" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Lily S.",
        rating: 5,
        text: "Essential for my dry skin. I apply it on damp skin and it works wonders.",
      },
    ],
  },
  {
    id: 14,
    brand: "Beauty of Joseon",
    name: "Dynasty Cream",
    category: "Moisturizers",
    price: "$24.00",
    image: "https://beautyofjoseon.com/cdn/shop/files/dynasty-cream-1-front.webp?v=1770618339&width=1512",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A firming and moisturizing cream enriched with Hanbang (traditional Korean herbal medicine) ingredients like Ginseng and Rice bran water.",
    ingredients:
      "Water, Oryza Sativa (Rice) Bran Water, Glycerin, Panax Ginseng Root Water, Hydrogenated Polydecene, 1,2-Hexanediol, Niacinamide, Squalane, Butylene Glycol, Propanediol, Dicaprylate/Dicaprate, Cetearyl Olivate, Sorbitan Olivate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Xanthan Gum, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Tromethamine, Carthamus Tinctorius (Safflower) Seed Oil, Hydrogenated Coconut Oil, Glyceryl Acrylate/Acrylic Acid Copolymer, Ethylhexylglycerin, Adenosine, Caprylic/Capric Triglyceride, Disodium EDTA, Hyaluronic Acid, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Honey Extract, Ceramide NP, Hydrogenated Lecithin, Coptis Japonica Root Extract, Raphanus Sativus (Radish) Seed Extract, Lycium Chinense Fruit Extract, Theobroma Cacao (Cocoa) Seed Extract, Phellinus Linteus Extract, Dextrin, Scutellaria Baicalensis Root Extract.",
    options: [{ size: "50ml", price: "$24.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Anti-Aging", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Hana K.",
        rating: 5,
        text: "Gives such a beautiful glow. My skin feels so soft.",
      },
    ],
  },
  {
    id: 15,
    brand: "Laneige",
    name: "Water Bank Blue Hyaluronic Cream",
    category: "Moisturizers",
    price: "$40.00",
    image:
      "https://us.laneige.com/cdn/shop/files/LN_WBCM_24AD_Product_02.jpg?height=520&v=1703778486&width=520",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A lush cream that delivers next-gen hydration with Blue Hyaluronic Acid, fermented with deep sea algae and put through a 10-step microfiltration process.",
    ingredients:
      "Water / Aqua / Eau, Butylene Glycol, Glycerin, Squalane, Sucrose Polystearate, Pentaerythrityl Tetraethylhexanoate, Methyl Trimethicone, Dibutyl Adipate, 1,2-Hexanediol, Glyceryl Stearate, Polyglyceryl-3 Methylglucose Distearate, Bis-Hydroxyethoxypropyl Dimethicone, Cetearyl Alcohol, Panthenol, Xanthan Gum, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Hydrogenated Polyisobutene, Glyceryl Caprylate, Tromethamine, Ethylhexylglycerin, Disodium Edta, Hydrolyzed Hyaluronic Acid, Fragrance / Parfum, Beta-Glucan, Limonene, Propanediol, Tocopherol, Undaria Pinnatifida Extract.",
    options: [{ size: "50ml", price: "$40.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Sophie J.",
        rating: 4,
        text: "Very hydrating but a bit scented for my taste.",
      },
    ],
  },
  {
    id: 16,
    brand: "Sulwhasoo",
    name: "Concentrated Ginseng Renewing Cream",
    category: "Moisturizers",
    price: "$260.00",
    image: "https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A signature ginseng anti-aging cream that uses Ginsenomicsâ„¢, a powerful, active beauty ginsenoside, to help skin look firmer and more resilient.",
    ingredients:
      "Water, Glycerin, Squalane, Butylene Glycol, Cyclopentasiloxane, Trehalose, Limnanthes Alba (Meadowfoam) Seed Oil, Glyceryl Stearate, Phytosteryl Isostearyl Dimer Dilinoleate, Octyldodecyl Myristate, Cyclohexasiloxane, Peg-40 Stearate, Stearic Acid, Helianthus Annuus (Sunflower) Seed Oil, Silica, Peg-100 Stearate, Palmitic Acid, Mangifera Indica (Mango) Seed Butter, Phenoxyethanol, Polyacrylate-13, Peg-30 Dipolyhydroxystearate, Cetearyl Alcohol, Fragrance, Pantethine, Polyisobutene, Caprylyl Glycol, Xanthan Gum, Glyceryl Caprylate, Ethylhexylglycerin, Disodium Edta, Polysorbate 20, Sorbitan Isostearate, Adenosine, Honey, Myristic Acid, Arachidic Acid, Panax Ginseng Root Extract, Rehmannia Glutinosa Root Extract, Paeonia Albiflora Root Extract, Lilium Candidum Bulb Extract, Nelumbo Nucifera Flower Extract, Polygonatum Officinale Rhizome/Root Extract, Dextrin, Theobroma Cacao (Cocoa) Extract, Linalool, Benzyl Benzoate, Alpha-Isomethyl Ionone, Limonene, Citronellol, Geraniol, Hexyl Cinnamal, Butylphenyl Methylpropional.",
    options: [{ size: "60ml", price: "$260.00" }],
    idealFor: {
      skinType: ["Dry", "Normal"],
      concern: ["Anti-Aging", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Linda M.",
        rating: 5,
        text: "The texture is like silk. My skin looks so much younger.",
      },
    ],
  },
  {
    id: 17,
    brand: "Dr. Jart+",
    name: "Ceramidin Skin Barrier Moisturizing Cream",
    category: "Moisturizers",
    price: "$48.00",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A deeply moisturizing cream supercharged with 5-Cera Complex to strengthen the skin barrier and shield from water and moisture loss.",
    ingredients:
      "Water, Glycerin, Silica, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Hydrogenated Poly(C6-14 Olefin), Sorbitan Stearate, 1,2-Hexanediol, Glyceryl Stearate, Ceramide Np, Ceramide Ns, Ceramide As, Ceramide Ap, Ceramide Eop, Dipropylene Glycol, Hydrogenated Lecithin, Cetearyl Glucoside, Cholesterol, Stearic Acid, Butylene Glycol, Ethylhexylglycerin, Xanthan Gum, Disodium Edta, Sodium Hyaluronate, Pelargonium Graveolens Flower Oil, Salvia Officinalis (Sage) Oil, Pogostemon Cablin Oil, Citrus Aurantium Bergamia (Bergamot) Fruit Oil, Panthenol, Malt Extract, Melia Azadirachta Flower Extract, Melia Azadirachta Leaf Extract, Curcuma Longa (Turmeric) Root Extract, Ocimum Sanctum Leaf Extract, Corallina Officinalis Extract.",
    options: [{ size: "50ml", price: "$48.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Sensitive"],
      concern: ["Dryness & Hydration", "Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "James T.",
        rating: 5,
        text: "Best cream for dry winter skin. Period.",
      },
    ],
  },
  {
    id: 18,
    brand: "Paula's Choice",
    name: "C15 Super Booster",
    category: "Serums",
    price: "$55.00",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A potent 15% vitamin C booster that visibly brightens skin and helps diminish the look of dark spots and uneven skin tone.",
    ingredients:
      "Water (Aqua), Ascorbic Acid (vitamin C/antioxidant), Ethoxydiglycol (hydration/penetration enhancer), PPG-26-Buteth-26 (texture enhancer), Peg-40 Hydrogenated Castor Oil (texture enhancer), Tocopherol (vitamin E/antioxidant), Ferulic Acid (antioxidant), Sodium Hyaluronate (hydration), Acetyl Octapeptide-3 (peptide), Glycerin (hydration), Panthenol (vitamin B5/skin-soothing), Sodium Metabisulfite (stabilizer), Triethanolamine (pH adjuster), Phenoxyethanol (preservative).",
    options: [{ size: "20ml", price: "$55.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging", "Acne & Blemishes"],
    },
    reviews: [
      {
        user: "Sarah G.",
        rating: 4,
        text: "Really brightened my skin, but smells a bit like hot dogs (typical for Vit C).",
      },
    ],
  },
  {
    id: 19,
    brand: "La Mer",
    name: "The Treatment Lotion",
    category: "Essences",
    price: "$180.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      'A "liquid energy" that jumpstarts your regimen. This fast-absorbing treatment delivers an instant rush of hydration to visibly soften, nourish, and improve texture.',
    ingredients:
      "Water, Algae Extract, Glycerin, Methyl Gluceth-20, Bis-Peg-18 Methyl Ether Dimethyl Silane, Sucrose, Yeast Extract, Sesamum Indicum (Sesame) Seed Oil, Medicago Sativa (Alfalfa) Seed Powder, Helianthus Annuus (Sunflower) Seedcake, Prunus Amygdalus Dulcis (Sweet Almond) Seed Meal, Eucalyptus Globulus (Eucalyptus) Leaf Oil, Sodium Gluconate, Copper Gluconate, Calcium Gluconate, Magnesium Gluconate, Zinc Gluconate, Magnesium Sulfate, Paraffin, Tocopheryl Succinate, Niacin, Sesamum Indicum (Sesame) Seed Powder, Citrus Aurantifolia (Lime) Peel Extract, Glycosaminoglycans, Trehalose, Sodium Hyaluronate, Caffeine, Caprylyl Glycol, Hexylene Glycol, Butylene Glycol, Magnesium Ascorbyl Phosphate, Alcohol Denat., Fragrance, Limonene, Linalool, Geraniol, Citronellol, Benzyl Salicylate, Benzyl Benzoate, Sodium Benzoate, Potassium Sorbate, Phenoxyethanol.",
    options: [
      { size: "150ml", price: "$180.00" },
      { size: "100ml", price: "$125.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Dryness & Hydration", "Anti-Aging"],
    },
    reviews: [
      {
        user: "David W.",
        rating: 5,
        text: "The perfect first step. My skin feels so prepped and hydrated.",
      },
    ],
  },
  {
    id: 20,
    brand: "Drunk Elephant",
    name: "Protini Polypeptide Cream",
    category: "Moisturizers",
    price: "$68.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A breakthrough protein moisturizer that combines an unprecedented array and concentration of signal peptides, growth factors, supportive amino acids, and pygmy waterlily for immediate improvement in the appearance of skinâ€™s tone, texture, and firmness.",
    ingredients:
      "Water/Aqua/Eau, Dicaprylyl Carbonate, Glycerin, Cetearyl Alcohol, Cetearyl Olivate, Sorbitan Olivate, Sclerocarya Birrea Seed Oil, Bacillus/Folic Acid Ferment Extract, Nymphaea Alba Root Extract, sh-Oligopeptide-1, sh-Oligopeptide-2, sh-Polypeptide-1, sh-Polypeptide-9, sh-Polypeptide-11, Copper Palmitoyl Heptapeptide-14, Heptapeptide-15 Palmitate, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-1, Alanine, Arginine, Glycine, Histidine, Isoleucine, Phenylalanine, Proline, Serine, Threonine, Valine, Acetyl Glutamine, Coconut Alkanes, Coco-Caprylate/Caprate, Sodium Hyaluronate, Aspartic Acid, Linoleic Acid, Linolenic Acid, Lecithin, Butylene Glycol, Polyvinyl Alcohol, Sodium Lactate, Sodium PCA, PCA, Sorbitan Isostearate, Carbomer, Polysorbate 20, Xanthan Gum, Caprylyl Glycol, Chlorphenesin, Phenoxyethanol, Ethylhexylglycerin.",
    options: [{ size: "50ml", price: "$68.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      {
        user: "Kelly B.",
        rating: 5,
        text: "My skin feels so much firmer and healthier. Love the airless pump!",
      },
    ],
  },
  {
    id: 21,
    brand: "COSRX",
    name: "BHA Blackhead Power Liquid",
    category: "Exfoliants",
    price: "$22.00",
    image: "https://www.cosrx.com/cdn/shop/files/bha-blackhead-power-liquid-cosrx-official-1_360x.jpg?v=1689840681",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A powerful BHA exfoliant that helps clear blackheads and control excess sebum while hydrating the skin.",
    ingredients:
      "Salix Alba (Willow) Bark Water, Butylene Glycol, Betaine Salicylate, Niacinamide, 1,2-Hexanediol, Arginine, Panthenol, Sodium Hyaluronate, Xanthan Gum, Ethyl Hexanediol.",
    options: [{ size: "100ml", price: "$22.00" }],
    idealFor: {
      skinType: ["Oily", "Combination"],
      concern: ["Acne & Blemishes"],
    },
    reviews: [
      {
        user: "Alex D.",
        rating: 5,
        text: "Cleared my blackheads in two weeks!",
      },
    ],
  },
  {
    id: 22,
    brand: "COSRX",
    name: "Centella Water Alcohol-Free Toner",
    category: "Toners",
    price: "$17.00",
    image: "https://www.cosrx.com/cdn/shop/files/centella-water-alcohol-free-toner-cosrx-official-1_300x.jpg?v=1724835527",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A soothing toner enriched with Centella Asiatica leaf water to calm and hydrate sensitive skin.",
    ingredients:
      "Water, Centella Asiatica Leaf Water, Butylene Glycol, 1,2-Hexanediol, Betaine, Panthenol, Allantoin, Ethyl Hexanediol, Sodium Hyaluronate.",
    options: [{ size: "150ml", price: "$17.00" }],
    idealFor: {
      skinType: ["Sensitive", "Dry", "Normal"],
      concern: ["Redness & Sensitivity"],
    },
    reviews: [
      { user: "Maria S.", rating: 4, text: "Very refreshing and calming." },
    ],
  },
  {
    id: 23,
    brand: "Beauty of Joseon",
    name: "Glow Serum : Propolis + Niacinamide",
    category: "Serums",
    price: "$17.00",
    image: "https://beautyofjoseon.com/cdn/shop/files/glow-serum-propolis-niacinamide-1-front.webp?v=1770278801&width=540",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A honey-like serum enriched with Hanbang ingredients for glowing skin and pore control.",
    ingredients:
      "Propolis Extract, Dipropylene Glycol, Glycerin, Niacinamide, Butylene Glycol, 1,2-Hexanediol, Melia Azadirachta Flower Extract, Melia Azadirachta Leaf Extract, Sodium Hyaluronate, Curcuma Longa (Turmeric) Root Extract, Ocimum Sanctum Leaf Extract, Theobroma Cacao (Cocoa) Seed Extract, Melaleuca Alternifolia (Tea Tree) Extract, Centella Asiatica Extract, Corallina Officinalis Extract, Lotus Corniculatus Seed Extract, Calophyllum Inophyllum Seed Oil, Betaine Salicylate, Sodium Polyacryloyldimethyl Taurate, Tromethamine, Polyglyceryl-10 Laurate, Caprylyl Glycol, Ethylhexylglycerin, Dextrin, Pentylene Glycol, Octanediol, Tocopherol, Xanthan Gum, Carbomer.",
    options: [{ size: "30ml", price: "$17.00" }],
    idealFor: {
      skinType: ["Combination", "Oily", "Normal"],
      concern: ["Acne & Blemishes", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Elena V.",
        rating: 5,
        text: "Gives the perfect glass skin glow.",
      },
    ],
  },
  {
    id: 24,
    brand: "Beauty of Joseon",
    name: "Revive Eye Serum : Ginseng + Retinal",
    category: "Eye Care",
    price: "$17.00",
    image: "https://beautyofjoseon.com/cdn/shop/files/revive-eye-serum-ginseng-retinal-1-front.webp?v=1770287139&width=540",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "An eye serum that helps to improve wrinkles on the sensitive skin around the eyes by combining ginseng extract and retinal.",
    ingredients:
      "Water, Panax Ginseng Root Extract, Glycerin, Dipropylene Glycol, Caprylic/Capric Triglyceride, 1,2-Hexanediol, Pentaerythrityl Tetraethylhexanoate, Niacinamide, Butylene Glycol Dicaprylate/Dicaprate, Cetearyl Alcohol, Sorbitan Olivate, Cetearyl Olivate, Butylene Glycol, Hydrogenated Lecithin, Tromethamine, Carbomer, Glyceryl Stearate, Macadamia Ternifolia Seed Oil, Adenosine, Theobroma Cacao (Cocoa) Extract, Dextrin, Cholesterol, Polyglyceryl-10 Oleate, Retinal, Brassica Campestris (Rapeseed) Sterols, Phytosteryl/Behenyl/Octyldodecyl Lauroyl Glutamate, Silica, Sodium Hyaluronate, Tocopherol, Aluminum/Magnesium Hydroxide Stearate, Potassium Cetyl Phosphate, Pentaerythrityl Tetra-di-t-butyl Hydroxyhydrocinnamate, Ceramide NP, Palmitoyl Tripeptide-5, Disodium EDTA, Ethylhexylglycerin.",
    options: [{ size: "30ml", price: "$17.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      {
        user: "Julia M.",
        rating: 5,
        text: "Very gentle yet effective for fine lines.",
      },
    ],
  },
  {
    id: 25,
    brand: "Laneige",
    name: "Cream Skin Toner & Moisturizer",
    category: "Toners",
    price: "$36.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A 2-in-1 hybrid that softens like a toner and hydrates like a moisturizer in one step.",
    ingredients:
      "Water, Glycerin, Limnanthes Alba (Meadowfoam) Seed Oil, 1,2-Hexanediol, Polyglyceryl-10 Stearate, Glyceryl Stearate Citrate, Sodium Stearoyl Glutamate, Inulin Lauryl Carbamate, Glyceryl Caprylate, Ethylhexylglycerin, Propanediol, Disodium Edta, Camellia Sinensis Leaf Extract, Tocopherol.",
    options: [{ size: "170ml", price: "$36.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Sensitive"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Anna L.",
        rating: 5,
        text: "Saves me so much time in the morning!",
      },
    ],
  },
  {
    id: 26,
    brand: "Laneige",
    name: "Radian-C Cream",
    category: "Moisturizers",
    price: "$35.00",
    image: "https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A vitamin-rich moisturizer that helps visibly brighten skin and reduce the look of dark spots.",
    ingredients:
      "Water, 3-O-Ethyl Ascorbic Acid, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Propanediol, Methyl Trimethicone, Hydrogenated Poly(C6-14 Olefin), Pentaerythrityl Tetraethylhexanoate, Cetearyl Olivate, Potassium Cetyl Phosphate, 1,2-Hexanediol, Sorbitan Olivate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Limonene, Polymethyl Methacrylate, Ammonium Acryloyldimethyltaurate/Beheneth-25 Methacrylate Crosspolymer, Citric Acid, Fragrance, Ethylhexylglycerin, Disodium Edta, Sorbitan Isostearate, Sodium Citrate, Linalool, Tocopherol, Madecassoside, Citral, Geraniol.",
    options: [{ size: "30ml", price: "$35.00" }],
    idealFor: {
      skinType: ["Normal", "Combination", "Oily"],
      concern: ["Anti-Aging", "Acne & Blemishes"],
    },
    reviews: [
      { user: "Chloe S.", rating: 4, text: "Smells great and brightens well." },
    ],
  },
  {
    id: 27,
    brand: "Sulwhasoo",
    name: "Gentle Cleansing Oil",
    category: "Cleansers",
    price: "$40.00",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A refreshing cleansing oil that removes makeup and impurities while leaving skin feeling supple.",
    ingredients:
      "C12-15 Alkyl Benzoate, Pentaerythrityl Tetraethylhexanoate, Isopropyl Palmitate, Pentaerythrityl Tetraisostearate, Peg-20 Glyceryl Triisostearate, Peg-8 Isostearate, Cocos Nucifera (Coconut) Oil, Dextrin Palmitate, Fragrance, Limonene, Glyceryl Caprylate, Ethylhexylglycerin, Water, Butylene Glycol, Panax Ginseng Root Extract, Rehmannia Glutinosa Root Extract, Paeonia Albiflora Root Extract, Lilium Candidum Bulb Extract, Nelumbo Nucifera Flower Extract, Polygonatum Officinale Rhizome/Root Extract, Pinus Koraiensis Seed Oil, Sesamum Indicum (Sesame) Seed Oil, Camellia Japonica Seed Oil, Prunus Armeniaca (Apricot) Kernel Oil, Squalane, Prunus Mume Flower Extract, Nelumbo Nucifera Germ Extract, Tocopherol.",
    options: [{ size: "200ml", price: "$40.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Grace Y.",
        rating: 5,
        text: "Melts everything away without irritation.",
      },
    ],
  },
  {
    id: 28,
    brand: "Sulwhasoo",
    name: "Overnight Vitalizing Mask",
    category: "Treatments",
    price: "$54.00",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "An overnight mask that reawakens skin's natural glow while you sleep.",
    ingredients:
      "Water, Butylene Glycol, Glycerin, Cetyl Ethylhexanoate, Squalane, Butyrospermum Parkii (Shea) Butter, DI-C12-13 Alkyl Malate, Cyclopentasiloxane, Glyceryl Stearate, Cyclohexasiloxane, Trehalose, Stearic Acid, Palmitic Acid, Peg-100 Stearate, Cetearyl Alcohol, Phenoxyethanol, Fragrance, Polyacrylate-13, Cetyl Alcohol, Polyisobutene, Caprylyl Glycol, Xanthan Gum, Ethylhexylglycerin, Disodium Edta, Polysorbate 20, Sorbitan Isostearate, Honey, Myristic Acid, Arachidic Acid, Panax Ginseng Root Extract, Rehmannia Glutinosa Root Extract, Paeonia Albiflora Root Extract, Lilium Candidum Bulb Extract, Nelumbo Nucifera Flower Extract, Polygonatum Officinale Rhizome/Root Extract, Dextrin, Theobroma Cacao (Cocoa) Extract, Linalool, Benzyl Benzoate, Alpha-Isomethyl Ionone, Limonene, Citronellol, Geraniol, Hexyl Cinnamal.",
    options: [{ size: "120ml", price: "$54.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination"],
      concern: ["Anti-Aging", "Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Lily T.",
        rating: 5,
        text: "Wake up with glowing, rested skin.",
      },
    ],
  },
  {
    id: 29,
    brand: "Dr. Jart+",
    name: "Vital Hydra Solution Biome Essence",
    category: "Essences",
    price: "$45.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A hydrating essence that balances the skin's microbiome for a healthy, glowing complexion.",
    ingredients:
      "Water, Glycerin, Streptococcus Thermophilus Ferment, Glycereth-26, Propanediol, 1,2-Hexanediol, Dipropylene Glycol, Niacinamide, Butylene Glycol, Betaine, DNA, Xanthan Gum, Ethylhexylglycerin, Adenosine, Sodium Citrate, Citric Acid, Disodium Edta, Glycine, Serine, Glutamic Acid, Aspartic Acid, Leucine, Alanine, Lysine, Arginine, Tyrosine, Phenylalanine, Proline, Threonine, Valine, Isoleucine, Histidine, Cysteine, Methionine.",
    options: [{ size: "150ml", price: "$45.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Sensitive"],
      concern: ["Dryness & Hydration", "Redness & Sensitivity"],
    },
    reviews: [
      { user: "Mark R.", rating: 5, text: "Very soothing and hydrating." },
    ],
  },
  {
    id: 30,
    brand: "Dr. Jart+",
    name: "Every Sun Day Mineral Sunscreen",
    category: "Sun Care",
    price: "$40.00",
    image: "https://images.unsplash.com/photo-1615397323675-400921473456?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A mineral sunscreen that provides broad-spectrum protection while being gentle on sensitive skin.",
    ingredients:
      "Water, Zinc Oxide, Propylheptyl Caprylate, Butyloctyl Salicylate, Propanediol, Titanium Dioxide, Isododecane, Polyglyceryl-3 Polydimethylsiloxyethyl Dimethicone, Niacinamide, Caprylyl Methicone, Methyl Methacrylate Crosspolymer, Disteardimonium Hectorite, Magnesium Sulfate, 1,2-Hexanediol, Triethoxycaprylylsilane, Aluminum Hydroxide, Stearic Acid, Glycerin, Caprylyl Glycol, Glyceryl Caprylate, Ethylhexylglycerin, Adenosine, Tocopherol.",
    options: [{ size: "50ml", price: "$40.00" }],
    idealFor: {
      skinType: ["Sensitive", "Oily", "Combination"],
      concern: ["Redness & Sensitivity"],
    },
    reviews: [
      {
        user: "Emma L.",
        rating: 4,
        text: "Great mineral sunscreen, minimal white cast.",
      },
    ],
  },
  {
    id: 31,
    brand: "Paula's Choice",
    name: "Skin Recovery Enriched Calming Toner",
    category: "Toners",
    price: "$23.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A milky toner that helps soothe dry, sensitive skin while providing essential antioxidants.",
    ingredients:
      "Water (Aqua), Cyclopentasiloxane (hydration), Glycerin (hydration), Glycereth-26 (texture enhancer), Polysorbate 20 (texture enhancer), Oenothera Biennis (Evening Primrose) Oil (non-fragrant plant oil/antioxidant), Borago Officinalis (Borage) Seed Oil (non-fragrant plant oil/antioxidant), Sodium Hyaluronate (hydration), Panthenol (skin-soothing), Allantoin (skin-soothing), Chamomilla Recutita (Matricaria) Flower Extract (skin-soothing), Cucumis Sativus (Cucumber) Fruit Extract (skin-soothing), Epilobium Angustifolium (Willow Herb) Flower/Leaf/Stem Extract (skin-soothing), Paeonia Lactiflora (Peony) Root Extract (antioxidant), Avena Sativa (Oat) Kernel Extract (skin-soothing), Sodium PCA (hydration), Adenosine (skin-restoring), Caprylic/Capric Triglyceride (emollient), Tocopheryl Acetate (vitamin E/antioxidant), Ascorbyl Palmitate (vitamin C/antioxidant), Magnesium Ascorbyl Phosphate (vitamin C/antioxidant), Quercetin (antioxidant), Phospholipids (skin-restoring), Sodium Chondroitin Sulfate (hydration), Retinyl Palmitate (vitamin A/antioxidant), Salix Alba (Willow) Bark Extract (skin-soothing), Phytic Acid (chelating agent), Disodium EDTA (chelating agent), Phenoxyethanol (preservative).",
    options: [{ size: "190ml", price: "$23.00" }],
    idealFor: {
      skinType: ["Dry", "Sensitive"],
      concern: ["Dryness & Hydration", "Redness & Sensitivity"],
    },
    reviews: [
      { user: "Linda B.", rating: 5, text: "So soothing for my dry skin." },
    ],
  },
  {
    id: 32,
    brand: "Paula's Choice",
    name: "Clinical 1% Retinol Treatment",
    category: "Serums",
    price: "$62.00",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A potent 1% retinol treatment that helps visibly improve the appearance of wrinkles and firm skin.",
    ingredients:
      "Water (Aqua), Dimethicone (texture enhancer), Glycerin (hydration), Butylene Glycol (hydration), Isononyl Isononanoate (texture enhancer), Castor Isostearate Succinate (texture enhancer), Glyceryl Stearate (texture enhancer), C12-15 Alkyl Benzoate (texture enhancer), Dimethicone Crosspolymer (texture enhancer), PEG-33 (texture enhancer), PEG-100 Stearate (texture enhancer), Retinol (skin-restoring), Glycine Soja (Soybean) Oil (antioxidant), Ceramide NG (skin-restoring), Palmitoyl Tetrapeptide-7 (skin-restoring), Palmitoyl Hexapeptide-12 (skin-restoring), Palmitoyl Tripeptide-1 (skin-restoring), Sodium Hyaluronate (hydration), Dipotassium Glycyrrhizate (skin-soothing), Glycyrrhiza Glabra (Licorice) Root Extract (skin-soothing), Avena Sativa (Oat) Kernel Extract (skin-soothing), Arctium Lappa (Burdock) Root Extract (skin-soothing), Salix Alba (Willow) Bark Extract (skin-soothing), Glycine Soja (Soybean) Sterols (antioxidant), Lecithin (skin-restoring), Allantoin (skin-soothing), Tocopheryl Acetate (vitamin E/antioxidant), Hydrolyzed Soy Protein (texture enhancer), Sorbitan Laurate (texture enhancer), Acetyl Dipeptide-1 Cetyl Ester (skin-soothing), Disodium EDTA (chelating agent), Hydroxyethylcellulose (texture enhancer), Palmitoyl Oligopeptide (skin-restoring), Sodium Hydroxide (pH adjuster), Caprylyl Glycol (preservative), Ethylhexylglycerin (preservative), Magnesium Aluminum Silicate (texture enhancer), Steareth-20 (texture enhancer), Polysorbate 20 (texture enhancer), BHA (antioxidant), BHT (antioxidant), Phenoxyethanol (preservative).",
    options: [{ size: "30ml", price: "$62.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      {
        user: "Sarah K.",
        rating: 5,
        text: "Strong but works wonders for fine lines.",
      },
    ],
  },
  {
    id: 33,
    brand: "The Ordinary",
    name: "Squalane Cleanser",
    category: "Cleansers",
    price: "$9.00",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A gentle cleansing product formulated to target makeup removal while leaving the skin feeling smooth and moisturized.",
    ingredients:
      "Squalane, Aqua (Water), Coco-Caprylate/Caprate, Glycerin, Sucrose Stearate, Ethyl Macadamiate, Caprylic/Capric Triglyceride, Sucrose Laurate, Hydrogenated Starch Hydrolysate, Sucrose Dilaurate, Sucrose Trilaurate, Polyacrylate Crosspolymer-6, Isoceteth-20, Sodium Polyacrylate, Tocopherol, Hydroxymethoxyphenyl Decanone, Trisodium Ethylenediamine Disuccinate, Malic Acid, Ethylhexylglycerin, Chlorphenesin.",
    options: [
      { size: "50ml", price: "$9.00" },
      { size: "150ml", price: "$19.90" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily", "Sensitive"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "James M.",
        rating: 5,
        text: "Great first cleanse, very gentle.",
      },
    ],
  },
  {
    id: 34,
    brand: "The Ordinary",
    name: "Caffeine Solution 5% + EGCG",
    category: "Eye Care",
    price: "$7.50",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A light-textured formula that contains an extremely high 5% concentration of caffeine, supplemented with highly-purified Epigallocatechin Gallatyl Glucoside (EGCG).",
    ingredients:
      "Aqua (Water), Caffeine, Maltodextrin, Glycerin, Propanediol, Epigallocatechin Gallatyl Glucoside, Gallyl Glucoside, Hyaluronic Acid, Oxidized Glutathione, Melanoidins, Glycine Soja (Soybean) Seed Extract, Urea, Pentylene Glycol, Hydroxyethylcellulose, Polyacrylate Crosspolymer-6, Xanthan gum, Lactic Acid, Dehydroacetic Acid, Trisodium Ethylenediamine Disuccinate, Propyl Gallate, Dimethyl Isosorbide, Benzyl Alcohol, 1,2-Hexanediol, Ethylhexylglycerin, Phenoxyethanol, Caprylyl Glycol.",
    options: [{ size: "30ml", price: "$7.50" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      { user: "Lily P.", rating: 4, text: "Helps with morning puffiness." },
    ],
  },
  {
    id: 37,
    brand: "La Mer",
    name: "The Eye Concentrate",
    category: "Eye Care",
    price: "$260.00",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A concentrated eye cream that helps visibly diminish dark circles, surface lines, and wrinkles.",
    ingredients:
      "Algae Extract, Water, Cyclopentasiloxane, Glycerin, Methyl Gluceth-20, Bis-Peg-18 Methyl Ether Dimethyl Silane, Tricaprylin, Yeast Extract, Sesamum Indicum (Sesame) Seed Oil, Medicago Sativa (Alfalfa) Seed Powder, Helianthus Annuus (Sunflower) Seedcake, Prunus Amygdalus Dulcis (Sweet Almond) Seed Meal, Eucalyptus Globulus (Eucalyptus) Leaf Oil, Sodium Gluconate, Copper Gluconate, Calcium Gluconate, Magnesium Gluconate, Zinc Gluconate, Magnesium Sulfate, Paraffin, Tocopheryl Succinate, Niacin, Sesamum Indicum (Sesame) Seed Powder, Citrus Aurantifolia (Lime) Peel Extract, Helichrysum Arenarium (Everlasting) Extract, Sigesbeckia Orientalis (St. Paul's Wort) Extract, Polygonum Cuspidatum Root Extract, Saccharomyces Lysate Extract, Humulus Lupulus (Hops) Extract, Citrus Reticulata (Tangerine) Peel Extract, Asparagopsis Armata Extract, Laminaria Digitata Extract, Sorbitol, Caprylic/Capric Triglyceride, Cholesterol, Linoleic Acid, Caffeine, Hydrogenated Vegetable Oil, Sodium Hyaluronate, Tocopheryl Linoleate/Oleate, Acetyl Glucosamine, Squalane, Acetyl Hexapeptide-8, Dipeptide-2, Palmitoyl Tetrapeptide-7, Gold, Copper Powder, Silver, Polymethylsilsesquioxane, Ammonium Acryloyldimethyltaurate/Vp Copolymer, Trimethylsiloxysilicate, Polysorbate 20, Lecithin, Butylene Glycol, Silica, Glycosaminoglycans, Alcohol Denat., Fragrance, Limonene, Linalool, Geraniol, Citronellol, Benzyl Salicylate, Benzyl Benzoate, Sodium Benzoate, Potassium Sorbate, Phenoxyethanol.",
    options: [{ size: "15ml", price: "$260.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      {
        user: "Victoria B.",
        rating: 5,
        text: "Luxury for the eyes, truly helps with dark circles.",
      },
    ],
  },
  {
    id: 38,
    brand: "La Mer",
    name: "The Regenerating Serum",
    category: "Serums",
    price: "$400.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2023/10/22/186000-876829762_tiny.mp4",
    description:
      "A powerful age-defying serum that helps visibly diminish lines and wrinkles for a rejuvenated look.",
    ingredients:
      "Water, Algae Extract, Dimethicone, Hdi/Trimethylol Hexyllactone Crosspolymer, Hydrogenated Polyisobutene, Caprylic/Capric/Myristic/Stearic Triglyceride, Polysilicone-11, Peg-8 Dimethicone, Peg-100 Stearate, Peg-10 Dimethicone, Glycerin, Citrus Aurantifolia (Lime) Peel Extract, Sesamum Indicum (Sesame) Seed Oil, Medicago Sativa (Alfalfa) Seed Powder, Helianthus Annuus (Sunflower) Seedcake, Prunus Amygdalus Dulcis (Sweet Almond) Seed Meal, Eucalyptus Globulus (Eucalyptus) Leaf Oil, Sodium Gluconate, Copper Gluconate, Calcium Gluconate, Magnesium Gluconate, Zinc Gluconate, Magnesium Sulfate, Paraffin, Tocopheryl Succinate, Niacin, Sesamum Indicum (Sesame) Seed Powder, Crithmum Maritimum Extract, Sigesbeckia Orientalis (St. Paul's Wort) Extract, Polygonum Cuspidatum Root Extract, Saccharomyces Lysate Extract, Humulus Lupulus (Hops) Extract, Citrus Reticulata (Tangerine) Peel Extract, Asparagopsis Armata Extract, Laminaria Digitata Extract, Sorbitol, Caprylic/Capric Triglyceride, Cholesterol, Linoleic Acid, Caffeine, Hydrogenated Vegetable Oil, Sodium Hyaluronate, Tocopheryl Linoleate/Oleate, Acetyl Glucosamine, Squalane, Acetyl Hexapeptide-8, Dipeptide-2, Palmitoyl Tetrapeptide-7, Gold, Copper Powder, Silver, Polymethylsilsesquioxane, Ammonium Acryloyldimethyltaurate/Vp Copolymer, Trimethylsiloxysilicate, Polysorbate 20, Lecithin, Butylene Glycol, Silica, Glycosaminoglycans, Alcohol Denat., Fragrance, Limonene, Linalool, Geraniol, Citronellol, Benzyl Salicylate, Benzyl Benzoate, Sodium Benzoate, Potassium Sorbate, Phenoxyethanol.",
    options: [{ size: "30ml", price: "$400.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging"],
    },
    reviews: [
      {
        user: "Olivia R.",
        rating: 5,
        text: "The ultimate serum for anti-aging.",
      },
    ],
  },
  {
    id: 39,
    brand: "Drunk Elephant",
    name: "C-Firma Fresh Day Serum",
    category: "Serums",
    price: "$78.00",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "A super-potent 15% vitamin C day serum thatâ€™s packed with a powerful antioxidant complex, essential nutrients, and fruit enzymes.",
    ingredients:
      "Water/Aqua/Eau, Ethoxydiglycol, Ascorbic Acid, Glycerin, Laureth-23, Lactobacillus/Pumpkin Ferment Extract, Sclerocarya Birrea Seed Oil, Ferulic Acid, Sodium Hyaluronate, Chondrus Crispus Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Haematococcus Pluvialis Extract, Vitis Vinifera (Grape) Juice Extract, Camellia Sinensis Leaf Extract, Panthenol, Tocopherol, Diglucosyl Gallic Acid, Chromium Hydroxide Green, Pentylene Glycol, Butylene Glycol, Sodium Hydroxide, Phenoxyethanol, Potassium Sorbate, Sodium Benzoate, Ethylhexylglycerin.",
    options: [{ size: "28ml", price: "$78.00" }],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily"],
      concern: ["Anti-Aging", "Acne & Blemishes"],
    },
    reviews: [
      {
        user: "Rachel S.",
        rating: 5,
        text: "Love that you mix it fresh yourself!",
      },
    ],
  },
  {
    id: 40,
    brand: "Drunk Elephant",
    name: "Beste No. 9 Jelly Cleanser",
    category: "Cleansers",
    price: "$34.00",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7ce3ea84?auto=format&fit=crop&w=800&q=80",
    textureVideo:
      "https://cdn.pixabay.com/video/2020/02/24/32880-394931843_tiny.mp4",
    description:
      "An innovative jelly cleanser that removes all traces of makeup, excess oil, pollution, and any other grime from the day.",
    ingredients:
      "Water/Aqua/Eau, Glycerin, Cocamidopropyl Betaine, Coco-Glucoside, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Hydroxysultaine, Sodium Methyl Oleoyl Taurate, Propanediol, Aloe Barbadensis Leaf Extract, Glycolipids, Linoleic Acid, Linolenic Acid, Lauryl Glucoside, Cucumis Sativus (Cucumber) Fruit Extract, Rosa Canina Fruit Oil, Sclerocarya Birrea Seed Oil, Squalane, Phytosphingosine, Ceramide AP, Ceramide NP, Ceramide EOP, Cholesterol, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Sodium Chloride, Sodium Benzoate, Potassium Sorbate, Phenoxyethanol, Ethylhexylglycerin.",
    options: [
      { size: "150ml", price: "$34.00" },
      { size: "60ml", price: "$16.00" },
    ],
    idealFor: {
      skinType: ["Dry", "Normal", "Combination", "Oily", "Sensitive"],
      concern: ["Dryness & Hydration"],
    },
    reviews: [
      {
        user: "Megan L.",
        rating: 5,
        text: "The perfect gentle cleanser for every day.",
      },
    ],
  },
  {
    id: 20219,
    brand: "The Ordinary",
    name: "Glycolic Acid 7% Toning Solution",
    category: "Exfoliating Toner",
    price: "$13.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    description:
      "An alpha hydroxy acid (AHA) solution that provides mild exfoliation for improved skin radiance and visible clarity.",
    ingredients:
      "Aqua (Water), Glycolic Acid, Rosa Damascena Flower Water, Centaurea Cyanus Flower Water, Aloe Barbadensis Leaf Water, Propanediol, Glycerin, Panthenol, Panax Ginseng Root Extract, Tasmannia Lanceolata Fruit/Leaf Extract",
    reviews: [],
  },
  {
    id: 655290,
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    category: "Facial Serum",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    description:
      "A high-strength vitamin and mineral blemish formula to reduce the appearance of skin blemishes and congestion.",
    ingredients:
      "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol",
    reviews: [],
  },
  {
    id: 700163,
    brand: "La Roche-Posay",
    name: "Effaclar Mat Anti-Shine Face Moisturizer",
    category: "Moisturizer",
    price: "$31.99",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    description:
      "A daily mattifying moisturizer for oily skin that targets excess oil to help reduce shine and pore size.",
    ingredients:
      "Aqua / Water, Glycerin, Dimethicone, Isocetyl Stearate, Alcohol Denat., Silica, Dimethicone/Vinyl Dimethicone Crosspolymer, Acrylamide/Sodium Acryloyldimethyltaurate Copolymer, Methyl Methacrylate Crosspolymer, Butylene Glycol",
    reviews: [],
  },
  {
    id: 802635,
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Exfoliator",
    price: "$34.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    description:
      "A leave-on exfoliant that unclogs pores, smooths wrinkles, and brightens skin tone.",
    ingredients:
      "Water (Aqua), Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Oleifera (Green Tea) Leaf Extract, Sodium Hydroxide, Tetrasodium EDTA",
    reviews: [],
  },
  {
    id: 832412,
    brand: "Neutrogena",
    name: "Hydro Boost Water Gel",
    category: "Moisturizer",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80",
    description:
      "A lightweight water gel moisturizer with hyaluronic acid that delivers intense hydration for soft, supple skin.",
    ingredients:
      "Water, Dimethicone, Glycerin, Cetearyl Olivate, Sorbitan Olivate, Polyacrylamide, Phenoxyethanol, C13-14 Isoparaffin, Dimethicone Crosspolymer, Chlorphenesin",
    reviews: [],
  },
  {
    id: 267963,
    brand: "Kiehl's",
    name: "Ultra Facial Cream",
    category: "Moisturizer",
    price: "$38.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    description:
      "A 24-hour daily face moisturizer that provides continuous hydration for healthy-looking skin.",
    ingredients:
      "Aqua / Water, Glycerin, Cyclohexasiloxane, Squalane, Bis-PEG-18 Methyl Ether Dimethyl Silane, Sucrose Stearate, Stearyl Alcohol, PEG-8 Stearate, Myristyl Myristate, Pentaerythrityl Tetraethylhexanoate",
    reviews: [],
  },
  {
    id: 802127,
    brand: "Drunk Elephant",
    name: "Protini Polypeptide Cream",
    category: "Moisturizer",
    price: "$68.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    description:
      "A protein-rich moisturizer that combines signal peptides and amino acids to improve skin tone, texture, and firmness.",
    ingredients:
      "Water/Aqua/Eau, Dicaprylyl Carbonate, Glycerin, Cetearyl Alcohol, Cetearyl Olivate, Sorbitan Olivate, Sclerocarya Birrea Seed Oil, Bacillus/ Soymilk Ferment Filtrate, Nymphaea Alba Root Extract, Sh-Oligopeptide-1",
    reviews: [],
  },
  {
    id: 458260,
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    category: "Serum",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    description:
      "A high-strength vitamin and mineral blemish formula with 10% pure niacinamide and 1% zinc PCA.",
    ingredients:
      "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tammarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin",
    reviews: [],
  },
  {
    id: 246498,
    brand: "La Roche-Posay",
    name: "Effaclar Mat",
    category: "Moisturizer",
    price: "$32.00",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    description:
      "Daily mattifying moisturizer for oily skin to target excess oil and help tighten pores.",
    ingredients:
      "Aqua / Water, Glycerin, Dimethicone, Isocetyl Stearate, Alcohol Denat., Silica, Dimethicone/Vinyl Dimethicone Crosspolymer, Acrylamide/Sodium Acryloyldimethyltaurate Copolymer, Methyl Methacrylate Crosspolymer, Butylene Glycol, PEG-100 Stearate, Cocamide MEA, Sarcosine, Glyceryl Stearate, Triethanolamine, Isohexadecane, Perlite, Capryloyl Salicylic Acid, Tetrasodium EDTA, Pentylene Glycol, Polysorbate 80, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Salicylic Acid, Parfum / Fragrance",
    reviews: [],
  },
  {
    id: 749475,
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Exfoliant",
    price: "$34.00",
    image: "https://images.unsplash.com/photo-1556228720-1c2a46e1c26b?auto=format&fit=crop&w=800&q=80",
    description:
      "A leave-on exfoliant that unclogs pores, smooths wrinkles, and evens out skin tone.",
    ingredients:
      "Water (Aqua), Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Oleifera (Green Tea) Leaf Extract, Sodium Hydroxide, Tetrasodium EDTA",
    reviews: [],
  },
  {
    id: 836282,
    brand: "Kiehl's",
    name: "Ultra Facial Cream",
    category: "Moisturizer",
    price: "$38.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    description:
      "A lightweight daily moisturizer that provides 24-hour hydration and strengthens the skin's moisture barrier.",
    ingredients:
      "Aqua / Water, Glycerin, Cyclohexasiloxane, Squalane, Bis-PEG-18 Methyl Ether Dimethyl Silane, Sucrose Stearate, Stearyl Alcohol, PEG-8 Stearate, Myristyl Myristate, Pentaerythrityl Tetraethylhexanoate, Prunus Armeniaca Kernel Oil / Apricot Kernel Oil, Phenoxyethanol, Persea Gratissima Oil / Avocado Oil, Glyceryl Stearate, Cetyl Alcohol, Oryza Sativa Bran Oil / Rice Bran Oil, Olea Europaea Fruit Oil / Olive Fruit Oil, Chlorphenesin, Stearic Acid, Palmitic Acid, Disodium EDTA, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Carbomer, Prunus Amygdalus Dulcis Oil / Sweet Almond Oil, Xanthan Gum, Ethylhexylglycerin, Sodium Hydroxide, Tocopherol, Pseudoalteromonas Ferment Extract, Salicylic Acid",
    reviews: [],
  },
  {
    id: 318208,
    brand: "Drunk Elephant",
    name: "C-Firma Fresh Day Serum",
    category: "Serum",
    price: "$78.00",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
    description:
      "A potent vitamin C day serum packed with a powerful antioxidant complex, essential nutrients, and fruit enzymes.",
    ingredients:
      "Water/Aqua/Eau, Ethoxydiglycol, Ascorbic Acid, Glycerin, Laureth-23, Lactobacillus/Pumpkin Ferment Extract, Sclerocarya Birrea Seed Oil, Ferulic Acid, Sodium Hyaluronate, Chondrus Crispus Extract, Camellia Sinensis Leaf Extract, Lactobacillus/Punica Granatum Fruit Ferment Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Vitis Vinifera (Grape) Juice Extract, Phyllanthus Emblica Fruit Extract, Hydrolyzed Wheat Protein, Tocopherol, Caprylhydroxamic Acid, Acetyl Glucosamine, Hydrolyzed Quinoa, Glutathion, Quercetin, Sophora Japonica Flower Extract, Vitis Vinifera (Grape) Seed Extract, Magnesium Aspartate, Zinc Gluconate, Copper Gluconate, Lecithin, Tetrasodium Glutamate Diacetate, Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer, Caprylyl Glycol, Phenoxyethanol, Sodium Hydroxide",
    reviews: [],
  },
  {
    id: 581657,
    brand: "Neutrogena",
    name: "Hydro Boost Water Gel",
    category: "Moisturizer",
    price: "$20.00",
    image: "https://images.unsplash.com/photo-1571781926291-c477eb31f8da?auto=format&fit=crop&w=800&q=80",
    description:
      "A unique water gel formula that absorbs quickly like a gel but has the long-lasting moisturizing power of a cream.",
    ingredients:
      "Water, Dimethicone, Glycerin, Cetearyl Olivate, Sorbitan Olivate, Polyacrylamide, Phenoxyethanol, C13-14 Isoparaffin, Dimethicone/Vinyl Dimethicone Crosspolymer, Synthetic Beeswax, Chlorphenesin, Laureth-7, Carbomer, Sodium Hyaluronate, Ethylhexylglycerin, Fragrance, C12-14 Pareth-12, Sodium Hydroxide, Blue 1",
    reviews: [],
  },
  {
    id: 55900,
    brand: "Sunday Riley",
    name: "Good Genes All-In-One Lactic Acid Treatment",
    category: "Treatment",
    price: "$85.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    description:
      "A multi-tasking treatment formulated with high potency, purified grade lactic acid that exfoliates dull, pore-clogging dead skin cells.",
    ingredients:
      "Water/Eau/Aqua, Lactic Acid, C13-15 Alkane, Caprylic/Capric Triglyceride, Ceteareth-20, Glycerin, Glyceryl Stearate, Steareth-2, Stearic Acid, Opuntia Ficus-Indica (Prickly Pear) Fruit Extract, Cypripedium Pubescens (Lady's Slipper Orchid) Extract, Arnica Montana Flower Extract, Aloe Barbadensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Agave Tequilana (Blue Agave) Leaf Extract, Saccharomyces Cerevisiae (Yeast) Extract, Althaea Officinalis (Marshmallow) Root Extract, Cyclomethicone, Xanthan Gum, Phenoxyethanol, Caprylyl Glycol, Ethylhexylglycerin, Hexylene Glycol, Potassium Sorbate",
    reviews: [],
  },
  {
    id: 56001,
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "Cleanser",
    price: "$14.99",
    image: "https://m.media-amazon.com/images/I/51DbQev1thL._AC_UF1000,1000_QL80_.jpg",
    description: "A gentle facial cleanser with ingredients like ceramides and hyaluronic acid that work to restore the skin's natural barrier.",
    ingredients: "Purified Water, Glycerin, Behentrimonium Methosulfate and Cetearyl Alcohol, Ceramide 3, Ceramide 6-II, Ceramide 1, Hyaluronic Acid, Cholesterol, Polyoxyl 40 Stearate, Glyceryl Monostearate, Stearyl Alcohol, Polysorbate 20, Potassium Phosphate, Dipotassium Phosphate, Sodium Lauroyl Lactylate, Cetyl Alcohol, Disodium EDTA, Phytosphingosine, Methylparaben, Propylparaben, Carbomer, Xanthan Gum.",
    reviews: [],
  },
  {
    id: 56002,
    brand: "CeraVe",
    name: "Daily Moisturizing Lotion",
    category: "Moisturizer",
    price: "$13.99",
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products-v3/daily-moisturizing-lotion/700x700/cerave_daily_moisturizing_lotion_12oz_front_-700x700-v2.jpg?rev=5fb61e1db7fe49fb9faf308c5f583d65",
    description: "A lightweight, oil-free moisturizer that helps hydrate the skin and restore its natural barrier.",
    ingredients: "Purified Water, Glycerin, Caprylic/Capric Triglyceride, Behentrimonium Methosulfate and Cetearyl Alcohol, Ceteareth-20 and Cetearyl Alcohol, Ceramide 3, Ceramide 6-II, Ceramide 1, Hyaluronic Acid, Cholesterol, Dimethicone, Polysorbate 20, Polyglyceryl-3 Diisostearate, Potassium Phosphate, Dipotassium Phosphate, Sodium Lauroyl Lactylate, Cetyl Alcohol, Disodium EDTA, Phytosphingosine, Methylparaben, Propylparaben, Carbomer, Xanthan Gum.",
    reviews: [],
  },
  {
    id: 56003,
    brand: "SKIN1004",
    name: "Madagascar Centella Ampoule",
    category: "Serum",
    price: "$19.00",
    image: "https://miinme.ch/cdn/shop/files/SKIN1004-Madagascar-Centella-Ampoule.jpg?v=1765715822",
    description: "A soothing ampoule that helps calm and restore imbalance in the skin caused by harsh environments.",
    ingredients: "Centella Asiatica Extract(100%).",
    reviews: [],
  },
  {
    id: 56004,
    brand: "SKIN1004",
    name: "Madagascar Centella Light Cleansing Oil",
    category: "Cleanser",
    price: "$21.00",
    image: "https://glowtheory.com/cdn/shop/files/SKIN1004_Madagascar_Centella_Light_cleansing_oil_200ml_1024x1024.jpg?v=1748524042",
    description: "A lightweight cleansing oil that gently melts away makeup, dirt, oils and sunscreen without stinging the eye area.",
    ingredients: "Ethylhexyl Stearate, Cetyl Ethylhexanoate, Sorbeth-30 Tetraoleate, Centella Asiatica Extract(10,000ppm), Helianthus Annuus(Sunflower) Seed Oil, Citrus Aurantium Bergamia(Bergamot) Fruit Oil, Olea Europaea(Olive) Fruit Oil, Simmondsia Chinensis(Jojoba) Seed Oil, Ethylhexylglycerin, Pelargonium Graveolens Flower Oil, Rosa Damascena Flower Oil.",
    reviews: [],
  },
  {
    id: 56005,
    brand: "Haruharu Wonder",
    name: "Black Rice Hyaluronic Toner",
    category: "Toner",
    price: "$22.00",
    image: "https://www.koreanbeauty.co.uk/cdn/shop/files/BlackRiceHyaluronicTonerOriginal_2.png?v=1743600703&width=900",
    description: "A pure and potent toner that is formulated with 95% naturally derived ingredients, including 2,000ppm Korean black rice extract.",
    ingredients: "Water, Betaine, Glycerin, Propanediol, Oryza Sativa (Rice) Extract, Phyllostachys Pubescens Shoot Bark Extract, Aspergillus Ferment Extract Filtrate, Panax Ginseng Root Extract, Cyclodextrin, Scutellaria Baicalensis Root Extract, Hyaluronic Acid, Beta-Glucan, Cellulose Gum, Xanthan Gum, Butylene Glycol, Usnea Barbata (Lichen) Extract, Zanthoxylum Piperitum Fruit Extract, Pulsatilla Koreana Extract, Sodium Phytate, Tamarindus Indica Seed Gum, Polyglyceryl-10 Laurate, Polyglyceryl-10 Myristate, Glucose, 1,2-Hexanediol, Alcohol, Lavandula Angustifolia (Lavender) Oil, Linalool.",
    reviews: [],
  },
  {
    id: 56006,
    brand: "Haruharu Wonder",
    name: "Black Rice Moisture 5.5 Soft Cleansing Gel",
    category: "Cleanser",
    price: "$18.00",
    image: "https://sokoglam.com/cdn/shop/files/Soko-Glam-PDP-HaruHaru-Wonder-Black-Rice-Moisture-5.5-Soft-Cleansing-Gel-02.png?v=1753470444&width=1445",
    description: "An unscented, mildly acidic cleansing gel that is formulated with naturally-derived surfactants.",
    ingredients: "Water, Glycerin, Coco-Betaine, Sodium Chloride, Pentylene Glycol, Propanediol, 1,2-Hexanediol, Xanthan Gum, Hydroxyethylcellulose, Potassium Cocoyl Glycinate, Potassium Cocoate, Oryza Sativa (Rice) Extract, Phyllostachys Pubescens Shoot Bark Extract, Panax Ginseng Root Extract, Aspergillus Ferment Extract Filtrate, Beta-Glucan, Butylene Glycol, Trehalose, Citric Acid, Cyclodextrin, Zanthoxylum Piperitum Fruit Extract, Pulsatilla Koreana Extract, Usnea Barbata (Lichen) Extract, Ethylhexylglycerin.",
    reviews: [],
  },
  {
    id: 56007,
    brand: "Medicube",
    name: "Zero Pore Pad 2.0",
    category: "Toner",
    price: "$25.00",
    image: "https://m.media-amazon.com/images/I/71Mcspt-6AL.jpg",
    description: "A dual-textured toner pad infused with AHA and BHA to gently exfoliate dead skin cells, clear sebum, and help minimize the look of pores.",
    ingredients: "Water, Methylpropanediol, Trometamine, Lactic Acid, Alcohol Denat., 1,2-Hexanediol, Panthenol, Glycereth-26, Salicylic Acid, Ammonium Acryloyldimethyltaurate/VP, Copolymer, Betaine, Trehalose, Allantoin, Polyglyceryl-10 Laurate, Rosa Centifolia Flower Water, Glycerin, Disodium EDTA, Sodium Hyaluronate, Cynanchum Atratum Extract, Citrus Aurantium Dulcis (Orange) Peel Oil, Citrus Limon (Lemon) Peel Oil, Citrus Grandis (Grapefruit) Peel Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Citrus Aurantium Bergamia (Bergamot) Fruit Oil, Pelargonium Graveolens Flower Oil, Pinus Sylvestris Leaf Extract, Illicium Verum (Anise) Fruit Extract, Scutellaria Baicalensis Root Extract, Ethylhexylglycerin, Butylene Glycol, Salix Alba (Willow) Bark Extract, Origanum Vulgare Leaf Extract, Chamaecyparis Obtusa Leaf Extract, Lactobacillus/Soybean Ferment Extract, Cinnamomum Cassia Bark Extract, Portulaca Oleracea Extract, Oenothera Biennis (Evening Primrose) Flower Extract, Pinus Palustris Leaf Extract, Ulmus Davidiana Root Extract, Pueraria Lobata Root Extract, Limonene.",
    reviews: [],
  },
  {
    id: 56008,
    brand: "Medicube",
    name: "Age-R Booster Pro",
    category: "Skincare Device",
    price: "$299.00",
    image: "https://m.media-amazon.com/images/I/71cKBPGmeWL.jpg",
    description: "A 6-in-1 high-tech beauty device that helps maximize skincare absorption, improve skin elasticity, and tightens pores with advanced EMS, microcurrent, and LED therapy.",
    ingredients: "Device body, Charging cable, User manual.",
    reviews: [],
  }
];


``

## src/utils/theme.ts
``tsx
export function getActiveTheme(): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();

  // Valentine's Day: Feb 14 (Visible Feb 7 - Feb 14)
  const valentinesStart = new Date(currentYear, 1, 7);
  const valentinesEnd = new Date(currentYear, 1, 14, 23, 59, 59);
  if (currentDate >= valentinesStart && currentDate <= valentinesEnd) {
    return 'theme-valentines';
  }

  // Women's Day: March 8 (Visible March 1 - March 8)
  const womensDayStart = new Date(currentYear, 2, 1);
  const womensDayEnd = new Date(currentYear, 2, 8, 23, 59, 59);
  if (currentDate >= womensDayStart && currentDate <= womensDayEnd) {
    return 'theme-womens-day';
  }

  // Pride Month: June (Visible May 25 - June 30)
  const prideStart = new Date(currentYear, 4, 25);
  const prideEnd = new Date(currentYear, 5, 30, 23, 59, 59);
  if (currentDate >= prideStart && currentDate <= prideEnd) {
    return 'theme-pride';
  }

  // Christmas: Dec 25 (Visible Dec 1 - Dec 25)
  const christmasStart = new Date(currentYear, 11, 1);
  const christmasEnd = new Date(currentYear, 11, 25, 23, 59, 59);
  if (currentDate >= christmasStart && currentDate <= christmasEnd) {
    return 'theme-christmas';
  }

  return 'theme-default';
}

``

## package.json
``json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.44.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "better-sqlite3": "^12.4.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}

``

