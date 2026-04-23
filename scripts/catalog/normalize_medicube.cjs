const fs = require('fs');

const extracted = JSON.parse(fs.readFileSync('extracted_medicube.json', 'utf-8'));

const normalizeDescription = (name, currentDesc) => {
  const templates = [
    `Achieve the ultimate in dermatological excellence with the ${name}. This high-fidelity formula is precision-engineered to deliver visible transformation in skin texture and clarity.`,
    `Experience a clinical-grade breakthrough with Medicube's ${name}. Designed for the sophisticated skincare ritual, it leverages advanced science to restore skin vitality and resilience.`,
    `The ${name} is a professional-strength masterpiece that targets your skin's unique needs with clinical precision. Formulated for maximum efficacy, it unveils a radiant, glass-like complexion.`,
    `Re-densify and lift your complexion with the clinical-grade ${name}. Engineered for maximum fidelity in skin repair, it provides immediate restoration for sagging, tired skin.`
  ];
  
  // Pick a template based on the name length or hash
  const index = name.length % templates.length;
  let newDesc = templates[index];
  
  // Append a portion of the original description if it's useful, otherwise just clean it up
  if (currentDesc && currentDesc.length > 50) {
    const originalHighlights = currentDesc.split('.').slice(0, 2).join('.') + '.';
    newDesc += " " + originalHighlights;
  }
  
  return newDesc.replace(/\[.*?\]/g, '').trim(); // Remove bracketed tags
};

const normalizePrice = (usd) => {
  // Simple linear scaling: 30 USD -> 350 ZAR, 100 USD -> 950 ZAR
  const zar = Math.round(((usd - 30) / (100 - 30)) * (950 - 350) + 350);
  return Math.max(350, Math.min(950, zar));
};

const normalized = extracted.map((p, i) => {
  const newId = 9120000000000 + i;
  return {
    ...p,
    id: newId,
    slug: `medicube-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    price: normalizePrice(p.price),
    description: normalizeDescription(p.name, p.description),
    sku: `MEDICUBE-${newId}`,
    supplierId: 'teemdrop',
    stockStatus: 'in_stock'
  };
});

fs.writeFileSync('normalized_medicube.json', JSON.stringify(normalized, null, 2));
console.log(`Normalized ${normalized.length} Medicube products.`);
