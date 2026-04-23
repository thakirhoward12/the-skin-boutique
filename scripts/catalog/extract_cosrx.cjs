const fs = require('fs');
const path = require('path');

const targetBrand = 'COSRX';
const brandFile = path.join(__dirname, 'src/data/brands/cosrx.ts');

let existingNames = [];
if (fs.existsSync(brandFile)) {
  const brandContent = fs.readFileSync(brandFile, 'utf-8');
  const nameRegex = /name: ["'](.+?)["']/g;
  let match;
  while ((match = nameRegex.exec(brandContent)) !== null) {
    existingNames.push(match[1].toLowerCase());
  }
}

const scrapedFiles = [
  'src/data/brands/kiyoko-scraped-part1.ts',
  'src/data/brands/kiyoko-scraped-part2.ts',
  'src/data/brands/kiyoko-scraped-part3.ts',
  'src/data/brands/kiyoko-scraped-part4.ts'
];

const extracted = [];

scrapedFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const blocks = content.split(/(\{\s*id: \d+,)/);
  
  for (let i = 1; i < blocks.length; i += 2) {
    const block = blocks[i] + blocks[i+1];
    
    if (block.toLowerCase().includes("brand: 'cosrx'") || block.toLowerCase().includes('brand: "cosrx"')) {
      try {
        const idMatch = block.match(/id: (\d+)/);
        const nameMatch = block.match(/name: ['"](.+?)['"]/);
        const categoryMatch = block.match(/category: ['"](.+?)['"]/);
        const priceMatch = block.match(/price: ([\d.]+)/);
        const imageMatch = block.match(/image: ['"](.+?)['"]/);
        const descMatch = block.match(/description: ['"](.+?)['"]/);
        const ingredMatch = block.match(/ingredients: ['"](.+?)['"]/);
        const skuMatch = block.match(/sku: ["'](.+?)["']/);

        if (idMatch && nameMatch && categoryMatch && priceMatch && imageMatch && descMatch && skuMatch) {
          const id = parseInt(idMatch[1]);
          const name = nameMatch[1];
          const category = categoryMatch[1];
          const price = parseFloat(priceMatch[1]);
          const image = imageMatch[1];
          const description = descMatch[1];
          const ingredients = ingredMatch ? ingredMatch[1] : 'Refer to product packaging for full ingredient list.';
          const sku = skuMatch[1];

          if (!existingNames.includes(name.toLowerCase())) {
            extracted.push({ id, name, category, price, image, description, ingredients, sku });
            existingNames.push(name.toLowerCase());
          }
        }
      } catch (e) {
        console.error('Error parsing block:', e);
      }
    }
  }
});

fs.writeFileSync('extracted_cosrx.json', JSON.stringify(extracted, null, 2));
console.log(`Extracted ${extracted.length} new COSRX products.`);
