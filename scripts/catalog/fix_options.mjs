import fs from 'fs';
import path from 'path';

const brandsDir = path.join(process.cwd(), 'src/data/brands');
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(brandsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find lines like: `    options: [{ size: 'Pink', price: 850, ` and make them `    options: [{ size: 'Pink', price: 850 }],`
  // We'll use a regex replace
  const regex = /(options:\s*\[\s*\{\s*size:\s*'[^']+',\s*price:\s*[0-9]+)(\s*,\s*)$/gm;
  
  const newContent = content.replace(regex, '$1 }],');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed options syntax in ${file}`);
  }
});
