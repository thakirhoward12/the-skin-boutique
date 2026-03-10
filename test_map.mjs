import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandsDir = path.join(__dirname, 'src', 'data', 'brands');
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

// 1. Define Category Mapping
const categoryMap = {
  'Serum': 'Serums', 'Ampoule': 'Serums', 'Essence': 'Serums',
  'Cream': 'Moisturizers', 'Lotion': 'Moisturizers', 'Spot Treatment': 'Moisturizers', 'Acne Treatments & Kits': 'Moisturizers', 'Skincare Set': 'Moisturizers',
  'Sheet Masks': 'Masks', 'Face Mask': 'Masks', 'Sleep Mask': 'Masks', 'Wash-off Face Mask': 'Masks', 'Peel-off Face Mask': 'Masks', 'Steam Mask': 'Masks',
  'Shampoo': 'Hair Care', 'Conditioner': 'Hair Care', 'Hair Set': 'Hair Care', 'Hair Serum': 'Hair Care', 'Hair Water': 'Hair Care', 'Hair Tonic': 'Hair Care', 'Hair Mask': 'Hair Care',
  'Makeup Sponge': 'Tools', 'Makeup Tools': 'Tools',
  'Blush & Highlighter': 'Makeup', 'Cushion Foundation': 'Makeup', 'Primer': 'Makeup', 'Concealer': 'Makeup', 'Eyebrow': 'Makeup', 'Eyeliner': 'Makeup', 'Eye Shadow': 'Makeup', 'Mascara Remover': 'Makeup', 'Setting Spray': 'Makeup',
  'Toner Pads': 'Toners', 'Toner': 'Toners', 'Facial Mist': 'Toners',
  'Lip Gloss': 'Lip Care', 'Lip Balms': 'Lip Care', 'Lip Tint': 'Lip Care', 'Lip Sleeping Mask': 'Lip Care', 'Lipstick': 'Lip Care',
  'Hand Cream': 'Bath & Body', 'Feet Mask': 'Bath & Body', 'Body Wash': 'Bath & Body', 'Foot Mask': 'Bath & Body', 'Body Lotion': 'Bath & Body', 'Body Wash Refills': 'Bath & Body', 'Bar Soap': 'Bath & Body', 'Hand Mask': 'Bath & Body', 'Body Cream': 'Bath & Body',
  'Eye Patch': 'Eye Care', 'Eye Cream': 'Eye Care', 'Eye Masks': 'Eye Care',
  'Oil Cleanser': 'Cleansers', 'Foam Cleanser': 'Cleansers', 'Cleanser': 'Cleansers', 'Water Cleanser': 'Cleansers', 'Gel Cleanser': 'Cleansers',
  'Sunscreen': 'Sun Care',
  'Peeling Gel': 'Exfoliants', 'Exfoliator': 'Exfoliants', 'Pore Strip': 'Exfoliants'
};

const categories = {};
let totalProducts = 0;

for (const file of files) {
  const filePath = path.join(brandsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Quick pass to find original categories
  const catRegex = /category:\s*["']([^"']+)["']/g;
  let match;
  while ((match = catRegex.exec(content)) !== null) {
    const originalCat = match[1];
    const newCat = categoryMap[originalCat] || originalCat;
    categories[newCat] = (categories[newCat] || 0) + 1;
    totalProducts++;
  }
}

console.log(`Total Products: ${totalProducts}`);
console.log('Projected Consolidated Categories:');
const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
for (const [cat, count] of sortedCategories) {
  console.log(`${cat}: ${count}`);
}
