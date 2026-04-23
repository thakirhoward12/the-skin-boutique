const fs = require('fs');
const path = require('path');

if (!fs.existsSync('normalized_cosrx.json')) {
  console.log('Skipping merge as no normalized file found.');
  process.exit();
}

const normalized = JSON.parse(fs.readFileSync('normalized_cosrx.json', 'utf-8'));
const targetFile = path.join(__dirname, 'src/data/brands/cosrx.ts');

let content = fs.readFileSync(targetFile, 'utf-8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
    console.error('Could not find end of array in cosrx.ts');
    process.exit(1);
}

const newEntries = normalized.map(p => {
    return `  {
    id: ${p.id},
    slug: "${p.slug}",
    brand: "COSRX",
    name: "${p.name}",
    category: "${p.category}",
    price: ${p.price},
    image: "${p.image}",
    description: "${p.description.replace(/"/g, '\\"')}",
    ingredients: "${p.ingredients.replace(/"/g, '\\"')}",
    reviews: [],
    sku: "${p.sku}",
    supplierId: "teemdrop",
    stockStatus: "in_stock",
  },`.replace(/'/g, "\\'");
}).join('\n');

const updatedContent = content.slice(0, lastBracketIndex) + 
                       newEntries + 
                       '\n' + 
                       content.slice(lastBracketIndex);

fs.writeFileSync(targetFile, updatedContent);
console.log(`Successfully merged ${normalized.length} products into cosrx.ts.`);
