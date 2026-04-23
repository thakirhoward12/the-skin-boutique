import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/data/brands/skin1004.ts', 'utf-8');
const productRegex = /\{\s*id:\s*["'](.*?)["'],\s*name:\s*["'](.*?)["']/g;
let match;
let count = 0;
while ((match = productRegex.exec(content)) !== null) {
  count++;
  console.log(`Match ${count}: ${match[1]} - ${match[2]}`);
}
console.log(`Total found in skin1004.ts: ${count}`);
