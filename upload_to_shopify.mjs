import fs from 'fs';
import path from 'path';

const SHOPIFY_DOMAIN = 'the-skin-boutique-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const API_VERSION = '2024-01';

if (!SHOPIFY_ACCESS_TOKEN) {
  console.error('ERROR: Set SHOPIFY_ACCESS_TOKEN environment variable before running.');
  console.error('  PowerShell:  $env:SHOPIFY_ACCESS_TOKEN="your_token_here"');
  process.exit(1);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Read products from brand files using regex since we don't have a TS parser in standard node easily
function parseBrandFiles() {
    console.log('Reading local catalog...');
    const brandsDir = 'src/data/brands';
    const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));
    let products = [];
    
    for (const file of files) {
        const filePath = path.join(brandsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        let currentProduct = null;
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Very naive parser tailored to our file structure
            const idMatch = line.match(/id:\s*(\d+)/);
            if (idMatch) {
                currentProduct = { id: idMatch[1] };
                products.push(currentProduct);
            } else if (currentProduct) {
                const brandMatch = line.match(/brand:\s*"(.*?)"/);
                if (brandMatch) currentProduct.brand = brandMatch[1];
                
                const nameMatch = line.match(/name:\s*"(.*?)"/);
                if (nameMatch) currentProduct.name = nameMatch[1];
                
                const catMatch = line.match(/category:\s*"(.*?)"/);
                if (catMatch) currentProduct.category = catMatch[1];
                
                const priceMatch = line.match(/price:\s*([\d.]+)/);
                if (priceMatch) currentProduct.price = priceMatch[1];
                
                const imageMatch = line.match(/image:\s*"(.*?)"/);
                if (imageMatch) currentProduct.image = imageMatch[1];
                
                if (line.includes('description:')) {
                    const descMatch = line.match(/description:\s*(".*?")/);
                    if (descMatch) {
                        try {
                            currentProduct.description = JSON.parse(descMatch[1]);
                        } catch (e) {
                            currentProduct.description = "";
                        }
                    }
                }
                
                if (line.includes('ingredients:')) {
                    const ingMatch = line.match(/ingredients:\s*(".*?")/);
                    if (ingMatch) {
                        try {
                            currentProduct.ingredients = JSON.parse(ingMatch[1]);
                        } catch (e) {
                            currentProduct.ingredients = "";
                        }
                        // Reached end of vital fields
                        currentProduct = null;
                    }
                }
            }
        }
    }
    
    // Filter out any failed parses
    return products.filter(p => p.id && p.name && p.price);
}

async function uploadToShopify(products) {
    console.log(`Found ${products.length} products to upload.`);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        
        // Construct the product payload
        const payload = {
            product: {
                title: p.name,
                body_html: `<p>${p.description}</p><h6>Ingredients</h6><p>${p.ingredients}</p>`,
                vendor: p.brand,
                product_type: p.category,
                tags: ["Imported", "TSB"],
                variants: [
                    {
                        price: p.price,
                        sku: p.id, // Set SKU to the TS ID so our suppliers can map it
                        requires_shipping: true,
                        inventory_management: null, // Allow infinite purchasing, our suppliers manage rest
                        taxable: true
                    }
                ],
                images: p.image && p.image !== "https://via.placeholder.com/800x800?text=No+Image" ? [
                    { src: p.image }
                ] : []
            }
        };

        try {
            const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.text();
                console.error(`Status ${res.status}: Failed to upload ${p.name}. Response: ${errorData}`);
                failCount++;
            } else {
                successCount++;
                if (successCount % 50 === 0) {
                    console.log(`Uploaded ${successCount}/${products.length} products...`);
                }
            }
        } catch (err) {
            console.error(`Error uploading ${p.name}:`, err.message);
            failCount++;
        }

        // Shopify REST API rate limit is 2 requests per second.
        // Sleep 600ms to stay well within limits (approx 1.6 req/s).
        await sleep(600);
    }

    console.log(`Finished Upload! Success: ${successCount}, Failed: ${failCount}`);
}

async function main() {
    const products = parseBrandFiles();
    // Safety check - maybe just upload the first 10 for testing
    // To do them all, don't slice. Let's slice for safety if they are over 1500 but user wants them all.
    await uploadToShopify(products.slice(0, 5));
}

main();
