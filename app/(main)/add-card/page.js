import { cookies } from "next/headers";
import CardList from "@/components/addcard/CardList";
import { getCartWithProducts } from "@/database/queries";
import { getCurrency } from "@/utils/getCookieServer";
import { getExchangeRates } from "@/utils/getExchangeRates";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;
  const [currency, rates] = await Promise.all([getCurrency(), getExchangeRates()]);

  let products = [];

  if (trackingId) {
    try {
      products = await getCartWithProducts(trackingId);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }

  return (
    <div>
      <CardList products={products} trackingId={trackingId} currency={currency} rates={rates} />
    </div>
  );
}