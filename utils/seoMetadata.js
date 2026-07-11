import { headers } from "next/headers";

const DEFAULT_LANG = "en";
const LOGO = "https://www.hdotrade.pt/client/logo.png";

// All domains mapped to their language codes and base URLs
const DOMAIN_MAP = [
  { domain: "https://www.hdotrade.pt",  lang: "pt",    hreflang: "pt"    },
  { domain: "https://hdotrade.com",    lang: "en",    hreflang: "en-US" },
  { domain: "https://hdotrade.uk",     lang: "en",    hreflang: "en-GB" },
  { domain: "https://hdotrade.de",     lang: "de",    hreflang: "de"    },
  { domain: "https://hdotrade.es",     lang: "es",    hreflang: "es"    },
  { domain: "https://hdotrade.fr",     lang: "fr",    hreflang: "fr"    },
  { domain: "https://hdotrade.eu",     lang: "en",    hreflang: "en"    },
  { domain: "https://hdotrade.co.il",  lang: "he",    hreflang: "he"    },
  { domain: "https://hdotrade.au", lang: "en",    hreflang: "en-AU" },
];

// Build full hreflang alternates for any page path
function buildHreflangAlternates(path = "") {
  const languages = { "x-default": `https://www.hdotrade.pt${path}` };
  for (const { domain, hreflang } of DOMAIN_MAP) {
    languages[hreflang] = `${domain}${path}`;
  }
  return languages;
}

// Get the base domain URL from hostname (for canonical)
export function getDomainFromHost(hostname = "") {
  const host = hostname.toLowerCase();
  if (host.includes(".uk"))  return "https://hdotrade.uk";
  if (host.includes(".co.il") || host.includes(".il")) return "https://hdotrade.co.il";
  if (host.includes(".de"))     return "https://hdotrade.de";
  if (host.includes(".fr"))     return "https://hdotrade.fr";
  if (host.includes(".es"))     return "https://hdotrade.es";
  if (host.includes(".pt"))     return "https://www.hdotrade.pt";
  if (host.includes(".eu"))     return "https://hdotrade.eu";
  // if (host.includes(".com.au")) return "https://hdotrade.au";
  if (host.includes(".com"))    return "https://hdotrade.com";
  return "https://hdotrade.pt";
}

const seoMetadata = {
  home: {
    title: {
      en: "Industrial Kitchen Equipment & Spare Parts | HDO Trade",
      pt: "Equipamentos e Peças de Cozinha Industrial | HDO Trade",
      fr: "Équipements & Pièces de Cuisine Industrielle | HDO Trade",
      es: "Equipos y Repuestos de Cocina Industrial | HDO Trade",
      he: "ציוד ואביזרי מטבח תעשייתי | HDO Trade",
      de: "Gewerbeküchen Ersatzteile & Ausrüstung | HDO Trade",
    },
    description: {
      en: "Shop tested spare parts for commercial kitchen equipment — dishwashers, mixers, juicers & more. Santos, Electrolux, Sirman, Dynamic and 50+ brands. Fast worldwide shipping.",
      pt: "Peças sobresselentes testadas para equipamento de cozinha industrial — lava-louças, batedeiras, espremedores e mais. Santos, Electrolux, Sirman, Dynamic e +50 marcas. Envio rápido mundial.",
      fr: "Pièces détachées testées pour équipements de cuisine professionnelle — lave-vaisselle, mixeurs, presse-agrumes et plus. Santos, Electrolux, Sirman, Dynamic et +50 marques. Livraison mondiale rapide.",
      es: "Repuestos testados para equipos de cocina comercial — lavavajillas, batidoras, exprimidores y más. Santos, Electrolux, Sirman, Dynamic y +50 marcas. Envío mundial rápido.",
      he: "חלקי חילוף מבוקרים לציוד מטבח מסחרי — מדיח כלים, מיקסר, מסחטה ועוד. Santos, Electrolux, Sirman, Dynamic ו-50+ מותגים. משלוח מהיר לכל העולם.",
      de: "Geprüfte Ersatzteile für Gewerbeküchen — Spülmaschinen, Mixer, Entsafter und mehr. Santos, Electrolux, Sirman, Dynamic und 50+ Marken. Schneller weltweiter Versand.",
    },
    path: "",
  },
  store: {
    title: {
      en: "Shop Spare Parts | HDO Trade",
      pt: "Loja de Peças | HDO Trade",
      fr: "Boutique Pièces | HDO Trade",
      es: "Tienda Repuestos | HDO Trade",
      he: "חנות חלקי חילוף | HDO Trade",
      de: "Ersatzteile Shop | HDO Trade",
    },
    description: {
      en: "Browse thousands of tested spare parts by manufacturer, category or search. Dishwasher, mixer, juicer, food processor parts and more.",
      pt: "Pesquise milhares de peças testadas por fabricante, categoria ou busca. Peças para lava-louças, batedeira, espremedor e mais.",
      fr: "Parcourez des milliers de pièces testées par fabricant, catégorie ou recherche. Lave-vaisselle, mixeur, presse-agrumes et plus.",
      es: "Busque miles de repuestos testados por fabricante, categoría o búsqueda. Lavavajillas, batidora, exprimidor y más.",
      he: "עיינו באלפי חלקי חילוף מבוקרים לפי יצרן, קטגוריה או חיפוש. מדיח כלים, מיקסר, מסחטה ועוד.",
      de: "Tausende geprüfte Ersatzteile nach Hersteller, Kategorie oder Suche. Spülmaschine, Mixer, Entsafter, Küchenmaschine und mehr.",
    },
    path: "/shop",
  },
  about: {
    title: {
      en: "About Us | HDO Trade",
      pt: "Sobre Nós | HDO Trade",
      fr: "À Propos | HDO Trade",
      es: "Sobre Nosotros | HDO Trade",
      he: "אודותינו | HDO Trade",
      de: "Über uns | HDO Trade",
    },
    description: {
      en: "Learn about HDO Trade — our mission, expertise in spare parts, quality standards, and worldwide customer support since day one.",
      pt: "Conheça a HDO Trade — nossa missão, experiência em peças sobresselentes, padrões de qualidade e suporte global.",
      fr: "Découvrez HDO Trade — notre mission, expertise en pièces détachées, standards de qualité et support client mondial.",
      es: "Conozca HDO Trade — nuestra misión, experiencia en repuestos, estándares de calidad y soporte global.",
      he: "גלו על HDO Trade — המשימה שלנו, המומחיות בחלקי חילוף, תקני האיכות ותמיכת לקוחות עולמית.",
      de: "Erfahren Sie mehr über HDO Trade — unsere Mission, Ersatzteil-Expertise, Qualitätsstandards und weltweiten Kundensupport.",
    },
    path: "/about",
  },
  contact: {
    title: {
      en: "Contact Us | HDO Trade",
      pt: "Contacte-nos | HDO Trade",
      fr: "Contactez-Nous | HDO Trade",
      es: "Contáctenos | HDO Trade",
      he: "צרו קשר | HDO Trade",
      de: "Kontakt | HDO Trade",
    },
    description: {
      en: "Contact HDO Trade for spare parts enquiries, orders, and support. Phone, email, WhatsApp — we respond fast.",
      pt: "Contacte a HDO Trade para consultas de peças, encomendas e suporte. Telefone, email, WhatsApp — respondemos rápido.",
      fr: "Contactez HDO Trade pour des demandes de pièces, commandes et support. Téléphone, email, WhatsApp — réponse rapide.",
      es: "Contacte HDO Trade para consultas de repuestos, pedidos y soporte. Teléfono, email, WhatsApp — respuesta rápida.",
      he: "צרו קשר עם HDO Trade לשאלות על חלקי חילוף, הזמנות ותמיכה. טלפון, אימייל, וואטסאפ — אנחנו מגיבים מהר.",
      de: "Kontaktieren Sie HDO Trade für Ersatzteil-Anfragen, Bestellungen und Support. Telefon, E-Mail, WhatsApp — schnelle Antwort.",
    },
    path: "/contact",
  },
  terms: {
    title: {
      en: "Terms & Conditions | HDO Trade",
      pt: "Termos e Condições | HDO Trade",
      fr: "Termes et Conditions | HDO Trade",
      es: "Términos y Condiciones | HDO Trade",
      he: "תנאים והגבלות | HDO Trade",
      de: "AGB | HDO Trade",
    },
    description: {
      en: "Read the HDO Trade terms and conditions covering purchases, payments, returns, liability and dispute resolution.",
      pt: "Leia os termos e condições da HDO Trade sobre compras, pagamentos, devoluções e resolução de disputas.",
      fr: "Consultez les termes et conditions HDO Trade sur les achats, paiements, retours et résolution de litiges.",
      es: "Lea los términos y condiciones de HDO Trade sobre compras, pagos, devoluciones y resolución de disputas.",
      he: "קראו את התנאים וההגבלות של HDO Trade בנושאי רכישות, תשלומים, החזרות ויישוב סכסוכים.",
      de: "Lesen Sie die AGB von HDO Trade zu Käufen, Zahlungen, Rücksendungen und Streitbeilegung.",
    },
    path: "/terms-conditions",
  },
};

// Domain → language map (fixed .co.uk detection bug)
export function getLanguageFromHost(hostname = "") {
  const host = hostname.toLowerCase();
  if (host.includes(".uk") || host.includes(".com.au")) return "en";
  if (host.includes(".co.il") || host.includes(".il")) return "he";
  if (host.includes(".de"))     return "de";
  if (host.includes(".fr"))     return "fr";
  if (host.includes(".es"))     return "es";
  if (host.includes(".pt"))     return "pt";
  if (host.includes(".eu"))     return "en";
  return DEFAULT_LANG;
}

export async function getRequestLanguage() {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";
  return getLanguageFromHost(host);
}

export async function getRequestHost() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "hdotrade.pt"
  );
}

// Fixed: canonical now points to the real page URL on the current domain,
// and includes full hreflang alternates for all domains
export function getSeoMetadata(pageKey, lang = DEFAULT_LANG, currentDomain = "https://www.hdotrade.pt") {
  const pageMetadata = seoMetadata[pageKey];
  if (!pageMetadata) return null;

  const title = pageMetadata.title[lang] || pageMetadata.title[DEFAULT_LANG];
  const description = pageMetadata.description[lang] || pageMetadata.description[DEFAULT_LANG];
  const path = pageMetadata.path || "";
  const canonical = `${currentDomain}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "HDO Trade",
      images: [{ url: LOGO, alt: "HDO Trade" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [LOGO],
    },
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
  };
}

export function getLocalizedProductSeo(product, lang = DEFAULT_LANG, currentDomain = "https://hdotrade.pt") {
  const titleMap = {
    en: product?.name,
    pt: product?.namePt,
    fr: product?.nameFr,
    es: product?.nameEs,
    he: product?.nameHe,
    de: product?.nameDe,
  };

  const descriptionMap = {
    en: product?.description,
    pt: product?.descriptionPt,
    fr: product?.descriptionFr,
    es: product?.descriptionEs,
    he: product?.descriptionHe,
    de: product?.descriptionDe,
  };

  const title = titleMap[lang] || titleMap.en || "HDO Trade";
  const rawDesc = descriptionMap[lang] || descriptionMap.en || "";
  const description = stripHtml(rawDesc) || `${title} - HDO Trade spare part`;
  const image = product?.image;
  const productId = product?.id || product?._id?.toString();
  const path = `/shop/${productId}`;
  const canonical = `${currentDomain}${path}`;

  return {
    title: `${title} | HDO Trade`,
    description,
    openGraph: {
      title: `${title} | HDO Trade`,
      description,
      type: "article",
      siteName: "HDO Trade",
      images: image
        ? [{ url: image, width: 800, height: 800, alt: title }]
        : [{ url: LOGO, alt: "HDO Trade" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HDO Trade`,
      description,
      images: image ? [image] : [LOGO],
    },
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
  };
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
