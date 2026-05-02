"use client";
import { euCountry } from "@/database/eucountry";
import Cookies from "js-cookie";

const ukCountry = ["United Kingdom"];

// Determine currency purely from domain — no cookie needed for non-.com domains
function getCurrencyFromDomain() {
  if (typeof window === "undefined") return null;
  const h = window.location.hostname.toLowerCase();

  // UK domain → always GBP
  if (h.includes(".co.uk") || (h.includes(".uk") && !h.includes(".co.uk"))) return "pound";

  // All EU country domains → always EUR
  if (h.includes(".de") || h.includes(".fr") || h.includes(".es") || h.includes(".pt") || h.includes(".eu")) return "euro";

  // .com → let cookie decide (USD or EUR toggle)
  return null;
}

export default function useCurrency() {
  const domainCurrency = getCurrencyFromDomain();
  if (domainCurrency) return domainCurrency;

  // .com site — check cookie
  const stored = Cookies.get("selectedCountry");
  const comCurrency = Cookies.get("comCurrency"); // "usd" | "euro"

  let countryName = null;
  try {
    if (stored) {
      const parsed = JSON.parse(stored);
      countryName = parsed?.name;
    }
  } catch (err) {
    console.error("Failed to parse selectedCountry cookie:", err);
  }

  if (ukCountry.includes(countryName)) return "pound";
  if (euCountry.includes(countryName)) return "euro";

  if (comCurrency === "euro") return "euro";
  if (comCurrency === "usd") return "dollar";

  return "euro"; // .com default: EUR (same price as USD in DB)
}
