import { Facebook, Instagram, Twitter, ArrowRight, Droplet } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface FooterProps {
  onOpenAffiliate?: () => void;
}

export default function Footer({ onOpenAffiliate }: FooterProps) {
  return (
    <footer className="bg-ink-900 text-white pt-24 pb-12 transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 pb-24 border-b border-white/10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Join The Inner Circle</h2>
            <p className="text-white/60 font-light text-sm max-w-md">
              Subscribe to receive exclusive access to new launches, expert skincare advice, and private sales.
            </p>
          </div>
          <div className="flex items-center">
            <form className="w-full max-w-md flex relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-transparent border-b border-white/30 pb-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-white/40"
              />
              <button type="submit" className="absolute right-0 bottom-3 text-white hover:text-pastel-pink transition-colors">
                <ArrowRight className="w-5 h-5 stroke-[1.5]" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <Droplet className="w-6 h-6 text-pastel-pink" />
              <span className="font-serif text-3xl font-light tracking-tight text-white block">
                The Skin Boutique
              </span>
            </div>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-8 max-w-xs">
              Your premier destination for the world's most coveted skincare brands. Expertly curated for the modern beauty enthusiast.
            </p>
            <div className="flex space-x-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5 stroke-[1.5]" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Shop</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">All Brands</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Best Sellers</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Gift Cards</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">About</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Our Story</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Our Brands</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Sustainability</a></li>
              <li><button onClick={onOpenAffiliate} className="text-sm text-white/80 hover:text-white transition-colors font-light">Affiliate Program</button></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Journal</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">FAQ</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Contact Us</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light">Track Order</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/40 font-light">
            &copy; {new Date().getFullYear()} The Skin Boutique. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-light">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
