import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReferralCode?: string;
}

export default function AuthModal({ isOpen, onClose, initialReferralCode }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');

  useEffect(() => {
    if (!initialReferralCode) {
      const savedCode = localStorage.getItem('referralCode');
      if (savedCode) setReferralCode(savedCode);
    }
  }, [initialReferralCode]);
  
  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Sanitization & Validation Guards
    if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address (under 100 characters).");
      return;
    }
    if (password.length > 100) {
      setError("Password exceeds maximum allowed length.");
      return;
    }
    
    // Clean and validate referral to alphanumeric hyphens, max 50 chars
    const cleanReferral = referralCode.trim().replace(/[^a-zA-Z0-9-]/g, '').slice(0, 50);

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, cleanReferral || undefined);
        localStorage.removeItem('referralCode'); // Clear after use
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

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl overflow-hidden z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-white/80 rounded-full hover:bg-white transition-colors border border-white/40 shadow-sm"
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

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="block text-xs font-medium text-ink-700 uppercase tracking-wider mb-2">
                      Referral Code (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserPlus className="h-5 w-5 text-ink-400" />
                      </div>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-ink-50 border border-transparent rounded-xl text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark focus:bg-white transition-all text-sm mb-4"
                        placeholder="ENTER-CODE"
                      />
                    </div>
                  </motion.div>
                )}

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

              <div className="mt-6 flex items-center">
                <div className="flex-1 border-t border-ink-100"></div>
                <span className="px-4 text-xs font-medium text-ink-400 uppercase tracking-widest bg-white">OR</span>
                <div className="flex-1 border-t border-ink-100"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-ink-200 text-ink-700 py-3.5 rounded-full hover:bg-ink-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Continue with Google
              </button>

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
