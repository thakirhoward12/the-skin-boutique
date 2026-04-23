import fs from 'fs';
import path from 'path';

const brandsDir = 'src/data/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

let totalMissing = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf-8');
  // Match products without images or with placeholder images
  // We'll look for image: "" or missing image field in the object literal
  // For simplicity, we'll parse the array using a regex-based approach or just string searching
  
  const productsMatch = content.match(/{\s*id:[\s\S]*?}/g);
  if (productsMatch) {
    productsMatch.forEach(p => {
      const hasImage = p.includes('image:') && !p.includes('image: ""') && !p.includes('image: \'\'');
      if (!hasImage) {
        console.log(`Missing image in ${file}: ${p.match(/name: "(.*?)"/)?.[1] || 'Unknown'}`);
        totalMissing++;
      }
    });
  }
}

console.log(`Total missing images: ${totalMissing}`);
