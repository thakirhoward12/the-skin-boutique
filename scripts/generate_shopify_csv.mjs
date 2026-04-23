import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const MASTER_FILE = 'public/data/products.json';
const OUTPUT_FILE = 'exports/shopify_import.csv';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function generateShopifyCSV() {
  const products = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf-8'));

  // Shopify requires specific column names
  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE,
    header: [
      { id: 'Handle',                title: 'Handle' },
      { id: 'Title',                 title: 'Title' },
      { id: 'Body',                  title: 'Body (HTML)' },
      { id: 'Vendor',                title: 'Vendor' },
      { id: 'Type',                  title: 'Type' },
      { id: 'Tags',                  title: 'Tags' },
      { id: 'Published',             title: 'Published' },
      { id: 'VariantSKU',            title: 'Variant SKU' },
      { id: 'VariantPrice',          title: 'Variant Price' },
      { id: 'VariantCompareAt',      title: 'Variant Compare At Price' },
      { id: 'VariantRequiresShipping', title: 'Variant Requires Shipping' },
      { id: 'VariantTaxable',        title: 'Variant Taxable' },
      { id: 'VariantInventoryQty',   title: 'Variant Inventory Qty' },
      { id: 'VariantInventoryPolicy',title: 'Variant Inventory Policy' },
      { id: 'ImageSrc',              title: 'Image Src' },
      { id: 'ImageAltText',          title: 'Image Alt Text' },
      { id: 'SEOTitle',              title: 'SEO Title' },
      { id: 'SEODescription',        title: 'SEO Description' },
      { id: 'CostPerItem',           title: 'Cost per item' },
    ]
  });

  const rows = [];

  products.forEach((p, i) => {
    const handle = slugify(p.name);
    const sku = `KY-${String(p.id).padStart(5, '0')}`;
    const description = p.description
      ? p.description  // Already branded by normalize_kiyoko.mjs
          .replace(/Kiyoko['']?s?\s*Notes?\s*:?\s*/gi, '')
          .replace(/\bKiyoko\b/gi, 'The Skin Boutique')
      : `<p><strong>The Skin Boutique Curates: ${p.name}</strong></p><p>Experience the best of K-Beauty with ${p.name} by ${p.brand} — a premium formula crafted for radiant, glass skin.</p><p><em>Authentically sourced and independently curated by The Skin Boutique — your trusted destination for premium K-Beauty in South Africa.</em></p>`;
    const seoDesc = p.description
      ? p.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 320)
      : `Shop ${p.name} by ${p.brand} at The Skin Boutique — South Africa's home of premium K-Beauty.`;
    
    const costPerItem = p.sourcePrice 
      ? (p.sourcePrice * 1.1 * 19.5).toFixed(2) 
      : '';

    if (p.options && p.options.length > 0) {
      // Multiple variants — first row is main product
      p.options.forEach((opt, idx) => {
        rows.push({
          Handle:                    handle,
          Title:                     idx === 0 ? p.name : '',
          Body:                      idx === 0 ? description : '',
          Vendor:                    idx === 0 ? p.brand : '',
          Type:                      idx === 0 ? p.category : '',
          Tags:                      idx === 0 ? `kbeauty, ${p.brand}, ${p.category}` : '',
          Published:                 idx === 0 ? 'TRUE' : '',
          VariantSKU:                `${sku}-${idx}`,
          VariantPrice:              opt.price.toFixed(2),
          VariantCompareAt:          '',
          VariantRequiresShipping:   'TRUE',
          VariantTaxable:            'TRUE',
          VariantInventoryQty:       '100',
          VariantInventoryPolicy:    'deny',
          ImageSrc:                  idx === 0 ? p.image : '',
          ImageAltText:              idx === 0 ? `${p.brand} - ${p.name}` : '',
          SEOTitle:                  idx === 0 ? `${p.name} | The Skin Boutique` : '',
          SEODescription:            idx === 0 ? seoDesc : '',
          CostPerItem:               idx === 0 ? costPerItem : '',
        });
      });
    } else {
      // Single variant
      rows.push({
        Handle:                    handle,
        Title:                     p.name,
        Body:                      description,
        Vendor:                    p.brand,
        Type:                      p.category,
        Tags:                      `kbeauty, ${p.brand}, ${p.category}`,
        Published:                 'TRUE',
        VariantSKU:                sku,
        VariantPrice:              p.price.toFixed(2),
        VariantCompareAt:          '',
        VariantRequiresShipping:   'TRUE',
        VariantTaxable:            'TRUE',
        VariantInventoryQty:       '100',
        VariantInventoryPolicy:    'deny',
        ImageSrc:                  p.image,
        ImageAltText:              `${p.brand} - ${p.name}`,
        SEOTitle:                  `${p.name} | The Skin Boutique`,
        SEODescription:            seoDesc,
        CostPerItem:               costPerItem,
      });
    }
  });

  await csvWriter.writeRecords(rows);
  console.log(`Shopify CSV generated: ${rows.length} rows for ${products.length} products.`);
  console.log(`File saved to: ${OUTPUT_FILE}`);
}

generateShopifyCSV().catch(console.error);
