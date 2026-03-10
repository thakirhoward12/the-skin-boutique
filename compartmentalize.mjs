import fs from 'fs';
import path from 'path';

console.log("Reading the core products.ts file...");
const content = fs.readFileSync('src/data/products.ts', 'utf8');

// The file has a prefix (types) and the actual array declaration
const jsContent = content.split('export const products: Product[] = ')[1];
const filePrefixStr = content.split('export const products: Product[] = ')[0];
const productsStr = jsContent.substring(0, jsContent.lastIndexOf('];') + 1);

let products;
try {
  products = eval(productsStr);
} catch (e) {
  console.error("Failed to parse array with eval.", e.message);
  process.exit(1);
}

// Ensure the brands directory exists
const brandsDir = path.join('src', 'data', 'brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

// Group products by brand
const brandsMap = new Map();
for (const p of products) {
  const brand = p.brand || "Uncategorized";
  if (!brandsMap.has(brand)) {
    brandsMap.set(brand, []);
  }
  brandsMap.get(brand).push(p);
}

// Helper to write products exactly back to their TS format
function stringifyProduct(p) {
  return `  {
    id: ${p.id},
    brand: ${JSON.stringify(p.brand)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    price: ${JSON.stringify(p.price)},
    image: ${JSON.stringify(p.image)},
    ${p.textureVideo ? `textureVideo: ${JSON.stringify(p.textureVideo)},` : ''}
    description: ${JSON.stringify(p.description)},
    ingredients: ${JSON.stringify(p.ingredients)},
    ${p.options ? `options: ${JSON.stringify(p.options)},` : ''}
    ${p.idealFor ? `idealFor: ${JSON.stringify(p.idealFor)},` : ''}
    reviews: []
  }`;
}

const indexImports = [];
const allArrays = [];

// Create a standalone TS file for each mapped brand
console.log(`Writing ${brandsMap.size} independent brand files to src/data/brands/...`);
for (const [brand, brandProducts] of brandsMap.entries()) {
  const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // Camel case the array variable name safely and prefix with "brand" to prevent numbers at index 0.
  const camelSlug = slug.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
  const arrayName = "brand" + camelSlug.charAt(0).toUpperCase() + camelSlug.slice(1) + "Products";
  
  const fileContent = `import { Product } from '../products';\n\nexport const ${arrayName}: Product[] = [\n${brandProducts.map(stringifyProduct).join(",\n")}\n];\n`;
  
  fs.writeFileSync(path.join(brandsDir, `${slug}.ts`), fileContent);
  
  // Track this for the new master `products.ts` index
  indexImports.push(`import { ${arrayName} } from './brands/${slug}';`);
  allArrays.push(`  ...${arrayName}`);
}

// Write the compiled master products.ts file linking to all the partitioned imports
const newProductsTs = `${filePrefixStr}
${indexImports.join("\n")}

export const products: Product[] = [
${allArrays.join(",\n")}
];
`;

fs.writeFileSync('src/data/products.ts', newProductsTs);
console.log(`Compartmentalization successful! All brand files successfully mapped.`);
