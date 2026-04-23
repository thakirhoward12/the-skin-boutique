import fs from 'fs';
import path from 'path';

const BRANDS_DIR = 'src/data/brands';

function normalizeName(name, brand) {
  let normalized = name.toLowerCase();
  
  // Remove brand name if present at start
  if (brand) {
    const brandLower = brand.toLowerCase();
    if (normalized.startsWith(brandLower)) {
      normalized = normalized.slice(brandLower.length).trim();
    }
  }
  
  // Remove common size/unit patterns at end
  normalized = normalized.replace(/\(.*\)$/, ''); // (55ml)
  normalized = normalized.replace(/\d+(ml|g|oz|ml|pcs|s|sheets)/gi, ''); // 55ml
  
  // Strip special chars and extra spaces
  normalized = normalized.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  
  return normalized;
}

async function deduplicateBrand(file) {
  const brandName = path.basename(file, '.ts');
  const filePath = path.join(BRANDS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Simple regex to extract products.
  const productRegex = /\{\s*id:\s*(["']?)(.*?)\1,\s*[\s\S]*?name:\s*(["'])(.*?)\3/g;
  const products = [];
  let match;
  
  while ((match = productRegex.exec(content)) !== null) {
    products.push({
      fullMatch: match[0],
      id: match[2],
      name: match[4],
      index: match.index,
      normalized: normalizeName(match[4], brandName)
    });
  }
  
  if (products.length === 0) return;

  const groups = {};
  products.forEach(p => {
    if (!groups[p.normalized]) groups[p.normalized] = [];
    groups[p.normalized].push(p);
  });

  const idsToRemove = [];
  let duplicateCount = 0;

  for (const norm in groups) {
    const group = groups[norm];
    if (group.length > 1) {
      // Find the winner. Priority: 
      // 1. Has non-placeholder image (heuristic)
      // 2. teemdrop supplier if user wants updated names
      // 3. longest description?
      // 4. For now: Newer IDs (longer strings) usually teemdrop
      
      const winner = group.reduce((prev, curr) => {
        // Simple preference: Newer ID strings are usually the "updated" ones
        if (curr.id.length > prev.id.length) return curr;
        if (curr.id.length < prev.id.length) return prev;
        // Tie breaker: higher ID or just the first one
        return curr.id > prev.id ? curr : prev;
      });

      group.forEach(p => {
        if (p.id !== winner.id) {
          idsToRemove.push(p.id);
          duplicateCount++;
          console.log(`  Removing duplicate: "${p.name}" (${p.id}) in favor of "${winner.name}" (${winner.id})`);
        }
      });
    }
  }

  if (idsToRemove.length > 0) {
    let newContent = content;
    // Walk through and remove. We must do it carefully to not mess up indices.
    // Easiest is to replace each fullMatch with an empty string or a comment.
    // We'll filter the products list and then rebuild the array if possible, 
    // but that's risky for formatting. 
    // Let's use a replacement strategy: 
    
    // Sort IDS to remove by index DESC to not invalidate indices
    const toRemove = products.filter(p => idsToRemove.includes(p.id)).sort((a,b) => b.index - a.index);
    
    for (const p of toRemove) {
      // Try to remove the trailing comma if present
      const afterMatch = newContent.slice(p.index + p.fullMatch.length);
      const commaMatch = afterMatch.match(/^\s*,/);
      const sliceEnd = p.index + p.fullMatch.length + (commaMatch ? commaMatch[0].length : 0);
      
      newContent = newContent.slice(0, p.index) + newContent.slice(sliceEnd);
    }

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${file}: Removed ${duplicateCount} duplicates.`);
  }
}

async function run() {
  const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
  console.log(`Found ${files.length} brand files.`);
  for (const file of files) {
    console.log(`Processing ${file}...`);
    await deduplicateBrand(file);
  }
}

run().catch(console.error);
