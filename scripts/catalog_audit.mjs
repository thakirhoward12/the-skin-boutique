import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';

function normalizeName(name, brand) {
  let normalized = name.toLowerCase();
  
  if (brand) {
    const brandLower = brand.toLowerCase();
    if (normalized.startsWith(brandLower)) {
      normalized = normalized.slice(brandLower.length).trim();
    }
  }
  
  normalized = normalized.replace(/\(.*\)$/, '');
  normalized = normalized.replace(/\d+(ml|g|oz|ml|pcs|s|sheets)/gi, '');
  normalized = normalized.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  
  return normalized;
}

async function auditCatalog() {
  const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
  const allProducts = [];
  const duplicates = [];
  const missingImages = [];
  const priceOutliers = [];

  for (const file of files) {
    const brandName = path.basename(file, '.ts');
    const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf-8');
    const productRegex = /\{\s*id:\s*(["']?)(.*?)\1,\s*[\s\S]*?name:\s*(["'])(.*?)\3([\s\S]*?)\}/g;
    let match;

    while ((match = productRegex.exec(content)) !== null) {
      const p = {
        id: match[2],
        name: match[4],
        body: match[5],
        file: file,
        normalized: normalizeName(match[4], brandName)
      };
      
      // Extract price
      const priceMatch = p.body.match(/price:\s*(\d+)/);
      p.price = priceMatch ? parseInt(priceMatch[1]) : 0;
      
      // Extract image
      const imageMatch = p.body.match(/image:\s*(["'])(.*?)\1/);
      p.image = imageMatch ? imageMatch[2] : '';

      allProducts.push(p);
    }
  }

  // Check for duplicates
  const seen = {};
  allProducts.forEach(p => {
    if (seen[p.normalized]) {
      duplicates.push({ name: p.name, id: p.id, file: p.file, original: seen[p.normalized] });
    } else {
      seen[p.normalized] = p.id;
    }
  });

  // Check for missing images
  allProducts.forEach(p => {
    if (!p.image || p.image.includes('placeholder') || p.image.length < 10) {
      missingImages.push(p);
    }
  });

  // Check for price outliers (e.g., > 10000 ZAR seems too high for single product)
  allProducts.forEach(p => {
    if (p.price > 10000 || p.price < 5) {
      priceOutliers.push(p);
    }
  });

  console.log('\n--- CATALOG AUDIT REPORT ---');
  console.log(`Total Products: ${allProducts.length}`);
  console.log(`Duplicates: ${duplicates.length}`);
  console.log(`Missing Image: ${missingImages.length}`);
  console.log(`Price Outliers: ${priceOutliers.length}`);

  if (duplicates.length > 0) {
    console.log('\nDuplicates Found:');
    duplicates.forEach(d => console.log(`  - ${d.name} (${d.id}) in ${d.file}`));
  }

  if (missingImages.length > 0) {
    console.log('\nMissing Images:');
    missingImages.forEach(m => console.log(`  - ${m.name} (${m.id}) in ${m.file}`));
  }

  if (priceOutliers.length > 0) {
    console.log('\nPrice Outliers:');
    priceOutliers.forEach(o => console.log(`  - ${o.name} (${o.id}) - Price: ${o.price} in ${o.file}`));
  }
}

auditCatalog();
