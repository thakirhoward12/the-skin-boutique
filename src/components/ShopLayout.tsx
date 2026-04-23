import React, { useState, Suspense, lazy } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const CheckoutModal = lazy(() => import('./CheckoutModal'));
const TrackingModal = lazy(() => import('./TrackingModal'));
const CurrencyModal = lazy(() => import('./CurrencyModal'));
const AffiliateModal = lazy(() => import('./AffiliateModal'));
const AuthModal = lazy(() => import('./AuthModal'));
const ContactModal = lazy(() => import('./ContactModal'));

interface ShopLayoutProps {
  children: React.ReactNode;
  /** Page title shown in breadcrumb */
  pageTitle: string;
  /** Optional subtitle shown below the page header */
  subtitle?: string;
}

/**
 * ShopLayout — Unified page shell for all shop pages.
 * Provides: Navbar, Footer, CartDrawer, modals, breadcrumbs.
 * Prevents duplicating 100+ lines of modal state per page.
 */
export default function ShopLayout({ children, pageTitle, subtitle }: ShopLayoutProps) {
  const [favorites] = useState<Set<number>>(new Set());
  const [isWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const { isCheckoutOpen, closeCheckout, openCheckout } = useCart();
  const location = useLocation();

  // Build breadcrumb from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar
        favoritesCount={favorites.size}
        onOpenWishlist={() => {}}
        onOpenCheckout={openCheckout}
        onOpenCurrency={() => setIsCurrencyOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAffiliate={() => setIsAffiliateOpen(true)}
      />

      {/* Page Header with Breadcrumb */}
      <div className="pt-32 pb-12 bg-gradient-to-b from-ink-900 via-ink-900/95 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Home
            </Link>
            {pathSegments.map((segment, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 text-white/30" />
                <span className={i === pathSegments.length - 1 ? 'text-white/90 font-medium' : 'text-white/50'}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight">
            {pageTitle}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg text-white/60 font-light max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <main className="relative flex-grow -mt-6">
        {children}
      </main>

      <Footer
        onOpenAffiliate={() => setIsAffiliateOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <CartDrawer />

      <Suspense fallback={null}>
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
  );
}
