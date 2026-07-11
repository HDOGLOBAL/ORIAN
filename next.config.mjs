/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Image optimization — AVIF first for best compression
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "hdotrade.com" },
      { protocol: "https", hostname: "hdotrade.pt" },
      { protocol: "https", hostname: "hdotrade.eu" },
      { protocol: "https", hostname: "hdotrade.co.uk" },
      { protocol: "https", hostname: "hdotrade.de" },
      { protocol: "https", hostname: "hdotrade.es" },
      { protocol: "https", hostname: "hdotrade.fr" },
      { protocol: "https", hostname: "hdotrade.co.il" },
      { protocol: "https", hostname: "hdotrade.au" },
    ],
  },

  // SEO & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Cache static assets for 1 year
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache local images for 30 days
        source: "/client/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },

  // Permanent redirects for common variations (consolidate link equity)
  async redirects() {
    return [
      // Force trailing-slash off (Google prefers consistent canonical)
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/store",
        destination: "/shop",
        permanent: true,
      },
    ];
  },

  // Compress responses
  compress: true,

  // Power header off (minor SEO/security improvement)
  poweredByHeader: false,

  // Strict mode for better React behavior
  reactStrictMode: true,
};

export default nextConfig;
