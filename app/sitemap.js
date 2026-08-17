import { getAllProducts, getCategories } from "@/database/queries";

// All domains with their hreflang language codes
const domainLangMap = [
  { domain: "https://www.hdotrade.pt",  lang: "pt"    },
  { domain: "https://hdotrade.com",    lang: "en-US" },
  { domain: "https://hdotrade.uk",     lang: "en-GB" },
  { domain: "https://hdotrade.de",     lang: "de"    },
  { domain: "https://hdotrade.es",     lang: "es"    },
  { domain: "https://hdotrade.fr",     lang: "fr"    },
  { domain: "https://hdotrade.it",     lang: "it"    },
  { domain: "https://hdotrade.eu",     lang: "en"    },
  { domain: "https://hdotrade.co.il",  lang: "he"    },
];

const staticPages = [
  { path: "",                  priority: 1.0, freq: "daily"   },
  { path: "/shop",             priority: 0.9, freq: "daily"   },
  { path: "/about",            priority: 0.7, freq: "monthly" },
  { path: "/contact",          priority: 0.7, freq: "monthly" },
  { path: "/terms-conditions", priority: 0.5, freq: "yearly"  },
  { path: "/privacy-policy",   priority: 0.5, freq: "yearly"  },
  { path: "/refunds-returns",  priority: 0.5, freq: "yearly"  },
];

// Static category slugs — always available, no DB needed
const staticCategorySlugs = [
  "dishwasher",
  "mixer",
  "juicer",
  "vegetable-cutter",
  "kitchen-tap",
];

function buildAlternates(path) {
  const languages = { "x-default": `https://www.hdotrade.pt${path}` };
  for (const { domain, lang } of domainLangMap) {
    languages[lang] = `${domain}${path}`;
  }
  return { languages };
}

// Wraps a promise with a timeout — returns null if it takes too long
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export default async function sitemap() {
  const now = new Date().toISOString();
  const entries = [];

  // Static pages — always included, no DB required
  for (const { path, priority, freq } of staticPages) {
    entries.push({
      url: `https://www.hdotrade.pt${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: buildAlternates(path),
    });
  }

  // Static category pages — always included
  for (const slug of staticCategorySlugs) {
    const path = `/category/${slug}`;
    entries.push({
      url: `https://www.hdotrade.pt${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: buildAlternates(path),
    });
  }

  // DB category pages (extra slugs from DB, 5s timeout)
  try {
    const categories = await withTimeout(getCategories(), 5000);
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        const slug = cat?.slug || cat?.name || cat?.id || cat?._id?.toString();
        if (!slug || staticCategorySlugs.includes(slug)) continue;
        const path = `/category/${encodeURIComponent(slug)}`;
        entries.push({
          url: `https://www.hdotrade.pt${path}`,
          lastModified: cat.updatedAt || now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch (_) {}

  // Product pages (5s timeout — if DB is slow, sitemap still works)
  try {
    const products = await withTimeout(getAllProducts({ lean: true }), 5000);
    if (Array.isArray(products)) {
      for (const product of products) {
        if (!product?.id && !product?._id) continue;
        const id = product.id || product._id.toString();
        const path = `/shop/${id}`;
        entries.push({
          url: `https://www.hdotrade.pt${path}`,
          lastModified: product.updatedAt || now,
          changeFrequency: "weekly",
          priority: 0.9,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch (_) {}

  return entries;
}
