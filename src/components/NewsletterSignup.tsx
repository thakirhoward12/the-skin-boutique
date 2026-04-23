import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-ivory-50 flex justify-center">
      <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none">
         <div className="ambient-orb w-[600px] h-[600px] top-1/2 left-[-10%] -translate-y-1/2 bg-pastel-pink/20 animate-float" style={{ animationDelay: '0s' }} />
         <div className="ambient-orb w-[500px] h-[500px] top-1/2 right-[-5%] -translate-y-1/2 bg-pastel-blue-light/10 animate-float" style={{ animationDelay: '-4s' }} />
      </div>
      
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="premium-glass rounded-[3rem] p-10 md:p-16 shadow-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-ink-900 mb-6">Join The Glow Club</h2>
          <p className="text-ink-600 font-light text-lg mb-10 max-w-xl mx-auto">
            Subscribe to our newsletter for early access to new arrivals, exclusive discounts, and expert skincare tips.
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-white/80 border border-white focus:border-pastel-pink-dark rounded-full py-4 pl-6 pr-16 text-ink-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-pink-light/50 transition-all font-light"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="absolute right-2 top-2 bottom-2 bg-ink-900 text-white rounded-full w-10 flex items-center justify-center hover:bg-ink-800 transition-colors disabled:bg-ink-400"
            >
              <AnimatePresence mode="popLayout">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-pastel-pink" />
                  </motion.div>
                ) : status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
          
          <p className="text-[10px] text-ink-400 mt-6 uppercase tracking-widest font-medium">
            No spam, just glow. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
