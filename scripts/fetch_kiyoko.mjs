import fs from 'fs';
import path from 'path';

async function fetchKiyokoProducts() {
  let products = [];
  let page = 1;
  let hasMore = true;

  while(hasMore) {
    try {
      const url = `https://kiyoko.com/products.json?limit=250&page=${page}`;
      console.log('Fetching', url);
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        products = products.concat(data.products);
        page++;
      } else {
        hasMore = false;
      }
    } catch (e) {
      console.error('Error fetching page', page, e);
      hasMore = false;
    }
  }

  console.log(`Fetched ${products.length} products from Kiyoko`);
  
  // Clean up and organize by vendor
  const brandData = {};
  for(const p of products) {
    const brand = p.vendor;
    if(!brandData[brand]) brandData[brand] = [];
    
    brandData[brand].push({
      title: p.title,
      handle: p.handle,
      price: p.variants.length > 0 ? p.variants[0].price : 0,
      image: p.images.length > 0 ? p.images[0].src : null,
      tags: p.tags
    });
  }
  
  fs.writeFileSync('kiyoko_dump.json', JSON.stringify(brandData, null, 2));
  console.log('Saved to kiyoko_dump.json');
}

fetchKiyokoProducts();
