import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRANDS_DIR = path.join(__dirname, 'src/data/brands');
const DATA_DIR = path.join(__dirname, 'public/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'products.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function robustExport() {
    console.log('Starting robust export of products to JSON...');
    const files = fs.readdirSync(BRANDS_DIR);
    const allProducts = [];

    for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        console.log(`Processing ${file}...`);
        const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
        
        // Find every { id: ... } block
        const blocks = content.split(/\{\s*id:/).slice(1);
        blocks.forEach(block => {
            const idMatch = block.match(/^\s*(\d+)/);
            const slugMatch = block.match(/slug:\s*(["'])(.*?)\1/);
            const brandMatch = block.match(/brand:\s*(["'])(.*?)\1/);
            const nameMatch = block.match(/name:\s*(["'])(.*?)\1/);
            const categoryMatch = block.match(/category:\s*(["'])(.*?)\1/);
            const priceMatch = block.match(/price:\s*([\d\.]+)/);
            const imageMatch = block.match(/image:\s*(["'])(.*?)\1/);
            
            // For longer multiline strings, capture until the closing quote
            const descriptionMatch = block.match(/description:\s*["']([\s\S]*?)["'],\n/);
            const ingredientsMatch = block.match(/ingredients:\s*["']([\s\S]*?)["'],\n/);
            
            const skuMatch = block.match(/sku:\s*(["'])(.*?)\1/);
            const supplierIdMatch = block.match(/supplierId:\s*(["'])(.*?)\1/);
            const stockStatusMatch = block.match(/stockStatus:\s*(["'])(.*?)\1/);

            if (idMatch && nameMatch) {
                allProducts.push({
                    id: parseInt(idMatch[1]),
                    slug: slugMatch?.[2] || "",
                    brand: brandMatch?.[2] || "",
                    name: nameMatch?.[2] || "",
                    category: categoryMatch?.[2] || "Skincare",
                    price: parseFloat(priceMatch?.[1] || "0"),
                    image: imageMatch?.[2] || "",
                    description: descriptionMatch?.[1] || "",
                    ingredients: ingredientsMatch?.[1] || "",
                    reviews: [],
                    sku: skuMatch?.[2] || "",
                    supplierId: supplierIdMatch?.[2] || "local",
                    stockStatus: stockStatusMatch?.[2] || "in_stock"
                });

            } else {
              // If it fails to parse basics, log the name of the file
              // console.warn(`Skipped an entry in ${file}`);
            }
        });
    }
    
    console.log(`Successfully exported ${allProducts.length} products to JSON.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
}

robustExport();
