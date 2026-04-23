import fs from 'fs';
import path from 'path';

const csvPath = './the_skin_boutique_sourcing_list.csv';
const outputPath = './public/data/products.json';
const ZAR_RATE = 18.95;

// Ensure directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function parseCsv(content) {
  const lines = content.split('\n');
  const products = [];
  const seenSkus = new Set();
  const seenTitles = new Set();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let brandRaw, titleRaw, skuRaw, imageRaw, priceRaw;

    const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (matches && matches.length >= 5) {
      [brandRaw, titleRaw, skuRaw, imageRaw, priceRaw] = matches.map(m => m.replace(/^"|"$/g, '').trim());
    } else {
      // Fallback for lines without many commas or weird formatting
      const parts = line.split(',').map(p => p.replace(/^"|"$/g, '').trim());
      if (parts.length < 5) continue;
      [brandRaw, titleRaw, skuRaw, imageRaw, priceRaw] = parts;
    }

    if (!titleRaw || titleRaw === 'Product Name') continue;
    
    // Deduplication checks
    const sku = (skuRaw || '').trim();
    const title = (titleRaw || '').trim();
    
    if (sku && seenSkus.has(sku)) {
        console.log(`Skipping duplicate SKU: ${sku}`);
        continue;
    }
    if (title && seenTitles.has(title)) {
        console.log(`Skipping duplicate Title: ${title}`);
        continue;
    }
    
    if (sku) seenSkus.add(sku);
    if (title) seenTitles.add(title);

    // Convert ZAR Price to USD Base Number
    const zarPrice = parseInt(priceRaw.toString().replace(/[^0-9]/g, '')) || 0;
    const priceInUSD = parseFloat((zarPrice / ZAR_RATE).toFixed(2));

    products.push({
      id: slugify(`${brandRaw}-${titleRaw}`).slice(0, 50),
      title: title,
      name: title,
      brand: brandRaw,
      price: priceInUSD, // STORED IN USD
      image: imageRaw,
      sku: sku,
      description: `Premium ${brandRaw} ${title}. Authentically sourced K-Beauty. Designed to bring the best of Korean skincare directly to you.`,
      ingredients: 'Information pending updated sourcing details.',
      category: 'Skincare',
      tags: [brandRaw, 'K-Beauty', 'New Arrival'],
      supplierId: 'local',
      stockStatus: 'in_stock',
      reviews: []
    });
  }
  return products;
}

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const allProducts = parseCsv(csvContent);

  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  console.log(`✅ Successfully generated ${outputPath} with ${allProducts.length} items.`);
  console.log(`ℹ️ Base Currency is now USD. ZAR conversion rate used: ${ZAR_RATE}`);
} catch (error) {
  console.error('❌ Failed to generate catalog:', error);
}
