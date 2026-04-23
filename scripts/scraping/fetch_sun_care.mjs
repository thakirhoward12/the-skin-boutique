import fs from 'fs';

async function fetchMissingSunCareProducts() {
  console.log("Fetching additional Sun Care products from Kiyoko Beauty Shopify API...");
  try {
    let allShopifyProducts = [];
    let page = 1;
    let keepFetching = true;

    // Use broader terms or fetch more pages if necessary, but 10 pages usually is enough
    while (keepFetching) {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(`https://kiyokobeauty.com/products.json?limit=250&page=${page}`);
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.products;
      
      if (!products || products.length === 0) {
        keepFetching = false;
        break;
      }
      
      allShopifyProducts = allShopifyProducts.concat(products);
      page++;
      
      // Let's go deeper this time if needed, though 15 is basically their whole catalog
      if (page > 15) break; 
    }

    // Broaden search terms specifically for sunscreen
    const sunCareTerms = ['sun', 'spf', 'uv', 'shield', 'sunblock', 'solar'];
    let foundSunCare = [];
    
    // Read existing IDs to avoid duplicates
    const brandsDir = './src/data/brands';
    const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));
    const existingIds = new Set();
    const idRegex = /id:\s*(\d+)/g;
    
    for (const file of files) {
       const content = fs.readFileSync(`${brandsDir}/${file}`, 'utf8');
       let match;
       while ((match = idRegex.exec(content)) !== null) {
         existingIds.add(parseInt(match[1], 10));
       }
    }
    
    console.log(`Found ${existingIds.size} existing products in catalog.`);

    for (const p of allShopifyProducts) {
       if (existingIds.has(p.id)) continue;
       
       const titleLower = p.title.toLowerCase();
       const typeLower = (p.product_type || '').toLowerCase();
       const tagsLower = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : [];
       const bodyLower = (p.body_html || '').toLowerCase();
       
       // Relaxed matching for sun care
       const isMatch = sunCareTerms.some(term => 
          titleLower.includes(term) || 
          typeLower.includes(term) || 
          tagsLower.includes(term) ||
          bodyLower.includes(term)
       ) && !titleLower.includes('set') && !titleLower.includes('kit'); // Avoid sets
       
       if (isMatch) {
           foundSunCare.push({ ...p, assignedCategory: 'Sun Care' });
           existingIds.add(p.id); // mark as used
           
           if (foundSunCare.length >= 2) break; // Only need 2 more
       }
    }

    if (foundSunCare.length === 0) {
       console.log("No new Sun Care products found.");
       return;
    }

    const newProductsArray = foundSunCare.map((p) => {
      const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
      const rawPrice = firstVariant ? parseFloat(firstVariant.price) : 0;
      const formattedPrice = `$${rawPrice.toFixed(2)}`;
      
      let description = p.body_html || "";
      description = description.replace(/<[^>]*>?/gm, '').trim();
      if (!description) {
         description = `Discover ${p.title} by ${p.vendor}, now available at The Skin Boutique.`;
      }
      
      const primaryImage = p.images && p.images.length > 0 ? p.images[0].src : "https://via.placeholder.com/800x800?text=No+Image";

      return `  {
    id: ${p.id},
    brand: ${JSON.stringify(p.vendor || "Unknown Brand")},
    name: ${JSON.stringify(p.title)},
    category: "Sun Care",
    price: ${JSON.stringify(formattedPrice)},
    image: ${JSON.stringify(primaryImage)},
    description: ${JSON.stringify(description.substring(0, 300) + (description.length > 300 ? "..." : ""))},
    ingredients: "Refer to product packaging.",
    reviews: []
  }`;
    });

    const currentExtras = fs.readFileSync('src/data/brands/kiyoko-extras.ts', 'utf8');
    const arrayEndIndex = currentExtras.lastIndexOf('];');
    
    // Add comma if not empty
    const beforeEnd = currentExtras.substring(0, arrayEndIndex).trimEnd();
    const hasComma = beforeEnd.endsWith(',');
    
    const finalContent = `${beforeEnd}${hasComma ? '' : ','}\n${newProductsArray.join(",\n")}\n];\n`;
    
    fs.writeFileSync('src/data/brands/kiyoko-extras.ts', finalContent);
    console.log(`Added ${foundSunCare.length} missing Sun Care products to kiyoko-extras.ts!`);

  } catch (error) {
    console.error("Failed to fetch missing products:", error.message);
  }
}

fetchMissingSunCareProducts();
