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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group"
            >
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full border border-ink-100 text-ink-900 mb-8 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-white transition-all duration-500">
                <feature.icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif text-ink-900 mb-4">{feature.name}</h3>
              <p className="text-sm text-ink-500 font-light leading-relaxed max-w-[250px] mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
