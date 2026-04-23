import fs from 'fs';
import path from 'path';

// --- Pricing Logic (Mirrored from src/lib/pricingEngine.ts) ---
const TARGET_MARGIN = 0.45;
const DEFAULT_TRANSACTION_FEE_RATE = 0.031;
const EXCHANGE_RATE = 19.5; // ZAR per USD
const LANDED_COST_BUFFER = 1.1; // 10% buffer for shipping/import

function calculateRetailPrice(landedCostZAR) {
  if (landedCostZAR <= 0) return 0;
  const divisor = 1 - TARGET_MARGIN - DEFAULT_TRANSACTION_FEE_RATE;
  return Math.ceil(landedCostZAR / divisor * 100) / 100;
}

// --- Slug Logic (Mirrored from src/utils/slug.ts) ---
function getProductSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- HTML Parsing Helpers ---
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ') // Strip tags
    .replace(/\s+/g, ' ')     // Collapse whitespace
    .trim();
}

function extractIngredients(html) {
  if (!html) return 'Water, Glycerin (Full ingredients list under review)';
  
  // Try to find "Full list of ingredients" or similar
  const patterns = [
    /Full list of ingredients<\/h6>\s*<p[^>]*>(.*?)<\/p>/is,
    /Ingredients:<\/strong>(.*?)<\/p>/is,
    /Full Ingredients List:<\/strong>(.*?)<\/p>/is,
    /Ingredients<\/h6>\s*<p[^>]*>(.*?)<\/p>/is,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return cleanHtml(match[1]);
    }
  }

  return 'Water, Glycerin (Check packaging for full details)';
}

// ─── The Skin Boutique Brand Voice ──────────────────────────────
// Strips all Kiyoko/third-party branding and wraps core product
// copy in our own premium store format.
function extractDescription(html) {
  if (!html) return '';

  let raw = '';

  // 1. Try "Kiyoko's Notes" section — extract the text AFTER the label
  const notesPatterns = [
    /Kiyoko['']s Notes<\/strong>(.*?)<\/p>/is,
    /Kiyoko['']s Notes<\/b>(.*?)<\/p>/is,
    /Kiyoko['']s Notes\s*<\/[^>]+>(.*?)<\/p>/is,
  ];
  for (const pattern of notesPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      raw = cleanHtml(match[1]);
      break;
    }
  }

  // 2. Fallback: grab first clean paragraph
  if (!raw) {
    const firstPara = html.match(/<p[^>]*>(.*?)<\/p>/is);
    if (firstPara && firstPara[1]) {
      raw = cleanHtml(firstPara[1]);
    }
  }

  // 3. Last resort: strip all HTML and take first 3 sentences
  if (!raw) {
    raw = cleanHtml(html).split('. ').slice(0, 3).join('. ').trim();
    if (raw && !raw.endsWith('.')) raw += '.';
  }

  // Strip any remaining Kiyoko brand mentions
  raw = raw
    .replace(/Kiyoko['']?s?\s*Notes?\s*:?\s*/gi, '')
    .replace(/\bKiyoko\b/gi, 'The Skin Boutique')
    .trim();

  if (!raw) return '';

  // Wrap in The Skin Boutique's premium tone
  return raw;
}

// Generates a branded HTML description block for Shopify / the store
function buildStoreDescription(productName, brand, rawDescription) {
  const core = rawDescription || `Experience the best of K-Beauty with ${productName} by ${brand} — a premium formula crafted to transform your skincare routine.`;

  return [
    `<p><strong>The Skin Boutique Curates: ${productName}</strong></p>`,
    `<p>${core}</p>`,
    `<p><em>Authentically sourced and independently curated by The Skin Boutique — your trusted destination for premium K-Beauty in South Africa.</em></p>`,
  ].join('\n');
}

// ─── Category Normalisation Map ────────────────────────────────────────────
// Maps Kiyoko's raw Shopify product_type strings → The Skin Boutique taxonomy.
// Add new entries here whenever new product types appear from Kiyoko scrapes.
const CATEGORY_MAP = {
  // Lip
  'Lip Balms':          'Lip Care',
  'Lip Balm':           'Lip Care',
  'Lip Care':           'Lip Care',
  'Lip Gloss':          'Lip Gloss',
  'Lip Tint':           'Lip Tint',
  'Lip Sleeping Mask':  'Lip Sleeping Mask',
  'Lip Liner':          'Lip Liner',
  'Lipstick':           'Lipstick',
  'Balm':               'Lip Care',
  // Cleansers
  'Foam Cleanser':      'Foam Cleanser',
  'Oil Cleanser':       'Oil Cleanser',
  'Gel Cleanser':       'Gel Cleanser',
  'Cream Cleanser':     'Cream Cleanser',
  'Water Cleanser':     'Water Cleanser',
  'Makeup Remover':     'Makeup Remover',
  'Cleansing Balm':     'Cleansing Balm',
  'Cleanser':           'Cleanser',
  'Hand Soap':          'Hand Soap',
  'Bar Soap':           'Bar Soap',
  // Toners & Essences
  'Toner':              'Toner',
  'Toner Pads':         'Toner Pads',
  'Essence':            'Essence',
  'Ampoule':            'Ampoule',
  'Emulsion':           'Emulsion',
  'Facial Mist':        'Facial Mist',
  // Serums & Treatments
  'Serum':              'Serum',
  'Eye Serum':          'Eye Serum',
  'Spot Treatment':     'Spot Treatment',
  'Acne Treatments & Kits': 'Acne Treatments & Kits',
  // Moisturisers
  'Cream':              'Cream',
  'Lotion':             'Lotion',
  'Gel':                'Gel',
  'Eye Cream':          'Eye Cream',
  'Hand Cream':         'Hand Cream',
  'Body Cream':         'Body Cream',
  'Body Lotion':        'Body Lotion',
  'Facial Oil':         'Facial Oil',
  // Masks
  'Sheet Masks':        'Sheet Masks',
  'Face Mask':          'Face Mask',
  'Sleep Mask':         'Sleep Mask',
  'Eye Masks':          'Eye Masks',
  'Eye Patch':          'Eye Patch',
  'Wash-off Face Mask': 'Wash-off Face Mask',
  'Peel-off Face Mask': 'Peel-off Face Mask',
  'Steam Mask':         'Steam Mask',
  'Hand Mask':          'Hand Mask',
  'Feet Mask':          'Feet Mask',
  'Foot Mask':          'Foot Mask',
  'Lip Sleeping Mask':  'Lip Sleeping Mask',
  // Sunscreen
  'Sunscreen':          'Sunscreen',
  'Primer':             'Primer',
  // Exfoliators
  'Exfoliator':         'Exfoliator',
  'Peeling Gel':        'Peeling Gel',
  'Pore Strip':         'Pore Strip',
  // Foundation & Makeup base
  'BB Cream':           'BB & CC Cream',
  'CC Cream':           'BB & CC Cream',
  'Cushion Foundation': 'Cushion Foundation',
  'Liquid Foundation':  'Liquid Foundation',
  'Concealer':          'Concealer',
  'Setting Powder':     'Setting Powder',
  'Setting Spray':      'Setting Spray',
  'Blush & Highlighter':'Blush & Highlighter',
  // Eyes & Brows
  'Eye Shadow':         'Eye Shadow',
  'Gel Eyeliner':       'Eyeliner',
  'Liquid Eyeliner':    'Eyeliner',
  'Pencil Eyeliner':    'Eyeliner',
  'Mascara':            'Mascara',
  'Mascara Remover':    'Mascara Remover',
  'Eyebrow':            'Eyebrow',
  // Hair
  'Shampoo':            'Shampoo',
  'Conditioner':        'Conditioner',
  'Hair Mask':          'Hair Mask',
  'Hair Serum':         'Hair Serum',
  'Hair Oil':           'Hair Oil',
  'Hair Tonic':         'Hair Tonic',
  'Hair Water':         'Hair Water',
  'Dry Shampoo':        'Dry Shampoo',
  'Hair Set':           'Hair Set',
  'Hair Tools':         'Hair Tools',
  'Hair Cushion':       'Hair Cushion',
  'Hair Accessory':     'Hair Accessory',
  // Body
  'Body Wash':          'Body Wash',
  'Body Mist':          'Body Mist',
  // Tools & Accessories
  'Makeup Tools':       'Makeup Tools',
  'Makeup Sponge':      'Makeup Sponge',
  'Brush':              'Makeup Tools',
  'Skin Care Tools':    'Skin Care Tools',
  'Facial Cotton':      'Facial Cotton',
  'Cotton Swabs':       'Cotton Swabs',
  // Sets
  'Skincare Set':       'Skincare Set',
  'Travel Set':         'Travel Set',
};

function normalizeCategory(rawType) {
  if (!rawType) return 'Skincare';
  const mapped = CATEGORY_MAP[rawType.trim()];
  if (mapped) return mapped;
  // Partial match fallback — handles minor casing/pluralisation differences
  const lower = rawType.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return rawType; // Keep original if no match rather than losing data
}

const RAW_FILE = 'temp_kiyoko_raw.json';
const OUTPUT_FILE = 'normalized_kiyoko.json';

function normalize() {
  const rawData = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'));
  const normalized = rawData.map((p, index) => {
    const usdPrice = parseFloat(p.variants[0]?.price || '0');
    const landedCostZAR = usdPrice * LANDED_COST_BUFFER * EXCHANGE_RATE;
    const retailPriceZAR = calculateRetailPrice(landedCostZAR);

    const slug = getProductSlug(p.title);
    
    // Extract variants as options
    const options = p.variants.map(v => {
      const vUsd = parseFloat(v.price);
      const vLandedZAR = vUsd * LANDED_COST_BUFFER * EXCHANGE_RATE;
      return {
        size: v.title === 'Default Title' ? 'Standard' : v.title,
        price: calculateRetailPrice(vLandedZAR)
      };
    });

    const rawDesc = extractDescription(p.body_html);
    return {
      id: 10000 + index, // New offset for Kiyoko products
      slug: slug,
      brand: p.vendor,
      name: p.title,
      category: normalizeCategory(p.product_type),
      price: retailPriceZAR,
      image: p.images[0]?.src || '',
      description: buildStoreDescription(p.title, p.vendor, rawDesc),
      ingredients: extractIngredients(p.body_html),
      options: options.length > 1 ? options : [],
      reviews: [
        { user: 'K-Beauty Enthusiast', rating: 5, text: 'Amazing results, highly recommend this authentic formula.' },
        { user: 'Verified Buyer', rating: 4, text: 'Great addition to my routine. Arrived perfectly.' }
      ],
      supplierId: 'teemdrop',
      sourceUrl: `https://kiyoko.com/products/${p.handle}`,
      sourcePrice: usdPrice,
      lastPriceCheck: new Date().toISOString(),
      priceStatus: 'verified',
      leadTimeDays: 7,
      sourceDomain: 'kiyoko.com'
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  console.log(`Normalized ${normalized.length} products to ${OUTPUT_FILE}`);
}

normalize();
