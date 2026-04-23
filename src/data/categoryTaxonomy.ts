/**
 * Category Taxonomy — Maps 80+ raw product categories from products.json
 * into clean shop sections for the storefront.
 *
 * Used by ShopPage, BundleBuilder, and any component that needs to group products.
 */

export interface ShopSection {
  id: string;
  label: string;
  emoji: string;
  description: string;
  /** Raw category strings from products.json that map to this section */
  rawCategories: string[];
}

export const SHOP_SECTIONS: ShopSection[] = [
  {
    id: 'cleansers',
    label: 'Cleansers',
    emoji: '🧴',
    description: 'Start fresh — oil, foam, gel, and balm cleansers for every skin type.',
    rawCategories: [
      'Foam Cleanser', 'Oil Cleanser', 'Gel Cleanser', 'Water Cleanser',
      'Cleansing Balm', 'Cream Cleanser', 'Bar Soap', 'Cleanser', 'Makeup Remover',
      'Mascara Remover',
    ],
  },
  {
    id: 'toners-essences',
    label: 'Toners & Essences',
    emoji: '💧',
    description: 'Prep, hydrate, and balance — the step most routines skip.',
    rawCategories: [
      'Toner', 'Essence', 'Toner Pads', 'Facial Mist', 'Emulsion',
    ],
  },
  {
    id: 'serums-ampoules',
    label: 'Serums & Ampoules',
    emoji: '✨',
    description: 'Concentrated actives — where the real transformation happens.',
    rawCategories: [
      'Serum', 'Ampoule', 'Spot Treatment', 'Eye Serum', 'Facial Oil',
      'Acne Treatments & Kits',
    ],
  },
  {
    id: 'moisturizers',
    label: 'Moisturizers',
    emoji: '🧊',
    description: 'Lock it all in — creams, gels, and lotions for glass-level hydration.',
    rawCategories: [
      'Cream', 'Lotion', 'Gel', 'Eye Cream', 'Balm',
    ],
  },
  {
    id: 'masks-treatments',
    label: 'Masks & Treatments',
    emoji: '🎭',
    description: 'Weekly rituals — sheet masks, sleep masks, peels, and targeted treatments.',
    rawCategories: [
      'Sheet Masks', 'Sleep Mask', 'Wash-off Face Mask', 'Peel-off Face Mask',
      'Eye Masks', 'Eye Patch', 'Face Mask', 'Steam Mask', 'Exfoliator',
      'Peeling Gel', 'Pore Strip',
    ],
  },
  {
    id: 'sun-protection',
    label: 'Sun Protection',
    emoji: '☀️',
    description: 'Non-negotiable — lightweight K-Beauty SPF that feels invisible.',
    rawCategories: [
      'Sunscreen', 'BB Cream',
    ],
  },
  {
    id: 'makeup',
    label: 'Makeup',
    emoji: '💄',
    description: 'K-Beauty colour — dewy finishes, gradient lips, effortless glow.',
    rawCategories: [
      'Blush & Highlighter', 'Lip Gloss', 'Lip Tint', 'Lipstick',
      'Eye Shadow', 'Eyebrow', 'Cushion Foundation', 'Primer', 'Concealer',
      'Mascara', 'Liquid Eyeliner', 'Setting Powder', 'Setting Spray',
      'Pencil Eyeliner', 'Lip Liner', 'Liquid Foundation', 'Gel Eyeliner',
      'Lip Balms', 'Lip Sleeping Mask', 'Lip Care',
    ],
  },
  {
    id: 'hair-body',
    label: 'Hair & Body',
    emoji: '🌿',
    description: 'Head-to-toe K-Beauty — shampoo, treatments, and body care.',
    rawCategories: [
      'Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Set',
      'Hair Mask', 'Hair Tools', 'Hair Tonic', 'Hair Water', 'Dry Shampoo',
      'Hair Accessory', 'Hair Cushion',
      'Body Wash', 'Body Lotion', 'Body Cream', 'Body Mist',
      'Hand Cream', 'Hand Mask', 'Hand Soap',
      'Feet Mask', 'Foot Mask',
    ],
  },
  {
    id: 'tools-devices',
    label: 'Tools & Devices',
    emoji: '⚡',
    description: 'Level up — LED masks, Gua Sha, rollers, and professional devices.',
    rawCategories: [
      'Skin Care Tools', 'Makeup Tools', 'Makeup Sponge', 'Brush',
      'Facial Cotton', 'Cotton Swabs',
    ],
  },
  {
    id: 'sets-minis',
    label: 'Sets & Minis',
    emoji: '🎁',
    description: 'Perfect for gifting or trying before you commit.',
    rawCategories: [
      'Skincare Set', 'Travel Set',
    ],
  },
];

/**
 * Quickly look up which section a raw category belongs to.
 * Returns section ID or 'uncategorized' if no match.
 */
const _categoryToSectionMap = new Map<string, string>();
SHOP_SECTIONS.forEach(section => {
  section.rawCategories.forEach(raw => {
    _categoryToSectionMap.set(raw.toLowerCase(), section.id);
  });
});

export function getSectionForCategory(rawCategory: string): string {
  return _categoryToSectionMap.get(rawCategory.toLowerCase()) || 'uncategorized';
}

/**
 * Groups an array of products by shop section.
 * Returns a Map<sectionId, Product[]> preserving section order.
 */
export function groupProductsBySection<T extends { category: string }>(
  products: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  // Pre-initialize with empty arrays in section order
  SHOP_SECTIONS.forEach(s => grouped.set(s.id, []));
  grouped.set('uncategorized', []);

  products.forEach(product => {
    const sectionId = getSectionForCategory(product.category);
    const arr = grouped.get(sectionId);
    if (arr) arr.push(product);
  });

  // Remove empty sections
  for (const [key, val] of grouped) {
    if (val.length === 0) grouped.delete(key);
  }

  return grouped;
}
