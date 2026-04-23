import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRANDS_DIR = path.join(__dirname, '../src/data/brands');
const TARGET_FILE = path.join(__dirname, '../public/data/products.json');

async function compileCatalog() {
  console.log('Compiling products.json from TypeScript files...');
  
  const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
  let allProducts = [];

  for (const file of files) {
    const filePath = `file://${path.join(BRANDS_DIR, file)}`;
    try {
      // Dynamic import works with tsx 
      const module = await import(filePath);
      
      // Look for the exported array (it might be named brandXProducts, etc)
      // Usually it's the first exported array
      for (const key in module) {
        if (Array.isArray(module[key])) {
          allProducts = allProducts.concat(module[key]);
          console.log(`Loaded ${module[key].length} products from ${file}`);
          break; // only grab the first array to avoid duplicates
        }
      }
    } catch (e) {
      console.error(`Failed to import ${file}:`, e);
    }
  }

  console.log(`\nTotal products collected: ${allProducts.length}`);
  
  fs.writeFileSync(TARGET_FILE, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log(`Successfully wrote ${TARGET_FILE}!`);
}

compileCatalog();
