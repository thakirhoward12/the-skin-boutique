import fs from 'fs';

async function fetchMissingProducts() {
  console.log("Fetching missing products from Kiyoko Beauty Shopify API...");
  try {
    let allShopifyProducts = [];
    let page = 1;
    let keepFetching = true;

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
      
      // Stop after 10 pages to prevent infinite loops, should be plenty
      if (page > 10) break;
    }

    const needs = {
      'Cleansers': { terms: ['cleanser', 'wash', 'cleansing'], needed: 5, found: [] },
      'Eye Care': { terms: ['eye cream', 'eye serum', 'eye patch'], needed: 6, found: [] },
      'Exfoliants': { terms: ['exfoliant', 'peeling', 'scrub', 'bha', 'aha'], needed: 11, found: [] },
      'Sun Care': { terms: ['sunscreen', 'sun cream', 'sun stick', 'spf'], needed: 13, found: [] }
    };
    
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
       
       for (const [targetCat, reqs] of Object.entries(needs)) {
         if (reqs.found.length < reqs.needed) {
            // Check if product matches this category
            const isMatch = reqs.terms.some(term => titleLower.includes(term) || typeLower.includes(term));
            
            if (isMatch) {
               // Make sure it doesn't accidentally match another category's primary keywords if it's already assigned
               let isAssignedToOther = false;
               for (const otherCat of Object.keys(needs)) {
                  if (otherCat !== targetCat && needs[otherCat].found.some(f => f.id === p.id)) {
                     isAssignedToOther = true;
                  }
               }
               
               if (!isAssignedToOther) {
                   reqs.found.push({ ...p, assignedCategory: targetCat });
                   existingIds.add(p.id); // mark as used
                   break; // Stop looking for other categories for this product
               }
            }
         }
       }
       
       // Check if we have enough of everything
       const allSatisfied = Object.values(needs).every(req => req.found.length >= req.needed);
       if (allSatisfied) break;
    }

    let allNewProducts = [];
    for (const [cat, reqs] of Object.entries(needs)) {
       console.log(`Found ${reqs.found.length}/${reqs.needed} for ${cat}`);
       allNewProducts = allNewProducts.concat(reqs.found);
    }
    
    if (allNewProducts.length === 0) {
       console.log("No new products found.");
       return;
    }

    const newProductsArray = allNewProducts.map((p) => {
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
    category: ${JSON.stringify(p.assignedCategory)},
    price: ${JSON.stringify(formattedPrice)},
    image: ${JSON.stringify(primaryImage)},
    description: ${JSON.stringify(description.substring(0, 300) + (description.length > 300 ? "..." : ""))},
    ingredients: "Refer to product packaging.",
    reviews: []
  }`;
    });

    const fileContent = `import { Product } from '../products';\n\nexport const kiyokoExtrasProducts: Product[] = [\n${newProductsArray.join(",\n")}\n];\n`;
    fs.writeFileSync('src/data/brands/kiyoko-extras.ts', fileContent);
    console.log(`Created kiyoko-extras.ts with ${allNewProducts.length} missing products!`);

  } catch (error) {
    console.error("Failed to fetch missing products:", error.message);
  }
}

fetchMissingProducts();
