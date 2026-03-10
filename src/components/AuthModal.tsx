import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      // After successful login/signup, close modal and reset form
      onClose();
      setEmail('');
      setPassword('');
      setIsLogin(true);
    } catch (err: any) {
      console.error(err);
      // Format Firebase errors gracefully
      let errorMsg = "An error occurred. Please try again.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = "Invalid email or password.";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = "An account with this email already exists.";
      } else if (err.code === 'auth/weak-password') {
        errorMsg = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = "Please enter a valid email address.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-ink-50 rounded-full hover:bg-ink-100 transition-colors"
            >
              <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pastel-pink/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  {isLogin ? (
                    <LogIn className="w-8 h-8 text-pastel-pink-dark stroke-[1.5]" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-pastel-pink-dark stroke-[1.5]" />
                  )}
                </div>
                <h2 className="text-3xl font-serif text-ink-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-ink-500 font-light text-sm">
                  {isLogin 
                    ? 'Sign in to access your wishlist and exclusive offers.' 
                    : 'Join us to save your favorite products and personalized routine.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-ink-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-ink-50 border border-transparent rounded-xl text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark focus:bg-white transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-ink-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-ink-50 border border-transparent rounded-xl text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark focus:bg-white transition-all text-sm"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink-900 text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading 
                    ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                    : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-ink-100 pt-6">
                <p className="text-ink-500 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={toggleMode}
                    className="ml-2 text-pastel-pink-dark font-medium hover:underline focus:outline-none tracking-wide"
                  >
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
