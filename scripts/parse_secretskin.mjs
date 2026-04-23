import fs from 'fs';

const raw = fs.readFileSync('C:/Users/thaki/.gemini/antigravity/brain/548a3604-10b3-4d74-93d5-200a40c6fea8/.system_generated/steps/736/content.md', 'utf8');
const jsonStr = raw.substring(raw.indexOf('{"products"'));
const data = JSON.parse(jsonStr);

// Filter out non-shippable products (services like pHformula treatments)
const products = data.products
  .filter(p => p.variants.some(v => v.requires_shipping))
  .map(p => ({
    title: p.title,
    vendor: p.vendor,
    price: Math.min(...p.variants.map(v => parseFloat(v.price))),
    maxPrice: Math.max(...p.variants.map(v => parseFloat(v.price))),
    available: p.variants.some(v => v.available),
    tags: p.tags
  }));

console.log(`\n=== SECRET SKIN CATALOG: ${products.length} shippable products ===\n`);

// Brand breakdown
const brands = {};
products.forEach(p => {
  if (!brands[p.vendor]) brands[p.vendor] = { count: 0, prices: [] };
  brands[p.vendor].count++;
  brands[p.vendor].prices.push(p.price);
});

console.log('BRAND BREAKDOWN:');
Object.entries(brands)
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([brand, data]) => {
    const avg = data.prices.reduce((s, p) => s + p, 0) / data.prices.length;
    const min = Math.min(...data.prices);
    const max = Math.max(...data.prices);
    console.log(`  ${brand}: ${data.count} products | R${min} - R${max} | Avg: R${avg.toFixed(0)}`);
  });

// Price distribution
console.log('\nPRICE DISTRIBUTION:');
const ranges = [
  [0, 200], [200, 400], [400, 600], [600, 1000], [1000, 2000], [2000, 5000], [5000, 10000]
];
ranges.forEach(([min, max]) => {
  const count = products.filter(p => p.price >= min && p.price < max).length;
  if (count > 0) console.log(`  R${min}-R${max}: ${count} products`);
});

// Find overlapping brands with our catalog
const ourBrands = ['Mediheal', 'ANUA', 'COSRX', 'Beauty of Joseon', 'AXIS-Y', 'Purito', 'Dr. Althea', 'numbuzin', 'Medicube', 'Jumiso', 'SKIN1004', 'Biodance', 'Haruharu WONDER'];
console.log('\nOVERLAPPING BRANDS (SecretSkin vs Skin Boutique):');
ourBrands.forEach(brand => {
  const ssProducts = products.filter(p => 
    p.vendor.toLowerCase().includes(brand.toLowerCase()) || 
    p.title.toLowerCase().includes(brand.toLowerCase())
  );
  if (ssProducts.length > 0) {
    console.log(`\n  ${brand} (${ssProducts.length} products on SecretSkin):`);
    ssProducts.forEach(p => {
      console.log(`    ${p.available ? '✓' : '✗'} R${p.price} — ${p.title}`);
    });
  }
});

// Output full JSON for analysis
fs.writeFileSync('exports/secretskin_prices.json', JSON.stringify(products, null, 2));
console.log('\nFull data saved to exports/secretskin_prices.json');
