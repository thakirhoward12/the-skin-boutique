import fs from 'fs';
import path from 'path';

const brandsDir = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts') && f.startsWith('kiyoko-'));

const targetBrands = ['Beauty of Joseon', 'Skin1004', 'Laneige', 'Dr. Althea'];
const extracted = {};

targetBrands.forEach(brand => extracted[brand] = []);

files.forEach(file => {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  // Simple extraction of objects that match brand: "BrandName"
  const brandMatches = content.match(/{[^}]*brand:\s*["'](Beauty of Joseon|Skin1004|Laneige|Dr\. Althea)["'][^}]*}/g);
  if (brandMatches) {
    brandMatches.forEach(match => {
        // Need to check which brand it is
        for (const brand of targetBrands) {
            if (match.includes(`brand: "${brand}"`) || match.includes(`brand: '${brand}'`)) {
                extracted[brand].push(match);
                break;
            }
        }
    });
  }
});

targetBrands.forEach(brand => {
    console.log(`${brand}: ${extracted[brand].length} products found in scraped files`);
});
