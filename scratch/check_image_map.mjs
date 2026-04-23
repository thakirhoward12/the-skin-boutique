import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';
const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));

const imageMap = {};
let conflictCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf-8');
  const productRegex = /\{\s*id:\s*(["']?)(.*?)\1,\s*[\s\S]*?name:\s*(["'])(.*?)\3[\s\S]*?image:\s*(["'])(.*?)\5/g;
  let match;
  while ((match = productRegex.exec(content)) !== null) {
    const id = match[2];
    const name = match[4];
    const image = match[6];
    
    if (imageMap[image]) {
      console.log(`Conflict in ${file}: "${name}" and "${imageMap[image].name}" in ${imageMap[image].file}`);
      conflictCount++;
    } else {
      imageMap[image] = { id, name, file };
    }
  }
});

console.log(`\nTotal image conflicts: ${conflictCount}`);
