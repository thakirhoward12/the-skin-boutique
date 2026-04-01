import fs from 'fs';
import path from 'path';

function parseBrandFiles() {
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
                        currentProduct = null;
                    }
                }
            }
        }
    }
    return products.filter(p => p.id && p.name && p.price);
}

function escapeCSV(str) {
    if (!str) return '""';
    const cleaned = str.toString().replace(/"/g, '""');
    return `"${cleaned}"`;
}

async function main() {
    const products = parseBrandFiles();
    console.log(`Generating CSV for ${products.length} products...`);
    
    // Shopify CSV Headers
    const headers = [
        "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
        "Option1 Name", "Option1 Value",
        "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping", "Variant Taxable",
        "Image Src"
    ];
    
    const rows = [];
    rows.push(headers.join(","));
    
    for (const p of products) {
        // Create handle from name
        const handle = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const bodyHtml = `<p>${p.description}</p><h6>Ingredients</h6><p>${p.ingredients}</p>`;
        
        const row = [
            escapeCSV(handle), // Handle
            escapeCSV(p.name), // Title
            escapeCSV(bodyHtml), // Body (HTML)
            escapeCSV(p.brand), // Vendor
            escapeCSV(p.category), // Type
            escapeCSV("Imported, TSB"), // Tags
            "TRUE", // Published
            "Title", // Option1 Name
            "Default Title", // Option1 Value
            escapeCSV(p.id), // Variant SKU (CRITICAL FOR OUR SUPPLIERS)
            "0", // Variant Grams
            "", // Variant Inventory Tracker (Shopify tracks it, but our suppliers update it)
            "999", // Variant Inventory Qty
            "deny", // Variant Inventory Policy
            "manual", // Variant Fulfillment Service
            escapeCSV(p.price), // Variant Price
            "TRUE", // Variant Requires Shipping
            "TRUE", // Variant Taxable
            escapeCSV(p.image && p.image !== "https://via.placeholder.com/800x800?text=No+Image" ? p.image : "") // Image Src
        ];
        
        rows.push(row.join(","));
    }
    
    fs.writeFileSync('shopify_products.csv', rows.join("\n"));
    console.log(`Generated shopify_products.csv successfully with ${products.length} products!`);
}

main();
