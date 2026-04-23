import fs from 'fs';

async function fetchAnuaProducts() {
  console.log("Fetching products from Kiyoko Beauty Shopify API...");
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
    }

    const shopifyProducts = allShopifyProducts.filter(p => p.vendor === "ANUA" || p.vendor === "Anua" || p.title.toLowerCase().includes("anua"));
    
    console.log(`Successfully fetched ${shopifyProducts.length} Anua products.`);
    
    // Read the existing file contents
    const currentTs = fs.readFileSync('src/data/brands/anua.ts', 'utf8');
    
    // Split the file at the array opening to insert new items
    const arrayStartMatch = 'export const brandAnuaProducts: Product[] = [';
    const arrayStartIndex = currentTs.indexOf(arrayStartMatch);
    
    // If we can't find the array, bail out
    if (arrayStartIndex === -1) {
       console.error("Could not find brandAnuaProducts array in anua.ts");
       return;
    }
    
    // Extract existing product IDs to prevent duplicates
    const idRegex = /id:\s*(\d+)/g;
    const existingIds = new Set();
    let match;
    while ((match = idRegex.exec(currentTs)) !== null) {
      existingIds.add(parseInt(match[1], 10));
    }
    
    console.log(`Found ${existingIds.size} existing Anua products.`);

    const newProductsArray = shopifyProducts
      .filter(p => !existingIds.has(p.id))
      .map((p) => {
      // Find the first variant for pricing
      const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
      const rawPrice = firstVariant ? parseFloat(firstVariant.price) : 0;
      const formattedPrice = `$${rawPrice.toFixed(2)}`;
      
      // Attempt to clean HTML tags out of description
      let description = p.body_html || "";
      description = description.replace(/<[^>]*>?/gm, '').trim();
      
      // Fallback descriptions if the parsed HTML is empty
      if (!description) {
         description = `Discover ${p.title} by ${p.vendor}, now available at The Skin Boutique.`;
      }
      
      // Find the primary featured image
      const primaryImage = p.images && p.images.length > 0 ? p.images[0].src : "https://via.placeholder.com/800x800?text=No+Image";

      return `  {
    id: ${p.id},
    brand: "ANUA",
    name: ${JSON.stringify(p.title)},
    category: ${JSON.stringify(p.product_type || "Skincare")},
    price: ${JSON.stringify(formattedPrice)},
    image: ${JSON.stringify(primaryImage)},
    description: ${JSON.stringify(description.substring(0, 300) + (description.length > 300 ? "..." : ""))},
    ingredients: "Refer to product packaging.",
    reviews: []
  }`;
    });

    if (newProductsArray.length === 0) {
      console.log("No new Anua products to add.");
      return;
    }

    // Determine the split point
    const splitPoint = arrayStartIndex + arrayStartMatch.length;
    const beforeArrayDesc = currentTs.substring(0, splitPoint);
    const afterArrayDesc = currentTs.substring(splitPoint);
    
    let combinedProducts = "";
    if (afterArrayDesc.trim() === '];' || afterArrayDesc.trim() === ']') {
        combinedProducts = `\n${newProductsArray.join(",\n")}\n`;
    } else {
        combinedProducts = `\n${newProductsArray.join(",\n")},\n`;
    }
    
    const finalContent = `${beforeArrayDesc}${combinedProducts}${afterArrayDesc.trimStart()}`;
    
    fs.writeFileSync('src/data/brands/anua.ts', finalContent);
    console.log(`Added ${newProductsArray.length} new Anua products to src/data/brands/anua.ts!`);

  } catch (error) {
    console.error("Failed to add Anua products:", error.message);
  }
}

fetchAnuaProducts();
