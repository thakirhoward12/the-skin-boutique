const fs = require('fs');
const path = require('path');

const normalized = JSON.parse(fs.readFileSync('normalized_medicube.json', 'utf-8'));
const targetFile = path.join(__dirname, 'src/data/brands/medicube.ts');

let content = fs.readFileSync(targetFile, 'utf-8');

// Find the end of the array (last '];')
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
    console.error('Could not find end of array in medicube.ts');
    process.exit(1);
}

// Prepare the new entries string
const newEntries = normalized.map(p => {
    return `  {
    id: ${p.id},
    slug: "${p.slug}",
    brand: "Medicube",
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
  },`.replace(/'/g, "\\'"); // Basic escaping
}).join('\n');

const updatedContent = content.slice(0, lastBracketIndex) + 
                       newEntries + 
                       '\n' + 
                       content.slice(lastBracketIndex);

fs.writeFileSync(targetFile, updatedContent);
console.log(`Successfully merged ${normalized.length} products into medicube.ts.`);
