import fs from 'fs';
import path from 'path';

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  while(true) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`https://kiyokobeauty.com/products.json?limit=250&page=${page}`);
    const data = await res.json();
    if(data.products.length === 0) break;
    products.push(...data.products);
    page++;
    if (page > 10) break; // safeguard
  }
  return products;
}

function extractInfo(bodyHtml) {
  if (!bodyHtml) return { desc: '', ings: 'Refer to product packaging.' };
  
  // Clean 'Kiyoko's Notes'
  let text = bodyHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  text = text.replace(/Kiyoko'?s Notes/ig, '');
  text = text.replace(/Kiyoko Beauty/ig, 'The Skin Boutique');
  text = text.replace(/Kiyoko/ig, 'The Skin Boutique');
  
  // Find Ingredients
  let desc = text;
  let ings = 'Refer to product packaging.';
  
  const ingMatch = text.match(/(?:Full list of ingredients|Ingredients|Ingredient Highlights)[:\s]*(.*)/i);
  if (ingMatch) {
    ings = ingMatch[1].trim();
    // remove the ingredients part from description
    desc = text.substring(0, ingMatch.index).trim();
  }

  // Remove "Ingredients are subject to change..."
  ings = ings.replace(/Ingredients are subject to change.*/ig, '').trim();

  return { desc, ings };
}

async function start() {
    const shopifyProducts = await fetchAllProducts();
    const map = new Map();
    for (const p of shopifyProducts) {
        map.set(p.id, p);
    }
    
    console.log(`Fetched ${map.size} products from API.`);
    
    // Iterate over src/data/brands/
    const brandsDir = 'src/data/brands';
    const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));
    let updatedCount = 0;
    
    for (const file of files) {
        const filePath = path.join(brandsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let changed = false;
        
        const lines = content.split('\n');
        let currentId = null;
        for (let i = 0; i < lines.length; i++) {
            const idMatch = lines[i].match(/id:\s*(\d+)/);
            if (idMatch) {
                currentId = parseInt(idMatch[1]);
            }
            if (currentId && lines[i].includes('description:')) {
                const sp = map.get(currentId);
                // Even if not fetched, remove Kiyoko from what's there
                if (sp) {
                    const info = extractInfo(sp.body_html);
                    lines[i] = `    description: ${JSON.stringify(info.desc || "Discover this amazing product at The Skin Boutique.")},`;
                    changed = true;
                } else {
                    // Try to clean up existing line if missing from API
                   let currentDesc = lines[i].replace(/Kiyoko'?s Notes\\n/ig, '');
                   currentDesc = currentDesc.replace(/Kiyoko/ig, 'The Skin Boutique');
                   lines[i] = currentDesc;
                   changed = true;
                }
            }
            if (currentId && lines[i].includes('ingredients:')) {
                const sp = map.get(currentId);
                if (sp) {
                    const info = extractInfo(sp.body_html);
                    let ingText = info.ings;
                    if (!ingText || ingText.length < 5) ingText = 'Refer to product packaging.';
                    lines[i] = `    ingredients: ${JSON.stringify(ingText)},`;
                }
                currentId = null; // reset
            }
        }
        
        if (changed) {
            fs.writeFileSync(filePath, lines.join('\n'));
            updatedCount++;
        }
    }
    
    console.log(`Updated ${updatedCount} files.`);
}

start();
