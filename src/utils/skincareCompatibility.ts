import { Product } from '../data/products';

export type UsageTime = 'AM' | 'PM' | 'BOTH';

export interface BundleItem {
  id: string; // Unique ID for the slot
  product: Product;
  usageTime: UsageTime;
}

export interface CompatibilityIssue {
  severity: 'warning' | 'caution';
  message: string;
  productIds: string[];
}

interface ActiveIngredients {
  hasRetinol: boolean;
  hasBHA: boolean;
  hasAHA: boolean;
  hasVitaminC: boolean;
  hasBenzoylPeroxide: boolean;
  hasNiacinamide: boolean;
}

function parseActives(product: Product): ActiveIngredients {
  const text = (product.ingredients + ' ' + product.name + ' ' + product.description).toLowerCase();

  return {
    hasRetinol: /retinol|retinoid|retinyl|bakuchiol/.test(text),
    hasBHA: /bha|salicylic acid|betaine salicylate/.test(text),
    hasAHA: /aha|glycolic acid|lactic acid|mandelic acid/.test(text),
    hasVitaminC: /vitamin c|ascorbic acid|l-ascorbic|sodium ascorbyl phosphate|magnesium ascorbyl phosphate/.test(text),
    hasBenzoylPeroxide: /benzoyl peroxide/.test(text),
    hasNiacinamide: /niacinamide|vitamin b3/.test(text),
  };
}

export function detectClashes(items: BundleItem[]): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  // Compare every slotted item against every other slotted item just once
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];

      // If one is strictly AM and the other is strictly PM, they never overlap. No clash.
      if (
        (itemA.usageTime === 'AM' && itemB.usageTime === 'PM') ||
        (itemA.usageTime === 'PM' && itemB.usageTime === 'AM')
      ) {
        continue;
      }

      const activesA = parseActives(itemA.product);
      const activesB = parseActives(itemB.product);

      // Check Retinol + Vitamin C
      if (
        (activesA.hasRetinol && activesB.hasVitaminC) ||
        (activesB.hasRetinol && activesA.hasVitaminC)
      ) {
        issues.push({
          severity: 'warning',
          message: 'Retinol combined with Vitamin C can cause severe irritation. It is highly recommended to use Vitamin C in the morning (AM) and Retinol at night (PM).',
          productIds: [itemA.id, itemB.id]
        });
      }

      // Check Retinol + AHA/BHA
      if (
        (activesA.hasRetinol && (activesB.hasAHA || activesB.hasBHA)) ||
        (activesB.hasRetinol && (activesA.hasAHA || activesA.hasBHA))
      ) {
        issues.push({
          severity: 'warning',
          message: 'Combining Retinol with exfoliating acids (AHA/BHA) severely compromises your skin barrier and causes extreme dryness. Assign one to AM and the other to PM, or alternate days.',
          productIds: [itemA.id, itemB.id]
        });
      }

      // Check Vitamin C + AHA/BHA
      if (
        (activesA.hasVitaminC && (activesB.hasAHA || activesB.hasBHA)) ||
        (activesB.hasVitaminC && (activesA.hasAHA || activesA.hasBHA))
      ) {
        issues.push({
          severity: 'caution',
          message: 'Layering Vitamin C with AHA/BHA alters the pH levels, which can deactivate the Vitamin C and increase irritation chances. Proceed with caution.',
          productIds: [itemA.id, itemB.id]
        });
      }

      // Check Benzoyl Peroxide + Retinol
      if (
        (activesA.hasBenzoylPeroxide && activesB.hasRetinol) ||
        (activesB.hasBenzoylPeroxide && activesA.hasRetinol)
      ) {
        issues.push({
          severity: 'warning',
          message: 'Benzoyl Peroxide can oxidize and deactivate Retinol, making both ineffective while causing dryness. Do not layer them together.',
          productIds: [itemA.id, itemB.id]
        });
      }

      // Check Benzoyl Peroxide + Vitamin C
      if (
        (activesA.hasBenzoylPeroxide && activesB.hasVitaminC) ||
        (activesB.hasBenzoylPeroxide && activesA.hasVitaminC)
      ) {
        issues.push({
          severity: 'warning',
          message: 'Benzoyl Peroxide oxidizes Vitamin C instantly, rendering it useless. Use Vitamin C in the AM and Benzoyl Peroxide in the PM.',
          productIds: [itemA.id, itemB.id]
        });
      }
      
      // Niacinamide + Vitamin C (modern formulations are usually fine, but high concentrations might clash)
      if (
        (activesA.hasNiacinamide && activesB.hasVitaminC) ||
        (activesB.hasNiacinamide && activesA.hasVitaminC)
      ) {
        issues.push({
          severity: 'caution',
          message: 'Niacinamide and Vitamin C generally work well together, but high concentrations layered at the exact same time may cause temporary skin flushing in sensitive skin.',
          productIds: [itemA.id, itemB.id]
        });
      }
    }
  }

  // Deduplicate issues by message (in case 3 retiniols are added)
  const uniqueIssues = issues.filter((v, i, a) => a.findIndex(t => t.message === v.message) === i);
  return uniqueIssues;
}
