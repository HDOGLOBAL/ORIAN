import { headers } from "next/headers";

export default async function robots() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "hdotrade.pt";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

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
      "https://hdotrade.uk/sitemap.xml",
      "https://hdotrade.es/sitemap.xml",
      "https://hdotrade.fr/sitemap.xml",
      "https://hdotrade.co.il/sitemap.xml",
      "https://hdotrade.au/sitemap.xml",
    ],
    host: baseUrl,
  };
}
