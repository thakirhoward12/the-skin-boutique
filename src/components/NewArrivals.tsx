import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { type Product } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';

export default function NewArrivals({
  products,
  favorites,
  toggleFavorite,
  onOpenProduct
}: {
  products: Product[];
  favorites: Set<string>;
  toggleFavorite: (e: React.MouseEvent, id: string) => void;
  onOpenProduct: (product: Product) => void;
}) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  
  // Sort products by ID descending to get newest first
  const newProducts = [...products].sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 10);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    
    const priceNumber = product.options && product.options.length > 0 
      ? product.options[0].price 
      : product.price;
    
    addToCart({
       id: product.options && product.options.length > 0 ? `${product.id}-0` : product.id,
       title: product.options && product.options.length > 0 ? `${product.name} - ${product.options[0].size}` : product.name,
       price: priceNumber,
       image: product.image,
       quantity: 1
    });
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-vibrant-gradient">Curated New Arrivals</h2>
            <p className="text-ink-500 font-light text-xl max-w-2xl italic">The latest additions to our museum of K-Beauty excellence, curated for the discerning enthusiast.</p>
          </motion.div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {newProducts.map((product, index) => (
            <motion.div
              key={`new-${product.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1 
              }}
              className="flex-none w-72 sm:w-85 snap-start group"
              onClick={() => onOpenProduct(product)}
            >
              <div className="glass-card rounded-[2.5rem] p-4 h-full relative cursor-pointer group-hover:border-emerald/30 group-hover:bg-white/95 duration-700">
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-ink-50/50 mb-6">
                  <img
                    src={product.image}
                    alt={`${product.brand} - ${product.name}`}
                    className="object-cover object-center w-full h-full transition-transform duration-1000 group-hover:scale-110 mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Effect Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-ink-900 text-white text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                      Edition № {index + 1}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleFavorite(e, product.id);
                    }}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/70 backdrop-blur-md hover:bg-white transition-all z-10 shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 duration-300"
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-ruby text-ruby' : 'text-ink-900'}`} />
                  </button>
                  
                  {/* Dynamic Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="btn-shop w-full py-4 rounded-full text-ink-900 shadow-2xl flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
                
                <div className="px-2 pb-4 space-y-2 flex flex-col items-center text-center">
                  <p className="text-[10px] text-emerald font-bold tracking-[0.3em] uppercase opacity-70 mb-1">{product.brand}</p>
                  <h3 className="text-xl font-serif text-ink-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="pt-2 border-t border-ink-100 w-12 mx-auto my-2 opacity-30"></div>
                  <p className="text-lg font-serif italic text-ink-700">{formatPrice(product.price)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
