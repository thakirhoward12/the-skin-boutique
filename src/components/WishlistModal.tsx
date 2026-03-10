import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';

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
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  const favoriteProducts = products.filter(product => favorites.has(product.id));
  const [quantities, setQuantities] = useState<Record<number, number>>({});

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
