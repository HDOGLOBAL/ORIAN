export async function getExchangeRates() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP", {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    const data = await res.json();
    return { usd: data.rates.USD, gbp: data.rates.GBP };
  } catch {
    return { usd: 1.08, gbp: 0.86 }; // fallback
  }
}
 
// Convert EUR price to target currency
export function convertPrice(eurAmount, currency, rates) {
  if (!eurAmount) return 0;
  const amount = parseFloat(eurAmount);
  if (currency === "euro") return amount;
  if (currency === "pound") return parseFloat((amount * rates.gbp).toFixed(2));
  return parseFloat((amount * rates.usd).toFixed(2)); // dollar
}
 
export function getCurrencyCode(currency) {
  if (currency === "euro") return "EUR";
  if (currency === "pound") return "GBP";
  return "USD";
}
 
export function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: getCurrencyCode(currency),
  }).format(amount);
}
 