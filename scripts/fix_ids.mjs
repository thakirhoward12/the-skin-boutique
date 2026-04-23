import fs from 'fs';
import path from 'path';

const brandsDir = './src/data/brands';
const files = fs.readdirSync(brandsDir);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(brandsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace "id": 12345 with "id": "12345"
  content = content.replace(/"id":\s*(\d+)/g, '"id": "$1"');
  
  // Also handle unquoted id: 12345 just in case
  content = content.replace(/(\s)id:\s*(\d+)/g, '$1id: "$2"');

  fs.writeFileSync(filePath, content);
  console.log(`Updated IDs in ${file}`);
});
