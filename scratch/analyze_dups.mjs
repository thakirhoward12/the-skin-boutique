import fs from 'fs';
import path from 'path';

const dir = './src/data/brands';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const products = [];

files.forEach(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    // Extract name and slug (if present) or just name
    // Regex matches name: "..." or name: '...'
    const regex = /name:\s*["'](.+?)["']/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
        products.push({ name: m[1], file: f });
    }
});

const nameMap = new Map();
const duplicates = [];

products.forEach(p => {
    const normalized = p.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (nameMap.has(normalized)) {
        duplicates.push({ 
            name: p.name, 
            file1: nameMap.get(normalized).file, 
            file2: p.file 
        });
    } else {
        nameMap.set(normalized, p);
    }
});

console.log(JSON.stringify({
    totalFound: products.length,
    duplicateCount: duplicates.length,
    duplicates: duplicates
}, null, 2));
