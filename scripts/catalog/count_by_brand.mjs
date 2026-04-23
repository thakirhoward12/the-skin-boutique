import fs from 'fs';
import path from 'path';

const brandsDir = 'src/data/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));

const counts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const catRegex = /id:\s*\d+/g;
  const matches = content.match(catRegex);
  const count = matches ? matches.length : 0;
  counts.push({ file, count });
}

counts.sort((a, b) => b.count - a.count);

console.log('All Brands by Product Count:');
counts.forEach(c => {
  console.log(`${c.file}: ${c.count} products`);
});
