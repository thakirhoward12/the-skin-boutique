import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setStatus('idle');
    setErrorMessage('');
  };

  const handleClose = () => {
    onClose();
    // Delay resetting the form until the exit animation finishes
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const templateParams = {
        name: name,
        email: email,
        subject: subject,
        message: message,
      };

      // Ensure the user has these set in their environment, or we can use the provided service ID directly for now if they haven't set up the env vars yet.
      // Since the user provided the service ID, we'll use it directly to ensure it works out of the box.
      // They will still need the template ID and public key.
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_o9s7cff';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_0fyeemq';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rG3Wzpb0Ao6pyVppu';

      if (templateId === 'template_id_here' || publicKey === 'public_key_here') {
        throw new Error('EmailJS Template ID and Public Key are missing. Please configure them in your .env file or update the component.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setStatus('success');
      // Automatically close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      // If the error comes from EmailJS, it usually has a text property
      setErrorMessage(error?.text || error.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-md"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-ink-500 hover:text-ink-900 transition-colors z-10 bg-white/50 rounded-full hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-ink-900 mb-2">Contact Us</h2>
                <p className="text-ink-500 font-light text-sm">
                  Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-ink-900 mb-2">Message Sent</h3>
                  <p className="text-ink-500 font-light">
                    Thank you for reaching out, {name}. We will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 focus:border-pastel-pink transition-all font-light"
                        placeholder="Jane Doe"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 focus:border-pastel-pink transition-all font-light"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 focus:border-pastel-pink transition-all font-light appearance-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Returns & Exchanges">Returns & Exchanges</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/50 border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 focus:border-pastel-pink transition-all font-light resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 text-red-500 bg-red-50/50 p-3 rounded-lg text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-ink-900 text-white py-4 rounded-xl hover:bg-ink-800 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-light tracking-wide">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-light tracking-wide uppercase text-sm">Send Message</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
