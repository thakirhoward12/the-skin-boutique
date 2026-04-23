import fs from 'fs';
import path from 'path';

const MASTER_FILE = 'public/data/products.json';
const BRANDS_DIR = 'src/data/brands';

function split() {
  const products = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf-8'));
  const brandsMap = {};

  products.forEach(p => {
    if (!brandsMap[p.brand]) {
      brandsMap[p.brand] = [];
    }
    brandsMap[p.brand].push(p);
  });

  if (!fs.existsSync(BRANDS_DIR)) {
    fs.mkdirSync(BRANDS_DIR, { recursive: true });
  }

  Object.entries(brandsMap).forEach(([brand, items]) => {
    const filename = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ts';
    const filePath = path.join(BRANDS_DIR, filename);
    
    const content = `import { Product } from '../products';\n\nexport const ${brand.replace(/[^a-zA-Z0-9]/g, '')}Products: Product[] = ${JSON.stringify(items, null, 2)};\n`;
    
    fs.writeFileSync(filePath, content, 'utf-8');
  });

  console.log(`Split master catalog into ${Object.keys(brandsMap).length} brand files.`);
}

split();
