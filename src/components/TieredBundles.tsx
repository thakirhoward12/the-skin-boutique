import React from 'react';
import { motion } from 'motion/react';
import { Package, Sparkles, ArrowRight, ShieldCheck, Zap, Droplets, Sun } from 'lucide-react';

interface TieredBundlesProps {
  onOpenBuilder: (tierIndex: number) => void;
}

export default function TieredBundles({ onOpenBuilder }: TieredBundlesProps) {
  const tiers = [
    {
      name: "The Starter",
      tagline: "Your skincare baseline",
      items: ["Cleanser", "Moisturizer"],
      icon: Droplets,
      discount: "10% OFF",
      gradient: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-500",
    },
    {
      name: "The Essential",
      tagline: "Complete daytime protection",
      items: ["Cleanser", "Moisturizer", "SPF"],
      icon: Sun,
      discount: "15% OFF",
      gradient: "from-amber-50 to-orange-50",
      iconColor: "text-amber-500",
    },
    {
      name: "The Advanced",
      tagline: "Targeted active treatment",
      items: ["Cleanser", "Serum", "Moisturizer", "SPF"],
      icon: Zap,
      discount: "20% OFF",
      gradient: "from-purple-50 to-fuchsia-50",
      iconColor: "text-purple-500",
      featured: true,
    },
    {
      name: "The Ritual",
      tagline: "The ultimate skin transformation",
      items: ["Cleanser", "Toner", "Serum", "Moisturizer", "SPF"],
      icon: ShieldCheck,
      discount: "25% OFF",
      gradient: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-500",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-pastel-pink/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Package className="w-8 h-8 text-pastel-pink-dark stroke-[1.5]" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-ink-900 mb-6"
          >
            Curate Your Bundle
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink-500 font-light"
          >
            Unlock progressively larger discounts by building your perfect bundle. Choose from our baseline sets below or build from scratch.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onOpenBuilder(index)}
                className={`group cursor-pointer relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  tier.featured 
                    ? 'border-pastel-pink-dark bg-white shadow-lg ring-2 ring-transparent hover:ring-pastel-pink-dark/50' 
                    : 'border-ink-100 bg-white hover:border-ink-300'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pastel-pink-dark text-white px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${tier.iconColor} stroke-[1.5]`} />
                </div>
                
                <h3 className="text-2xl font-serif text-ink-900 mb-1">{tier.name}</h3>
                <p className="text-sm text-ink-500 font-light mb-6">{tier.tagline}</p>
                
                <div className="mb-8">
                  <div className="inline-block px-3 py-1 bg-ink-900 text-white text-sm font-bold rounded-lg mb-4">
                    {tier.discount}
                  </div>
                  <ul className="space-y-3">
                    {tier.items.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-ink-700">
                        <ArrowRight className="w-4 h-4 text-pastel-pink-dark mr-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto pt-6 border-t border-ink-100">
                  <div
                    className={`w-full py-4 rounded-full text-xs font-medium tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${
                      tier.featured
                        ? 'bg-ink-900 text-white group-hover:bg-ink-800'
                        : 'bg-ink-50 text-ink-900 group-hover:bg-ink-200'
                    }`}
                  >
                    Select Bundle
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
