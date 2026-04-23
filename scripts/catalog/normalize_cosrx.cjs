const fs = require('fs');

if (!fs.existsSync('extracted_cosrx.json')) {
  console.log('Skipping normalization as no extracted file found.');
  process.exit();
}

const extracted = JSON.parse(fs.readFileSync('extracted_cosrx.json', 'utf-8'));

const normalizeDescription = (name, currentDesc) => {
  const templates = [
    `Achieve clinical-grade clarity with the ${name}. Combining advanced dermatological research and high-potency ingredients, this targeted treatment effectively transforms your skin’s texture.`,
    `A staple of K-Beauty dermatological excellence, the ${name} provides high-fidelity care for compromised skin. Formulated to soothe, protect, and refine.`,
    `The ${name} is engineered to address your skin's unique concerns without irritation. Embrace this clinical-grade masterpiece to reveal a healthy, balanced, and radiant complexion.`,
    `Experience targeted treatment with the ${name}. COSRX's commitment to minimal but highly effective formulations ensures profound results and a revitalized glow.`
  ];
  
  const index = name.length % templates.length;
  let newDesc = templates[index];
  
  if (currentDesc && currentDesc.length > 50) {
    const originalHighlights = currentDesc.split('.').slice(0, 2).join('.') + '.';
    newDesc += " " + originalHighlights;
  }
  
  return newDesc.replace(/\[.*?\]/g, '').trim(); 
};

// COSRX is generally priced around R300 - R650
const normalizePrice = (usd) => {
  const zar = Math.round(((usd - 15) / (60 - 15)) * (650 - 300) + 300);
  return Math.max(300, Math.min(650, zar));
};

const normalized = extracted.map((p, i) => {
  const newId = 9140000000000 + i;
  return {
    ...p,
    id: newId,
    slug: `cosrx-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    price: normalizePrice(p.price),
    description: normalizeDescription(p.name, p.description),
    sku: `COSRX-${newId}`,
    supplierId: 'teemdrop',
    stockStatus: 'in_stock'
  };
});

fs.writeFileSync('normalized_cosrx.json', JSON.stringify(normalized, null, 2));
console.log(`Normalized ${normalized.length} COSRX products.`);
