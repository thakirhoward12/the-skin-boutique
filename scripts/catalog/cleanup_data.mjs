import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands';
const SHOPIFY_CSV = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/shopify_products.csv';

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseCSV(content) {
    const lines = content.split(/\r?\n/);
    const headers = lines[0].split(',');
    const titleIdx = headers.indexOf('Title');
    const priceIdx = headers.indexOf('Variant Price');
    const skuIdx = headers.indexOf('Variant SKU');

    const products = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const parts = [];
        let cur = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"' && line[j+1] === '"') { cur += '"'; j++; }
            else if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { parts.push(cur); cur = ''; }
            else cur += char;
        }
        parts.push(cur);
        if (parts[titleIdx]) {
            products.push({
                title: parts[titleIdx],
                price: parseFloat(parts[priceIdx]) || 0,
                sku: (parts[skuIdx] || '').trim()
            });
        }
    }
    return products;
}

const shopifyRaw = fs.readFileSync(SHOPIFY_CSV, 'utf-8');
const shopifyProducts = parseCSV(shopifyRaw);

const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));

// 1. Build a map of "authoritative" products from brand files
const authProducts = new Map();
for (const file of files) {
    if (file.startsWith('kiyoko-scraped')) continue;
    const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
    const regex = /name:\s*(["'])(.*?)\1/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        authProducts.set(normalize(match[2]), file);
    }
}

// 2. Process all files
for (const file of files) {
    const filePath = path.join(BRANDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Split by product blocks
    const parts = content.split(/(\{\s*id:\s*\d+)/);
    const newContentParts = [parts[0]];

    for (let i = 1; i < parts.length; i += 2) {
        const header = parts[i];
        let block = parts[i + 1];
        if (!block) continue;

        const nameMatch = block.match(/name:\s*(["'])(.*?)\1/);
        if (!nameMatch) {
            newContentParts.push(header + block);
            continue;
        }

        const name = nameMatch[2];
        const normName = normalize(name);

        // A. Check for duplicates in scraped files
        if (file.startsWith('kiyoko-scraped') && authProducts.has(normName)) {
            console.log(`Removing duplicate from ${file}: ${name}`);
            modified = true;
            // Skip this block by matching until the next closing brace
            const endIdx = block.indexOf('},');
            if (endIdx !== -1) {
                // Actually we just don't add header + block
                continue;
            }
        }

        // B. Fix prices
        let currentPriceMatch = block.match(/price:\s*([\d\.]+)/);
        if (currentPriceMatch) {
            let currentPrice = parseFloat(currentPriceMatch[1]);
            let finalPrice = currentPrice;

            // Fix scraped data (missing decimal)
            if (file.startsWith('kiyoko-scraped') && currentPrice > 50 && Number.isInteger(currentPrice)) {
                finalPrice = currentPrice / 10;
                console.log(`Scaling price in ${file}: ${name} (${currentPrice} -> ${finalPrice})`);
            }

            // Sync with CSV if available
            const sMatch = shopifyProducts.find(s => normalize(s.title) === normName);
            if (sMatch && sMatch.price > 0 && Math.abs(sMatch.price - finalPrice) > 0.01) {
                console.log(`Syncing price in ${file}: ${name} (${finalPrice} -> ${sMatch.price})`);
                finalPrice = sMatch.price;
            }

            if (finalPrice !== currentPrice) {
                block = block.replace(/price:\s*[\d\.]+/, `price: ${finalPrice}`);
                modified = true;
            }
        }

        newContentParts.push(header + block);
    }

    if (modified) {
        fs.writeFileSync(filePath, newContentParts.join(''), 'utf8');
    }
}

console.log("Cleanup complete.");
