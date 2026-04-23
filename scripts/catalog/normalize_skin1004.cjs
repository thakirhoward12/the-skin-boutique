const fs = require('fs');

if (!fs.existsSync('extracted_skin1004.json')) {
  console.log('Skipping normalization as no extracted file found.');
  process.exit();
}

const extracted = JSON.parse(fs.readFileSync('extracted_skin1004.json', 'utf-8'));

const normalizeDescription = (name, currentDesc) => {
  const templates = [
    `Experience the pure soothing power of Madagascar's finest botanical excellence with the ${name}. Formulated to deliver intense barrier repair, this masterpiece restores your complexion to a serene, glass-like radiance.`,
    `A soothing masterpiece developed by Skin1004. The ${name} is engineered with high-fidelity Centella Asiatica extracts to calm irritation, fortify the skin barrier, and reveal an exceptionally healthy and luminous finish.`,
    `Achieve clinical-grade calming and hydration with the ${name}. This advanced formula seamlessly integrates botanical purity with dermatological efficacy for unparalleled skin resilience.`,
    `The ${name} is your ultimate defense against environmental stressors. Featuring premium Madagascar Centella, it delivers continuous hydration and profound soothing for sensitive, compromised skin.`
  ];
  
  const index = name.length % templates.length;
  let newDesc = templates[index];
  
  if (currentDesc && currentDesc.length > 50) {
    const originalHighlights = currentDesc.split('.').slice(0, 2).join('.') + '.';
    newDesc += " " + originalHighlights;
  }
  
  return newDesc.replace(/\[.*?\]/g, '').trim(); 
};

const normalizePrice = (usd) => {
  // Scaling roughly to R350-R650 for Skin1004
  const zar = Math.round(((usd - 20) / (80 - 20)) * (650 - 350) + 350);
  return Math.max(350, Math.min(650, zar));
};

const normalized = extracted.map((p, i) => {
  const newId = 9130000000000 + i;
  return {
    ...p,
    id: newId,
    slug: `skin1004-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    price: normalizePrice(p.price),
    description: normalizeDescription(p.name, p.description),
    sku: `SKIN1004-${newId}`,
    supplierId: 'teemdrop',
    stockStatus: 'in_stock'
  };
});

fs.writeFileSync('normalized_skin1004.json', JSON.stringify(normalized, null, 2));
console.log(`Normalized ${normalized.length} Skin1004 products.`);
