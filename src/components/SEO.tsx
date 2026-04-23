import React from 'react';
import { Helmet } from 'react-helmet-async';
import { type Product } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  product?: Product;
}

export default function SEO({ title, description, product }: SEOProps) {
  const baseTitle = "The Skin Boutique | Premium K-Beauty & Skincare South Africa";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const metaDescription = description || "Shop 1000+ authentic Korean skincare products at The Skin Boutique. Curated K-Beauty favorites for every skin type. Free shipping on orders over R750.";
  const currentUrl = window.location.href;
  const defaultImage = "https://cdn.shopify.com/s/files/1/0515/4589/9157/files/The_Skin_Boutique_Logo.png";
  const image = product?.image || defaultImage;

  const productSchema = product ? {
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
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://the-skin-boutique.web.app/"
      },
      ...(product ? [{
        "@type": "ListItem",
        "position": 2,
        "name": product.name,
        "item": currentUrl
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}
