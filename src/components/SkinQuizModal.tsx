import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { type Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';
import { useProducts } from '../contexts/ProductContext';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Normal';
type Concern = 'Acne & Blemishes' | 'Anti-Aging' | 'Redness & Sensitivity' | 'Dryness & Hydration';

export default function SkinQuizModal({ isOpen, onClose }: SkinQuizModalProps) {
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concern, setConcern] = useState<Concern | null>(null);
  const [isSensitive, setIsSensitive] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { saveProfile } = useUser();
  const { products } = useProducts();

  const handleNext = () => {
    if (step === 2) {
      // Analyze and get recommendations
      setIsAnalyzing(true);
      setStep(3);
      
      if (skinType && concern) {
        saveProfile(skinType, concern);
      }
      
      setTimeout(() => {
        generateRecommendations();
        setIsAnalyzing(false);
        setStep(4);
      }, 2500);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const generateRecommendations = () => {
    let recs: Product[] = [];
    
    // Helper to safely check keywords
    const matchAny = (p: Product, keywords: string[]) => {
      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    };

    // Always recommend a cleanser and SPF
    const cleanser = products.find(p => matchAny(p, ['cleanser', 'wash', 'cleansing'])) || products[0];
    const spf = products.find(p => matchAny(p, ['spf', 'sunscreen', 'sun'])) || products[1];
    
    // Pick a targeted treatment based on concern
    let treatment;
    if (concern === 'Acne & Blemishes') {
      treatment = products.find(p => matchAny(p, ['bha', 'salicylic', 'acne', 'clear', 'pore'])) || products[2];
    } else if (concern === 'Anti-Aging') {
      treatment = products.find(p => matchAny(p, ['retinol', 'aging', 'peptide', 'firm', 'renew'])) || products[3];
    } else if (concern === 'Redness & Sensitivity') {
      treatment = products.find(p => matchAny(p, ['cica', 'calm', 'sooth', 'sensitive', 'recovery'])) || products[4];
    } else {
      // Dryness & Hydration
      treatment = products.find(p => matchAny(p, ['hydrate', 'mucin', 'moist', 'water', 'hyaluronic'])) || products[5];
    }

    if (cleanser && !recs.includes(cleanser)) recs.push(cleanser);
    if (treatment && !recs.includes(treatment)) recs.push(treatment);
    if (spf && !recs.includes(spf)) recs.push(spf);
    
    setRecommendations(recs);
  };

  const handleAddRoutineToCart = () => {
    recommendations.forEach(product => {
      const priceString = product.options && product.options.length > 0 
        ? product.options[0].price 
        : product.price;
      const priceNumber = parseFloat(priceString.replace('$', ''));
      
      addToCart({
        id: product.options && product.options.length > 0 ? `${product.id}-0` : product.id.toString(),
        title: product.options && product.options.length > 0 ? `${product.name} - ${product.options[0].size}` : product.name,
        price: priceNumber,
        image: product.image,
        quantity: 1
      });
    });
    onClose();
  };

  const resetQuiz = () => {
    setStep(0);
    setSkinType(null);
    setConcern(null);
    setIsSensitive(null);
    setRecommendations([]);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetQuiz, 500); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col min-h-[500px]"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 p-2 bg-ink-50 rounded-full hover:bg-ink-100 transition-colors"
            >
              <X className="w-5 h-5 text-ink-900 stroke-[1.5]" />
            </button>

            {/* Progress Bar */}
            {step < 3 && (
              <div className="absolute top-0 left-0 w-full h-1 bg-ink-50">
                <motion.div 
                  className="h-full bg-pastel-pink-dark"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((step + 1) / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                {/* Step 0: Intro */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-pastel-pink/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-pastel-pink-dark stroke-[1.5]" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-ink-900 mb-4">Discover Your Routine</h2>
                    <p className="text-ink-500 font-light mb-8 max-w-md mx-auto">
                      Take our 3-minute quiz to get a personalized skincare routine curated by our experts, tailored specifically to your skin's unique needs.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-ink-900 text-white px-8 py-4 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors inline-flex items-center"
                    >
                      Start Quiz <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 1: Skin Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">What is your skin type?</h2>
                    <p className="text-ink-500 font-light text-sm mb-8">Select the one that best describes your skin on a typical day.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['Oily', 'Dry', 'Combination', 'Normal'] as SkinType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => { setSkinType(type); handleNext(); }}
                          className="p-6 border border-ink-200 rounded-2xl text-left hover:border-ink-900 hover:bg-ink-50 transition-all group"
                        >
                          <h3 className="font-medium text-ink-900 mb-1 group-hover:text-pastel-pink-dark transition-colors">{type}</h3>
                          <p className="text-xs text-ink-500 font-light">
                            {type === 'Oily' && 'Shiny all over, prone to breakouts.'}
                            {type === 'Dry' && 'Feels tight, flaky, or rough.'}
                            {type === 'Combination' && 'Oily T-zone, dry or normal cheeks.'}
                            {type === 'Normal' && 'Well-balanced, rarely breaks out.'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Primary Concern */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">What is your primary skin concern?</h2>
                    <p className="text-ink-500 font-light text-sm mb-8">We'll target this with a specialized treatment.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['Acne & Blemishes', 'Anti-Aging', 'Redness & Sensitivity', 'Dryness & Hydration'] as Concern[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => { setConcern(c); handleNext(); }}
                          className="p-6 border border-ink-200 rounded-2xl text-left hover:border-ink-900 hover:bg-ink-50 transition-all group"
                        >
                          <h3 className="font-medium text-ink-900 group-hover:text-pastel-pink-dark transition-colors">{c}</h3>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Analyzing */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center flex flex-col items-center justify-center h-full"
                  >
                    <div className="relative w-24 h-24 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-pastel-pink-dark/30 border-t-pastel-pink-dark rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-pastel-pink-dark animate-pulse" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">Curating Your Routine...</h2>
                    <p className="text-ink-500 font-light text-sm">Analyzing your profile for {skinType?.toLowerCase()} skin.</p>
                  </motion.div>
                )}

                {/* Step 4: Results */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-ink-900 mb-2">Your Custom Routine</h2>
                      <p className="text-ink-500 font-light text-sm">
                        Perfectly balanced for {skinType?.toLowerCase()} skin targeting {concern?.toLowerCase()}.
                      </p>
                    </div>

                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                      {recommendations.map((product, idx) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 bg-ink-50/50">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-ink-500 uppercase tracking-wider font-medium mb-1">Step {idx + 1}</p>
                            <h4 className="text-sm font-medium text-ink-900 truncate">{product.name}</h4>
                            <p className="text-xs text-ink-500 mt-1">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAddRoutineToCart}
                        className="flex-1 bg-ink-900 text-white py-4 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-ink-800 transition-colors flex items-center justify-center"
                      >
                        Add Routine to Cart
                      </button>
                      <button
                        onClick={resetQuiz}
                        className="px-8 py-4 rounded-full text-xs font-medium tracking-widest uppercase text-ink-900 border border-ink-200 hover:border-ink-900 transition-colors"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
