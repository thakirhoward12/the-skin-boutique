import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands';
const SCRAPED_FILE = path.join(BRANDS_DIR, 'kiyoko-scraped.ts');
const content = fs.readFileSync(SCRAPED_FILE, 'utf8');

// Use a regex to find all product objects { ... }
const productRegex = /\{\s*id:[\s\S]*?\},/g;
const products = content.match(productRegex) || [];

console.log(`Found ${products.length} products in kiyoko-scraped.ts`);

const CHUNK_SIZE = 250; // Smaller chunks to be safe
const chunks = [];
for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    chunks.push(products.slice(i, i + CHUNK_SIZE));
}

chunks.forEach((chunk, index) => {
    const chunkFile = path.join(BRANDS_DIR, `kiyoko-scraped-part${index + 1}.ts`);
    const chunkContent = `import { Product } from '../products';\n\nexport const kiyokoScrapedPart${index + 1}Products: Product[] = [\n${chunk.join('\n')}\n];`;
    fs.writeFileSync(chunkFile, chunkContent);
    console.log(`Created ${chunkFile}`);
});

// Update products.ts is handled next
