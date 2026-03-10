import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandsDir = path.join(__dirname, 'src', 'data', 'brands');
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

const categories = {};
let totalProducts = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const catRegex = /category:\s*["']([^"']+)["']/g;
  let match;
  while ((match = catRegex.exec(content)) !== null) {
    const cat = match[1];
    categories[cat] = (categories[cat] || 0) + 1;
    totalProducts++;
  }
}

console.log(`Total Products: ${totalProducts}`);
console.log('Categories:');
const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
for (const [cat, count] of sortedCategories) {
  console.log(`${cat}: ${count}`);
}
