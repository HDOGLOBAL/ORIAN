
// "use client";

// import ReactCountryFlag from "react-country-flag";
// import { useState, useEffect, useRef } from "react";
// import Cookies from "js-cookie";

// export default function LanguageSwitcher() {
//   const [currentDomain, setCurrentDomain] = useState("");
//   const [showComCurrencyMenu, setShowComCurrencyMenu] = useState(false);
//   const [comCurrency, setComCurrency] = useState(null); // "usd" or "euro"
//   const menuRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setCurrentDomain(window.location.hostname);
//       // Restore saved COM currency preference
//       const saved = Cookies.get("comCurrency");
//       if (saved) setComCurrency(saved);
//     }

//     // Close dropdown on outside click
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowComCurrencyMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isActive = (domainFragment) => currentDomain.includes(domainFragment);

//   const languages = [
//     {
//       // UK → English + GBP (pound)
//       code: "uk",
//       countryCode: "GB",
//       language: "English (UK) — £ GBP",
//       title: "UK",
//       link: "https://hdotrade.uk/",
//       domainMatch: ".co.uk",
//     },
//     {
//       // COM → English + USD/EUR toggle
//       code: "com",
//       countryCode: "US",
//       language: "English (USA / Global)",
//       title: "COM",
//       link: "https://hdotrade.com/",
//       domainMatch: "hdotrade.com",
//       hasCurrencyToggle: true,
//     },
//     {
//       // PT → Portuguese + EUR (same as global English main)
//       code: "pt",
//       countryCode: "PT",
//       language: "Português — € EUR",
//       title: "PT",
//       link: "https://hdotrade.pt/",
//       domainMatch: ".pt",
//     },
//     {
//       // DE → German + EUR
//       code: "de",
//       countryCode: "DE",
//       language: "Deutsch — € EUR",
//       title: "DE",
//       link: "https://hdotrade.de/",
//       domainMatch: ".de",
//     },
//     {
//       // ES → Spanish + EUR
//       code: "es",
//       countryCode: "ES",
//       language: "Español — € EUR",
//       title: "ES",
//       link: "https://hdotrade.es/",
//       domainMatch: ".es",
//     },
//     {
//       // FR → French + EUR
//       code: "fr",
//       countryCode: "FR",
//       language: "Français — € EUR",
//       title: "FR",
//       link: "https://hdotrade.fr/",
//       domainMatch: ".fr",
//     },
//     {
//       // EU → English + EUR
//       code: "eu",
//       countryCode: "EU",
//       language: "EU — € EUR",
//       title: "EU",
//       link: "https://hdotrade.eu/",
//       domainMatch: ".eu",
//     },
//   ];

//   const handleComCurrencySelect = (currency) => {
//     setComCurrency(currency);
//     Cookies.set("comCurrency", currency, { expires: 30, path: "/" });

//     // Also update selectedCountry cookie so getCurrency() picks up the right value
//     if (currency === "usd") {
//       // Use a non-EU, non-UK country to get "dollar"
//       Cookies.set("selectedCountry", JSON.stringify({ name: "United States", code: "US" }), { expires: 30, path: "/" });
//     } else {
//       // Use a generic EU placeholder so getCurrency() returns "euro"
//       Cookies.set("selectedCountry", JSON.stringify({ name: "Germany", code: "DE" }), { expires: 30, path: "/" });
//     }

//     setShowComCurrencyMenu(false);
//     window.location.reload();
//   };

//   const isComDomain =
//     (currentDomain.includes("hdotrade.com") || currentDomain.includes("hdotrade.local.com")) &&
//     !currentDomain.includes("hdotrade.com.");

//   return (
//     <div className="flex items-start gap-3" dir="ltr">
//       {languages.map((langItem) => {
//         const active =
//           langItem.code === "com"
//             ? isComDomain
//             : langItem.code === "eu"
//             ? currentDomain.includes(".eu") && !currentDomain.includes(".co.uk")
//             : currentDomain.includes(langItem.domainMatch);

//         if (langItem.hasCurrencyToggle) {
//           // COM site — show flag + dropdown for USD/EUR
//           return (
//             <div key={langItem.code} className="relative" ref={menuRef}>
//               <button
//                 onClick={() => setShowComCurrencyMenu((prev) => !prev)}
//                 className={`flex w-8 shrink-0 flex-col items-center justify-start text-center leading-none group cursor-pointer transition-all ${
//                   active ? "text-blue-900 font-bold" : "text-gray-700"
//                 }`}
//                 title={langItem.language}
//               >
//                 <ReactCountryFlag
//                   countryCode={langItem.countryCode}
//                   svg
//                   style={{ width: "2em", height: "1em" }}
//                 />
//                 <span className="mt-1 text-xs leading-none">
//                   {comCurrency === "euro" ? "€" : comCurrency === "usd" ? "$" : langItem.title}
//                 </span>
//               </button>

//               {showComCurrencyMenu && (
//                 <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[130px]">
//                   <a
//                     href={langItem.link}
//                     className="block px-3 py-2 text-xs font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50"
//                     onClick={() => setShowComCurrencyMenu(false)}
//                   >
//                     🌐 {langItem.language}
//                   </a>
//                   <button
//                     onClick={() => handleComCurrencySelect("usd")}
//                     className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 ${
//                       comCurrency === "usd" ? "text-blue-700 font-semibold" : "text-gray-700"
//                     }`}
//                   >
//                     🇺🇸 USD ($)
//                   </button>
//                   <button
//                     onClick={() => handleComCurrencySelect("euro")}
//                     className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 ${
//                       comCurrency === "euro" ? "text-blue-700 font-semibold" : "text-gray-700"
//                     }`}
//                   >
//                     🇪🇺 EUR (€)
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         }

//         return (
//           <a
//             href={langItem.link}
//             key={langItem.code}
//             className={`flex w-8 shrink-0 flex-col items-center justify-start text-center leading-none group cursor-pointer transition-all ${
//               active ? "text-blue-900 font-bold" : "text-gray-700"
//             }`}
//             title={langItem.language}
//           >
//             <ReactCountryFlag
//               countryCode={langItem.countryCode}
//               svg
//               style={{ width: "2em", height: "1em" }}
//             />
//             <span className="mt-1 text-xs leading-none">{langItem.title}</span>
//           </a>
//         );
//       })}
//     </div>
//   );
// }


"use client";

import ReactCountryFlag from "react-country-flag";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

export default function LanguageSwitcher() {
const [currentDomain, setCurrentDomain] = useState("");
  const [showComCurrencyMenu, setShowComCurrencyMenu] = useState(false);
  const [comCurrency, setComCurrency] = useState(null); // "usd" or "euro"
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname);
      // Restore saved COM currency preference
      const saved = Cookies.get("comCurrency");
      if (saved) setComCurrency(saved);
    }

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowComCurrencyMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (domainFragment) => currentDomain.includes(domainFragment);

  const languages = [
    {
      // UK → English + GBP (pound)
      code: "uk",
      countryCode: "GB",
      language: "English (UK) — £ GBP",
      title: "UK",
      link: "https://hdotrade.uk/",
      domainMatch: ".uk", 
    },
    // {
    //   // AU → English + AUD
    //   code: "au",
    //   countryCode: "AU",
    //   language: "English (AU) — $ AUD",
    //   title: "AU",
    //   link: "https://hdotrade.au/",
    //   domainMatch: ".com.au", 
    // },
    {
      // COM → English + USD only
      code: "com",
      countryCode: "US",
      language: "English (USA) — $ USD",
      title: "USA",
      link: "https://hdotrade.com/",
      domainMatch: "hdotrade.com",
      hasCurrencyToggle: false,
    },
    {
      // PT → Portuguese + EUR
      code: "pt",
      countryCode: "PT",
      language: "Português — € EUR",
      title: "PT",
      link: "https://hdotrade.pt/",
      domainMatch: ".pt",
    },
    {
      // DE → German + EUR
      code: "de",
      countryCode: "DE",
      language: "Deutsch — € EUR",
      title: "DE",
      link: "https://hdotrade.de/",
      domainMatch: ".de",
    },
    {
      // ES → Spanish + EUR
      code: "es",
      countryCode: "ES",
      language: "Español — € EUR",
      title: "ES",
      link: "https://hdotrade.es/",
      domainMatch: ".es",
    },
    {
      // FR → French + EUR
      code: "fr",
      countryCode: "FR",
      language: "Français — € EUR",
      title: "FR",
      link: "https://hdotrade.fr/",
      domainMatch: ".fr",
    },
    {
      // IT → Italian + EUR
      code: "it",
      countryCode: "IT",
      language: "Italiano — € EUR",
      title: "IT",
      link: "https://hdotrade.it/",
      domainMatch: ".it",
    },
    {
      // EU → English + EUR
      code: "eu",
      countryCode: "EU",
      language: "EU — € EUR",
      title: "EU",
      link: "https://hdotrade.eu/",
      domainMatch: ".eu",
    },
  ];

  const handleComCurrencySelect = (currency) => {
    setComCurrency(currency);
    Cookies.set("comCurrency", currency, { expires: 30, path: "/" });

    // Also update selectedCountry cookie so getCurrency() picks up the right value
    if (currency === "usd") {
      Cookies.set("selectedCountry", JSON.stringify({ name: "United States", code: "US" }), { expires: 30, path: "/" });
    } else {
      Cookies.set("selectedCountry", JSON.stringify({ name: "Germany", code: "DE" }), { expires: 30, path: "/" });
    }

    setShowComCurrencyMenu(false);
    window.location.reload();
  };

  const isComDomain =
    (currentDomain.includes("hdotrade.com") || currentDomain.includes("hdotrade.local.com")) &&
    !currentDomain.includes("hdotrade.com.");

  return (
    <div className="flex items-center gap-2" dir="ltr" suppressHydrationWarning>
      {languages.map((langItem) => {
        const active =
          langItem.code === "com"
            ? isComDomain
            : langItem.code === "eu"
            ? currentDomain.includes(".eu") && !currentDomain.includes(".uk")
            : currentDomain.includes(langItem.domainMatch);

        if (langItem.hasCurrencyToggle) {
          // COM site — show flag + dropdown for USD/EUR
          return (
            <div key={langItem.code} className="relative" ref={menuRef}>
              <button
                onClick={() => setShowComCurrencyMenu((prev) => !prev)}
                className={`flex w-8 shrink-0 flex-col items-center justify-start text-center leading-none group cursor-pointer transition-all ${
                  active ? "text-blue-900 font-bold" : "text-gray-700"
                }`}
                title={langItem.language}
              >
                <ReactCountryFlag
                  countryCode={langItem.countryCode}
                  svg
                  style={{ width: "2em", height: "1em" }}
                />
                <span className="mt-1 text-xs leading-none">
                  {comCurrency === "euro" ? "€" : comCurrency === "usd" ? "$" : langItem.title}
                </span>
              </button>

              {showComCurrencyMenu && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[130px]">
                  <a
                    href={langItem.link}
                    className="block px-3 py-2 text-xs font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50"
                    onClick={() => setShowComCurrencyMenu(false)}
                  >
                    🌐 {langItem.language}
                  </a>
                  <button
                    onClick={() => handleComCurrencySelect("usd")}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 ${
                      comCurrency === "usd" ? "text-blue-700 font-semibold" : "text-gray-700"
                    }`}
                  >
                    🇺🇸 USD ($)
                  </button>
                  <button
                    onClick={() => handleComCurrencySelect("euro")}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-blue-50 ${
                      comCurrency === "euro" ? "text-blue-700 font-semibold" : "text-gray-700"
                    }`}
                  >
                    🇪🇺 EUR (€)
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <a
            href={langItem.link}
            key={langItem.code}
            className={`flex shrink-0 flex-col items-center justify-center text-center leading-none cursor-pointer transition-all ${
              active ? "opacity-100 font-bold" : "opacity-70 hover:opacity-100"
            }`}
            title={langItem.language}
          >
            <ReactCountryFlag
              countryCode={langItem.countryCode}
              svg
              style={{ width: "1.5em", height: "1em" }}
            />
            <span className="mt-0.5 text-[9px] leading-none">{langItem.title}</span>
          </a>
        );
      })}
    </div>
  );
}