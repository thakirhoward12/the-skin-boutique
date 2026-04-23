import fs from 'fs';

const products = JSON.parse(fs.readFileSync('./public/data/products.json', 'utf8'));

const seenNames = new Map();
const seenSkus = new Map();
const seenSlugs = new Map();

const duplicates = {
    byName: [],
    bySku: [],
    bySlug: []
};

products.forEach(p => {
    const name = p.name.toLowerCase().trim();
    const sku = p.sku?.toLowerCase().trim();
    const slug = p.id; // Corrected: in this app 'id' is often the slug or numeric ID used for slugging

    if (seenNames.has(name)) {
        duplicates.byName.push({ product: p, original: seenNames.get(name) });
    } else {
        seenNames.set(name, p);
    }

    if (sku && seenSkus.has(sku)) {
        duplicates.bySku.push({ product: p, original: seenSkus.get(sku) });
    } else if (sku) {
        seenSkus.set(sku, p);
    }

    if (slug && seenSlugs.has(slug)) {
        duplicates.bySlug.push({ product: p, original: seenSlugs.get(slug) });
    } else if (slug) {
        seenSlugs.set(slug, p);
    }
});

console.log(JSON.stringify(duplicates, null, 2));
