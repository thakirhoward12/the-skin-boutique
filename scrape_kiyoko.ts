import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { resolve } from 'path';

async function scrapeKiyoko() {
  console.log("Fetching ALL products from Kiyoko Shopify API...");
  
  let allShopifyProducts: any[] = [];
  let page = 1;

  while (true) {
    console.log(`Fetching page ${page}...`);
    try {
      const response = await fetch(`https://kiyokobeauty.com/products.json?limit=250&page=${page}`);
      if (!response.ok) break;
      const data = await response.json();
      if (!data.products || data.products.length === 0) break;
      
      allShopifyProducts = allShopifyProducts.concat(data.products);
      page++;
      
      // Safety fail-safe just in case
      if (page > 30) break;
    } catch (err) {
      console.error("Fetch error on page " + page, err);
      break;
    }
  }
  
  console.log(`Fetched ${allShopifyProducts.length} total products from Kiyoko.`);

  // Get existing IDs from local source to prevent duplicating
  const brandsDir = './src/data/brands';
  const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.ts'));
  const existingIds = new Set<number>();
  const idRegex = /id:\s*(\d+)/g;
  
  for (const file of files) {
     const content = fs.readFileSync(`${brandsDir}/${file}`, 'utf8');
     let match;
     while ((match = idRegex.exec(content)) !== null) {
       existingIds.add(parseInt(match[1], 10));
     }
  }
  
  console.log(`Found ${existingIds.size} existing products locally.`);
  
  const newProducts: any[] = [];
  for (const p of allShopifyProducts) {
    if (existingIds.has(p.id)) continue;
    
    // Attempt to guess category based on title and tags
    const titleLower = p.title.toLowerCase();
    const typeLower = (p.product_type || '').toLowerCase();
    
    let category = "Skincare";
    if (titleLower.includes('cleans') || typeLower.includes('cleans')) category = "Cleansers";
    else if (titleLower.includes('sun') || typeLower.includes('sun') || titleLower.includes('spf')) category = "Sun Care";
    else if (titleLower.includes('toner') || typeLower.includes('toner')) category = "Toners";
    else if (titleLower.includes('serum') || titleLower.includes('ampoule')) category = "Serums";
    else if (titleLower.includes('cream') || titleLower.includes('moistur')) category = "Moisturizers";
    else if (titleLower.includes('mask') || typeLower.includes('mask')) category = "Masks";
    else if (titleLower.includes('eye')) category = "Eye Care";
    else if (titleLower.includes('exfoliat') || titleLower.includes('peel') || titleLower.includes('bha') || titleLower.includes('aha')) category = "Exfoliants";
    else if (p.product_type) category = p.product_type;
    
    const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
    const rawPrice = firstVariant ? parseFloat(firstVariant.price) : 0;
    if (rawPrice === 0) continue; // Skip items with no price/not available
    
    let description = p.body_html || "";
    description = description.replace(/<[^>]*>?/gm, '').trim();
    if (!description) description = `Discover ${p.title} by ${p.vendor}, now available at The Skin Boutique.`;
    
    const primaryImage = p.images && p.images.length > 0 ? p.images[0].src : "https://via.placeholder.com/800x800?text=No+Image";

    newProducts.push({
      id: p.id,
      brand: p.vendor || "Unknown Brand",
      name: p.title,
      category: category,
      price: rawPrice,
      image: primaryImage,
      description: description.substring(0, 300) + (description.length > 300 ? "..." : ""),
      ingredients: "Refer to product packaging.",
      reviews: []
    });
  }
  
  if (newProducts.length === 0) {
     console.log("No new products found.");
     return;
  }
  
  console.log(`Found ${newProducts.length} NEW products to add to catalog.`);
  
  // Format for local file
  const newProductsArray = newProducts.map(p => `  {
    id: ${p.id},
    brand: ${JSON.stringify(p.brand)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    price: ${p.price},
    image: ${JSON.stringify(p.image)},
    description: ${JSON.stringify(p.description)},
    ingredients: "Refer to product packaging.",
    reviews: []
  }`);
  
  // Save to src/data/brands to be imported
  const fileContent = `import { Product } from '../products';\n\nexport const kiyokoAllNewProducts: Product[] = [\n${newProductsArray.join(",\n")}\n];\n`;
  fs.writeFileSync('src/data/brands/kiyoko-all-new.ts', fileContent);
  console.log("Local file kiyoko-all-new.ts generated.");
  
  // Upload to Firebase
  try {
    const serviceAccountPath = resolve('./serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
      console.log("serviceAccountKey.json not found, skipping Firebase upload. Run `npx tsx upload_to_firestore.ts` later.");
      return;
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    try {
      initializeApp({ credential: cert(serviceAccount) });
    } catch (e) { /* silent catch */ }
    
    const db = getFirestore();
    
    console.log("Uploading to Firebase Firestore in batches...");
    let count = 0;
    let batch = db.batch();
    const productsRef = db.collection('products');
    
    for (let i = 0; i < newProducts.length; i++) {
       const product = newProducts[i];
       const docRef = productsRef.doc(product.id.toString());
       batch.set(docRef, product);
       count++;
       if (count % 400 === 0) {
         await batch.commit();
         batch = db.batch(); // limit is 500
       }
    }
    if (count % 400 !== 0) {
      await batch.commit();
    }
    console.log(`Successfully uploaded ${count} missing Kiyoko products to Firestore!`);
  } catch (err) {
    console.error("Firebase upload failed:", err);
  }
}

scrapeKiyoko();
