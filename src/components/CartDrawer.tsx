import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Clock, Sparkles, Gift } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getLeadTimeLabel } from '../lib/pricingEngine';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    shippingCost,
    orderTotal,
    freeShippingRemainingAmount,
    freeShippingProgressPercent,
    isFreeShipping,
    cartLeadTime,
    openCheckout,
  } = useCart();
  const { formatPrice, currency } = useCurrency();

  // Progress bar milestone markers
  const milestones = [25, 50, 75, 100];

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
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white/70 backdrop-blur-2xl border-l border-white/40 z-[101] shadow-2xl flex flex-col"
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
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-pastel-pink-dark font-semibold">
                              {formatPrice(item.price)}
                            </p>
                            {/* Lead time badge for dropship items */}
                            {item.supplierId && item.supplierId !== 'local' && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-ink-400" />
                                <p className="text-[10px] text-ink-400 font-medium">
                                  {getLeadTimeLabel(item.supplierId)}
                                </p>
                              </div>
                            )}
                            {/* Bundle indicator */}
                            {item.bundleId && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Gift className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] text-emerald-600 font-medium">
                                  Bundle Item
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id as string)}
                          className="text-ink-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-ink-200 rounded-full bg-white">
                          <button
                            onClick={() => updateQuantity(item.id as string, item.quantity - 1)}
                            className="p-1.5 text-ink-500 hover:text-ink-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id as string, item.quantity + 1)}
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
              <div className="p-6 border-t border-white/40 bg-white/40 backdrop-blur-md">
                {/* ── Dynamic Free Shipping Progress Bar ── */}
                <div className="mb-5">
                  {isFreeShipping ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm"
                    >
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      >
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                      <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                        🎉 Free Shipping Unlocked!
                      </span>
                      <motion.div
                        animate={{ rotate: [0, -15, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }}
                      >
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="bg-white/60 p-4 rounded-2xl border border-white/50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-ink-400" />
                          <p className="text-xs text-ink-500">
                            Add{' '}
                            <motion.span
                              key={freeShippingRemainingAmount}
                              initial={{ scale: 1.3, color: '#be185d' }}
                              animate={{ scale: 1, color: '#1a1a2e' }}
                              className="font-bold text-ink-800"
                            >
                              {formatPrice(freeShippingRemainingAmount)}
                            </motion.span>{' '}
                            more for{' '}
                            <span className="font-semibold text-emerald-600">free shipping</span>
                          </p>
                        </div>
                        {currency === 'ZAR' && (
                          <span className="text-[9px] text-ink-400 bg-ink-50 px-1.5 py-0.5 rounded-md font-medium">
                            VAT Incl.
                          </span>
                        )}
                      </div>

                      {/* Multi-step progress bar */}
                      <div className="relative w-full h-2 bg-ink-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-pastel-pink-dark via-pink-400 to-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${freeShippingProgressPercent}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>

                      {/* Milestone markers */}
                      <div className="flex justify-between mt-1.5 px-0.5">
                        {milestones.map((pct) => (
                          <div key={pct} className="flex flex-col items-center">
                            <div
                              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                freeShippingProgressPercent >= pct
                                  ? 'bg-emerald-400'
                                  : 'bg-ink-200'
                              }`}
                            />
                            {pct === 100 && (
                              <span className="text-[8px] text-ink-400 mt-0.5 font-medium">FREE</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Order Summary ── */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-500 text-sm">Subtotal</span>
                    <span className="font-medium text-ink-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-500 text-sm">Shipping</span>
                    <span className={`font-medium ${isFreeShipping ? 'text-emerald-600' : 'text-ink-900'}`}>
                      {isFreeShipping ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-ink-100 flex justify-between items-center">
                    <span className="text-ink-500 font-medium uppercase tracking-wider text-sm">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-semibold text-ink-900">
                        {formatPrice(orderTotal)}
                      </span>
                      {currency === 'ZAR' && (
                        <p className="text-[9px] text-ink-400 mt-0.5">VAT Inclusive</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lead time notice */}
                {cartLeadTime.max > 2 && (
                  <div className="flex items-center gap-2 mb-4 py-2 px-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-700 font-medium">
                      {cartLeadTime.label}
                    </p>
                  </div>
                )}

                <button 
                  onClick={openCheckout}
                  className="w-full py-4 bg-ink-900 text-white rounded-full font-medium text-lg hover:bg-ink-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
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
