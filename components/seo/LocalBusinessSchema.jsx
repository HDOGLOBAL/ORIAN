// LocalBusiness JSON-LD — boosts local search ("spare parts Portugal", "Covilha spare parts")
// and ties your website to Google Maps / Google Business Profile

export default function LocalBusinessSchema({ domain = "https://hdotrade.pt" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": `${domain}/#localbusiness`,
    name: "HDO Trade",
    image: `${domain}/client/logo.png`,
    logo: `${domain}/client/logo.png`,
    url: domain,
    telephone: "+351935210099",
    email: "info@hdotrade.pt",
    priceRange: "€€",
    description:
      "HDO Trade supplies tested, high-quality spare parts for commercial kitchen equipment with fast worldwide shipping. Offices, warehouse and physical store in Covilha, Portugal.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quinta das Rosas Lote 3 RC Esq",
      postalCode: "6200-551",
      addressLocality: "Covilha",
      addressRegion: "Castelo Branco",
      addressCountry: "PT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.2806,
      longitude: -7.5039,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://hdotrade.com",
      "https://hdotrade.uk",
      "https://hdotrade.de",
      "https://hdotrade.es",
      "https://hdotrade.fr",
      "https://hdotrade.eu",
      "https://hdotrade.co.il",
    ],
    areaServed: { "@type": "GeoShape", name: "Worldwide" },
    paymentAccepted: ["Credit Card", "Debit Card", "Bank Transfer", "PayPal"],
    currenciesAccepted: "EUR, USD, GBP",
    knowsLanguage: ["English", "Portuguese", "German", "French", "Spanish", "Hebrew"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
