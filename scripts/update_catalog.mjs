import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRANDS_DIR = path.join(__dirname, '../src/data/brands');

// Price rules in ZAR (R)
const PRICE_RULES = {
  'serum': 450.00,
  'toner': 420.00,
  'ampoule': 480.00,
  'moisturizer': 550.00,
  'cream': 550.00,
  'cleanser': 350.00,
  'spf': 380.00,
  'sun': 380.00,
  'mask': 45.00, // Individual sheet masks stay low
  'default': 650.00
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '');      // Trim - from end
}

const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(BRANDS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match objects inside the array: { id: ..., image: ... }
  // We match everything from { to } while being careful with nested braces
  // This is still a bit fragile but better than split('},')
  const productObjects = content.match(/\{[\s\S]+?id:[\s\S]+?\}/g);

  if (!productObjects) return;

  let newContent = content;

  productObjects.forEach(p => {
    let updatedP = p;

    // Extract fields
    const nameMatch = updatedP.match(/name:\s*"(.*)"/);
    const brandMatch = updatedP.match(/brand:\s*"(.*)"/);
    const priceMatch = updatedP.match(/price:\s*([\d.]+)/);
    const categoryMatch = updatedP.match(/category:\s*"(.*)"/);
    const descMatch = updatedP.match(/description:\s*"(.*)"/);
    const ingredientsMatch = updatedP.match(/ingredients:\s*"(.*)"/);

    if (nameMatch && brandMatch) {
      const name = nameMatch[1];
      const brand = brandMatch[1];
      const category = categoryMatch ? categoryMatch[1] : 'Skincare';
      const slug = slugify(`${brand} ${name}`);

      // 1. Insert/Update Slug
      if (!updatedP.includes('slug:')) {
        updatedP = updatedP.replace(/(id:\s*\d+,)/, `$1\n    slug: "${slug}",`);
      } else {
        updatedP = updatedP.replace(/slug:\s*".*?"/, `slug: "${slug}"`);
      }

      // 2. Normalize Prices
      if (priceMatch) {
        let currentPrice = parseFloat(priceMatch[1]);
        const isDevice = name.toLowerCase().includes('device') || name.toLowerCase().includes('age-r') || name.toLowerCase().includes('set');
        
        // If price is very low (e.g. 1.95), it's likely USD. We should multiply by ~18 for ZAR
        // or just apply the ceiling if it's too low.
        // But for South African store, we want R450+.
        if (currentPrice < 100 && !name.toLowerCase().includes('mask')) {
            // Assume it was USD or placeholder. Map to ceiling.
            currentPrice = 550.00; 
        }

        let ceiling = PRICE_RULES.default;
        for (const [key, val] of Object.entries(PRICE_RULES)) {
          if (category.toLowerCase().includes(key) || name.toLowerCase().includes(key)) {
            ceiling = val;
            break;
          }
        }

        // Apply ceiling strictly
        if (currentPrice > ceiling && !isDevice) {
            currentPrice = ceiling;
            updatedP = updatedP.replace(/price:\s*[\d.]+/, `price: ${currentPrice}`);
        }
      }

      // 3. Populate Descriptions
      const isPlaceholder = !descMatch || 
                            descMatch[1].length < 15 || 
                            descMatch[1].toLowerCase().includes('placeholder') || 
                            descMatch[1].toLowerCase().includes('refer to packaging') ||
                            descMatch[1].toLowerCase().includes('discover this amazing') ||
                            descMatch[1].toLowerCase().includes('coming soon');

      if (isPlaceholder) {
        const premiumDescription = `Experience the excellence of ${brand} with the ${name}. This premium ${category.toLowerCase()} is formulated with high-quality Korean skincare ingredients to deeply nourish and revitalize your complexion. Designed for those seeking a luxurious and effective ${category.toLowerCase()} addition to their daily ritual.`;
        
        if (descMatch) {
          updatedP = updatedP.replace(/description:\s*".*?"/, `description: "${premiumDescription}"`);
        } else {
          updatedP = updatedP.replace(/(ingredients:\s*".*?",)/, `description: "${premiumDescription}",\n    $1`);
        }
      }

      // 4. Scrub Competitors
      const competitors = ['Cerave', 'La Roche Posay', 'La Roche-Posay', 'Sephora', 'Ulta', 'Neutrogena', 'Eucerin'];
      competitors.forEach(comp => {
        const regex = new RegExp(comp, 'gi');
        if (updatedP.match(regex)) {
          updatedP = updatedP.replace(regex, 'other leading brands');
        }
      });

      // 5. Clean up "Refer to packaging" in ingredients if they are too short
      if (ingredientsMatch && (ingredientsMatch[1].length < 10 || ingredientsMatch[1].toLowerCase().includes('refer to product packaging'))) {
          // Keep it as is if we don't have better data, but ensure it's not empty
      }

      newContent = newContent.replace(p, updatedP);
    }
  });

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${file}`);
});


