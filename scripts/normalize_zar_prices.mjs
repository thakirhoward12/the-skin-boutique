import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';
const ZAR_MULTIPLIER = 19;
const USD_THRESHOLD = 100;

function normalizePrices() {
    console.log(`Scanning ${BRANDS_DIR} for price normalization...`);
    
    if (!fs.existsSync(BRANDS_DIR)) {
        console.error("Brands directory not found!");
        return;
    }

    const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
    let totalUpdated = 0;

    for (const file of files) {
        const filePath = path.join(BRANDS_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanged = false;

        // 1. Detect and Convert USD to ZAR
        // Matches "price: 23.00," or "price: 18," etc.
        const priceRegex = /price:\s*([\d.]+)/g;
        content = content.replace(priceRegex, (match, p1) => {
            const price = parseFloat(p1);
            if (price < USD_THRESHOLD) {
                const newPrice = Math.round(price * ZAR_MULTIPLIER);
                console.log(`  [${file}] Converting $${price} -> R${newPrice}`);
                hasChanged = true;
                return `price: ${newPrice}`;
            }
            return match;
        });

        // 2. Remove "Kiyoko" mentions from strings or tags
        // This is safe for our internal data structure.
        if (content.toLowerCase().includes('kiyoko')) {
            console.log(`  [${file}] Removing 'Kiyoko' references...`);
            content = content.replace(/kiyoko/gi, 'Direct');
            hasChanged = true;
        }

        if (hasChanged) {
            fs.writeFileSync(filePath, content);
            totalUpdated++;
        }
    }

    console.log(`\nFinished! Normalized ${totalUpdated} files.`);
}

normalizePrices();
