import { Sparkles } from 'lucide-react';

export default function MarqueeBanner() {
  const text = "GLOWING SKIN IS ALWAYS IN • CRUELTY FREE • VEGAN • DERMATOLOGIST TESTED • ";
  
  return (
    <div className="bg-pastel-pink text-ink-900 py-8 overflow-hidden relative flex items-center border-y border-ink-100">
      <div className="flex whitespace-nowrap animate-neon-marquee w-max items-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center mx-4">
            <span className="font-sans text-3xl md:text-5xl font-light tracking-widest uppercase text-ink-900">
              {text}
            </span>
            <Sparkles className="w-8 h-8 mx-8 text-ink-900 stroke-[1.5]" />
          </div>
        ))}
      </div>
    </div>
  );
}
