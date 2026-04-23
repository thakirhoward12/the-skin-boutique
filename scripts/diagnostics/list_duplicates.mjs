import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands';

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
const allDataProducts = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
    // Regex for name, price, sku
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

const nameMap = new Map();
const duplicates = [];
for (const p of allDataProducts) {
    if (nameMap.has(p.normalizedName)) {
        duplicates.push({ name: p.name, files: [nameMap.get(p.normalizedName).file, p.file] });
    } else {
        nameMap.set(p.normalizedName, p);
    }
}

console.log(`Found ${duplicates.length} duplicates:`);
duplicates.forEach(d => console.log(`- ${d.name} (${d.files.join(', ')})`));
