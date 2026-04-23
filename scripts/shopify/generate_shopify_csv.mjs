import fs from 'fs';
import path from 'path';

const INPUT_FILE = './public/data/products.json';
const OUTPUT_FILE = './shopify_products_update.csv';

if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Error: ${INPUT_FILE} not found. Run node export_catalog.mjs first.`);
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Shopify CSV Headers
const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Price',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Image Src'
];

const rows = products.map(p => {
    // Escape double quotes and handle multi-line descriptions
    const cleanDescription = p.description ? p.description.replace(/"/g, '""').replace(/\n/g, '<br>') : '';
    const cleanName = p.name ? p.name.replace(/"/g, '""') : '';
    
    return [
        p.slug,
        `"${cleanName}"`,
        `"${cleanDescription}"`,
        `"${p.brand}"`,
        `"${p.category}"`,
        `"${p.brand}, ${p.category}"`, // Tags
        'TRUE',
        'Title',
        'Default Title',
        p.sku || '',
        p.price, // Already in ZAR
        'shopify',
        100, // Default inventory
        'deny',
        'manual',
        p.image || ''
    ].join(',');
});

const csvContent = [headers.join(','), ...rows].join('\n');

fs.writeFileSync(OUTPUT_FILE, csvContent);
console.log(`Successfully generated Shopify CSV: ${OUTPUT_FILE}`);
console.log(`Total products included: ${products.length}`);
