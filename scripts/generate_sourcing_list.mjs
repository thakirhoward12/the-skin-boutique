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
            
            const idMatch = line.match(/id:\s*['"]?(.*?)['"]?,/);
            if (idMatch) {
                currentProduct = { id: idMatch[1] };
                products.push(currentProduct);
            } else if (currentProduct) {
                const brandMatch = line.match(/brand:\s*"(.*?)"/);
                if (brandMatch) currentProduct.brand = brandMatch[1];
                
                const nameMatch = line.match(/name:\s*"(.*?)"/);
                if (nameMatch) currentProduct.name = nameMatch[1];
                
                const priceMatch = line.match(/price:\s*([\d.]+)/);
                if (priceMatch) currentProduct.price = parseFloat(priceMatch[1]);
                
                const imageMatch = line.match(/image:\s*"(.*?)"/);
                if (imageMatch) currentProduct.image = imageMatch[1];
                
                const skuMatch = line.match(/sku:\s*"(.*?)"/);
                if (skuMatch) currentProduct.sku = skuMatch[1];
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
    console.log(`Generating Sourcing List for ${products.length} products...`);
    
    const headers = [
        "Brand", "Product Name", "SKU / ID", "Image Link", "Target Sale Price (ZAR)"
    ];
    
    const rows = [headers.join(",")];
    
    for (const p of products) {
        const row = [
            escapeCSV(p.brand),
            escapeCSV(p.name),
            escapeCSV(p.sku || p.id),
            escapeCSV(p.image && !p.image.includes("placeholder") ? p.image : ""),
            p.price // Target Sale Price in ZAR
        ];
        
        rows.push(row.join(","));
    }
    
    fs.writeFileSync('the_skin_boutique_sourcing_list.csv', rows.join("\n"));
    console.log(`Generated the_skin_boutique_sourcing_list.csv successfully!`);
}

main();
