import Breadcrumb from "@/components/shop/Breadcrumb";
import ProductCard from "@/components/shop/ProductCard";
import { getProductByCategory, getCategories } from "@/database/queries";
import { getCurrency } from "@/utils/getCookieServer";
import {
  getRequestLanguage,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";

const DOMAIN_MAP = [
  { domain: "https://hdotrade.pt",     hreflang: "pt"    },
  { domain: "https://hdotrade.com",    hreflang: "en-US" },
  { domain: "https://hdotrade.uk",  hreflang: "en-GB" },
  { domain: "https://hdotrade.de",     hreflang: "de"    },
  { domain: "https://hdotrade.es",     hreflang: "es"    },
  { domain: "https://hdotrade.fr",     hreflang: "fr"    },
  { domain: "https://hdotrade.eu",     hreflang: "en"    },
  { domain: "https://hdotrade.co.il",  hreflang: "he"    },
];

function buildHreflangAlternates(path) {
  const languages = { "x-default": `https://hdotrade.pt${path}` };
  for (const { domain, hreflang } of DOMAIN_MAP) {
    languages[hreflang] = `${domain}${path}`;
  }
  return languages;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);
  const decodedCategory = decodeURIComponent(params.category);
  const path = `/category/${params.category}`;

  const titleMap = {
    en: `${decodedCategory} Spare Parts | HDO Trade`,
    pt: `Peças ${decodedCategory} | HDO Trade`,
    fr: `Pièces ${decodedCategory} | HDO Trade`,
    es: `Repuestos ${decodedCategory} | HDO Trade`,
    de: `${decodedCategory} Ersatzteile | HDO Trade`,
    he: `חלקי חילוף ${decodedCategory} | HDO Trade`,
  };

  const descMap = {
    en: `Browse tested spare parts for ${decodedCategory}. Fast global shipping from HDO Trade.`,
    pt: `Pesquise peças testadas para ${decodedCategory}. Envio rápido mundial da HDO Trade.`,
    fr: `Parcourez les pièces testées pour ${decodedCategory}. Livraison mondiale rapide HDO Trade.`,
    es: `Explore repuestos testados para ${decodedCategory}. Envío mundial rápido de HDO Trade.`,
    de: `Geprüfte Ersatzteile für ${decodedCategory}. Schneller weltweiter Versand von HDO Trade.`,
    he: `עיינו בחלקי חילוף מבוקרים עבור ${decodedCategory}. משלוח מהיר לכל העולם מ-HDO Trade.`,
  };

  const title = titleMap[lang] || titleMap.en;
  const description = descMap[lang] || descMap.en;
  const canonical = `${domain}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "HDO Trade",
      url: canonical,
      images: [{ url: "https://hdotrade.pt/client/logo.png", width: 1200, height: 630, alt: "HDO Trade" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://hdotrade.pt/client/logo.png"],
    },
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
  };
}

export default async function page(props) {
  const params = await props.params;
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);
  const products = await getProductByCategory(category);
  const currency = await getCurrency();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  // Breadcrumb schema for rich snippets
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: domain },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${domain}/shop` },
      { "@type": "ListItem", position: 3, name: decodedCategory, item: `${domain}/category/${category}` },
    ],
  };

  // ItemList schema — helps Google understand this is a product collection page
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedCategory} Spare Parts`,
    numberOfItems: products?.length || 0,
    itemListElement: (products || []).slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${domain}/shop/${p.id || p._id}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Breadcrumb pageName={decodedCategory} />
      <div className="container grid md:grid-cols-4 grid-cols-2 gap-6 pt-4 pb-16 items-start">
        <div className="col-span-4">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product?.id}
                product={product}
                currency={currency}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
