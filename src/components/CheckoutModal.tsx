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
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[100] overflow-hidden"
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
