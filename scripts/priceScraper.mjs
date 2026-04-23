import fs from 'fs';
import path from 'path';
import { extractShopifyJsonLd, extractGenericDom } from './extractors.mjs';

const CONFIG = JSON.parse(fs.readFileSync(new URL('./scraperConfig.json', import.meta.url)));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const userAgent = CONFIG.user_agents[Math.floor(Math.random() * CONFIG.user_agents.length)];
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;'
        }
      });
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Attempt ${i + 1} failed for ${url} - ${e.message}`);
    }
    // Delay before retry
    await new Promise(r => setTimeout(r, CONFIG.delay_ms));
  }
  return null;
}

async function scrapePrice(url, domain) {
  const html = await fetchWithRetry(url);
  if (!html) return { success: false, error: 'Failed to fetch HTML' };

  let result = null;
  // Use Shopify extractor for known shopify sites, else try generic
  if (domain && domain.includes('shopify')) {
     result = extractShopifyJsonLd(html);
  } else {
     // Default to Shopify extractor, fallback to generic
     result = extractShopifyJsonLd(html);
     if (!result.price) {
        result = extractGenericDom(html, CONFIG);
     }
  }

  if (result && result.price) {
     return { success: true, ...result };
  }
  return { success: false, error: 'Could not extract price' };
}

async function main() {
  console.log('--- Arbitrage Price Scraper (Dry Run) ---');
  console.log('NOTE: Since products.ts is TypeScript, in a full pipeline this script would query the Firebase catalog or a compiled JSON.');
  
  // Example dummy loop simulating hitting configured URLs
  const dummyProductsToCheck = [
    { id: 'test1', name: 'Test Product (Shopify)', sourceUrl: 'https://example.com/product1', sourceDomain: 'shopify' }
  ];

  for (const product of dummyProductsToCheck) {
    if (!product.sourceUrl) continue;
    
    console.log(`Checking ${product.name}... (${product.sourceUrl})`);
    // Uncomment to enable real fetch:
    // const result = await scrapePrice(product.sourceUrl, product.sourceDomain);
    // console.log(`Result:`, result);
    
    // Simulate delay
    await new Promise(r => setTimeout(r, CONFIG.delay_ms));
  }
  
  console.log('Scrape run complete.');
}

main().catch(console.error);
