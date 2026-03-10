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
