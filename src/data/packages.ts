/**
 * Pre-Built Routine Packages
 *
 * Fixed-price bundles curated by The Skin Boutique.
 * Each package is a complete routine with step-by-step product selection.
 *
 * Prices auto-calculate: 20% off combined retail.
 * Products are matched by name substring against the live catalog.
 */

export interface PackageStep {
  step: number;
  label: string;
  /** Matched case-insensitive against product names in the catalog */
  productMatch: string;
  /** Why this step matters (shown in expandable section) */
  why: string;
}

export interface RoutinePackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  steps: PackageStep[];
  /** Discount off combined retail (0.20 = 20%) */
  discountPercent: number;
  badge?: 'BESTSELLER' | 'NEW' | 'LIMITED' | 'GIFT READY';
  skinTypes: string[];
  concerns: string[];
  /** Visual gradient for the card background */
  gradient: string;
  /** Estimated time to see results */
  resultsTimeline: string;
  /** Social proof number */
  socialProof: number;
  sortOrder: number;
}

export const ROUTINE_PACKAGES: RoutinePackage[] = [
  {
    id: 'glass-skin-ritual',
    name: 'The Glass Skin Ritual',
    tagline: 'Your complete 5-step K-Beauty transformation',
    description: 'The iconic glass skin look — luminous, translucent, and hydrated from within. This is the routine that put K-Beauty on the map. Five carefully layered steps that build hydration at every level.',
    steps: [
      {
        step: 1,
        label: 'Double Cleanse',
        productMatch: 'anua heartleaf pore control cleansing oil',
        why: 'Oil dissolves sunscreen, makeup, and sebum without stripping. Heartleaf calms as it cleanses.',
      },
      {
        step: 2,
        label: 'Tone & Prep',
        productMatch: 'anua heartleaf 77% soothing toner',
        why: 'Balances pH after cleansing and delivers the first layer of hydration. 77% heartleaf extract soothes.',
      },
      {
        step: 3,
        label: 'Treat',
        productMatch: 'cosrx advanced snail 96 mucin',
        why: 'Snail mucin repairs micro-tears, plumps fine lines, and creates the glass-like sheen K-Beauty is famous for.',
      },
      {
        step: 4,
        label: 'Hydrate & Seal',
        productMatch: 'beauty of joseon dynasty cream',
        why: 'Rice bran + ginseng cream locks in all previous layers. Traditional hanbang ingredients for lasting glow.',
      },
      {
        step: 5,
        label: 'Protect',
        productMatch: 'beauty of joseon relief sun',
        why: 'Lightweight SPF 50 with rice extract. No white cast, no greasiness — just invisible UV protection that preserves your glass finish.',
      },
    ],
    discountPercent: 0.20,
    badge: 'BESTSELLER',
    skinTypes: ['normal', 'dry', 'combination'],
    concerns: ['hydration', 'glow', 'barrier repair'],
    gradient: 'from-sky-50 via-blue-50 to-indigo-50',
    resultsTimeline: 'Week 1: Softer texture. Week 3: Visible glow. Week 6: Glass skin.',
    socialProof: 847,
    sortOrder: 1,
  },
  {
    id: 'brightening-edit',
    name: 'The Brightening Edit',
    tagline: 'Fade dark spots, reveal radiance',
    description: 'Hyperpigmentation, post-acne marks, dull skin — this routine attacks discolouration from three angles: Vitamin C, Niacinamide, and chemical exfoliation. Results you can photograph.',
    steps: [
      {
        step: 1,
        label: 'Gentle Exfoliate',
        productMatch: 'cosrx aha bha clarifying treatment toner',
        why: 'AHA loosens dead cells, BHA clears pores. Creates a clean canvas for vitamin C to penetrate.',
      },
      {
        step: 2,
        label: 'Brighten',
        productMatch: 'medicube deep vita c capsule serum',
        why: 'Pure vitamin C in capsule form — fresh activation every use. Inhibits melanin production at the source.',
      },
      {
        step: 3,
        label: 'Tone Even',
        productMatch: 'medicube kojic acid turmeric niacinamide serum',
        why: 'Kojic acid + niacinamide is the Korean dermatologist\'s go-to for stubborn dark spots.',
      },
      {
        step: 4,
        label: 'Protect',
        productMatch: 'skin1004 centella hyalu-cica water-fit sun',
        why: 'UV exposure is the #1 cause of dark spot relapse. This SPF ensures your brightening work isn\'t undone.',
      },
    ],
    discountPercent: 0.20,
    badge: 'NEW',
    skinTypes: ['all'],
    concerns: ['dark spots', 'brightening', 'uneven tone'],
    gradient: 'from-amber-50 via-yellow-50 to-orange-50',
    resultsTimeline: 'Week 2: Brighter overall tone. Week 4: Spots visibly fading. Week 8: Dramatically even.',
    socialProof: 523,
    sortOrder: 2,
  },
  {
    id: 'barrier-repair',
    name: 'The Barrier Repair',
    tagline: 'Rebuild, soothe, and strengthen',
    description: 'For over-exfoliated, irritated, or sensitised skin. This minimalist routine focuses on ceramides, centella, and gentle hydration to rebuild your moisture barrier from scratch.',
    steps: [
      {
        step: 1,
        label: 'Gentle Cleanse',
        productMatch: 'cosrx low ph good morning gel cleanser',
        why: 'pH 5.0-6.0 — matches your skin\'s natural acidity. Won\'t further compromise a damaged barrier.',
      },
      {
        step: 2,
        label: 'Repair',
        productMatch: 'skin1004 madagascar centella ampoule',
        why: 'Madagascar centella asiatica at clinical concentration. Stimulates collagen and repairs barrier lipids.',
      },
      {
        step: 3,
        label: 'Seal & Soothe',
        productMatch: 'illiyoon ceramide ato concentrate cream',
        why: 'Ceramide-dominant cream that mimics your skin\'s natural lipid structure. Dermatologist-recommended for eczema-prone skin.',
      },
    ],
    discountPercent: 0.15,
    skinTypes: ['sensitive', 'dry', 'all'],
    concerns: ['barrier repair', 'sensitivity', 'redness'],
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    resultsTimeline: 'Day 3: Less tightness. Week 1: Redness calming. Week 3: Barrier restored.',
    socialProof: 412,
    sortOrder: 3,
  },
  {
    id: 'the-starter',
    name: 'The Starter',
    tagline: 'Begin your K-Beauty journey',
    description: 'New to skincare? Start here. Two products, zero overwhelm. A cleanser and moisturiser that work for every skin type — the absolute minimum effective routine.',
    steps: [
      {
        step: 1,
        label: 'Cleanse',
        productMatch: 'cosrx low ph good morning gel cleanser',
        why: 'The most-recommended first cleanser in K-Beauty. Low pH, gentle, effective. Can\'t go wrong.',
      },
      {
        step: 2,
        label: 'Moisturise',
        productMatch: 'cosrx advanced snail 92 all in one cream',
        why: 'Snail mucin cream that hydrates, repairs, and protects in one step. The multi-tasker for beginners.',
      },
    ],
    discountPercent: 0.10,
    badge: 'GIFT READY',
    skinTypes: ['all'],
    concerns: ['beginner', 'simple routine'],
    gradient: 'from-pink-50 via-rose-50 to-fuchsia-50',
    resultsTimeline: 'Day 1: Cleaner, softer skin. Week 2: You\'ll want to add step 3.',
    socialProof: 1203,
    sortOrder: 4,
  },
  {
    id: 'anti-aging-protocol',
    name: 'The Anti-Aging Protocol',
    tagline: 'Turn back the clock with PDRN + collagen',
    description: 'Salmon DNA (PDRN) signals your cells to regenerate collagen. Combined with retinol and peptides, this is the most advanced anti-aging routine in K-Beauty.',
    steps: [
      {
        step: 1,
        label: 'Cleanse',
        productMatch: 'haruharu wonder black rice moisture deep cleansing oil',
        why: 'Fermented black rice dissolves makeup while delivering antioxidants. Anti-aging starts at step 1.',
      },
      {
        step: 2,
        label: 'Activate',
        productMatch: 'numbuzin rose pdrn collagen plumping serum',
        why: 'PDRN from salmon DNA triggers collagen regeneration. Rose extract provides immediate plumping effect.',
      },
      {
        step: 3,
        label: 'Firm',
        productMatch: 'medicube collagen jelly cream',
        why: 'Collagen peptides in a jelly-cream texture that bounces on application. Firms and hydrates simultaneously.',
      },
      {
        step: 4,
        label: 'Protect',
        productMatch: 'medicube pdrn pink tone up sun cream',
        why: 'SPF + PDRN + tone-up effect. Protects your anti-aging investment while giving an instant luminous finish.',
      },
    ],
    discountPercent: 0.20,
    skinTypes: ['mature', 'normal', 'dry'],
    concerns: ['aging', 'wrinkles', 'firmness', 'collagen'],
    gradient: 'from-purple-50 via-violet-50 to-fuchsia-50',
    resultsTimeline: 'Week 2: Plumper feel. Week 4: Fine lines softening. Week 8: Visibly firmer.',
    socialProof: 634,
    sortOrder: 5,
  },
  {
    id: 'acne-reset',
    name: 'The Acne Reset',
    tagline: 'Clear, calm, and prevent',
    description: 'BHA clears pores, centella calms inflammation, and lightweight hydration prevents the dryness that triggers more breakouts. This routine breaks the acne cycle.',
    steps: [
      {
        step: 1,
        label: 'Deep Cleanse',
        productMatch: 'cosrx salicylic acid daily gentle cleanser',
        why: 'BHA (salicylic acid) penetrates into pores to dissolve sebum plugs. Daily use prevents new breakouts.',
      },
      {
        step: 2,
        label: 'Exfoliate',
        productMatch: 'cosrx bha blackhead power liquid',
        why: 'Leave-on BHA treatment that continues working after application. Clears blackheads and prevents comedones.',
      },
      {
        step: 3,
        label: 'Soothe',
        productMatch: 'skin1004 madagascar centella ampoule',
        why: 'Centella calms post-breakout redness and inflammation without clogging pores. Non-comedogenic.',
      },
      {
        step: 4,
        label: 'Hydrate Light',
        productMatch: 'cosrx oil-free ultra moisturizing lotion',
        why: 'Oil-free hydration that won\'t feed breakouts. Birch sap provides moisture without heaviness.',
      },
    ],
    discountPercent: 0.20,
    skinTypes: ['oily', 'combination', 'acne-prone'],
    concerns: ['acne', 'blackheads', 'breakouts', 'oil control'],
    gradient: 'from-cyan-50 via-sky-50 to-blue-50',
    resultsTimeline: 'Week 1: Fewer new breakouts. Week 3: Existing spots fading. Week 6: Significantly clearer.',
    socialProof: 731,
    sortOrder: 6,
  },
];
