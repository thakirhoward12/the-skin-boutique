import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { type Product } from '../data/products';

export default function HomepageReviews({
  products,
  onOpenProduct
}: {
  products: Product[];
  onOpenProduct: (product: Product) => void;
}) {
  const allReviews = useMemo(() => {
    const reviews: Array<{ text: string, user: string, rating: number, product: Product }> = [];
    products.forEach(p => {
      if (p.reviews && p.reviews.length > 0) {
        p.reviews.forEach(r => {
          if (r.rating === 5) {
            reviews.push({ ...r, product: p });
          }
        });
      }
    });
    // Return a random set of 6 best reviews
    return reviews.sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [products]);

  if (allReviews.length === 0) return null;

  return (
    <section className="py-24 bg-ink-900 text-white relative flex justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-serif sm:text-4xl mb-6">Loved by Skincare Enthusiasts</h2>
          <p className="text-ink-200 font-light text-lg">Real results from our community of K-Beauty lovers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {allReviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => onOpenProduct(review.product)}
            >
              <div>
                <Quote className="w-8 h-8 text-pastel-pink-dark/50 mb-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-pastel-pink-dark text-pastel-pink-dark" />
                  ))}
                </div>
                <p className="text-white/90 font-light italic mb-8 leading-relaxed">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                <div>
                  <p className="font-medium text-sm text-white mb-1">{review.user}</p>
                  <p className="text-xs text-ink-300">Verified Buyer</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-pastel-pink uppercase tracking-wider mb-1">{review.product.brand}</p>
                    <p className="text-xs text-white max-w-[120px] truncate">{review.product.name}</p>
                  </div>
                  <img src={review.product.image} alt={review.product.name} className="w-10 h-10 rounded-full object-cover border border-white/20 ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
