import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://the-skin-boutique.web.app';
const BRANDS_DIR = './src/data/brands';
const PUBLIC_DIR = './public';

async function generateSitemap() {
  console.log('Generating sitemap...');

  const files = fs.readdirSync(BRANDS_DIR);
  const brands = [];
  const products = [];

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    
    const content = fs.readFileSync(path.join(BRANDS_DIR, file), 'utf8');
    
    // Extract Brand Name (usually first brand: "...")
    const brandMatch = content.match(/brand:\s*["']([^"']+)["']/);
    if (brandMatch && !brands.includes(brandMatch[1])) {
      brands.push(brandMatch[1]);
    }

    // Extract Product Names
    const nameRegex = /name:\s*["']([^"']+)["']/g;
    let match;
    while ((match = nameRegex.exec(content)) !== null) {
      products.push(match[1]);
    }
  }

  console.log(`Found ${brands.length} brands and ${products.length} products.`);

  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // Brand Pages
  brands.forEach(brand => {
    const encodedBrand = encodeURIComponent(brand);
    sitemap += `  <url>
    <loc>${BASE_URL}/?brand=${encodedBrand}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  sitemap += `  <url>
    <loc>${BASE_URL}/admin</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully in public/sitemap.xml!');
}

generateSitemap();
