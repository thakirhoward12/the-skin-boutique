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
                sku: parts[skuIdx] || ''
            });
        }
    }
    return products;
}

const shopifyRaw = fs.readFileSync(SHOPIFY_CSV, 'utf-8');
const shopifyProducts = parseCSV(shopifyRaw);

const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
const allDataProducts = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
    // Regex to match the whole block but we just need name, price, sku
    const regex = /name:\s*(["'])(.*?)\1,\s*.*?price:\s*([\d\.]+),.*?sku:\s*(["'])(.*?)\4/gs;
    let match;
    while ((match = regex.exec(content)) !== null) {
        allDataProducts.push({
            file,
            name: match[2],
            price: parseFloat(match[3]),
            sku: match[5],
            normalizedName: normalize(match[2])
        });
    }
}

console.log(`Total local products: ${allDataProducts.length}`);

// Find duplicates (identical normalized names)
const nameMap = new Map();
const duplicates = [];
for (const p of allDataProducts) {
    if (nameMap.has(p.normalizedName)) {
        duplicates.push({ name: p.name, files: [nameMap.get(p.normalizedName).file, p.file] });
    } else {
        nameMap.set(p.normalizedName, p);
    }
}

// Find price diffs
const priceDiffs = [];
for (const p of allDataProducts) {
    const s = shopifyProducts.find(s => normalize(s.title) === p.normalizedName || (p.sku && p.sku.includes(s.sku)));
    if (s && Math.abs(s.price - p.price) > 0.01) {
        priceDiffs.push({
            name: p.name,
            localPrice: p.price,
            shopifyPrice: s.price,
            file: p.file
        });
    }
}

console.log(`Found ${duplicates.length} duplicates.`);
duplicates.forEach(d => console.log(`Duplicate: ${d.name} in ${d.files.join(', ')}`));

console.log(`Found ${priceDiffs.length} price diffs.`);
priceDiffs.forEach(pd => console.log(`Diff: ${pd.name} (${pd.localPrice} -> ${pd.shopifyPrice}) in ${pd.file}`));
