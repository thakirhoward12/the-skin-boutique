import * as cheerio from 'cheerio';

/**
 * Extracts product price and stock status from Shopify JSON-LD
 */
export function extractShopifyJsonLd(html) {
  const $ = cheerio.load(html);
  let price = null;
  let inStock = false;
  let currency = 'USD';

  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      // Handle array of schemas or single schema
      const schemas = Array.isArray(data) ? data : [data];
      
      const productSchema = schemas.find(s => s['@type'] === 'Product');
      if (productSchema && productSchema.offers) {
        const offer = Array.isArray(productSchema.offers) ? productSchema.offers[0] : productSchema.offers;
        
        if (offer.price) {
          price = parseFloat(offer.price);
          currency = offer.priceCurrency || 'USD';
        }
        
        if (offer.availability) {
          inStock = offer.availability.includes('InStock');
        } else {
            inStock = true; // Assume true if not specified but price exists
        }
      }
    } catch (e) {
      // Ignore JSON parse errors for invalid scripts
    }
  });

  return { price, inStock, currency };
}

/**
 * Fallback generic DOM extractor
 */
export function extractGenericDom(html, config) {
  const $ = cheerio.load(html);
  let price = null;
  let inStock = true; // Assume in stock for generic unless proven otherwise

  for (const selector of config.selectors.generic.price_selectors) {
    const el = $(selector).first();
    if (el.length) {
      const text = el.text().replace(/[^0-9.]/g, '');
      const parsed = parseFloat(text);
      if (!isNaN(parsed) && parsed > 0) {
        price = parsed;
        break;
      }
    }
  }

  return { price, inStock, currency: 'USD' }; // Hardcode USD fallback
}
