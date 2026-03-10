import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-[95vh] flex items-center bg-ink-900">
      {/* Grainy Image Underlay */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-[120%] object-cover absolute top-[-10%] object-top opacity-60"
          src="https://images.unsplash.com/photo-1615397323731-9e19519129e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Skincare background"
          referrerPolicy="no-referrer"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900/90 mix-blend-multiply"></div>
        {/* Grainy Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
          }}
        ></div>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-end h-full mt-20">
        <div className="w-full flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <span className="font-sans text-xs tracking-[0.3em] text-pastel-pink uppercase font-medium border border-pastel-pink/30 px-6 py-2 rounded-full backdrop-blur-sm">
              Curated Korean Skincare
            </span>
          </motion.div>

          <div className="relative z-10 w-full overflow-hidden">
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] tracking-tighter font-serif text-pastel-pink leading-[0.85] font-light"
            >
              <span className="block italic pr-8">Glass Skin</span>
              <span className="block pl-12 sm:pl-24">Redefined.</span>
            </motion.h1>
          </div>
          
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-8 border-t border-pastel-pink/20 pt-8">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-base sm:text-lg text-pastel-pink/80 font-light max-w-md text-left"
            >
              Discover our expertly curated selection of the world's most sought-after K-Beauty brands, designed to give you a flawless, radiant complexion.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-4"
            >
              <a
                href="#products"
                className="group relative flex items-center justify-center w-32 h-32 rounded-full border border-pastel-pink/30 text-pastel-pink hover:bg-pastel-pink hover:text-ink-900 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 font-sans text-xs uppercase tracking-widest font-medium group-hover:-translate-y-1 transition-transform duration-300">Shop Now</span>
                <div className="absolute inset-0 bg-pastel-pink scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out origin-center"></div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
