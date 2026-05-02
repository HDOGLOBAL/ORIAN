// import { cookies, headers } from "next/headers";
// import { euCountry } from "@/database/eucountry";

// const ukCountry = ["United Kingdom"];

// // Determine currency from domain — overrides cookie for non-.com domains
// function getCurrencyFromHost(host) {
//   if (!host) return null;
//   const h = host.toLowerCase();

//   // UK → always GBP
//   if (h.includes(".co.uk") || (h.includes(".uk") && !h.includes(".co.uk"))) return "pound";

//   // All EU-language domains → always EUR
//   if (h.includes(".de") || h.includes(".fr") || h.includes(".es") || h.includes(".pt") || h.includes(".eu")) return "euro";

//   // .com → let cookie decide
//   return null;
// }

// export async function getCurrency() {
//   const cookieStore = await cookies();
//   const headerStore = await headers();

//   const host =
//     headerStore.get("x-forwarded-host") ||
//     headerStore.get("host") ||
//     "";

//   // Domain-level override (most reliable — no cookie needed)
//   const domainCurrency = getCurrencyFromHost(host);
//   if (domainCurrency) return domainCurrency;

//   // .com site — check cookies
//   const stored = cookieStore.get("selectedCountry")?.value;
//   const comCurrency = cookieStore.get("comCurrency")?.value;

//   if (stored) {
//     try {
//       const parsed = JSON.parse(stored);
//       const name = parsed?.name;

//       if (ukCountry.includes(name)) return "pound";
//       if (euCountry.includes(name)) return "euro";

//       // Non-EU, non-UK country on .com
//       if (comCurrency === "euro") return "euro";
//       return "dollar";
//     } catch (e) {
//       console.error("Invalid selectedCountry cookie:", e);
//     }
//   }

//   // .com with no country selected — check explicit toggle
//   if (comCurrency === "euro") return "euro";
//   if (comCurrency === "usd") return "dollar";

//   return "euro"; // .com default: EUR (same as USD in DB)
// }

import { cookies, headers } from "next/headers";
import { euCountry } from "@/database/eucountry";

const ukCountry = ["United Kingdom"];

// Determine currency from domain — overrides cookie for non-.com domains
function getCurrencyFromHost(host) {
  if (!host) return null;
  const h = host.toLowerCase().split(':')[0]; // strip port

  // UK → always GBP
  if (h.includes(".co.uk") || (h.includes(".uk") && !h.includes(".co.uk"))) return "pound";

  // All EU-language domains → always EUR
  if (h.includes(".de") || h.includes(".fr") || h.includes(".es") || h.includes(".pt") || h.includes(".eu")) return "euro";

  // .com → let cookie decide
  return null;
}

export async function getCurrency() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    "";

  // Domain-level override (most reliable — no cookie needed)
  const domainCurrency = getCurrencyFromHost(host);
  if (domainCurrency) return domainCurrency;

  // .com site — check cookies
  const stored = cookieStore.get("selectedCountry")?.value;
  const comCurrency = cookieStore.get("comCurrency")?.value;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const name = parsed?.name;

      if (ukCountry.includes(name)) return "pound";
      if (euCountry.includes(name)) return "euro";

      // Non-EU, non-UK country on .com
      if (comCurrency === "euro") return "euro";
      return "dollar";
    } catch (e) {
      console.error("Invalid selectedCountry cookie:", e);
    }
  }

  // .com with no country selected — check explicit toggle
  if (comCurrency === "euro") return "euro";
  if (comCurrency === "usd") return "dollar";

  return "euro"; // .com default: EUR (same as USD in DB)
}