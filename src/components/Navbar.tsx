import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, Heart, X, Globe, Droplet, Settings, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCurrency, Currency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

export default function Navbar({ 
  favoritesCount, 
  onOpenWishlist,
  onOpenCheckout,
  onOpenCurrency,
  onOpenAuth,
  onOpenAffiliate
}: { 
  favoritesCount: number;
  onOpenWishlist: () => void;
  onOpenCheckout: () => void;
  onOpenCurrency: () => void;
  onOpenAuth: () => void;
  onOpenAffiliate?: () => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currency, setCurrency } = useCurrency();
  const { cartCount, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();

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
          <div className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 flex items-center justify-center gap-2">
            <Droplet className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-pastel-pink-dark' : 'text-white'}`} />
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
            {isAdmin && (
              <Link
                to="/admin"
                title="Admin Dashboard"
                className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block`}
              >
                <Settings className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}
            {user ? (
              <Link 
                to="/affiliate" 
                title="Affiliate Dashboard"
                className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block`}
              >
                <Gift className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <button 
                onClick={onOpenAffiliate}
                title="Affiliate Rewards"
                className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block`}
              >
                <Gift className="h-5 w-5" strokeWidth={1.5} />
              </button>
            )}
            <button 
              onClick={() => user ? logout() : onOpenAuth()}
              title={user ? "Log Out" : "Sign In"}
              className={`${isScrolled ? 'text-ink-900 hover:text-ink-500' : 'text-white hover:text-pastel-pink'} hover:scale-110 transition-all duration-200 hidden sm:block`}
            >
              <User className={`h-5 w-5 ${user ? 'fill-current' : ''}`} strokeWidth={1.5} />
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
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-pastel-pink-dark hover:text-ink-900 transition-colors flex items-center gap-2">
                      <Settings className="w-5 h-5" /> Admin Dashboard
                    </Link>
                  )}
                  {user ? (
                    <Link to="/affiliate" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors flex items-center gap-2">
                      <Gift className="w-5 h-5 text-pastel-pink-dark" /> Affiliate Rewards
                    </Link>
                  ) : (
                    <button onClick={() => { setIsMobileMenuOpen(false); onOpenAffiliate?.(); }} className="text-lg font-medium text-ink-900 hover:text-pastel-pink-dark transition-colors flex items-center gap-2">
                      <Gift className="w-5 h-5 text-pastel-pink-dark" /> Affiliate Rewards
                    </button>
                  )}
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
