import CheckoutPage from "@/components/checkout/ControllCheckout";
import { getCartByTrackingId } from "@/database/queries";
import { getCurrency } from "@/utils/getCookieServer";
import { getExchangeRates, convertPrice } from "@/utils/getExchangeRates";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Checkout() {
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;

  if (!trackingId) redirect("/cart");

  const [, rates] = await Promise.all([getCurrency(), getExchangeRates()]);
  const currency = "euro"; // always show EUR at checkout

  let products = [];
  try {
    products = await getCartByTrackingId(trackingId);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    redirect("/cart");
  }

  // Subtotal in the display currency (converted live from EUR)
  const subtotal = products
    .reduce((total, p) => {
      const price = convertPrice(p.price?.eur, currency, rates);
      return total + price * (p.cartQuantity ?? p.quantity ?? 0);
    }, 0)
    .toFixed(2);

  return (
    <CheckoutPage
      products={products}
      subtotal={parseFloat(subtotal)}
      trackingId={trackingId}
      currency={currency}
      rates={rates}
    />
  );
}