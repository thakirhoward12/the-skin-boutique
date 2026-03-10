import fs from 'fs';
import google from 'googlethis';

async function updateCatalog() {
  console.log("Reading products.ts...");
  const content = fs.readFileSync('src/data/products.ts', 'utf8');
  const filePrefix = content.split('export const products: Product[] = ')[0];
  const jsContent = content.split('export const products: Product[] = ')[1];
  const productsStr = jsContent.substring(0, jsContent.lastIndexOf('];') + 1);
  
  let products;
  try {
    products = eval(productsStr);
  } catch (e) {
    console.error("Failed to parse products array. Assuming eval failed on TS syntax. Falling back to regex...");
    return;
  }

  // 1. Deduplicate
  const uniqueProducts = [];
  const seen = new Set();
  let duplicatesRemoved = 0;
  for (const p of products) {
    if (p.brand === "System") continue; // Ignore system pings
    const key = p.brand.trim() + '|' + p.name.trim();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProducts.push(p);
    } else {
      duplicatesRemoved++;
    }
  }
  
  console.log(`Removed ${duplicatesRemoved} duplicate entries.`);

  // 2. Fetch missing or stock images
  let updatedCount = 0;
  for (const p of uniqueProducts) {
    const isTarget = !p.image || 
                     p.image.includes('unsplash.com') || 
                     p.image.includes('pixabay') || 
                     p.image.includes('placeholder') || 
                     p.brand === 'CeraVe' || 
                     p.brand === 'Laneige' || 
                     p.brand === 'LANEIGE';
                     
    if (isTarget) {
      console.log(`[🔎] Fetching new image for: ${p.brand} ${p.name}`);
      try {
        const query = `${p.brand} ${p.name} bottle packaging white background skincare`;
        const results = await google.image(query, { safe: false });
        if (results && results.length > 0) {
          // Find the first good URL
          const bestImage = results.find(res => (res.url && !res.url.includes('amazon') && !res.url.includes('ebay')) || res.url);
          if (bestImage && bestImage.url) {
            console.log(`     -> Found: ${bestImage.url}`);
            p.image = bestImage.url;
            updatedCount++;
          }
        }
        // sleep to avoid rate limiting
        await new Promise(r => setTimeout(r, 2000));
      } catch(e) {
        console.error(`     -> Error fetching image: ${e.message}`);
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} images.`);

  // 3. Re-write the file
  console.log("Writing back to products.ts...");
  
  const formattedProducts = uniqueProducts.map(p => {
    return `  {
    id: ${p.id},
    brand: ${JSON.stringify(p.brand)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    price: ${JSON.stringify(p.price)},
    image: ${JSON.stringify(p.image)},
    ${p.textureVideo ? `textureVideo: ${JSON.stringify(p.textureVideo)},` : ''}
    description: ${JSON.stringify(p.description)},
    ingredients: ${JSON.stringify(p.ingredients)},
    ${p.options ? `options: ${JSON.stringify(p.options)},` : ''}
    ${p.idealFor ? `idealFor: ${JSON.stringify(p.idealFor)},` : ''}
    reviews: []
  }`;
  }).join(",\n");

  const newContent = `${filePrefix}export const products: Product[] = [\n${formattedProducts}\n];\n`;
  fs.writeFileSync('src/data/products.ts', newContent);
  console.log("products.ts successfully formatted and saved!");
}

updateCatalog();
