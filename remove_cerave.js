import fs from 'fs';

const filePath = './src/data/products.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// We can parse the file or just use regex, but since it's a TS file with a specific structure, regex might be tricky.
// Actually, since I'm in a node environment, I can just do string manipulation.
// Let's just remove the objects where brand is CeraVe.

const lines = content.split('\n');
let newLines = [];
let inCerave = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes("brand: 'CeraVe'") || line.includes('brand: "CeraVe"')) {
    // We are inside a CeraVe object. We need to go back and remove the start of this object.
    // The object starts with `{` a few lines above.
    let j = newLines.length - 1;
    while (j >= 0 && !newLines[j].includes('{')) {
      j--;
    }
    // Remove from j to end of newLines
    newLines.splice(j);
    inCerave = true;
    braceCount = 1; // we just removed the opening brace, so we are inside it
    continue;
  }
  
  if (inCerave) {
    if (line.includes('{')) braceCount++;
    if (line.includes('}')) braceCount--;
    
    if (braceCount === 0) {
      inCerave = false;
      // If the line has a comma after the closing brace, it's fine, we just skip this line too.
      // E.g. `  },`
    }
    continue;
  }
  
  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Removed CeraVe products');
