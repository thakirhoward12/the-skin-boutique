import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRANDS_DIR = path.resolve(__dirname, '../src/data/brands');
const DEVICES_FILE = path.join(BRANDS_DIR, 'devices.ts');

// Pricing Constants
const CAD_TO_USD = 0.74;
const USD_TO_ZAR = 18.8;
const ESTIMATED_SHIPPING_ZAR = 100;
const TARGET_MARGIN = 0.45;
const TRANSACTION_FEE = 0.05;

// Helper to calculate retail price
function calculateZarPrice(cadPriceStr) {
  const cadPrice = parseFloat(cadPriceStr || '0');
  const usdPrice = cadPrice * CAD_TO_USD;
  const zarBaseCost = usdPrice * USD_TO_ZAR;
  
  // Same formula as pricingEngine.ts:
  // (Landed Cost + Shipping) / (1 - Margin - Fees)
  const retailZar = (zarBaseCost + ESTIMATED_SHIPPING_ZAR) / (1 - TARGET_MARGIN - TRANSACTION_FEE);
  
  // Format to closest whole number ending in 9 (e.g. 199, 249, etc for retail aesthetic)
  const roughPrice = Math.round(retailZar);
  return Math.ceil(roughPrice / 10) * 10 - 1; 
}

// Generate TS object string
function generateTsObject(p) {
  const sourcePriceCad = p.variants[0]?.price || "0";
  const sourcePriceUsd = (parseFloat(sourcePriceCad) * CAD_TO_USD).toFixed(2);
  const retailPrice = calculateZarPrice(sourcePriceCad);
  
  const img = p.images[0]?.src || '';
  let desc = p.body_html ? p.body_html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').substring(0, 150) + '...' : 'Premium K-Beauty product.';
  // Escape quotes
  const safeDesc = desc.replace(/'/g, "\\'");
  const safeTitle = p.title.replace(/'/g, "\\'");
  const tagsStr = JSON.stringify(p.tags || []);

  return `  {
    id: "${p.handle}",
    name: '${safeTitle}',
    brand: '${p.vendor}',
    price: ${retailPrice},
    description: '${safeDesc}',
    image: "${img}",
    category: "Skincare",
    isNew: true,
    tags: ${tagsStr},
    sourceUrl: "https://www.yesstyle.com/en/search.html?q=${p.handle.replace(/-/g, '+')}", // Placeholder mapping to YesStyle search
    sourcePrice: ${sourcePriceUsd},
    priceStatus: 'verifying'
  },`;
}

async function run() {
  console.log("Fetching Kiyoko products...");
  
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(`https://kiyoko.com/products.json?limit=250&page=${page}`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        allProducts = allProducts.concat(data.products);
        console.log(`Fetched page ${page} - Total so far: ${allProducts.length}`);
        page++;
      } else {
        hasMore = false;
      }
    } catch (e) {
      console.warn("Error fetching page", page, e.message);
      hasMore = false;
    }
  }

  // Get existing files
  const existingFiles = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.ts'));
  
  // Track existing handles so we don't duplicate
  let existingHandles = new Set();
  for (const file of existingFiles) {
    const filePath = path.join(BRANDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Standardize IDs: Change id: 12345 to id: "slug-name"
    // Also captures existing string IDs
    const idRegex = /id:\s*(['"]?)([^'"}]+)(['"]?),/g;
    let match;
    const handlesInFile = new Set();
    
    // First pass: identify handles
    while ((match = idRegex.exec(content)) !== null) {
      let val = match[2].trim();
      // If it's a numeric ID, we want to try to find its handle in the file or just record it
      // Actually, standardizing existing files is easier: if we find a name: '...' we can slugify it if ID is numeric
      handlesInFile.add(val);
      existingHandles.add(val);
    }

    // Heuristic: If we find a product with numeric ID, try to find its handle from the 'name' or just keep it
    // For now, focus on NOT re-adding items already present.
  }
  
  console.log(`Found ${existingHandles.size} existing product references in local files.`);
  
  // Create devices.ts if it doesn't exist
  if (!fs.existsSync(DEVICES_FILE)) {
    fs.writeFileSync(DEVICES_FILE, `import { Product } from '../../types';\n\nexport const products: Product[] = [\n];\n`);
  }
  
  let newAdditions = 0;
  const updatesByFile = {};

  // Device keywords
  const deviceWords = ['device', 'gua sha', 'guasha', 'roller', 'massager', 'silicone mask', 'led mask', 'age-r'];

  for (const p of allProducts) {
    // Check if handle exists OR if Shopify ID (from kiyoko) exists in our files
    if (existingHandles.has(p.handle) || existingHandles.has(String(p.id))) continue;
    
    // Check if it's a device
    const titleLower = p.title.toLowerCase();
    const isDevice = deviceWords.some(w => titleLower.includes(w)) || (p.tags && p.tags.some(t => deviceWords.includes(t.toLowerCase())));
    
    let targetFile = '';
    if (isDevice) {
      targetFile = 'devices.ts';
    } else {
      const vendorSlug = p.vendor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const matchedFile = existingFiles.find(f => f.startsWith(vendorSlug));
      if (matchedFile) {
        targetFile = matchedFile;
      }
    }
    
    if (targetFile) {
      if (!updatesByFile[targetFile]) updatesByFile[targetFile] = [];
      updatesByFile[targetFile].push(generateTsObject(p));
      existingHandles.add(p.handle);
      newAdditions++;
    }
  }
  
  console.log(`Found ${newAdditions} new products to add! Injecting into TS files...`);
  
  for (const [file, codeBlocks] of Object.entries(updatesByFile)) {
    const filePath = path.join(BRANDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Inject right after ANY array definition matching Product[]
    const arrayStartMatch = content.match(/export\s+const\s+(\w+)\s*:\s*Product\[\]\s*=\s*\[/);
    if (arrayStartMatch) {
      const insertPos = arrayStartMatch.index + arrayStartMatch[0].length;
      const injectedCode = '\n' + codeBlocks.join('\n') + '\n';
      content = content.slice(0, insertPos) + injectedCode + content.slice(insertPos);
      fs.writeFileSync(filePath, content);
    } else {
      console.warn(`Could not find export array in ${file}`);
    }
  }
  
  console.log('Bulk import complete!');
}

run();
