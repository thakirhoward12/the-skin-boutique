import fs from 'fs';
import path from 'path';

const csvPath = './the_skin_boutique_sourcing_list.csv';
const brandsDir = './src/data/brands';

if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

function parseCsv(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const products = [];

  // Skip header, process lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted commas in CSV
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 5) continue;

    const [brandRaw, titleRaw, skuRaw, imageRaw, priceRaw] = matches.map(m => m.replace(/^"|"$/g, ''));
    
    products.push({
      id: slugify(`${brandRaw}-${titleRaw}`).slice(0, 50),
      title: titleRaw,
      brand: brandRaw,
      price: parseInt(priceRaw) || 0,
      image: imageRaw,
      sku: skuRaw,
      description: `Premium ${brandRaw} ${titleRaw}. Authentically sourced K-Beauty.`,
      category: 'Skincare', // Default
      tags: [brandRaw, 'K-Beauty', 'Skincare'],
      supplierId: 'local'
    });
  }
  return products;
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const allProducts = parseCsv(csvContent);

// Group by brand
const brandGroups = allProducts.reduce((acc, p) => {
  const brandKey = slugify(p.brand).replace(/-/g, '_');
  if (!acc[brandKey]) acc[brandKey] = [];
  acc[brandKey].push(p);
  return acc;
}, {});

// Generate files
Object.entries(brandGroups).forEach(([brandKey, products]) => {
  const brandName = products[0].brand;
  const fileName = `${brandKey}.ts`;
  const filePath = path.join(brandsDir, fileName);

  const fileContent = `import { Product } from '../products';

export const ${brandKey}Products: Product[] = ${JSON.stringify(products, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent);
  console.log(`Generated ${filePath} with ${products.length} products.`);
});

// Update products.ts aggregator
const aggregatorPath = './src/data/products.ts';
const imports = Object.keys(brandGroups).map(bk => `import { ${bk}Products } from './brands/${bk}';`).join('\n');
const combined = Object.keys(brandGroups).map(bk => `...${bk}Products`).join(',\n    ');

const aggregatorContent = `import { Product } from './products.d';
${imports}

export interface Product {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string;
    description: string;
    category: string;
    tags: string[];
    sku?: string;
    supplierId?: 'teemdrop' | 'abw' | 'local';
}

export const allProducts: Product[] = [
    ${combined}
];

export const categories = Array.from(new Set(allProducts.map(p => p.category)));
export const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort();
`;

fs.writeFileSync(aggregatorPath, aggregatorContent);
console.log(`Updated aggregator at ${aggregatorPath}`);
