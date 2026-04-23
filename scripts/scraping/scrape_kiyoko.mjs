import fs from 'fs';

async function fetchAndReplaceCatalog() {
  console.log("Fetching the first 250 products from Kiyoko Beauty Shopify API...");
  try {
    const response = await fetch('https://kiyokobeauty.com/products.json?limit=250');
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    const shopifyProducts = data.products;
    
    console.log(`Successfully fetched ${shopifyProducts.length} unique products.`);
    
    // Read the existing file prefixes
    const currentTs = fs.readFileSync('src/data/products.ts', 'utf8');
    const filePrefix = currentTs.split('export const products: Product[] = ')[0];
    
    const newProductsArray = shopifyProducts.map((p) => {
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
    brand: ${JSON.stringify(p.vendor || "Unknown Brand")},
    name: ${JSON.stringify(p.title)},
    category: ${JSON.stringify(p.product_type || "Skincare")},
    price: ${JSON.stringify(formattedPrice)},
    image: ${JSON.stringify(primaryImage)},
    description: ${JSON.stringify(description.substring(0, 300) + (description.length > 300 ? "..." : ""))},
    ingredients: "Refer to product packaging.",
    reviews: []
  }`;
    });

    const finalContent = `${filePrefix}export const products: Product[] = [\n${newProductsArray.join(",\n")}\n];\n`;
    
    fs.writeFileSync('src/data/products.ts', finalContent);
    console.log(`Replaced all products in src/data/products.ts with ${shopifyProducts.length} items from Kiyoko Beauty!`);

  } catch (error) {
    console.error("Failed to replace catalog:", error.message);
  }
}

fetchAndReplaceCatalog();
