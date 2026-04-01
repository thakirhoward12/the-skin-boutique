import { Star, ShieldCheck, MessageCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    name: 'Curated Selection',
    description: 'We handpick only the most effective products from globally recognized brands.',
    icon: Star,
    accent: 'from-rose-100 to-pink-50',
    iconAccent: 'text-rose-500',
  },
  {
    name: 'Authorized Retailer',
    description: '100% authentic products sourced directly from the brands you trust.',
    icon: ShieldCheck,
    accent: 'from-sky-100 to-blue-50',
    iconAccent: 'text-sky-500',
  },
  {
    name: 'Expert Guidance',
    description: 'Our skincare specialists are here to help you build your perfect routine.',
    icon: MessageCircle,
    accent: 'from-violet-100 to-purple-50',
    iconAccent: 'text-violet-500',
  },
  {
    name: 'Premium Delivery',
    description: 'Fast, beautifully packaged shipping straight to your door.',
    icon: Package,
    accent: 'from-amber-100 to-yellow-50',
    iconAccent: 'text-amber-500',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white rounded-[2rem] p-8 text-center border border-ink-100 hover:border-ink-200 hover:shadow-xl hover:shadow-ink-100/40 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0`} />
              
              <div className="relative z-10">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-sm border border-ink-50 ${feature.iconAccent} mb-7 group-hover:scale-110 group-hover:shadow-md transition-all duration-500`}>
                  <feature.icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-serif text-ink-900 mb-3">{feature.name}</h3>
                <p className="text-sm text-ink-500 font-light leading-relaxed max-w-[250px] mx-auto">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
