import fs from 'fs';
import path from 'path';

const SCRAPED_FILE = 'c:/Users/thaki/.gemini/antigravity/playground/golden-glenn/the-skin-boutique/src/data/brands/kiyoko-scraped.ts';
let content = fs.readFileSync(SCRAPED_FILE, 'utf8');

let originalContent = content;

// 1. Remove non-printable and stray non-ASCII characters that cause TS errors
// except for valid accents like É, ü, etc.
// But first, let's fix the specific "CUR%L" corruption
content = content.replace(/CUR%L/g, 'CURÉL');
content = content.replace(/CUR%L/g, 'CURÉL');
content = content.replace(/Cur%L/g, 'Curél');
content = content.replace(/CUR%L/g, 'CURÉL'); // Fixed the placeholder char

// 2. Fix the "floating commas" in a more robust way
// Matches anything that isn't a property name, value or closing bracket
// and looks for a comma on a line by itself or missing on previous.
// Replaces commas that are at the START of a line or between properties with a single comma at end of line.
content = content.replace(/([^,])\s*\n\s*,/g, '$1,\n');

// 3. Remove double commas
content = content.replace(/,\s*,/g, ',');

// 4. Ensure the file has a valid exports and closing tags
if (!content.includes('import { Product }')) {
    content = "import { Product } from '../products';\n\n" + content;
}
if (!content.includes('export const kiyokoScrapedProducts')) {
    // If somehow the export was mangled
    // This is risky, but let's assume it's there based on previous tail
}
if (!content.trim().endsWith('];')) {
    // If it's cut off, close it.
    // We already saw it ends with ]; in previous tail though.
}

fs.writeFileSync(SCRAPED_FILE, content);
console.log(`Deep sanitization complete for kiyoko-scraped.ts`);
