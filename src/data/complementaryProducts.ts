/**
 * Complementary Product Ecosystems
 *
 * Defines which products work together as systems.
 * Think of these like "character loadouts" in a game — each ecosystem
 * has a hero (anchor) product and companions that amplify it.
 *
 * Used by BundlesPage to create brand ecosystem showcases.
 */

export interface ProductEcosystem {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  /** The anchor/hero product that the ecosystem revolves around */
  heroProductMatch: string;
  /** Companion product name substrings (matched case-insensitive against catalog) */
  companionMatches: string[];
  /** Why these products work together */
  synergyNote: string;
  /** Display badge */
  badge?: 'BESTSELLER' | 'NEW' | 'PREMIUM' | 'TRENDING';
  /** Sort order on the bundles page */
  sortOrder: number;
}

export const PRODUCT_ECOSYSTEMS: ProductEcosystem[] = [
  // ═══════════════════════════════════════════════════════
  // HIGH-TICKET DEVICE SYSTEMS
  // ═══════════════════════════════════════════════════════
  {
    id: 'medicube-booster-pro',
    name: 'Medicube Age-R Complete System',
    brand: 'Medicube',
    tagline: 'Professional-grade at-home treatment',
    description: 'The Booster Pro is a clinical EMS+LED device that supercharges serum absorption by 300%. Pair it with Medicube\'s own formulated gels and serums for maximum synergy — they\'re literally designed for each other.',
    heroProductMatch: 'age-r booster pro',
    companionMatches: [
      'collagen jelly cream',
      'zero pore cream',
      'pdrn pink collagen bubble serum',
      'deep vita c capsule serum',
      'kojic acid turmeric niacinamide serum',
      'pdrn pink tone up sun cream',
    ],
    synergyNote: 'The Booster Pro\'s microcurrent drives actives 3× deeper. Each companion is formulated to be used with the device — same molecular weight, same pH range.',
    badge: 'PREMIUM',
    sortOrder: 1,
  },
  {
    id: 'medicube-vita-c',
    name: 'Medicube Vita C Brightening System',
    brand: 'Medicube',
    tagline: 'Visible brightening in 14 days',
    description: 'A complete vitamin C regimen from Medicube — serum, cream, and sun protection designed to work as a unified brightening system.',
    heroProductMatch: 'deep vita c capsule serum',
    companionMatches: [
      'collagen jelly cream',
      'zero pore moisture sun serum',
      'kojic acid turmeric niacinamide serum',
    ],
    synergyNote: 'Vitamin C + Niacinamide + SPF is the gold standard brightening trio. Each product is pH-matched to prevent destabilisation.',
    badge: 'TRENDING',
    sortOrder: 2,
  },

  // ═══════════════════════════════════════════════════════
  // K-BEAUTY HERO ROUTINES
  // ═══════════════════════════════════════════════════════
  {
    id: 'cosrx-snail-system',
    name: 'COSRX Snail Mucin Power System',
    brand: 'COSRX',
    tagline: 'The TikTok-viral hydration engine',
    description: 'COSRX\'s Snail 96 line is the most viral K-Beauty system in history. The mucin repairs barrier, plumps, and fades scars — all without irritation.',
    heroProductMatch: 'snail 96 mucin power essence',
    companionMatches: [
      'snail mucin',
      'cosrx low ph good morning',
      'cosrx advanced snail',
      'cosrx aha bha',
    ],
    synergyNote: 'Snail mucin + low pH cleansing creates the ideal environment for barrier repair. The AHA/BHA toner preps skin to absorb 2× more mucin.',
    badge: 'BESTSELLER',
    sortOrder: 3,
  },
  {
    id: 'beauty-of-joseon-dynasty',
    name: 'Beauty of Joseon Dynasty Collection',
    brand: 'Beauty of Joseon',
    tagline: 'Hanbang heritage meets modern science',
    description: 'Beauty of Joseon draws from 500+ years of Korean herbal medicine. Ginseng, rice water, and propolis — the dynasty ingredients that built K-Beauty.',
    heroProductMatch: 'glow serum',
    companionMatches: [
      'dynasty cream',
      'relief sun',
      'calming serum',
      'revive eye serum',
      'radiance cleansing balm',
    ],
    synergyNote: 'Propolis + Niacinamide from the Glow Serum pairs with the Dynasty Cream\'s rice bran for brightening synergy. The Relief Sun locks it all in without white cast.',
    badge: 'BESTSELLER',
    sortOrder: 4,
  },
  {
    id: 'anua-heartleaf',
    name: 'ANUA Heartleaf Clear Skin System',
    brand: 'ANUA',
    tagline: 'Calm, clear, and dewy',
    description: 'Houttuynia Cordata (heartleaf) is a Korean medicinal herb that calms redness, controls oil, and clears pores — without drying. ANUA built an entire line around it.',
    heroProductMatch: 'heartleaf 77% soothing toner',
    companionMatches: [
      'heartleaf pore control cleansing oil',
      'heartleaf 77% clear pad',
      'peach niacin',
      'azelaic acid',
    ],
    synergyNote: 'The double-cleanse method: Heartleaf Oil melts sunscreen/makeup → Heartleaf Toner rebalances pH → Clear Pads exfoliate without stripping. All at 77% heartleaf concentration.',
    badge: 'TRENDING',
    sortOrder: 5,
  },
  {
    id: 'skin1004-centella',
    name: 'Skin1004 Madagascar Centella System',
    brand: 'Skin1004',
    tagline: 'Barrier repair from the wild plains',
    description: 'Skin1004 sources their Centella Asiatica exclusively from Madagascar — where the compound concentration is 2× higher than farmed variants. This is pharmaceutical-grade repair.',
    heroProductMatch: 'centella ampoule',
    companionMatches: [
      'centella tone brightening',
      'centella tea-trica',
      'centella hyalu-cica',
      'centella soothing cream',
    ],
    synergyNote: 'Centella + Hyaluronic Acid + Cica is the Korean dermatologist\'s go-to for post-procedure recovery. This system mimics that clinical protocol at home.',
    sortOrder: 6,
  },
  {
    id: 'numbuzin-pdrn',
    name: 'numbuzin PDRN Collagen System',
    brand: 'numbuzin',
    tagline: 'Salmon DNA for plumped, bouncy skin',
    description: 'PDRN (Polydeoxyribonucleotide) is extracted from salmon DNA — it signals skin cells to regenerate collagen. numbuzin makes the most accessible PDRN line in K-Beauty.',
    heroProductMatch: 'rose pdrn collagen plumping serum',
    companionMatches: [
      'pdrn collagen 2x',
      'nad+ bio lifting',
      'numbuzin no.3',
      'numbuzin no.5',
    ],
    synergyNote: 'PDRN + Rose Extract boosts collagen synthesis. Layer the standard serum AM, the 2× concentration PM. The NAD+ essence accelerates cell turnover underneath.',
    badge: 'NEW',
    sortOrder: 7,
  },
  {
    id: 'torriden-dive-in',
    name: 'Torriden DIVE-IN Hydration System',
    brand: 'Torriden',
    tagline: '5 layers of hyaluronic acid',
    description: 'Torriden uses 5 molecular weights of hyaluronic acid — from surface-level to deep dermis penetration. Each product in the line targets a different skin depth.',
    heroProductMatch: 'dive-in',
    companionMatches: [
      'torriden balanceful',
      'torriden cellmazing',
    ],
    synergyNote: 'Low-molecular HA penetrates deep, high-molecular HA seals the surface. Using the full DIVE-IN line creates a "moisture sandwich" at every skin layer.',
    sortOrder: 8,
  },
  {
    id: 'haruharu-black-rice',
    name: 'HaruHaru Wonder Black Rice System',
    brand: 'Haruharu Wonder',
    tagline: 'Fermented rice for luminous skin',
    description: 'Black rice has 6× more antioxidants than white rice. HaruHaru ferments it to reduce molecular size for deeper penetration — a traditional Korean ingredient upgraded with modern biotechnology.',
    heroProductMatch: 'black rice hyaluronic toner',
    companionMatches: [
      'black rice probiotics barrier essence',
      'black rice moisture deep cleansing oil',
      'centella 5% niacinamide',
      'rose pdrn soothing serum',
    ],
    synergyNote: 'Fermented Black Rice + Probiotics creates a prebiotic-probiotic barrier system. The Cleansing Oil starts the fermented cascade, the Toner delivers actives, and the Essence seals the microbiome.',
    sortOrder: 9,
  },
];

/**
 * Find all ecosystems for a given brand name.
 */
export function getEcosystemsByBrand(brand: string): ProductEcosystem[] {
  return PRODUCT_ECOSYSTEMS.filter(
    e => e.brand.toLowerCase() === brand.toLowerCase()
  );
}
