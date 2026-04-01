import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Wallet, CheckCircle2, ShieldCheck, Lock, Mail, Gift, ExternalLink } from 'lucide-react';
import { useCurrency, exchangeRates } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useUser } from '../contexts/UserContext';
import { PaymentService, type PaymentMethod } from '../lib/payment';
import Celebration from './Celebration';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking: () => void;
}

type CheckoutStep = 'shipping' | 'summary' | 'yoco-waiting' | 'processing' | 'success';

interface ShippingAddressState {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutModal({ isOpen, onClose, onOpenTracking }: CheckoutModalProps) {
  const { formatPrice } = useCurrency();
  const { cartCount, cartTotal, cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { profile, updateWallet, markDiscountUsed } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(profile && profile.walletBalance >= 1 ? 'wallet' : 'yoco');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('shipping');
  const [yocoCheckoutId, setYocoCheckoutId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressState>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'South Africa'
  });
  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Referral discount logic
  const subtotal = cartTotal;
  const shipping = cartCount > 0 ? 5.99 : 0;
  const isEligibleForReferralDiscount = profile?.referredBy && !profile?.hasUsedReferralDiscount;
  const referralDiscountAmount = isEligibleForReferralDiscount ? subtotal * 0.1 : 0;
  const total = subtotal - referralDiscountAmount + shipping;

  // Poll for popup window completion
  useEffect(() => {
    if (checkoutStep === 'yoco-waiting' && popupRef.current) {
      pollIntervalRef.current = setInterval(() => {
        try {
          const popup = popupRef.current;
          if (!popup || popup.closed) {
            // Popup was closed - check if it was a success by looking at localStorage
            clearInterval(pollIntervalRef.current!);
            pollIntervalRef.current = null;
            
            // Check if payment completed (we'll set a flag in localStorage via success URL)
            const paymentResult = localStorage.getItem('yocoPaymentResult');
            if (paymentResult === 'success') {
              localStorage.removeItem('yocoPaymentResult');
              handlePaymentSuccess();
            } else {
              // User closed the popup without completing
              setCheckoutStep('summary');
            }
            return;
          }

          // Try to read the popup URL to detect redirects
          try {
            const popupUrl = popup.location.href;
            if (popupUrl.includes('payment=success')) {
              popup.close();
              clearInterval(pollIntervalRef.current!);
              pollIntervalRef.current = null;
              handlePaymentSuccess();
            } else if (popupUrl.includes('payment=cancelled') || popupUrl.includes('payment=failed')) {
              popup.close();
              clearInterval(pollIntervalRef.current!);
              pollIntervalRef.current = null;
              if (popupUrl.includes('payment=failed')) {
                alert('Payment failed. Please try again.');
              }
              setCheckoutStep('summary');
            }
          } catch (e) {
            // Cross-origin - expected when on Yoco's domain, keep polling
          }
        } catch (e) {
          // Popup reference lost
        }
      }, 500);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [checkoutStep]);

  const handlePaymentSuccess = async () => {
    setCheckoutStep('processing');
    
    const orderData = {
      items: cartItems,
      subtotal,
      shipping,
      total,
      status: 'paid' as const,
      paymentMethod: 'yoco' as any,
      customerEmail: profile?.email || 'guest@example.com',
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      shippingAddress,
      paymentReference: `YOCO-${yocoCheckoutId || Date.now()}`,
    };

    try {
      if (isEligibleForReferralDiscount) {
        await markDiscountUsed();
      }
      await createOrder(orderData);
      clearCart();
      setCheckoutStep('success');
    } catch (error) {
      console.error('Order creation failed:', error);
      clearCart();
      setCheckoutStep('success');
    }
  };



  const handleCheckout = async () => {
    const orderData = {
      items: cartItems,
      subtotal,
      shipping,
      total,
      status: 'pending' as const,
      paymentMethod: paymentMethod as any,
      customerEmail: profile?.email || 'guest@example.com',
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      shippingAddress,
    };

    if (paymentMethod === 'paypal') {
      return;
    }

    if ((paymentMethod as any) === 'wallet') {
      setCheckoutStep('processing');
      const zarRate = exchangeRates.ZAR;
      const totalInZar = total * zarRate;
      
      if (!profile || profile.walletBalance < totalInZar) {
        alert('Insufficient wallet balance.');
        setCheckoutStep('summary');
        return;
      }

      try {
        await updateWallet(-totalInZar);
        if (isEligibleForReferralDiscount) {
          await markDiscountUsed();
        }
        await createOrder({ ...orderData, total, status: 'paid', paymentReference: 'WALLET-' + Date.now() });
        clearCart();
        setCheckoutStep('success');
      } catch (error) {
        console.error('Wallet payment failed:', error);
        setCheckoutStep('summary');
      }
    } else if (paymentMethod === 'yoco') {
      // CRITICAL: Open the popup SYNCHRONOUSLY before any await,
      // otherwise browsers block it as it's no longer a direct user gesture.
      const width = 480;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        'about:blank',
        'YocoPayment',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes`
      );

      if (!popup) {
        alert('Your browser blocked the payment window. Please allow popups for this site and try again.');
        return;
      }

      // Show a loading message in the popup while we fetch the URL
      popup.document.write(`
        <html><head><title>Loading Payment...</title>
        <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fdf4f7;}
        .spinner{width:40px;height:40px;border:4px solid #f0c4d4;border-top:4px solid #c97a9a;border-radius:50%;animation:spin 1s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}</style></head>
        <body><div style="text-align:center"><div class="spinner" style="margin:0 auto 16px"></div><p style="color:#6b4c5e">Connecting to secure payment...</p></div></body></html>
      `);

      popupRef.current = popup;
      setCheckoutStep('processing');

      try {
        const zarRate = exchangeRates.ZAR;
        const amountInCents = Math.round(total * zarRate * 100);

        const session = await PaymentService.createYocoSession({
          amountInCents,
          email: orderData.customerEmail,
          customerName: profile?.displayName || undefined,
        });

        setYocoCheckoutId(session.id);

        // Now navigate the already-open popup to the Yoco URL
        popup.location.href = session.redirectUrl;
        popup.focus();
        setCheckoutStep('yoco-waiting');
      } catch (error) {
        console.error('Yoco session creation failed:', error);
        popup.close();
        alert('Could not connect to payment provider. Please try again.');
        setCheckoutStep('summary');
      }
    }
  };

  useEffect(() => {
    if (paymentMethod === 'paypal' && checkoutStep === 'summary') {
      const orderData = {
        items: cartItems,
        subtotal,
        shipping,
        total,
        status: 'pending' as const,
        paymentMethod: paymentMethod as any,
        customerEmail: profile?.email || 'guest@example.com',
      };

      PaymentService.renderPayPalButtons('paypal-button-container', {
        email: orderData.customerEmail,
        amount: total,
        amountInCents: 0,
        customerName: profile?.displayName || undefined,
        onSuccess: async (reference: string) => {
          try {
            if (isEligibleForReferralDiscount) {
              await markDiscountUsed();
            }
            await createOrder({ ...orderData, total, status: 'paid', paymentReference: reference });
            clearCart();
            setCheckoutStep('success');
          } catch (error) {
            console.error('Order creation failed:', error);
            setCheckoutStep('summary');
          }
        },
        onCancel: () => setCheckoutStep('summary'),
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setCheckoutStep('summary');
          alert('PayPal Payment failed. Please try again.');
        }
      });
    }
  }, [paymentMethod, checkoutStep, total, cartItems, profile, isEligibleForReferralDiscount]);

  const handleClose = () => {
    if (checkoutStep === 'yoco-waiting') {
      if (!confirm('A payment window is open. Are you sure you want to cancel?')) return;
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    }
    setCheckoutStep('summary');
    setYocoCheckoutId(null);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    onClose();
  };

  const handleTrackOrder = () => {
    setCheckoutStep('summary');
    onClose();
    onOpenTracking();
  };

  const handleReopenPopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[100] overflow-y-auto"
          >
            {checkoutStep === 'success' && <Celebration />}
            
            {/* SUCCESS STATE */}
            {checkoutStep === 'success' ? (
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

            /* WAITING FOR YOCO POPUP STATE */
            ) : checkoutStep === 'yoco-waiting' ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-full bg-pastel-pink/30 flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-pastel-pink-dark" />
                  </div>
                </motion.div>
                
                <h2 className="text-xl font-serif font-semibold text-ink-900 mb-2">
                  Complete Your Payment
                </h2>
                <p className="text-ink-500 text-sm mb-6 max-w-xs">
                  A secure payment window has opened. Please enter your card details there to complete your purchase.
                </p>

                {/* Amount reminder */}
                <div className="bg-ink-50 rounded-xl px-6 py-3 mb-6 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink-600">Total Amount</span>
                    <span className="text-xl font-bold text-ink-900">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleReopenPopup}
                  className="w-full bg-pastel-pink-dark text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  Bring Payment Window to Front
                </button>

                <button
                  onClick={() => {
                    if (popupRef.current && !popupRef.current.closed) {
                      popupRef.current.close();
                    }
                    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                    setCheckoutStep('summary');
                  }}
                  className="w-full text-ink-400 py-2 text-sm font-medium hover:text-ink-600 transition-colors"
                >
                  Cancel Payment
                </button>

                {/* Security badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px]">Protected by Yoco's PCI-DSS Level 1 security</span>
                </div>

                {/* Pulsing indicator */}
                <div className="mt-4 flex items-center gap-2 text-ink-400 text-xs">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-amber-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  Waiting for payment completion...
                </div>
              </div>

            /* PROCESSING STATE */
            ) : checkoutStep === 'processing' ? (
              <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mb-6 relative"
                >
                  <div className="relative">
                    <ShieldCheck className="w-20 h-20 text-pastel-pink-dark" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-pastel-pink-dark rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  </div>
                </motion.div>
                <h2 className="text-xl font-serif font-semibold text-ink-900 mb-2">
                  Processing Payment...
                </h2>
                <p className="text-ink-500 text-sm">
                  Please wait while we confirm your payment.
                </p>
              </div>

            /* SHIPPING ADDRESS STATE */
            ) : checkoutStep === 'shipping' ? (
              <>
                <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/20">
                  <h2 className="text-xl font-serif font-semibold text-ink-900">Shipping Details</h2>
                  <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-ink-500" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">First Name</label>
                      <input
                        type="text"
                        placeholder="Jane"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">Address Line 1</label>
                    <input
                      type="text"
                      placeholder="123 Beauty Lane"
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                      className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      placeholder="Suite 4B"
                      value={shippingAddress.address2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                      className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">City</label>
                      <input
                        type="text"
                        placeholder="Cape Town"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">State / Province</label>
                      <input
                        type="text"
                        placeholder="Western Cape"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">Zip / Postal Code</label>
                      <input
                        type="text"
                        placeholder="8001"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest ml-1">Country</label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full bg-ink-50 border-none rounded-xl px-4 py-3 text-ink-900 focus:ring-2 focus:ring-pastel-pink-dark/20 transition-all outline-none appearance-none"
                      >
                        <option value="South Africa">South Africa</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const { firstName, lastName, address1, city, zipCode } = shippingAddress;
                      
                      // Guard against overflow and basic XSS tags
                      const sanitize = (str: string) => str.trim().replace(/[<>]/g, '').slice(0, 100);
                      
                      const safeFirst = sanitize(firstName);
                      const safeLast = sanitize(lastName);
                      const safeAdd1 = sanitize(address1);
                      const safeCity = sanitize(city);
                      const safeZip = sanitize(zipCode).slice(0, 20);

                      if (!safeFirst || !safeLast || !safeAdd1 || !safeCity || !safeZip) {
                        alert('Please fill in all required fields properly.');
                        return;
                      }
                      
                      setShippingAddress({
                         ...shippingAddress,
                         firstName: safeFirst,
                         lastName: safeLast,
                         address1: safeAdd1,
                         city: safeCity,
                         zipCode: safeZip,
                         address2: sanitize(shippingAddress.address2 || ''),
                         state: sanitize(shippingAddress.state || '')
                      });

                      setCheckoutStep('summary');
                    }}
                    className="w-full bg-ink-900 text-white py-4 rounded-xl font-medium hover:bg-ink-800 transition-colors mt-4 flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>

            /* ORDER SUMMARY STATE (default) */
            ) : (
              <>
                <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-pink/20">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCheckoutStep('shipping')}
                      className="p-1 hover:bg-white/50 rounded-full transition-colors text-ink-400 hover:text-ink-900"
                      title="Back to shipping"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h2 className="text-xl font-serif font-semibold text-ink-900">Checkout</h2>
                  </div>
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
                      {/* Shipping Preview */}
                      <div className="bg-pastel-pink/5 rounded-2xl p-4 border border-pastel-pink/20 flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-bold text-pastel-pink-dark uppercase tracking-widest">Shipping To</h3>
                          <p className="text-sm font-medium text-ink-900">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                          <p className="text-[10px] text-ink-500 line-clamp-1">{shippingAddress.address1}, {shippingAddress.city}</p>
                        </div>
                        <button 
                          onClick={() => setCheckoutStep('shipping')}
                          className="text-[10px] font-bold text-pastel-pink-dark uppercase tracking-widest hover:underline"
                        >
                          Edit
                        </button>
                      </div>

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
                        {isEligibleForReferralDiscount && (
                          <div className="mt-2 p-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 uppercase tracking-wider">
                            <Gift className="w-3 h-3" /> 10% Referral Discount Applied
                          </div>
                        )}
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider mb-3">Payment Method</h3>
                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'yoco' ? 'border-pastel-pink-dark bg-pastel-pink/10' : 'border-ink-200 hover:border-pastel-pink-dark/50'}`}>
                            <input 
                              type="radio" 
                              name="payment" 
                              value="yoco" 
                              checked={paymentMethod === 'yoco'}
                              onChange={() => setPaymentMethod('yoco')}
                              className="sr-only"
                            />
                            <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'yoco' ? 'text-pastel-pink-dark' : 'text-ink-400'}`} />
                            <div className="flex flex-col">
                              <span className={`font-medium ${paymentMethod === 'yoco' ? 'text-ink-900' : 'text-ink-700'}`}>Secure Card Payment</span>
                              <span className="text-[10px] text-ink-400">Powered by Yoco</span>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'yoco' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'yoco' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
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
                            <div className="flex flex-col">
                              <span className={`font-medium ${paymentMethod === 'paypal' ? 'text-ink-900' : 'text-ink-700'}`}>PayPal</span>
                              <span className="text-[10px] text-ink-400">Globally Trusted</span>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-pastel-pink-dark' : 'border-ink-300'}`}>
                              {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-pastel-pink-dark" />}
                            </div>
                          </label>

                          {profile && (
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50' : 'border-ink-200 hover:border-emerald-500/50'}`}>
                              <input 
                                type="radio" 
                                name="payment" 
                                value="wallet" 
                                checked={paymentMethod === 'wallet'}
                                onChange={() => setPaymentMethod('wallet' as any)}
                                className="sr-only"
                              />
                              <Gift className={`w-5 h-5 mr-3 ${paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-ink-400'}`} />
                              <div className="flex flex-col">
                                <span className={`font-medium ${paymentMethod === 'wallet' ? 'text-ink-900' : 'text-ink-700'}`}>Pay with Boutique Wallet</span>
                                <span className="text-[10px] text-ink-400">Balance: R{profile.walletBalance.toFixed(2)}</span>
                              </div>
                              <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-emerald-500' : 'border-ink-300'}`}>
                                {paymentMethod === 'wallet' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Payment Note */}
                      <div className="bg-emerald-50/50 p-4 rounded-xl flex items-start gap-3 border border-emerald-100">
                        <Lock className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <p className="text-[10px] text-emerald-800 leading-relaxed">
                          Securely process your payment via our encrypted partner gateway. Your card details are never stored on our servers.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {paymentMethod === 'paypal' ? (
                          <div id="paypal-button-container" className="mt-4 min-h-[150px]"></div>
                        ) : (
                          <button
                            onClick={handleCheckout}
                            disabled={checkoutStep !== 'summary'}
                            className="w-full bg-ink-900 text-white py-4 rounded-xl font-medium hover:bg-ink-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            <Lock className="w-4 h-4 mr-2 opacity-70" />
                            Pay {formatPrice(total)} {(paymentMethod as any) === 'wallet' ? 'from wallet' : 'securely'}
                          </button>
                        )}
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
