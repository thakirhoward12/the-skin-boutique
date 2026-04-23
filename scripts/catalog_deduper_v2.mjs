import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';
const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));

function normalize(name, brand) {
    let n = name.toLowerCase();
    if (brand) {
        const bl = brand.toLowerCase();
        if (n.startsWith(bl)) n = n.slice(bl.length).trim();
    }
    // Keep sizes but normalize format
    n = n.replace(/\s+/g, ' ').replace(/[^a-z0-9]/g, ' ').trim();
    return n;
}

async function run() {
    for (const file of files) {
        const brandName = path.basename(file, '.ts');
        const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf-8');
        
        // Flexible product extraction
        const productRegex = /\{[\s\S]*?id:\s*(["']?)(.*?)\1,[\s\S]*?\}/g;
        const rawProducts = content.match(productRegex) || [];
        
        const products = rawProducts.map(raw => {
            const idMatch = raw.match(/id:\s*(["']?)(.*?)\1,/);
            const nameMatch = raw.match(/name:\s*(["'])(.*?)\3/);
            const imageMatch = raw.match(/image:\s*(["'])(.*?)\5/);
            const supplierMatch = raw.match(/supplierId:\s*(["'])(.*?)\7/);
            
            return {
                raw,
                id: idMatch ? idMatch[2] : null,
                name: nameMatch ? nameMatch[4] : null,
                image: imageMatch ? imageMatch[6] : null,
                supplierId: supplierMatch ? supplierMatch[8] : null,
                normalized: nameMatch ? normalize(nameMatch[4], brandName) : null
            };
        }).filter(p => p.id && p.name);

        const groups = {};
        products.forEach(p => {
            // Group by image if available, otherwise by name
            const key = p.image || p.normalized;
            if (!groups[key]) groups[key] = [];
            groups[key].push(p);
        });

        const idsToRemove = [];
        for (const key in groups) {
            const group = groups[key];
            if (group.length > 1) {
                // If they have the same image, they are definitely duplicates
                // If they only match by normalized name, check if one is 'teemdrop' and other is 'abw'
                const hasTeemdrop = group.some(p => p.supplierId === 'teemdrop');
                const hasAbw = group.some(p => p.supplierId === 'abw');
                
                if (hasTeemdrop && hasAbw) {
                    // Keep teemdrop
                    group.forEach(p => {
                        if (p.supplierId !== 'teemdrop') idsToRemove.push(p.id);
                    });
                } else {
                    // Just keep the one with longer ID or first one
                    const winner = group.sort((a,b) => b.id.toString().length - a.id.toString().length)[0];
                    group.forEach(p => {
                        if (p.id !== winner.id) idsToRemove.push(p.id);
                    });
                }
            }
        }

        if (idsToRemove.length > 0) {
            let newContent = content;
            // Sort by index in raw content to remove safely
            // But we don't have indices for raw matches easily.
            // Let's just replace the raw matches with empty strings one by one
            idsToRemove.forEach(id => {
                const prod = products.find(p => p.id === id);
                if (prod) {
                    // Escape raw for regex replacement or just use indexOf
                    const index = newContent.indexOf(prod.raw);
                    if (index !== -1) {
                        let end = index + prod.raw.length;
                        // Check for trailing comma
                        if (newContent[end] === ',') end++;
                        newContent = newContent.slice(0, index) + newContent.slice(end);
                        console.log(`  Removed ${prod.name} (${prod.id}) from ${file}`);
                    }
                }
            });
            fs.writeFileSync(path.join(BRANDS_DIR, file), newContent, 'utf-8');
        }
    }
}

run();
