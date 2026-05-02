import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import DirSetter from "@/components/common/DirSetter";
import { auth } from "@/auth";
import ToastProvider from "@/providers/ToastProvider";
import { cartCleanUp } from "@/database/queries";
import { CartProvider } from "@/providers/CartContext";
import { SupportStatusProvider } from "@/providers/SupportStatusProvider";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import WebVitals from "@/components/seo/WebVitals";
import { headers } from "next/headers";
import { getLanguageFromHost, getDomainFromHost } from "@/utils/seoMetadata";

// font display:swap prevents invisible text during load (Core Web Vitals)
const myFont = localFont({
  src: "./../public/fonts/lws4.woff2",
  display: "swap",
  preload: true,
});

// OG locale per language code
const OG_LOCALE_MAP = {
  en: "en_US",
  pt: "pt_PT",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  he: "he_IL",
};

// Required as a separate export in Next.js 14+
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata = {
  metadataBase: new URL("https://hdotrade.pt"),
  title: {
    default: "HDO Trade | Tested Spare Parts Worldwide",
    template: "%s | HDO Trade",
  },
  description:
    "HDO Trade offers tested, high-quality spare parts for commercial kitchen equipment. Fast global shipping. Trusted by professionals worldwide.",
  applicationName: "HDO Trade",
  keywords: [
    "spare parts", "commercial kitchen", "dishwasher parts", "mixer parts",
    "juicer parts", "food processor parts", "oven parts", "blender parts",
    "HDO Trade", "Ersatzteile Gewerbeküche", "pièces détachées cuisine",
    "repuestos cocina industrial", "peças de cozinha industrial",
    "Hobart parts", "Robot Coupe parts", "Vitamix parts",
  ],
  authors: [{ name: "HDO Trade", url: "https://hdotrade.pt" }],
  creator: "HDO Trade",
  publisher: "HDO Trade",
  category: "ecommerce",
  classification: "Commercial Kitchen Spare Parts",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/client/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/client/logo.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_PT", "de_DE", "es_ES", "fr_FR", "he_IL"],
    siteName: "HDO Trade",
    title: "HDO Trade | Tested Spare Parts Worldwide",
    description: "Tested spare parts for commercial kitchen equipment. Fast global shipping.",
    images: [{ url: "https://hdotrade.pt/client/logo.png", width: 1200, height: 630, alt: "HDO Trade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HDO Trade | Tested Spare Parts Worldwide",
    description: "Tested spare parts for commercial kitchen equipment.",
    images: ["https://hdotrade.pt/client/logo.png"],
  },
  alternates: {
    canonical: "https://hdotrade.pt",
    languages: {
      "x-default": "https://hdotrade.pt",
      "en":        "https://hdotrade.pt",
      "en-GB":     "https://hdotrade.uk",
      "en-US":     "https://hdotrade.com",
      "de":        "https://hdotrade.de",
      "pt":        "https://hdotrade.pt",
      "es":        "https://hdotrade.es",
      "fr":        "https://hdotrade.fr",
      "he":        "https://hdotrade.co.il",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

// Organization schema — full version with ImageObject logo
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hdotrade.pt/#organization",
  name: "HDO Trade",
  url: "https://hdotrade.pt",
  logo: {
    "@type": "ImageObject",
    url: "https://hdotrade.pt/client/logo.png",
    width: 200,
    height: 200,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+351935210099",
      contactType: "customer service",
      availableLanguage: ["English", "Portuguese", "German", "French", "Spanish", "Hebrew"],
      areaServed: "Worldwide",
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
};

// WebSite schema — enables Google sitelinks search box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://hdotrade.pt/#website",
  name: "HDO Trade",
  url: "https://hdotrade.pt",
  publisher: { "@id": "https://hdotrade.pt/#organization" },
  inLanguage: ["en", "pt", "de", "es", "fr", "he"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://hdotrade.pt/shop?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout(props) {
  const { children } = props;
  const session = await auth();
  await cartCleanUp();

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";
  const lang = getLanguageFromHost(host);
  const ogLocale = OG_LOCALE_MAP[lang] || "en_US";

  return (
    <html suppressHydrationWarning lang={lang} className="bg-[#ffffff]">
      <head>
        {/* Preconnect speeds up first paint by warming up Google Analytics early */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* OG locale is set dynamically per domain */}
        <meta property="og:locale" content={ogLocale} />

        {/* Apple touch icon for iOS home screen */}
        <link rel="apple-touch-icon" sizes="180x180" href="/client/logo.png" />

        <GoogleAnalytics />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <SessionProvider session={session}>
        <CartProvider>
          <body className={myFont.className} suppressHydrationWarning={true}>
            <SupportStatusProvider>
              <DirSetter />
              <ToastProvider>{children}</ToastProvider>
            </SupportStatusProvider>
            <div id="modal-root-content" />
            {/* Reports Core Web Vitals (LCP, CLS, INP) to Google Analytics */}
            <WebVitals />
          </body>
        </CartProvider>
      </SessionProvider>
    </html>
  );
}
