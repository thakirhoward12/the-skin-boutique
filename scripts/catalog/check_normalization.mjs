import fs from 'fs';
import path from 'path';

const brandsDir = 'src/data/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

const normalized = [];
const nonNormalized = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  // Check if first product has a price that looks like ZAR (integer > 50)
  // or if description is "premium" style (longer, more detailed)
  const priceMatch = content.match(/price:\s*(\d+(?:\.\d+)?)/);
  if (priceMatch) {
    const price = parseFloat(priceMatch[1]);
    if (price >= 50 && !content.includes('price: "$')) {
      normalized.push(file);
    } else {
      nonNormalized.push(file);
    }
  } else {
    nonNormalized.push(file);
  }
}

console.log('Normalized Files:', normalized.length);
console.log(JSON.stringify(normalized, null, 2));
console.log('\nNon-Normalized Files:', nonNormalized.length);
console.log(JSON.stringify(nonNormalized, null, 2));
