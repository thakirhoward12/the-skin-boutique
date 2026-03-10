import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Banner() {
  return (
    <section id="journal" className="relative bg-ink-900 py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Spa and skincare"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-[10px] font-medium text-pastel-pink tracking-[0.3em] uppercase mb-8">
            The Inner Circle
          </h2>
          <p className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-8">
            Elevate your <br className="hidden sm:block" />
            <span className="italic font-light text-pastel-pink">daily ritual.</span>
          </p>
          <p className="text-lg text-white/70 font-light mb-12 max-w-xl mx-auto">
            Join our community and receive 15% off your first order, plus exclusive access to new brand launches and expert skincare advice.
          </p>
          
          <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-pastel-pink rounded-full transition-colors"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="flex-shrink-0 flex items-center justify-center px-8 py-4 border border-pastel-pink text-ink-900 bg-pastel-pink hover:bg-white hover:border-white rounded-full transition-all duration-300 font-medium tracking-wide uppercase text-xs"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
