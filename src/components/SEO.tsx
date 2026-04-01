import { useEffect } from 'react';
import { type Product } from '../data/products';

interface SEOProps {
  title?: string;
  description?: string;
  product?: Product;
}

export default function SEO({ title, description, product }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const baseTitle = "The Skin Boutique | Premium K-Beauty";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    document.title = fullTitle;

    // 2. Base Metadata
    const metaDescription = description || "Discover the best of Korean Skincare at The Skin Boutique. Curated K-Beauty favorites for every skin type.";
    const currentUrl = window.location.href;
    const defaultImage = "https://cdn.shopify.com/s/files/1/0515/4589/9157/files/The_Skin_Boutique_Logo.png";
    const image = product?.image || defaultImage;

    const updates = [
      { name: "description", content: metaDescription },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: metaDescription },
      { property: "og:image", content: image },
      { property: "og:url", content: currentUrl },
      { property: "twitter:title", content: fullTitle },
      { property: "twitter:description", content: metaDescription },
      { property: "twitter:image", content: image },
    ];

    updates.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    // 3. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 4. Inject Product Schema if applicable
    let scriptTag = document.getElementById('product-schema');
    
    if (product) {
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [product.image],
        "description": product.description,
        "brand": { "@type": "Brand", "name": product.brand },
        "offers": {
          "@type": "Offer",
          "url": currentUrl,
          "priceCurrency": "ZAR",
          "price": product.price,
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": product.reviews?.length || "12"
        }
      };

      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'product-schema';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.innerHTML = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, product]);

  return null; // This is a logic-only component
}
