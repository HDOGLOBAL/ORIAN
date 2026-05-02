export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/api/",
          "/socket/",
          "/support/",
          "/checkout/",
          "/add-card/",
          "/admin/",
          "/vat-check/",
          "/*?search=*",        // avoid indexing search result variants
          "/*?manufacturer=*",  // avoid filter combination duplicates
          "/*?subcategory=*",
          "/*?page=*",          // canonical handles pagination, no need to index
        ],
      },
      // Block bad SEO bots that waste crawl budget
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"],
        disallow: "/",
      },
    ],
    sitemap: [
      "https://hdotrade.pt/sitemap.xml",
      "https://hdotrade.com/sitemap.xml",
      "https://hdotrade.eu/sitemap.xml",
      "https://hdotrade.de/sitemap.xml",
      "https://hdotrade.uk/sitemap.xml",   // ← was hdotrade.uk (wrong), fixed
      "https://hdotrade.es/sitemap.xml",
      "https://hdotrade.fr/sitemap.xml",
      "https://hdotrade.co.il/sitemap.xml",
    ],
    host: "https://hdotrade.pt",
  };
}
