import {
  checkOrderExists,
  getOrderTotalsByTrackingId,
  StripeFun,
} from "@/database/queries";
import CheckoutPage from "./CheckOutForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;

  // Redirect if no tracking ID
  if (!trackingId) {
    redirect("/shop");
  }

  // Check order existence
  const isOrderExist = await checkOrderExists(trackingId);
  if (!isOrderExist) {
    redirect("/shop");
  }

  // Get order totals
  const totals = await getOrderTotalsByTrackingId(trackingId);
  if (!totals) {
    redirect("/shop");
  }

  // Convert amount to cents (Stripe requires integer amounts)
  const calculateOrderAmount = () => {
    // Ensure grandTotal is treated as a number
    const amount =
      typeof totals.grandTotal === "string"
        ? parseFloat(totals.grandTotal)
        : totals.grandTotal;

    // Round to 2 decimal places and convert to cents
    return Math.round((amount || 0) * 100);
  };

  const currency = totals.currency === "euro" ? "eur" : "usd";

  try {
    const stripe = await StripeFun();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(), // Amount in cents
      currency: currency,
      payment_method_types: ["card"],
      metadata: {
        trackingId,
        orderTotal: totals.grandTotal.toString(),
      },
    });

    return (
      <CheckoutPage
        clientSecret={paymentIntent.client_secret}
        totals={totals}
      />
    );
  } catch (error) {
    console.error("Payment initialization error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center w-full max-w-[1280px] mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to initialize payment. Please try again later.
        </div>
      </div>
    );
  }
}
