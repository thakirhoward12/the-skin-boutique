import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal, openCheckout } = useCart();
  const { formatPrice } = useCurrency();

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
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white/70 backdrop-blur-2xl border-l border-white/40 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-ink-900" />
                <span className="font-serif text-xl font-semibold text-ink-900">Your Cart</span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors border border-white/50 shadow-sm"
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
            {cartItems.length > 0 && (() => {
              const FREE_SHIPPING_THRESHOLD = 35; // USD
              const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
              const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
              const qualified = remaining <= 0;

              return (
                <div className="p-6 border-t border-white/40 bg-white/40 backdrop-blur-md">
                  {/* Free shipping progress */}
                  <div className="mb-4">
                    {qualified ? (
                      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                        <span className="text-emerald-600 text-xs font-semibold">🎉 Free Shipping Unlocked!</span>
                      </div>
                    ) : (
                      <div className="bg-white/60 p-3 rounded-2xl border border-white/50 shadow-sm">
                        <p className="text-xs text-ink-500 text-center mb-2">
                          Add <span className="font-semibold text-ink-800">{formatPrice(remaining)}</span> more for <span className="font-semibold text-emerald-600">free shipping</span>
                        </p>
                        <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pastel-pink-dark to-emerald-400 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-ink-500 font-medium uppercase tracking-wider text-sm">
                      Subtotal
                    </span>
                    <span className="font-serif text-2xl font-semibold text-ink-900">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 mb-6 text-center">
                    {qualified ? 'Free standard shipping applied!' : 'Shipping and taxes calculated at checkout.'}
                  </p>
                  <button 
                    onClick={openCheckout}
                    className="w-full py-4 bg-ink-900 text-white rounded-full font-medium text-lg hover:bg-ink-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Checkout
                  </button>
                </div>
              );
            })()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
