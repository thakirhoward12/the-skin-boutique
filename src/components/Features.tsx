import { Star, ShieldCheck, MessageCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    name: 'Curated Selection',
    description: 'We handpick only the most effective products from globally recognized brands.',
    icon: Star,
  },
  {
    name: 'Authorized Retailer',
    description: '100% authentic products sourced directly from the brands you trust.',
    icon: ShieldCheck,
  },
  {
    name: 'Expert Guidance',
    description: 'Our skincare specialists are here to help you build your perfect routine.',
    icon: MessageCircle,
  },
  {
    name: 'Premium Delivery',
    description: 'Fast, beautifully packaged shipping straight to your door.',
    icon: Package,
  },
];

export default function Features() {
  return (
    <section id="about" className="py-32 bg-white transition-colors duration-1000 border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-[10px] font-medium text-ink-500 tracking-[0.2em] uppercase mb-4">The Boutique Experience</h2>
          <p className="text-4xl sm:text-5xl font-serif text-ink-900 font-light leading-tight">
            Why shop your favorite brands with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            // Asymmetrical Bento Layout
            const bentoClasses = 
              index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-1 min-h-[300px]" :
              index === 1 ? "md:col-span-1 lg:col-span-1 lg:row-span-2 min-h-[300px]" :
              "md:col-span-1 lg:col-span-1 lg:row-span-1 min-h-[250px]";

            return (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: -10,
                  rotateX: 2,
                  rotateY: -2,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative liquid-glass rounded-[2rem] p-8 transition-all duration-500 flex flex-col justify-center ${
                  index === 0 ? "md:flex-row md:text-left items-center md:items-start gap-8" : "text-center items-center"
                } ${bentoClasses}`}
              >
                <div className={`relative z-10 flex flex-col ${index === 0 ? 'md:flex-row gap-8 items-center md:items-start' : 'items-center'}`}>
                  <div className={`flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-2xl bg-white shadow-sm border border-ink-50 text-ink-900 group-hover:scale-110 group-hover:shadow-md transition-all duration-500 ${index !== 0 ? 'mb-7' : ''}`}>
                    <feature.icon className="h-8 w-8 stroke-[1.2]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className={`font-serif text-ink-900 mb-4 ${index === 0 || index === 1 ? 'text-2xl' : 'text-xl'}`}>{feature.name}</h3>
                    <p className={`text-ink-500 font-light leading-relaxed ${index === 0 ? 'text-base max-w-md' : 'text-sm max-w-[250px]'}`}>
                      {feature.description}
                    </p>
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
