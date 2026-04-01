import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Search, ChevronDown } from 'lucide-react';

interface IngredientGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SafetyRating = 'Hero' | 'Workhorse' | 'Well-Studied' | 'Use with Care';
type SkinType = 'All' | 'Oily' | 'Dry' | 'Sensitive' | 'Combo';

interface Ingredient {
  name: string;
  inci?: string;
  category: string;
  origin: 'Plant' | 'Fermented' | 'Synthetic' | 'Marine' | 'Animal' | 'Mineral';
  rating: SafetyRating;
  skins: SkinType[];
  whatItDoes: string;
  howItWorks: string;
  bestFor: string[];
  pairWith?: string[];
  avoidWith?: string[];
  concentration?: string;
  funFact?: string;
}

const INGREDIENTS: Ingredient[] = [
  // ─── Brighteners ───
  {
    name: 'Niacinamide',
    inci: 'Niacinamide',
    category: 'Brighteners',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All', 'Oily', 'Sensitive'],
    whatItDoes: 'The Swiss Army knife of skincare. Brightens, tightens pores, controls sebum, reduces redness, and strengthens the skin barrier — all at once.',
    howItWorks: 'Inhibits melanosome transfer (stops dark spots from reaching the skin surface), reduces production of inflammatory prostaglandins, and upregulates ceramide synthesis in the skin barrier.',
    bestFor: ['Enlarged pores', 'Uneven skin tone', 'Excess oil', 'Redness & sensitivity', 'Post-acne marks'],
    pairWith: ['Hyaluronic Acid', 'Ceramides', 'Retinol', 'AHAs'],
    avoidWith: [],
    concentration: '2–10% optimal. Above 10% can cause flushing in sensitive skin.',
    funFact: 'Niacinamide is Vitamin B3 — it\'s water-soluble, pH-stable, and one of the most extensively studied cosmetic ingredients in existence with 30+ peer-reviewed clinical studies.',
  },
  {
    name: 'Tranexamic Acid',
    inci: 'Tranexamic Acid',
    category: 'Brighteners',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'A standout brightener that targets stubborn melasma and post-inflammatory hyperpigmentation more safely than hydroquinone.',
    howItWorks: 'Blocks plasmin — an enzyme that triggers melanin synthesis — directly interrupting the pigmentation cascade at the source before melanin is even produced.',
    bestFor: ['Melasma', 'Dark spots', 'Post-acne marks', 'Hormonal pigmentation', 'Sun spots'],
    pairWith: ['Niacinamide', 'Arbutin', 'Vitamin C', 'SPF'],
    concentration: '2–5% effective range.',
    funFact: 'Originally a drug used to prevent excessive bleeding during surgery. Dermatologists discovered it accidentally suppressed pigmentation in patients with liver spots.',
  },
  {
    name: 'Alpha Arbutin',
    inci: 'Alpha-Arbutin',
    category: 'Brighteners',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'A gentle but highly effective brightening agent that fades spots without the irritation risks of Kojic Acid or Hydroquinone.',
    howItWorks: 'Competitively inhibits tyrosinase — the enzyme that catalyses melanin production. The "alpha" form is more stable and 10x more potent than beta-arbutin.',
    bestFor: ['Uneven skin tone', 'Dark spots', 'Freckles', 'Sensitive skin brightening'],
    pairWith: ['Niacinamide', 'Vitamin C', 'Tranexamic Acid'],
    concentration: '1–2% in leave-on products.',
    funFact: 'Derived naturally from bearberry, cranberry, and blueberry plants. The synthetic alpha form is purer and more consistent than plant-extracted forms.',
  },
  {
    name: 'Ascorbic Acid',
    inci: 'Ascorbic Acid (L-)',
    category: 'Brighteners',
    origin: 'Synthetic',
    rating: 'Workhorse',
    skins: ['All', 'Oily'],
    whatItDoes: 'The gold standard Vitamin C. Brightens skin, fights UV-induced free radical damage, and stimulates collagen synthesis.',
    howItWorks: 'A potent reducing agent — it donates electrons to neutralise free radicals. Also inhibits tyrosinase to brighten and directly promotes Type I collagen gene expression.',
    bestFor: ['Dull skin', 'Antioxidant protection', 'Brightening', 'Anti-aging', 'Hyperpigmentation'],
    pairWith: ['Vitamin E (Tocopherol)', 'Ferulic Acid', 'SPF'],
    avoidWith: ['Niacinamide (reduces efficacy at high concentrations)', 'Retinol (layer separately)'],
    concentration: '10–20% L-ascorbic acid for maximum efficacy. Requires pH below 3.5.',
    funFact: 'Ferulic Acid doubles the antioxidant protection of Vitamin C+E and dramatically extends product stability — look for all three together.',
  },
  {
    name: 'Kojic Acid',
    inci: 'Kojic Acid',
    category: 'Brighteners',
    origin: 'Fermented',
    rating: 'Well-Studied',
    skins: ['All', 'Oily'],
    whatItDoes: 'A powerful tyrosinase inhibitor derived from fungi fermentation. Excellent for stubborn dark spots but can cause irritation at high concentrations.',
    howItWorks: 'Chelates the copper ions essential to tyrosinase activity — without copper, the enzyme cannot produce melanin.',
    bestFor: ['Stubborn dark spots', 'Age spots', 'Melasma', 'Post-acne pigmentation'],
    pairWith: ['Niacinamide', 'Vitamin C', 'AHAs'],
    concentration: '1–2%. Higher concentrations risk sensitisation.',
    funFact: 'Kojic Acid is a natural by-product of the fermentation process used to make sake (Japanese rice wine).',
  },
  // ─── Hydrators ───
  {
    name: 'Hyaluronic Acid',
    inci: 'Sodium Hyaluronate',
    category: 'Hydrators',
    origin: 'Fermented',
    rating: 'Hero',
    skins: ['All'],
    whatItDoes: 'The ultimate hydrator. A molecule that can hold up to 1000× its own weight in water, delivering intense, multi-layer hydration.',
    howItWorks: 'A naturally occurring glycosaminoglycan (sugar molecule) that acts as a humectant — drawing atmospheric moisture and water from deeper skin layers into the stratum corneum.',
    bestFor: ['Dehydration', 'All skin types', 'Plumping fine lines', 'Post-exfoliation soothing'],
    pairWith: ['Everything. Apply to damp skin for best results.'],
    concentration: 'Works from 0.1–2%. Multi-weight formulas penetrate at different skin depths.',
    funFact: 'Hyaluronic Acid decreases by 50% between ages 20 and 50. Sodium Hyaluronate is the salt form — lighter and more penetrating than the full molecule.',
  },
  {
    name: 'Sodium Hyaluronate',
    inci: 'Sodium Hyaluronate',
    category: 'Hydrators',
    origin: 'Fermented',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'The smaller, more penetrating form of Hyaluronic Acid. Reaches deeper skin layers for hydration from within.',
    howItWorks: 'Lower molecular weight allows it to penetrate past the stratum corneum into the epidermis — providing hydration at multiple skin depths when combined with higher-weight HA.',
    bestFor: ['Deep hydration', 'Fine lines', 'Barrier support', 'All skin types'],
    pairWith: ['High-weight Hyaluronic Acid', 'Peptides', 'Ceramides'],
    concentration: '0.01–2%.',
  },
  {
    name: 'Glycerin',
    inci: 'Glycerin',
    category: 'Hydrators',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['All'],
    whatItDoes: 'One of the most proven, reliable humectants in skincare — used for over a century and validated by thousands of studies.',
    howItWorks: 'Attracts and binds water molecules from the environment and from deeper skin layers, trapping them in the stratum corneum.',
    bestFor: ['Dry skin', 'Barrier support', 'Foundation for any hydrating formula'],
    pairWith: ['Hyaluronic Acid', 'Ceramides', 'Urea'],
    concentration: '5–30% in moisturisers.',
    funFact: 'Glycerin is in virtually every effective moisturiser, ever made. It\'s inexpensive, highly effective, and universally tolerated.',
  },
  {
    name: 'Beta-Glucan',
    inci: 'Beta-Glucan',
    category: 'Hydrators',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['Sensitive', 'Dry', 'All'],
    whatItDoes: 'A deeply soothing, immune-modulating polysaccharide that calms, hydrates, and strengthens the skin barrier simultaneously.',
    howItWorks: 'Binds to beta-glucan receptors on Langerhans cells (immune cells in the skin) to modulate inflammatory response, while also forming a protective film on the skin surface.',
    bestFor: ['Sensitive and reactive skin', 'Redness', 'Post-procedure skin', 'Compromised barrier', 'Wound healing'],
    pairWith: ['Centella Asiatica', 'Ceramides', 'Panthenol'],
    funFact: 'Derived from yeast, oats, or mushrooms. Studies show Beta-Glucan is as effective as Hyaluronic Acid for moisturisation — but with the added benefit of calming inflammation.',
  },
  {
    name: 'Squalane',
    inci: 'Squalane',
    category: 'Hydrators',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['All', 'Oily'],
    whatItDoes: 'A lightweight, stable oil that perfectly mimics the skin\'s own natural sebum without clogging pores.',
    howItWorks: 'Squalane is a hydrogenated, stable form of squalene — one of the native lipids your sebaceous glands naturally produce. Replenishes lipid content, softens, and strengthens the barrier.',
    bestFor: ['All skin types — even oily', 'Barrier repair', 'Dry patches', 'Post-retinol skin', 'Oil cleansing'],
    pairWith: ['Ceramides', 'Retinol', 'Vitamin C'],
    concentration: '1–100% (can be used as a standalone face oil).',
    funFact: 'Modern squalane is produced from olive oil, sugarcane, or amaranth seeds — a sustainable alternative to the historically shark-derived squalene.',
  },
  // ─── Barrier Repair ───
  {
    name: 'Ceramides',
    inci: 'Ceramide NP / AP / EOP',
    category: 'Barrier Repair',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All', 'Sensitive', 'Dry'],
    whatItDoes: 'The structural lipids that make up 50% of your skin barrier. Without them, moisture escapes and irritants invade.',
    howItWorks: 'Form lamellar layers between corneocytes (skin cells) — the "mortar" between the "bricks" of your skin. Replenish depleted barrier lipids and restore water-holding capacity.',
    bestFor: ['Dry skin', 'Eczema-prone skin', 'Barrier damage', 'Sensitivity', 'Mature skin'],
    pairWith: ['Cholesterol', 'Fatty Acids (3:1:1 ratio is biologically optimal)', 'Niacinamide', 'Panthenol'],
    funFact: 'Ceramide levels drop by 30% between your 20s and 40s, and decrease further with UV exposure, harsh cleansing, and certain medications.',
  },
  {
    name: 'Panthenol',
    inci: 'Panthenol (D-)',
    category: 'Barrier Repair',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'The ultimate skin comforter. Panthenol (Provitamin B5) deeply hydrates, accelerates wound healing, and is one of the most extensively tolerated ingredients in formulation.',
    howItWorks: 'Converts to Pantothenic Acid (Vitamin B5) in the skin, which enhances keratinocyte proliferation, accelerates re-epithelialisation, reduces transepidermal water loss, and upregulates β-defensin production.',
    bestFor: ['Irritated skin', 'Post-procedure recovery', 'Sunburn', 'Chapped skin', 'Barrier-damaged skin'],
    pairWith: ['Centella Asiatica', 'Ceramides', 'Madecassoside'],
    concentration: '1–5%.',
    funFact: 'Panthenol is used in professional wound-care products and post-laser treatments for its accelerated healing properties.',
  },
  {
    name: 'Madecassoside',
    inci: 'Madecassoside',
    category: 'Barrier Repair',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['Sensitive', 'All'],
    whatItDoes: 'A bioactive compound from Centella Asiatica with some of the most potent soothing and barrier-repair properties in K-beauty.',
    howItWorks: 'Inhibits NF-κB (a master inflammatory signaling molecule), promotes fibroblast activity and collagen synthesis, and directly reduces pro-inflammatory cytokines IL-1β and TNF-α.',
    bestFor: ['Active redness', 'Rosacea', 'Post-acne marks', 'Barrier damage', 'Sensitive reactive skin', 'Wound healing'],
    pairWith: ['Asiaticoside', 'Centella Asiatica Extract', 'Panthenol', 'Beta-Glucan'],
    funFact: 'Used in Korean military wound dressing kits. Its clinical efficacy as an anti-inflammatory exceeds many pharmaceutical topical options for mild skin inflammation.',
  },
  // ─── Exfoliants ───
  {
    name: 'Glycolic Acid',
    inci: 'Glycolic Acid',
    category: 'Exfoliants',
    origin: 'Plant',
    rating: 'Workhorse',
    skins: ['Oily', 'Combo', 'All'],
    whatItDoes: 'The most potent and well-studied AHA. Dramatically improves skin texture, tone, fine lines, and brightness.',
    howItWorks: 'The smallest AHA molecule — smallest means deepest penetration. Cleaves desmosomes (protein bridges holding dead skin cells together), accelerating shedding and revealing fresh cells below.',
    bestFor: ['Uneven texture', 'Fine lines', 'Dull skin', 'Mild hyperpigmentation', 'Rough patches'],
    pairWith: ['Hyaluronic Acid (after exfoliation)'],
    avoidWith: ['Other acids', 'Retinol', 'Vitamin C (same routine)'],
    concentration: '5–10% for leave-on. pH must be below 3.5 for efficacy.',
    funFact: 'Originally derived from sugar cane. Its tiny molecular weight (76 Da) is why it\'s the most effective and fastest-acting AHA — and why it can be irritating at high concentrations.',
  },
  {
    name: 'Lactic Acid',
    inci: 'Lactic Acid',
    category: 'Exfoliants',
    origin: 'Fermented',
    rating: 'Hero',
    skins: ['All', 'Sensitive', 'Dry'],
    whatItDoes: 'The gentler, hydrating AHA. Exfoliates while simultaneously pulling moisture into skin — ideal for dry or sensitive skin.',
    howItWorks: 'Larger molecular weight than Glycolic Acid means shallower penetration and less irritation. Also functions as a humectant, and helps rebuild Natural Moisturising Factors (NMFs).',
    bestFor: ['Dry, sensitive skin', 'Mild texture issues', 'Keratosis pilaris', 'Dull skin', 'First-time acid users'],
    pairWith: ['Hyaluronic Acid', 'Ceramides', 'SPF'],
    avoidWith: ['Other acids', 'Retinol (same session)'],
    concentration: '5–10% exfoliating. Up to 2% used as humectant.',
    funFact: 'Naturally produced in your skin as part of its NMF (Natural Moisturising Factor) system. Also the acid in yoghurt — hence "milk acid".',
  },
  {
    name: 'Salicylic Acid',
    inci: 'Salicylic Acid',
    category: 'Exfoliants',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['Oily', 'Combo', 'Acne-Prone'],
    whatItDoes: 'The only true BHA used in skincare. Oil-soluble, meaning it penetrates into pores to dissolve the sebum-dead cell mix that causes blackheads and breakouts.',
    howItWorks: 'Lipophilic (oil-loving) structure allows it to cut through sebum and reach deep into follicles. Exfoliates pore lining, reduces comedones, and has anti-inflammatory properties.',
    bestFor: ['Blackheads', 'Whiteheads', 'Oily/congested skin', 'Enlarged pores', 'Body acne'],
    pairWith: ['Niacinamide', 'Tea Tree', 'Zinc PCA'],
    avoidWith: ['Other acids (same day)', 'Retinol (same session)'],
    concentration: '0.5–2% in leave-on products. 2%+ in rinse-off.',
    funFact: 'Salicylic Acid is derived from willow bark — the same plant that gave us aspirin. Its anti-inflammatory properties make it unique among exfoliating acids.',
  },
  // ─── Botanicals ───
  {
    name: 'Centella Asiatica',
    inci: 'Centella Asiatica Extract',
    category: 'Botanicals',
    origin: 'Plant',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'The crown jewel of K-beauty botanicals. Calms inflammation, speeds barrier repair, stimulates collagen, and soothes reactive skin conditions.',
    howItWorks: 'Contains 4 key bioactives: Madecassoside, Asiaticosde, Madecassic Acid, and Asiatic Acid. Each targets a different pathway — from NF-κB inflammatory inhibition to fibroblast activation and collagen gene expression.',
    bestFor: ['Sensitive/reactive skin', 'Redness', 'Rosacea', 'Barrier repair', 'Post-acne', 'Anti-aging'],
    pairWith: ['Beta-Glucan', 'Panthenol', 'Niacinamide', 'Ceramides'],
    funFact: 'Known as "Tiger Grass" because tigers were observed rolling in it after fights to heal wounds. Used in Ayurvedic medicine for 3,000+ years before modern dermatology validated it.',
  },
  {
    name: 'Snail Secretion Filtrate',
    inci: 'Snail Secretion Filtrate',
    category: 'Botanicals',
    origin: 'Animal',
    rating: 'Workhorse',
    skins: ['All', 'Dry'],
    whatItDoes: 'A K-beauty superstar ingredient containing a complex cocktail of glycoproteins, hyaluronic acid, glycolic acid, zinc, copper, and antimicrobial peptides.',
    howItWorks: 'The combination of growth factors, humectants, and mild exfoliating acids provides simultaneous hydration, repair, and gentle resurfacing. Copper peptides in mucus activate collagen and elastin synthesis.',
    bestFor: ['All-round skin repair', 'Dehydration', 'Acne scarring', 'Uneven texture', 'Fine lines', 'Post-breakout recovery'],
    pairWith: ['Hyaluronic Acid', 'Niacinamide', 'Peptides'],
    concentration: '70–96% mucin in most effective formulas.',
    funFact: 'Snail mucin is harvested humanely by allowing garden snails to glide across collection surfaces. South Korean snail farms supply the majority of global beauty-grade mucin.',
  },
  {
    name: 'Artemisia (Mugwort)',
    inci: 'Artemisia Capillaris Extract',
    category: 'Botanicals',
    origin: 'Plant',
    rating: 'Workhorse',
    skins: ['Sensitive', 'Oily', 'Combo'],
    whatItDoes: 'A traditional Korean medicinal herb with powerful anti-inflammatory, antibacterial, and antioxidant properties — increasingly common in modern K-beauty.',
    howItWorks: 'Rich in flavonoids, coumarins, and volatile oils. Inhibits NFκB-p65 (inflammatory pathway), demonstrates antimicrobial activity against C. acnes, and soothes sebum-related congestion.',
    bestFor: ['Acne', 'Sensitive oily skin', 'Redness', 'Calming irritation'],
    pairWith: ['Centella Asiatica', 'Heartleaf', 'Niacinamide'],
    funFact: 'Mugwort has been used in Korean medicine (Hanbang) for over 1,500 years. Brands like I\'m From have made it the hero ingredient of a dedicated product line.',
  },
  {
    name: 'Houttuynia Cordata (Heartleaf)',
    inci: 'Houttuynia Cordata Extract',
    category: 'Botanicals',
    origin: 'Plant',
    rating: 'Workhorse',
    skins: ['Oily', 'Sensitive', 'Acne-Prone'],
    whatItDoes: 'A powerful antibacterial, anti-inflammatory herb — the breakout-fighter of Korean botanical medicine.',
    howItWorks: 'Decanoyl acetaldehyde (active compound) exhibits strong antibacterial action against C. acnes. Also inhibits IL-6 and PGE2 inflammatory mediators.',
    bestFor: ['Active acne', 'Congested pores', 'Oily skin', 'Skin purification'],
    pairWith: ['Niacinamide', 'Salicylic Acid', 'Centella Asiatica'],
    funFact: 'Called "Dokudami" (poison blocker) in Japan, where it has been used medicinally for centuries. The ANUA Heartleaf serum became a viral bestseller globally.',
  },
  {
    name: 'Propolis',
    inci: 'Propolis Extract',
    category: 'Botanicals',
    origin: 'Animal',
    rating: 'Workhorse',
    skins: ['All', 'Acne-Prone'],
    whatItDoes: 'Bee propolis — a natural antibacterial, anti-inflammatory, antioxidant-rich resin that heals blemishes and deeply nourishes skin simultaneously.',
    howItWorks: 'Rich in bioflavonoids (pinocembrin, chrysin, caffeic acid esters) that inhibit multiple inflammatory enzymes (COX, LOX) and demonstrate broad antibacterial activity. Also a potent free-radical scavenger.',
    bestFor: ['Blemish healing', 'Antioxidant protection', 'Dry + acne-prone combination', 'Nourishment'],
    pairWith: ['Niacinamide', 'Hyaluronic Acid'],
    funFact: 'Bees produce propolis by mixing tree resins with beeswax and saliva to seal their hives against bacteria and fungi — nature\'s original antimicrobial sealant.',
  },
  // ─── Actives & Science ───
  {
    name: 'Retinol',
    inci: 'Retinol',
    category: 'Actives',
    origin: 'Synthetic',
    rating: 'Workhorse',
    skins: ['Oily', 'Combo', 'Dry'],
    whatItDoes: 'The most evidence-backed anti-aging active in existence. Stimulates collagen, accelerates cell turnover, and reduces fine lines, texture, dark spots, and even acne.',
    howItWorks: 'Converts to retinoic acid in skin, which binds retinoic acid receptors (RARs) in keratinocytes and fibroblasts. This directly upregulates Type I and III collagen gene expression, accelerates epidermal cell renewal by up to 30%, and inhibits matrix metalloproteinases (enzymes that degrade collagen).',
    bestFor: ['Anti-aging', 'Fine lines & wrinkles', 'Uneven texture', 'Hyperpigmentation', 'Acne'],
    pairWith: ['Hyaluronic Acid', 'Ceramides', 'Peptides'],
    avoidWith: ['AHAs/BHAs (same session)', 'Vitamin C (layer separately)', 'Benzoyl Peroxide'],
    concentration: '0.025% start → 0.1% maintenance. Use PM only. Always follow with SPF AM.',
    funFact: 'Retinol must be converted to retinaldehyde, then to retinoic acid (tretinoin) before it\'s active. Each conversion step reduces potency — but also reduces irritation. Prescription tretinoin is 20x more potent.',
  },
  {
    name: 'Peptides',
    inci: 'Palmitoyl Tripeptide-1, Argireline, etc.',
    category: 'Actives',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All'],
    whatItDoes: 'Short chains of amino acids that act as cell-signalling molecules, telling skin to produce more collagen, elastin, and repair itself.',
    howItWorks: 'Peptides mimic fragments of broken-down collagen. When skin "sees" these fragments, it believes collagen is degrading and up-regulates collagen synthesis in response. Specific peptides also inhibit acetylcholine release (like Argireline — a topical "Botox-like" peptide).',
    bestFor: ['Anti-aging', 'Loss of firmness', 'Fine lines', 'Barrier repair', 'General skin health'],
    pairWith: ['Hyaluronic Acid', 'Ceramides', 'Vitamin C'],
    avoidWith: ['High-concentration acids (they can break down peptide chains)'],
    funFact: 'There are over 300 different cosmetic peptides currently used in skincare. Matrixyl 3000 (Palmitoyl Tripeptide-1 + Palmitoyl Tetrapeptide-7) is one of the most clinically validated.',
  },
  {
    name: 'Adenosine',
    inci: 'Adenosine',
    category: 'Actives',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['All', 'Sensitive'],
    whatItDoes: 'A naturally occurring nucleoside with clinically proven wrinkle-reduction properties — and one of only a handful of ingredients approved by the FDA as a wrinkle reducer.',
    howItWorks: 'Binds adenosine receptors in fibroblasts, stimulating collagen and elastin production. Also has vasodilatory anti-inflammatory effects, reducing redness.',
    bestFor: ['Fine lines', 'Skin firmness', 'Sensitive aging skin', 'Anti-inflammatory support'],
    pairWith: ['Retinol', 'Peptides', 'Niacinamide'],
    concentration: '0.04–0.1% effective.',
    funFact: 'Found in every living cell on Earth as a primary energy carrier (ATP = adenosine triphosphate). In skincare, it directly activates fibroblasts — the collagen-producing cells.',
  },
  {
    name: 'EGF (Epidermal Growth Factor)',
    inci: 'sh-Oligopeptide-1',
    category: 'Actives',
    origin: 'Fermented',
    rating: 'Well-Studied',
    skins: ['All', 'Mature'],
    whatItDoes: 'A signaling protein that accelerates cell turnover, wound healing, and skin renewal. Most commonly used in post-procedure skincare and advanced anti-aging.',
    howItWorks: 'Binds the EGF receptor (EGFR) on keratinocytes, triggering a signaling cascade that promotes cell division, migration, and differentiation — dramatically accelerating skin renewal rate.',
    bestFor: ['Anti-aging', 'Post-procedure recovery', 'Uneven texture', 'Wound healing', 'Dull skin'],
    pairWith: ['Peptides', 'Hyaluronic Acid', 'PDRN'],
    concentration: '0.001–1ppm is biologically active.',
    funFact: 'The discovery of EGF won the 1986 Nobel Prize in Physiology or Medicine. Stanley Cohen identified it while studying nerve growth factor — and noticed it dramatically accelerated eye-opening in newborn mice.',
  },
  {
    name: 'PDRN (Salmon DNA)',
    inci: 'Polydeoxyribonucleotide',
    category: 'Actives',
    origin: 'Marine',
    rating: 'Well-Studied',
    skins: ['All', 'Mature'],
    whatItDoes: 'Extracted from salmon sperm DNA, PDRN stimulates cell regeneration by binding adenosine receptors — triggering tissue repair and collagen synthesis at a deep level.',
    howItWorks: 'PDRN fragments bind A2A adenosine receptors, activating fibroblast proliferation, promoting vascular endothelial growth factor (VEGF), and providing a pool of nucleotides for DNA repair and synthesis.',
    bestFor: ['Advanced anti-aging', 'Skin regeneration', 'Post-procedure recovery', 'Dull, damaged skin'],
    pairWith: ['EGF', 'Peptides', 'Hyaluronic Acid'],
    funFact: 'PDRN DNA is structurally identical to human DNA at 97% — salmon DNA and human DNA are close enough in structure that skin absorbs the fragments as building blocks for its own repair processes.',
  },
  {
    name: 'Zinc PCA',
    inci: 'Zinc PCA',
    category: 'Actives',
    origin: 'Synthetic',
    rating: 'Hero',
    skins: ['Oily', 'Acne-Prone', 'Combo'],
    whatItDoes: 'A targeted sebum controller and antibacterial agent — specifically engineered for oily and acne-prone skin without the drying effects of harsh actives.',
    howItWorks: 'Zinc inhibits 5α-reductase — the enzyme that converts testosterone to DHT, which directly stimulates sebum production. PCA (pyrrolidone carboxylic acid) is a natural moisturising factor that prevents the drying effects of zinc alone.',
    bestFor: ['Oily skin', 'Enlarged pores', 'Acne-prone skin', 'Sebum control', 'Anti-bacterial defence'],
    pairWith: ['Niacinamide', 'Salicylic Acid', 'Heartleaf'],
    concentration: '0.1–2%.',
    funFact: 'Zinc PCA is what many countries\' prescription dandruff shampoos use as the active — its sebum-regulating mechanism works on the scalp and face alike.',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(INGREDIENTS.map(i => i.category)))];
const ORIGINS = ['All', 'Plant', 'Fermented', 'Synthetic', 'Marine', 'Animal', 'Mineral'];
const RATINGS = ['All', 'Hero', 'Workhorse', 'Well-Studied', 'Use with Care'];

const ratingConfig: Record<SafetyRating, { color: string; icon: string }> = {
  'Hero': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '⭐' },
  'Workhorse': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💪' },
  'Well-Studied': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🔬' },
  'Use with Care': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '⚠️' },
};

const originConfig: Record<string, string> = {
  'Plant': 'bg-green-50 text-green-700',
  'Fermented': 'bg-yellow-50 text-yellow-700',
  'Synthetic': 'bg-blue-50 text-blue-700',
  'Marine': 'bg-cyan-50 text-cyan-700',
  'Animal': 'bg-orange-50 text-orange-700',
  'Mineral': 'bg-stone-50 text-stone-700',
};

export default function IngredientGlossaryModal({ isOpen, onClose }: IngredientGlossaryModalProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [rating, setRating] = useState('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return INGREDIENTS.filter(ing => {
      const matchSearch = !q || ing.name.toLowerCase().includes(q) || ing.whatItDoes.toLowerCase().includes(q) || (ing.inci?.toLowerCase().includes(q) ?? false);
      const matchCat = category === 'All' || ing.category === category;
      const matchRating = rating === 'All' || ing.rating === rating;
      return matchSearch && matchCat && matchRating;
    });
  }, [search, category, rating]);

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
            <div className="bg-white/60 backdrop-blur-xl border-b border-white/40 px-6 pt-6 pb-4 flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-ink-500 uppercase">The Skin Boutique</span>
                  <h1 className="text-2xl font-serif text-ink-900 mt-1">Ingredient Glossary</h1>
                  <p className="text-ink-500 text-xs mt-1">The science behind the products you use — no fluff.</p>
                </div>
                <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 border border-white/40 flex items-center justify-center transition-colors mt-1">
                  <X className="w-4 h-4 text-ink-500" />
                </button>
              </div>
              {/* Search */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search ingredients..."
                  className="w-full bg-white/40 border border-white/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 flex-wrap">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${category === c ? 'bg-[#D4AF37] text-white' : 'bg-white/60 border border-white/40 text-ink-900 hover:bg-white/80'}`}
                    >{c}</button>
                  ))}
                </div>
              </div>
              {/* Rating filter */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {RATINGS.map(r => (
                  <button key={r} type="button" onClick={() => setRating(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${rating === r ? 'bg-[#D4AF37] text-white' : 'bg-white/60 border border-white/40 text-ink-900 hover:bg-white/80'}`}
                  >{r === 'All' ? 'All Ratings' : `${r}`}</button>
                ))}
              </div>
              <p className="text-ink-500 text-xs mt-2">{filtered.length} ingredient{filtered.length !== 1 ? 's' : ''}</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <p className="text-sm">No ingredients found.</p>
                </div>
              ) : filtered.map((ing) => {
                const isOpen_ = openId === ing.name;
                const rc = ratingConfig[ing.rating];
                return (
                  <div key={ing.name}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen_ ? null : ing.name)}
                      className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">{ing.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rc.color}`}>{rc.icon} {ing.rating}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${originConfig[ing.origin]}`}>{ing.origin}</span>
                        </div>
                        {ing.inci && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{ing.inci}</p>}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{ing.whatItDoes}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen_ ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen_ && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden bg-gray-50 border-t border-gray-100"
                        >
                          <div className="px-5 py-4 space-y-3">
                            {/* What it does */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">What It Does</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{ing.whatItDoes}</p>
                            </div>
                            {/* Science */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">🔬 How It Works</p>
                              <p className="text-sm text-indigo-900 leading-relaxed">{ing.howItWorks}</p>
                            </div>
                            {/* Best for */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Best For</p>
                              <div className="flex flex-wrap gap-1.5">
                                {ing.bestFor.map(b => <span key={b} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100">{b}</span>)}
                              </div>
                            </div>
                            {/* Pair with / Avoid */}
                            <div className="grid grid-cols-2 gap-2">
                              {ing.pairWith && ing.pairWith.length > 0 && (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-2">
                                  <p className="text-[10px] font-bold text-green-700 mb-1">✅ Pairs Well With</p>
                                  <p className="text-xs text-green-800">{ing.pairWith.join(', ')}</p>
                                </div>
                              )}
                              {ing.avoidWith && ing.avoidWith.length > 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-2">
                                  <p className="text-[10px] font-bold text-red-700 mb-1">⚠️ Avoid Combining</p>
                                  <p className="text-xs text-red-800">{ing.avoidWith.join(', ')}</p>
                                </div>
                              )}
                            </div>
                            {/* Concentration */}
                            {ing.concentration && (
                              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-2">
                                <span className="text-sm">💊</span>
                                <div>
                                  <p className="text-[10px] font-bold text-amber-700">Effective Concentration</p>
                                  <p className="text-xs text-amber-800">{ing.concentration}</p>
                                </div>
                              </div>
                            )}
                            {/* Fun fact */}
                            {ing.funFact && (
                              <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl p-2">
                                <span className="text-sm">💡</span>
                                <p className="text-xs text-purple-800"><strong>Fun Fact:</strong> {ing.funFact}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
