import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands';
const files = fs.readdirSync(BRANDS_DIR);

files.forEach(file => {
    if (!file.endsWith('.ts') && !file.endsWith('.js')) return;
    
    const filePath = path.join(BRANDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let originalContent = content;
    
    // 1. Fix the "floating comma" and missing comma issue
    // This regex matches a property value, followed by potential whitespace/comma/news, then "sku:"
    // It captures the trailing character of the previous value.
    const aggressiveFix = /([^,\s])\s*\n+\s*,?\s*sku:/g;
    content = content.replace(aggressiveFix, '$1,\n    sku:');
    
    // 2. Fix the specific mangled brand name for Curél
    // It seems to be encoded as "CUR%L" or similar
    content = content.replace(/CUR%L/g, 'CURÉL');
    content = content.replace(/CUR%L/g, 'CURÉL');
    content = content.replace(/Cur%L/g, 'Curél');
    
    // 3. Cleanup double commas if any
    content = content.replace(/,(\s*\n*\s*),/g, '$1,');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Deep cleaned ${file}`);
    } else {
        console.log(`No fixes needed for ${file}`);
    }
});
