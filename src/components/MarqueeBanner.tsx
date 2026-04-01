import { Sparkles } from 'lucide-react';

export default function MarqueeBanner() {
  const text = "GLOWING SKIN IS ALWAYS IN • CRUELTY FREE • VEGAN • DERMATOLOGIST TESTED • ";
  
  return (
    <div className="relative bg-pastel-pink text-ink-900 py-8 overflow-hidden flex items-center border-y border-ink-100">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-pastel-pink to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-pastel-pink to-transparent z-10 pointer-events-none" />
      
      <div className="flex whitespace-nowrap animate-neon-marquee w-max items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center mx-4">
            <span className="font-sans text-3xl md:text-5xl font-extralight tracking-[0.15em] uppercase text-ink-900/80">
              {text}
            </span>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 mx-6 md:mx-8 text-pastel-pink-dark stroke-[1.5]" />
          </div>
        ))}
      </div>
    </div>
  );
}
