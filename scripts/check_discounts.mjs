import fs from 'fs';

const raw = fs.readFileSync('C:/Users/thaki/.gemini/antigravity/brain/548a3604-10b3-4d74-93d5-200a40c6fea8/.system_generated/steps/736/content.md', 'utf8');
const jsonStr = raw.substring(raw.indexOf('{"products"'));
const data = JSON.parse(jsonStr);

const results = [];

data.products
  .filter(p => p.variants.some(v => v.requires_shipping))
  .forEach(p => {
    const v = p.variants[0];
    const salePrice = parseFloat(v.price);
    const compareAt = v.compare_at_price ? parseFloat(v.compare_at_price) : null;
    const isOnSale = compareAt && compareAt > salePrice;
    
    results.push({
      title: p.title,
      vendor: p.vendor,
      currentPrice: salePrice,
      originalPrice: compareAt || salePrice,
      isOnSale,
      discountPct: isOnSale ? Math.round((1 - salePrice / compareAt) * 100) : 0,
    });
  });

// Show all discounted products
const discounted = results.filter(r => r.isOnSale);
const regular = results.filter(r => !r.isOnSale);

console.log(`\n=== SECRETSKIN DISCOUNT ANALYSIS ===\n`);
console.log(`On Sale: ${discounted.length} products`);
console.log(`Regular Price: ${regular.length} products\n`);

if (discounted.length > 0) {
  console.log('DISCOUNTED PRODUCTS:');
  console.log('─'.repeat(90));
  discounted.sort((a, b) => b.discountPct - a.discountPct).forEach(r => {
    console.log(`  🏷️  ${r.title.substring(0, 50).padEnd(50)} | Sale: R${r.currentPrice.toString().padStart(6)} | Was: R${r.originalPrice.toString().padStart(6)} | -${r.discountPct}%`);
  });
}

// Now check which of our overrides were based on SALE prices
console.log('\n\n=== IMPACT ON OUR OVERRIDES ===\n');

const overrides = JSON.parse(fs.readFileSync('scripts/market_price_overrides.json', 'utf8')).overrides;

let needsUpdate = 0;
overrides.forEach(o => {
  const match = results.find(r => r.title.toLowerCase().includes(o.match.toLowerCase()));
  if (match && match.isOnSale) {
    needsUpdate++;
    console.log(`⚠️  OVERRIDE BASED ON SALE PRICE:`);
    console.log(`   Product: ${match.title}`);
    console.log(`   Our override used: R${o.saMarketPrice} (this is the SALE price)`);
    console.log(`   Actual regular price: R${match.originalPrice}`);
    console.log(`   Our adjusted retail: R${o.adjustedRetail}`);
    console.log(`   Recommendation: Benchmark against R${match.originalPrice} instead`);
    console.log('');
  } else if (match && !match.isOnSale) {
    console.log(`✅ ${o.match.substring(0, 45).padEnd(45)} — R${o.saMarketPrice} is the regular price`);
  }
});

console.log(`\nTotal overrides affected by sale prices: ${needsUpdate}`);
