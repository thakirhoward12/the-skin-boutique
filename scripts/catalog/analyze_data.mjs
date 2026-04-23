import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';
const SHOPIFY_CSV = 'shopify_products.csv';

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/\u00a0/g, ' ') // replace nbsp with space
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseCSV(content) {
    const lines = content.split(/\r?\n/);
    if (lines.length === 0) return [];
    
    // Improved CSV parsing for headers and rows
    const parseLine = (line) => {
        const parts = [];
        let cur = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"' && inQuotes && line[j+1] === '"') {
                cur += '"';
                j++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(cur);
                cur = '';
            } else {
                cur += char;
            }
        }
        parts.push(cur);
        return parts;
    };

    const headers = parseLine(lines[0]);
    const titleIdx = headers.indexOf('Title');
    const priceIdx = headers.indexOf('Variant Price');
    const skuIdx = headers.indexOf('Variant SKU');

    const products = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        const parts = parseLine(line);

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

try {
    const shopifyRaw = fs.readFileSync(SHOPIFY_CSV, 'utf-8');
    const shopifyProducts = parseCSV(shopifyRaw);

    if (!fs.existsSync(BRANDS_DIR)) {
        console.error("Brands directory not found!");
        process.exit(1);
    }

    const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
    const allDataProducts = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
        // Split by opening brace of product objects
        const productBlocks = content.split(/{\s*id:/).slice(1);
        
        productBlocks.forEach((block, index) => {
            // Enhanced name extraction
            const nameMatch = block.match(/name:\s*(["'])([\s\S]*?)\1\s*,/);
            const priceMatch = block.match(/price:\s*([\d\.\s"']+)/);
            const skuMatch = block.match(/sku:\s*(["'])([\s\S]*?)\1\s*,/);
            const idMatch = block.match(/^\s*(\d+)/);

            if (nameMatch) {
                let pPrice = 0;
                if (priceMatch) {
                   const rawPrice = priceMatch[1].replace(/["'\s]/g, '');
                   pPrice = parseFloat(rawPrice) || 0;
                }

                const product = {
                    file,
                    id: idMatch ? idMatch[1] : 'unknown',
                    name: nameMatch[2],
                    normalizedName: normalize(nameMatch[2]),
                    price: pPrice,
                    sku: (skuMatch?.[2] || "").trim()
                };
                allDataProducts.push(product);

                // Debug: log first few products from each file
                if (index < 2) {
                    // console.log(`Sample from ${file}: ID=${product.id}, Name="${product.name}", Price=${product.price}`);
                }
            }
        });
    }

    console.log(`Successfully parsed ${allDataProducts.length} products from brand files.`);
    console.log(`Successfully parsed ${shopifyProducts.length} products from Shopify CSV.`);

    // 1. Find Duplicates
    const nameMap = new Map();
    const duplicates = [];
    allDataProducts.forEach(p => {
        if (nameMap.has(p.normalizedName)) {
            const existing = nameMap.get(p.normalizedName);
            // Only report as duplicate if it's not the exact same object (id match)
            if (existing.id !== p.id) {
                duplicates.push({ 
                    name: p.name, 
                    id1: existing.id,
                    id2: p.id,
                    files: [existing.file, p.file] 
                });
            }
        } else {
            nameMap.set(p.normalizedName, p);
        }
    });

    // 2. Find Price Inaccuracies
    const priceInaccuracies = [];
    let matchCount = 0;
    shopifyProducts.forEach(s => {
        if (s.price === 0) return;
        
        const normalizedTitle = normalize(s.title);
        const localMatches = allDataProducts.filter(p => 
            p.normalizedName === normalizedTitle || 
            (p.sku && s.sku && p.sku === s.sku)
        );
        
        if (localMatches.length > 0) matchCount++;

        localMatches.forEach(p => {
            if (Math.abs(s.price - p.price) > 0.05) {
                priceInaccuracies.push({
                    name: p.name,
                    id: p.id,
                    current: p.price,
                    correct: s.price,
                    file: p.file
                });
            }
        });
    });

    console.log(`Matched ${matchCount} Shopify products with local database.`);

    const report = {
        scanDate: new Date().toISOString(),
        totalProductsScanned: allDataProducts.length,
        duplicateCount: duplicates.length,
        duplicates: duplicates,
        priceInaccuracyCount: priceInaccuracies.length,
        priceInaccuracies: priceInaccuracies
    };

    fs.writeFileSync('analysis_results.json', JSON.stringify(report, null, 2));
    console.log(`Found ${duplicates.length} duplicates and ${priceInaccuracies.length} price inaccuracies.`);
} catch (error) {
    console.error("Error during analysis:", error);
}
