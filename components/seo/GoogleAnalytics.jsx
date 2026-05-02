// Add your Google Analytics 4 Measurement ID and GTM ID


const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // e.g. G-XXXXXXXXXX
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // e.g. GTM-XXXXXXX

export default function GoogleAnalytics() {
  if (!GA_ID && !GTM_ID) return null;
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { page_path: window.location.pathname });`,
            }}
          />
        </>
      )}
    </>
  );
}
