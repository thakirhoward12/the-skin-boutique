import { motion } from 'motion/react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[12rem] font-serif font-bold text-ink-900/5 leading-none select-none"
          >
            404
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-pastel-pink rounded-full blur-3xl opacity-60 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-ink-900 stroke-[1]" />
          </div>
        </div>

        <h1 className="text-3xl font-serif text-ink-900 mb-4">Purely Lost?</h1>
        <p className="text-ink-500 font-light mb-10 leading-relaxed">
          The page you're searching for seems to have vanished into thin air. Let's get your skincare journey back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-ink-900 text-white px-8 py-4 rounded-full font-medium hover:bg-ink-800 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Back to Shop
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-ink-200 text-ink-700 px-8 py-4 rounded-full font-medium hover:bg-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-ink-100 italic text-ink-400 text-sm font-serif">
          "Beauty is being comfortable in your own skin, even when you're a little lost."
        </div>
      </motion.div>
    </div>
  );
}
