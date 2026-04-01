import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronRight, Droplets, Sparkles, Sun, Shield, Zap, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GlassSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const skinIssues = [
  {
    id: 'acne',
    emoji: '😤',
    name: 'Acne & Breakouts',
    color: 'from-rose-50 to-red-50',
    border: 'border-rose-200',
    accent: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    causes: [
      'Excess sebum (oil) clogging pores with dead skin cells',
      'C. acnes bacteria thriving in blocked follicles',
      'Hormonal fluctuations (puberty, menstrual cycle, stress)',
      'Over-cleansing or using harsh, stripping products',
      'Using comedogenic ingredients like coconut oil or lanolin',
      'Not reapplying SPF — leading to UV-triggered inflammation',
    ],
    solutions: [
      'Double cleanse with a low-pH, non-stripping gel cleanser',
      'Add Niacinamide 5–10% to regulate sebum and reduce redness',
      'Use Salicylic Acid (BHA) 1–2x per week to clear pore congestion',
      'Centella Asiatica or Heartleaf calms active inflamed breakouts',
      'Never skip moisturiser — dehydration triggers more oil production',
      'Use a lightweight, non-comedogenic mineral SPF daily',
    ],
    keyIngredients: ['Niacinamide', 'Salicylic Acid', 'Centella Asiatica', 'Heartleaf', 'Zinc PCA', 'Tea Tree'],
  },
  {
    id: 'hyperpigmentation',
    emoji: '🟤',
    name: 'Dark Spots & Pigmentation',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    accent: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    causes: [
      'UV exposure triggering excess melanin production as protection',
      'Post-inflammatory hyperpigmentation (PIH) after acne heals',
      'Hormonal changes — melasma from pregnancy or birth control',
      'Picking or squeezing blemishes, causing deeper trauma',
      'Slow cell turnover leaving pigmented cells on the surface',
      'Not wearing SPF daily — UV darkens existing spots dramatically',
    ],
    solutions: [
      'Wear broad-spectrum SPF 50+ every single day — non-negotiable',
      'Niacinamide inhibits melanin transfer to skin cells',
      'Tranexamic Acid reduces dark spots by blocking melanin production',
      'Alpha Arbutin gently fades spots without irritating sensitive skin',
      'Vitamin C (Ascorbic Acid) brightens and prevents new damage',
      'Gentle AHA exfoliation (Glycolic/Lactic) accelerates cell turnover',
    ],
    keyIngredients: ['Niacinamide', 'Tranexamic Acid', 'Arbutin', 'Ascorbic Acid', 'Kojic Acid', 'Glycolic Acid'],
  },
  {
    id: 'dullness',
    emoji: '😴',
    name: 'Dull & Tired Skin',
    color: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200',
    accent: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    causes: [
      'Buildup of dead skin cells slowing natural light reflection',
      'Chronic dehydration — skin cells plump with water = glow',
      'Poor sleep reducing overnight repair and regeneration cycles',
      'High stress elevating cortisol, which disrupts skin function',
      'Diet lacking antioxidants, vitamins and healthy fats',
      'Environmental pollution creating free radical damage',
    ],
    solutions: [
      'Layer lightweight hydrating toners (the "7 Skin Method")',
      'A Hyaluronic Acid serum draws moisture from air into skin',
      'Use Vitamin C in the morning to fight free radical damage',
      'Exfoliate 2x per week with an AHA or enzyme-based product',
      'Apply an essence — fermented botanicals boost radiance',
      'Sleeping mask 2–3x per week for intensive overnight renewal',
    ],
    keyIngredients: ['Hyaluronic Acid', 'Ascorbic Acid', 'Niacinamide', 'Peptides', 'Glycolic Acid', 'Adenosine'],
  },
  {
    id: 'barrier',
    emoji: '🛡️',
    name: 'Damaged Skin Barrier',
    color: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    causes: [
      'Over-exfoliating with acids or physical scrubs too frequently',
      'Using harsh, high-pH foaming cleansers that strip natural oils',
      'Layering too many active ingredients at once',
      'Washing with very hot water — disrupts lipid structure',
      'Cold, dry weather or indoor heating depleting skin moisture',
      'Underlying conditions like eczema, rosacea, or perioral dermatitis',
    ],
    solutions: [
      'Simplify your routine immediately — strip it back to 3 steps',
      'Use a creamy, low-pH cleanser with ceramides or oat extract',
      'Layer ceramide-rich products to rebuild the lipid matrix',
      'Panthenol (B5) and Madecassoside accelerate barrier healing',
      'Apply a thick sleeping mask or balm at night as an occlusive',
      'Pause all actives (Retinol, Acids, Vitamin C) until healed',
    ],
    keyIngredients: ['Ceramide', 'Panthenol', 'Madecassoside', 'Beta-Glucan', 'Squalane', 'Centella Asiatica'],
  },
  {
    id: 'aging',
    emoji: '⏰',
    name: 'Fine Lines & Loss of Firmness',
    color: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    accent: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700',
    causes: [
      'Natural collagen and elastin decline starting from mid-20s',
      'Unprotected UV exposure — the #1 accelerator of skin aging',
      'Repetitive facial expressions forming expression lines',
      'Free radical damage from pollution, smoke, and poor diet',
      'Chronic dehydration — water-plump skin shows fewer lines',
      'Lack of sleep reducing skin\'s overnight repair cycle',
    ],
    solutions: [
      'SPF 50+ is the most evidence-backed anti-aging product',
      'Retinol 0.025–0.1% stimulates collagen — start slowly',
      'Multi-peptide serums signal skin to produce new collagen',
      'Adenosine is a proven wrinkle-reducer backed by clinical data',
      'EGF (Epidermal Growth Factor) accelerates cell renewal',
      'Snail Mucin repairs and deeply hydrates for plumper skin',
    ],
    keyIngredients: ['Retinol', 'Peptides', 'Adenosine', 'EGF', 'Collagen', 'Snail Secretion Filtrate'],
  },
  {
    id: 'sensitivity',
    emoji: '🌡️',
    name: 'Redness & Sensitivity',
    color: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    accent: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
    causes: [
      'Compromised skin barrier allowing irritants to penetrate',
      'Synthetic fragrances, dyes, and alcohol in products',
      'Environmental triggers: cold, wind, UV, and pollution',
      'Underlying conditions: rosacea, eczema, contact dermatitis',
      'Overuse of active ingredients causing irritation and inflammation',
      'Hot showers or steam — dilates blood vessels near the surface',
    ],
    solutions: [
      'Switch to fragrance-free, minimal-ingredient formulations',
      'Centella Asiatica (Cica) is the gold standard for calming redness',
      'Allantoin and Beta-Glucan soothe and strengthen reactive skin',
      'Use only mineral SPF (zinc oxide) — chemical filters can irritate',
      'Introduce new products one at a time, patch test first',
      'Avoid hot showers and pat (never rub) the face dry',
    ],
    keyIngredients: ['Centella Asiatica', 'Allantoin', 'Beta-Glucan', 'Panthenol', 'Calendula', 'Madecassoside'],
  },
];

const routineSteps = [
  {
    step: '01',
    phase: 'Evening only',
    name: 'Oil Cleanser',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-amber-50 text-amber-600',
    description: 'Dissolves SPF, makeup, and sebum without stripping moisture. Massage onto dry skin for 60 seconds.',
    tip: 'Look for: Jojoba, Squalane, Rice Bran Oil bases',
    why: 'Preserves your natural microbiome while thoroughly removing the day\'s buildup.',
  },
  {
    step: '02',
    phase: 'AM & PM',
    name: 'Water Cleanser',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-blue-50 text-blue-600',
    description: 'A low-pH (4.5–5.5) gel or foam to remove water-based impurities and sweat.',
    tip: 'Look for: pH indicator on label, ceramide-infused variants',
    why: 'Maintains your skin\'s acid mantle — the foundation of barrier health.',
  },
  {
    step: '03',
    phase: '2–3x per week',
    name: 'Exfoliate',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-purple-50 text-purple-600',
    description: 'Chemical exfoliants (AHA for texture, BHA for pores, PHA for sensitive skin) remove dead cell buildup.',
    tip: 'Never mix multiple acids in the same routine',
    why: 'Fresh skin cells reflect light better, giving you that glass-skin luminosity.',
  },
  {
    step: '04',
    phase: 'AM & PM',
    name: 'Hydrating Toner',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-cyan-50 text-cyan-600',
    description: 'Alcohol-free, water-light formulas that prep skin to absorb everything that follows.',
    tip: 'Try the 7-Skin Method: pat on 5–7 thin layers for maximum hydration',
    why: 'Pre-hydrated skin absorbs serums up to 40% more effectively.',
  },
  {
    step: '05',
    phase: 'AM & PM',
    name: 'Essence',
    icon: <Leaf className="w-5 h-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'The heart of K-beauty. Fermented essences deliver actives deep into skin for glow from within.',
    tip: 'Pat — never rub — to press product into skin',
    why: 'Fermentation increases ingredient bioavailability and adds skin-identical probiotics.',
  },
  {
    step: '06',
    phase: 'AM & PM',
    name: 'Targeted Serum',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-rose-50 text-rose-600',
    description: 'Your highest-concentration active. One concern per serum: brightening, anti-aging, or barrier repair.',
    tip: 'Rule: apply thinnest to thickest consistency',
    why: 'Serums have the smallest molecular size — deepest penetration for fastest results.',
  },
  {
    step: '07',
    phase: '2–3x per week',
    name: 'Sheet Mask',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'An intensive occlusive treatment — the essence-soaked sheet creates a seal that forces actives in.',
    tip: 'Refrigerate your masks for a de-puffing, lymph-draining effect',
    why: 'A 20-minute mask delivers the equivalent of a full serum application.',
  },
  {
    step: '08',
    phase: 'AM & PM',
    name: 'Moisturiser',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-teal-50 text-teal-600',
    description: 'Seals in all previous hydration layers. Gel cream for day, richer cream or sleeping mask for night.',
    tip: 'Apply to slightly damp skin for best absorption',
    why: 'Ceramide-rich moisturisers rebuild the lipid matrix of your skin barrier.',
  },
  {
    step: '09',
    phase: 'AM only',
    name: 'SPF 50+',
    icon: <Sun className="w-5 h-5" />,
    color: 'bg-yellow-50 text-yellow-600',
    description: 'The most evidence-backed anti-aging, anti-pigmentation, anti-everything product in skincare. Non-negotiable.',
    tip: 'Apply ¼ teaspoon (2 finger lengths) to face and neck. Reapply every 2 hours outdoors.',
    why: 'UV is responsible for 80–90% of visible skin aging. Nothing else matters without SPF.',
  },
];

export default function GlassSkinModal({ isOpen, onClose }: GlassSkinModalProps) {
  const [activeTab, setActiveTab] = useState<'issues' | 'routine'>('issues');
  const [openIssue, setOpenIssue] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-[#fdfbf9]/90 backdrop-blur-3xl z-[201] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white/60 backdrop-blur-xl border-b border-white/40 px-8 pt-8 pb-6 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-ink-500 uppercase">The Skin Boutique</span>
                  <h1 className="text-3xl font-serif text-ink-900 mt-1">Glass Skin Guide</h1>
                  <p className="text-ink-500 text-sm mt-1 font-light">Understand your skin. Fix it. Glow.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 border border-white/40 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-ink-500" />
                </button>
              </div>
              {/* Tabs */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('issues')}
                  className={`px-6 py-2.5 rounded-xl font-sans text-sm transition-all flex items-center gap-2 ${activeTab === 'issues' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 border border-white/40 text-ink-900 hover:bg-white/80'}`}
                >
                  <span className="text-base">🔍</span> Skin Diagnose
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('routine')}
                  className={`px-6 py-2.5 rounded-xl font-sans text-sm transition-all flex items-center gap-2 ${activeTab === 'routine' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 border border-white/40 text-ink-900 hover:bg-white/80'}`}
                >
                  <span className="text-base">✨</span> Glass Skin Routine
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'issues' ? (
                <div className="p-6 space-y-3">
                  <p className="text-sm text-gray-500 mb-4">Tap your skin concern to see what's really causing it — and exactly how to fix it.</p>
                  {skinIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden transition-all duration-300`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIssue(openIssue === issue.id ? null : issue.id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{issue.emoji}</span>
                          <span className={`font-bold text-base ${issue.accent}`}>{issue.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${issue.accent} transition-transform duration-300 ${openIssue === issue.id ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {openIssue === issue.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-4">
                              {/* Causes */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <AlertCircle className={`w-4 h-4 ${issue.accent}`} />
                                  <span className={`text-xs font-bold uppercase tracking-wider ${issue.accent}`}>What's Causing It</span>
                                </div>
                                <ul className="space-y-2">
                                  {issue.causes.map((cause, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                                      {cause}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Solutions */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <CheckCircle2 className={`w-4 h-4 ${issue.accent}`} />
                                  <span className={`text-xs font-bold uppercase tracking-wider ${issue.accent}`}>How to Fix It</span>
                                </div>
                                <ul className="space-y-2">
                                  {issue.solutions.map((sol, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <span className={`mt-0.5 flex-shrink-0 text-xs font-bold ${issue.accent}`}>0{i + 1}</span>
                                      {sol}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Key Ingredients */}
                              <div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${issue.accent} mb-2`}>Key Ingredients</p>
                                <div className="flex flex-wrap gap-2">
                                  {issue.keyIngredients.map((ing) => (
                                    <span key={ing} className={`px-3 py-1 rounded-full text-xs font-medium ${issue.badge}`}>{ing}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 space-y-3">
                  <p className="text-sm text-gray-500 mb-4">The full K-beauty glass skin ritual. Tap each step to learn why it works and what to look for.</p>
                  {routineSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenStep(openStep === idx ? null : idx)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/80 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                          {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs text-gray-400 font-mono">STEP {step.step}</span>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{step.phase}</span>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">{step.name}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openStep === idx ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openStep === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                              <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
                              <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                                <span className="text-amber-500 text-sm">💡</span>
                                <p className="text-xs text-amber-700 font-medium">{step.tip}</p>
                              </div>
                              <div className="flex items-start gap-2 bg-indigo-50 rounded-xl p-3">
                                <span className="text-sm">🔬</span>
                                <p className="text-xs text-indigo-700"><strong>Why it works:</strong> {step.why}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  {/* Lifestyle pillars */}
                  <div className="mt-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 text-ink-900 p-6 shadow-sm">
                    <h3 className="font-serif text-xl mb-4">Beyond Skincare: The Lifestyle Pillars</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: '💧', label: 'Hydration', tip: '2L+ water daily. Hydrated skin glows.' },
                        { icon: '😴', label: 'Sleep', tip: '7–9 hrs. Collagen is synthesised overnight.' },
                        { icon: '🥗', label: 'Diet', tip: 'Antioxidants & omega-3s protect and repair.' },
                        { icon: '🧘', label: 'Stress', tip: 'Cortisol breaks down collagen. Manage it.' },
                      ].map((p) => (
                        <div key={p.label} className="bg-white/40 border border-white/20 rounded-xl p-4">
                          <span className="text-2xl">{p.icon}</span>
                          <p className="font-semibold text-sm mt-2 text-ink-900">{p.label}</p>
                          <p className="text-ink-500 text-xs mt-1">{p.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
