const fs = require('fs');
const path = require('path');

const files = [
  'kiyoko-scraped-part1.ts',
  'kiyoko-scraped-part2.ts',
  'kiyoko-scraped-part3.ts',
  'kiyoko-scraped-part4.ts'
];

const brandCounts = {};

files.forEach(file => {
  const filePath = path.join('c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands/', file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const brandMatches = content.match(/brand: ['"](.+?)['"]/g);
  
  if (brandMatches) {
    brandMatches.forEach(match => {
      const brand = match.match(/brand: ['"](.+?)['"]/)[1];
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
  }
});

const sortedBrands = Object.entries(brandCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 30);

console.log('Top 30 brands in scraped files:');
sortedBrands.forEach(([brand, count]) => {
  console.log(`${brand}: ${count}`);
});
