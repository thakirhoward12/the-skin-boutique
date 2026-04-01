import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Sun, Shield, Zap, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

interface SunCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const spfMythFacts = [
  { myth: 'I only need SPF on sunny days.', fact: 'UVA rays are present year-round, penetrate clouds and glass, and are the primary driver of skin aging. They\'re as strong on an overcast day as on a sunny one.' },
  { myth: 'SPF 100 is twice as good as SPF 50.', fact: 'SPF 50 blocks ~98% of UVB rays. SPF 100 blocks ~99%. The difference is marginal — consistent application matters far more than chasing higher numbers.' },
  { myth: 'My foundation with SPF 15 is enough.', fact: 'To achieve the advertised SPF from makeup, you\'d need to apply ¼ teaspoon onto your face — about 6x the amount most people actually use. Use a dedicated sunscreen underneath.' },
  { myth: 'People with darker skin don\'t need SPF.', fact: 'Melanin does offer a small natural SPF of around 3–4, but all skin types are equally susceptible to hyperpigmentation, UV-induced damage, and skin cancer. SPF is universal.' },
  { myth: 'I applied SPF this morning, I\'m covered all day.', fact: 'Sunscreens break down under UV exposure, sweat, and sebum. Reapplication every 2 hours of sun exposure is essential for maintained protection.' },
  { myth: 'Chemical sunscreens are harmful and should be avoided.', fact: 'The evidence overwhelmingly shows chemical UV filters approved in Korea, Japan, and the EU are safe. Korean formulations use next-generation filters (Tinosorb, Uvinul) that are both effective and cosmetically elegant.' },
];

const paRatings = [
  { rating: 'PA+', level: 1, protection: 'Some UVA protection', desc: 'Suitable for low UV index days or brief outdoor exposure.', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { rating: 'PA++', level: 2, protection: 'Moderate UVA protection', desc: 'Good for everyday use — commuting, casual outdoor activities.', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { rating: 'PA+++', level: 3, protection: 'High UVA protection', desc: 'Recommended for extended outdoor time, driving, or high UV index locations.', color: 'bg-red-100 text-red-700 border-red-200' },
  { rating: 'PA++++', level: 4, protection: 'Extremely high UVA protection', desc: 'The gold standard for K-beauty SPF. Ideal for beach days, sports, and anyone concerned about aging or pigmentation.', color: 'bg-rose-100 text-rose-700 border-rose-200' },
];

const filterComparison = [
  {
    type: 'Chemical / Organic Filters',
    emoji: '⚗️',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    accent: 'text-violet-700',
    how: 'Absorb UV rays and convert them to heat, which is released from the skin.',
    pros: ['Lightweight, invisible finish', 'No white-cast', 'Easier to layer under makeup', 'Korean/Japanese formulas use next-gen filters (Tinosorb S/M, Uvinul A Plus) for superior protection'],
    cons: ['Take 15–30 min to activate after application', 'Can occasionally cause stinging if they enter eyes', 'Some older US filters debate (avobenzone) — K-beauty filters are superior and widely approved globally'],
    examples: ['Ethylhexyl Methoxycinnamate', 'Tinosorb S', 'Uvinul A Plus', 'Mexoryl SX', 'Octinoxate'],
    ideal: 'Daily wear, city dwellers, those who layer makeup over SPF.',
  },
  {
    type: 'Physical / Mineral Filters',
    emoji: '🪨',
    bg: 'from-stone-50 to-gray-50',
    border: 'border-stone-200',
    accent: 'text-stone-700',
    how: 'Sit on skin\'s surface and physically reflect/scatter UV rays away.',
    pros: ['Effective immediately upon application', 'Very gentle — ideal for compromised or sensitive skin', 'No risk of irritation for reactive skin types', 'Safe for use over active breakouts'],
    cons: ['Can leave a white-cast, especially on deeper skin tones', 'Heavier texture — can pill under makeup', 'Requires more product for full coverage'],
    examples: ['Zinc Oxide', 'Titanium Dioxide'],
    ideal: 'Sensitive skin, rosacea, barrier-damaged skin, post-procedure care.',
  },
];

const applicationSteps = [
  { step: '01', icon: '🧴', title: 'Use the right amount', desc: '¼ teaspoon (approximately 2 finger-lengths) for face and neck. Most people apply only 20–25% of the required amount and get a fraction of the stated SPF.' },
  { step: '02', icon: '🖐️', title: 'Apply to dry skin', desc: 'Apply as the final skincare step, before makeup. For chemical SPF, allow 15–30 minutes before sun exposure. Mineral SPF works immediately.' },
  { step: '03', icon: '😶', title: 'Cover all areas', desc: 'Ears, neck, hairline, eyelids (use an SPF stick or eye-safe formula), and the backs of hands. Missed spots are a common source of cumulative sun damage.' },
  { step: '04', icon: '⏰', title: 'Reapply every 2 hours', desc: 'During outdoor activities, reapplication is not optional. Sweat, swimming, and sebum break down SPF protection. Use a setting spray SPF or SPF powder for easy top-ups over makeup.' },
  { step: '05', icon: '🌥️', title: 'Yes — even on cloudy days', desc: 'Up to 80% of UV rays penetrate clouds. UVA (aging rays) even penetrate glass. Apply SPF every morning regardless of weather or whether you plan to go outside.' },
];

export default function SunCareModal({ isOpen, onClose }: SunCareModalProps) {
  const [activeTab, setActiveTab] = useState<'spf' | 'filters' | 'apply' | 'myths'>('spf');
  const [openMyth, setOpenMyth] = useState<number | null>(null);

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
                  <h1 className="text-3xl font-serif text-ink-900 mt-1 flex items-center gap-3">
                    <Sun className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} /> Sun Care 101
                  </h1>
                  <p className="text-ink-500 text-sm mt-1 font-light">Everything you need to know about SPF — and why it changes everything.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 border border-white/40 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-ink-500" />
                </button>
              </div>
              {/* Quick stat */}
              <div className="bg-white/40 border border-white/40 rounded-2xl px-5 py-4 flex gap-6 text-sm font-sans font-medium text-ink-900 shadow-sm overflow-x-auto">
                <span className="whitespace-nowrap flex items-center gap-2"><span className="text-lg">☀️</span> UVB = Burning</span>
                <span className="whitespace-nowrap flex items-center gap-2"><span className="text-lg">⏳</span> UVA = Aging</span>
                <span className="whitespace-nowrap flex items-center gap-2"><span className="text-lg">🛡️</span> SPF = UVB protection</span>
                <span className="whitespace-nowrap flex items-center gap-2"><span className="text-lg">⭐</span> PA = UVA protection</span>
              </div>
              {/* Tabs */}
              <div className="flex gap-3 mt-6 flex-wrap">
                {[
                  { id: 'spf', label: '⭐ PA Ratings' },
                  { id: 'filters', label: '⚗️ Filters' },
                  { id: 'apply', label: '🖐️ How to Apply' },
                  { id: 'myths', label: '❌ Myths Busted' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2.5 rounded-xl font-sans text-sm transition-all shadow-sm ${activeTab === tab.id ? 'bg-[#D4AF37] text-white' : 'bg-white/60 border border-white/40 text-ink-900 hover:bg-white/80'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* PA Ratings */}
              {activeTab === 'spf' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-sm text-amber-800 font-medium">
                      🔬 <strong>What is PA?</strong> PA (Protection Grade of UVA) is a Japanese and Korean rating system measuring how well a sunscreen blocks UVA rays — the ones that cause aging, pigmentation, and penetrate glass. It's measured by Persistent Pigment Darkening (PPD) — the higher the PA grade, the better.
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                    <p className="text-sm text-orange-800 font-medium">
                      ☀️ <strong>What is SPF?</strong> Sun Protection Factor measures how long a sunscreen extends your skin's natural UV protection against UVB rays before burning. SPF 50 means it takes 50x longer to burn than without protection. But this only applies to UVB — you need a PA rating for full UVA coverage.
                    </p>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mt-2">Decoding the PA Rating System</h3>
                  {paRatings.map((pa) => (
                    <div key={pa.rating} className={`rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-5 shadow-sm`}>
                      <div className="flex items-start gap-4">
                        <div className={`px-3 py-1 rounded-xl text-sm font-black border ${pa.color} flex-shrink-0`}>{pa.rating}</div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{pa.protection}</p>
                          <p className="text-sm text-gray-600 mt-1">{pa.desc}</p>
                          <div className="flex gap-1 mt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className={`h-1.5 w-8 rounded-full ${i < pa.level ? 'bg-orange-400' : 'bg-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/60 backdrop-blur-xl border border-white/40 text-ink-900 rounded-2xl p-6 shadow-sm">
                    <p className="font-serif text-lg mb-2">🏆 What to look for</p>
                    <p className="text-ink-500 text-sm">For daily use, target <strong>SPF 50+ PA++++</strong>. K-beauty and Japanese sunscreens consistently lead the global market for high-protection, elegant formulations that don't leave a white cast or feel heavy. Europe has Tinosorb. Korea has Uvinul. Both are superior to many older American filters.</p>
                  </div>
                </div>
              )}

              {/* Chemical vs Physical */}
              {activeTab === 'filters' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">The great sunscreen debate — simplified. Both protect you. The difference is <em>how</em> they do it.</p>
                  {filterComparison.map((filter) => (
                    <div key={filter.type} className={`rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 space-y-4 shadow-sm`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{filter.emoji}</span>
                        <h3 className={`font-bold text-base ${filter.accent}`}>{filter.type}</h3>
                      </div>
                      <div className="bg-white/60 rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">How it works</p>
                        <p className="text-sm text-gray-700">{filter.how}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-emerald-700 mb-2">✅ Pros</p>
                          <ul className="space-y-1">
                            {filter.pros.map((p, i) => (
                              <li key={i} className="text-xs text-gray-600">• {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-red-700 mb-2">⚠️ Cons</p>
                          <ul className="space-y-1">
                            {filter.cons.map((c, i) => (
                              <li key={i} className="text-xs text-gray-600">• {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Common filters</p>
                        <div className="flex flex-wrap gap-1">
                          {filter.examples.map((e) => (
                            <span key={e} className={`px-2 py-0.5 rounded-full text-xs font-medium border ${filter.border} ${filter.accent} bg-white/70`}>{e}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500">✨ Ideal for:</p>
                        <p className="text-sm text-gray-700 mt-0.5">{filter.ideal}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-sm text-blue-800"><strong>💡 The verdict:</strong> Most K-beauty SPFs use hybrid formulas — combining chemical and physical filters to get the best of both: high protection, elegant texture, and zero white-cast. Look for formulas that list both Zinc Oxide AND organic filters.</p>
                  </div>
                </div>
              )}

              {/* How to Apply */}
              {activeTab === 'apply' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                    <p className="text-sm text-orange-800 font-medium">⚠️ Studies show the average person applies only 20–25% of the sunscreen required to achieve the stated SPF. That SPF 50 you think you're wearing might actually be giving you SPF 10.</p>
                  </div>
                  {applicationSteps.map((step) => (
                    <div key={step.step} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl">
                          {step.icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-mono text-gray-400">STEP {step.step}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/60 backdrop-blur-xl border border-white/40 text-ink-900 rounded-2xl p-6 shadow-sm">
                    <p className="font-serif text-lg mb-4">🏖️ Beach / Sport Specific</p>
                    <ul className="space-y-3 text-sm text-ink-500">
                      <li>• Use water-resistant SPF (water-resistant ≠ waterproof — reapply after swimming)</li>
                      <li>• Apply 30 min before entering the water</li>
                      <li>• Reapply immediately after towel-drying</li>
                      <li>• Go higher: SPF 50+ PA++++ is the minimum for beach environments</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Myths */}
              {activeTab === 'myths' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Sunscreen myths are everywhere — and they cause real skin damage. Let's fix that.</p>
                  {spfMythFacts.map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenMyth(openMyth === idx ? null : idx)}
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-gray-800 flex-1">❌ MYTH: {item.myth}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openMyth === idx ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openMyth === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 flex items-start gap-3 bg-emerald-50 border-t border-emerald-100 pt-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-emerald-800"><strong>✅ FACT:</strong> {item.fact}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 mt-6 shadow-sm">
                    <p className="text-ink-900 text-sm leading-relaxed">
                      <strong>Bottom line:</strong> SPF is not optional. UV radiation causes 80–90% of visible skin aging, the vast majority of hyperpigmentation, and 90%+ of non-melanoma skin cancers. It is the highest-leverage skincare product that exists — nothing else comes close. If you only do <em>one thing</em> for your skin, make it daily broad-spectrum SPF 50+ PA++++.
                    </p>
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
