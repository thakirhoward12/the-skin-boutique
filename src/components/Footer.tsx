import { Facebook, Instagram, Twitter, ArrowRight, Droplet, ArrowUp, Star, CreditCard, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import LegalDocsModal from './LegalDocsModal';
import GlassSkinModal from './GlassSkinModal';
import SunCareModal from './SunCareModal';
import IngredientGlossaryModal from './IngredientGlossaryModal';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface FooterProps {
  onOpenAffiliate?: () => void;
  onOpenContact?: () => void;
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: TikTokIcon, label: 'TikTok', href: 'https://tiktok.com' },
];

export default function Footer({ onOpenAffiliate, onOpenContact }: FooterProps) {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');
  const [glassSkinOpen, setGlassSkinOpen] = useState(false);
  const [sunCareOpen, setSunCareOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegal = (e: React.MouseEvent, tab: 'privacy' | 'terms') => {
    e.preventDefault();
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <footer className="bg-ink-900 text-white pt-24 pb-12 transition-colors duration-1000 relative">
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
              <button type="submit" className="absolute right-0 bottom-3 text-white hover:text-pastel-pink transition-colors group">
                <ArrowRight className="w-5 h-5 stroke-[1.5] group-hover:translate-x-1 transition-transform" />
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
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="h-4 w-4 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Shop Collections</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300" title="Shop All K-Beauty Brands">All Brands</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300" title="Trending Skincare Best Sellers">Best Sellers</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300" title="Latest Korean Skincare Arrivals">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Gift Cards</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Skincare Guide</h3>
            <ul className="space-y-4">
              <li><button type="button" onClick={() => setGlassSkinOpen(true)} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Glass Skin Routine</button></li>
              <li><button type="button" onClick={() => setSunCareOpen(true)} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Sun Care 101</button></li>
              <li><button type="button" onClick={() => setGlossaryOpen(true)} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Ingredient Glossary</button></li>
              <li><button onClick={onOpenAffiliate} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Affiliate Program</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mb-8">Support</h3>
            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Excellent</span>
              </div>
              <p className="text-[10px] text-white/60 font-light">Rated 4.9/5 by our beautiful community</p>
            </div>
            <ul className="space-y-4">
              <li><button type="button" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">FAQ</button></li>
              <li><button type="button" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Shipping & Returns</button></li>
              <li><button onClick={onOpenContact} className="text-sm text-white/80 hover:text-white transition-colors font-light hover:pl-1 duration-300">Contact Us</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/40 font-light">
            &copy; {new Date().getFullYear()} The Skin Boutique. All rights reserved.
          </p>
          <div className="flex items-center space-x-8 mt-4 md:mt-0">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8 hidden sm:flex">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Safe Payments</span>
              <div className="flex gap-3 opacity-60">
                <CreditCard className="w-5 h-5" />
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <button type="button" onClick={(e) => openLegal(e, 'privacy')} className="text-xs text-white/40 hover:text-white transition-colors font-light">Privacy Policy</button>
            <button type="button" onClick={(e) => openLegal(e, 'terms')} className="text-xs text-white/40 hover:text-white transition-colors font-light">Terms of Service</button>
            <button
              onClick={scrollToTop}
              className="group w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
      
      <LegalDocsModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        initialTab={legalTab} 
      />
      <GlassSkinModal isOpen={glassSkinOpen} onClose={() => setGlassSkinOpen(false)} />
      <SunCareModal isOpen={sunCareOpen} onClose={() => setSunCareOpen(false)} />
      <IngredientGlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </footer>
  );
}
