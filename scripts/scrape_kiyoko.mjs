import fs from 'fs';
import path from 'path';

const KIYOKO_BASE_URL = 'https://kiyoko.com/products.json';
const OUTPUT_FILE = 'temp_kiyoko_raw.json';
const LIMIT = 250;

async function fetchProducts(page = 1) {
  const url = `${KIYOKO_BASE_URL}?limit=${LIMIT}&page=${page}`;
  console.log(`Fetching page ${page}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return [];
  }
}

async function scrapeAll() {
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const products = await fetchProducts(page);
    if (products.length === 0) {
      hasMore = false;
    } else {
      allProducts = allProducts.concat(products);
      console.log(`Retrieved ${products.length} products. Total so far: ${allProducts.length}`);
      page++;
      // Anti-throttle delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Deduplicate by handle (Shopify's unique identifier)
  const uniqueProducts = [];
  const seenHandles = new Set();

  for (const product of allProducts) {
    if (!seenHandles.has(product.handle)) {
      seenHandles.add(product.handle);
      uniqueProducts.push(product);
    }
  }

  console.log(`Scraping complete. Found ${allProducts.length} items. Unique: ${uniqueProducts.length}`);

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(uniqueProducts, null, 2),
    'utf-8'
  );
  console.log(`Saved raw data to ${OUTPUT_FILE}`);
}

scrapeAll();
