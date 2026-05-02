// JSON-LD structured data for product pages
// Google uses this to show price, stock, rating in search results
// Includes BreadcrumbList for rich snippets and dynamic domain for canonical correctness

export default function ProductSchema({ product, currency, lang = "en", domain = "https://hdotrade.pt" }) {
  if (!product) return null;

  const price =
    currency === "pound"
      ? product.discountPrice?.gbp || product.price?.gbp || product.price?.eur
      : currency === "euro"
      ? product.discountPrice?.eur || product.price?.eur
      : product.discountPrice?.usd || product.price?.usd || product.price?.eur;

  const priceCurrency =
    currency === "pound" ? "GBP" : currency === "euro" ? "EUR" : "USD";

  // Get product name in current language, fallback to English
  const nameMap = {
    en: product.name,
    pt: product.namePt || product.name,
    fr: product.nameFr || product.name,
    es: product.nameEs || product.name,
    de: product.nameDe || product.name,
    he: product.nameHe || product.name,
  };

  const descriptionMap = {
    en: product.description,
    pt: product.descriptionPt || product.description,
    fr: product.descriptionFr || product.description,
    es: product.descriptionEs || product.description,
    de: product.descriptionDe || product.description,
    he: product.descriptionHe || product.description,
  };

  const localName = nameMap[lang] || product.name;
  const localDescription = descriptionMap[lang] || product.description || "";
  const cleanDescription = localDescription
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const productId = product.id || product._id?.toString();
  const productUrl = `${domain}/shop/${productId}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localName,
    description: cleanDescription || `${localName} - HDO Trade spare part`,
    image: product.image ? [product.image] : [],
    sku: product.sku || productId,
    mpn: product.mpn || product.sku || productId,
    brand: {
      "@type": "Brand",
      name: product.brand || "HDO Trade",
    },
    // All language names for Google to understand multilingual content
    alternateName: [
      product.namePt,
      product.nameFr,
      product.nameEs,
      product.nameDe,
      product.nameHe,
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency,
      price: price || 0,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability:
        product.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "HDO Trade",
        url: domain,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: priceCurrency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          geoTargetName: "Worldwide",
        },
      },
    },
    ...(product.ratings && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratings,
        reviewCount: product.reviewsNumber || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  // Breadcrumb schema — gives rich snippets in search results
  const breadcrumbLabels = {
    en: { home: "Home", shop: "Shop" },
    pt: { home: "Início", shop: "Loja" },
    fr: { home: "Accueil", shop: "Boutique" },
    es: { home: "Inicio", shop: "Tienda" },
    de: { home: "Startseite", shop: "Shop" },
    he: { home: "בית", shop: "חנות" },
  };
  const labels = breadcrumbLabels[lang] || breadcrumbLabels.en;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.home,
        item: domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: labels.shop,
        item: `${domain}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localName,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
