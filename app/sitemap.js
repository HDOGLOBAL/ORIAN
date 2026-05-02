import { getAllProducts, getCategories } from "@/database/queries";

// All domains with their hreflang language codes
const domainLangMap = [
  { domain: "https://hdotrade.pt",     lang: "pt"    },
  { domain: "https://hdotrade.com",    lang: "en-US" },
  { domain: "https://hdotrade.uk",  lang: "en-GB" },
  { domain: "https://hdotrade.de",     lang: "de"    },
  { domain: "https://hdotrade.es",     lang: "es"    },
  { domain: "https://hdotrade.fr",     lang: "fr"    },
  { domain: "https://hdotrade.eu",     lang: "en"    },
  { domain: "https://hdotrade.co.il",  lang: "he"    },
];

const staticPages = [
  { path: "",                  priority: 1.0, freq: "daily"   },
  { path: "/shop",             priority: 0.9, freq: "daily"   },
  { path: "/about",            priority: 0.7, freq: "monthly" },
  { path: "/contact",          priority: 0.7, freq: "monthly" },
  { path: "/terms-conditions", priority: 0.5, freq: "yearly"  },
];

function buildAlternates(path) {
  const languages = { "x-default": `https://hdotrade.pt${path}` };
  for (const { domain, lang } of domainLangMap) {
    languages[lang] = `${domain}${path}`;
  }
  return { languages };
}

export default async function sitemap() {
  const now = new Date().toISOString();
  const entries = [];

  // Static pages
  for (const { path, priority, freq } of staticPages) {
    entries.push({
      url: `https://hdotrade.pt${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: buildAlternates(path),
    });
  }

  // Category pages — important for taxonomy crawling
  try {
    const categories = await getCategories();
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        const slug = cat?.slug || cat?.name || cat?.id || cat?._id?.toString();
        if (!slug) continue;
        const path = `/category/${encodeURIComponent(slug)}`;
        entries.push({
          url: `https://hdotrade.pt${path}`,
          lastModified: cat.updatedAt || now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch (e) {
    console.error("Sitemap: error fetching categories", e);
  }

  // Product pages
  try {
    const products = await getAllProducts({ lean: true });
    for (const product of products) {
      if (!product?.id && !product?._id) continue;
      const id = product.id || product._id.toString();
      const path = `/shop/${id}`;
      entries.push({
        url: `https://hdotrade.pt${path}`,
        lastModified: product.updatedAt || now,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: buildAlternates(path),
      });
    }
  } catch (e) {
    console.error("Sitemap: error fetching products", e);
  }

  return entries;
}
