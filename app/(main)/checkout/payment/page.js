import {
  checkOrderExists,
  getOrderByTrackingId,
  StripeFun,
} from "@/database/queries";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;

  if (!trackingId) redirect("/shop");

  const isOrderExist = await checkOrderExists(trackingId);
  if (!isOrderExist) redirect("/shop");

  const order = await getOrderByTrackingId(trackingId);
  if (!order) redirect("/shop");

  const { totals, email, firstName, lastName, vatValid, vatNumber } = order;
  const currency = totals.currency === "euro" ? "eur" : "usd";
  const siteUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hdotrade.eu";

  const toAmount = (val) => Math.round((parseFloat(val) || 0) * 100);

  // Build line items with proper VAT breakdown
  const lineItems = [];

  // Net products (subtotal minus any discount)
  const netProducts =
    toAmount(totals.subtotal) - toAmount(totals.discount || 0);
  lineItems.push({
    price_data: {
      currency,
      product_data: { name: "Products" },
      unit_amount: netProducts > 0 ? netProducts : toAmount(totals.subtotal),
    },
    quantity: 1,
  });

  // Shipping
  if (parseFloat(totals.shipping || 0) > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: { name: "Shipping" },
        unit_amount: toAmount(totals.shipping),
      },
      quantity: 1,
    });
  }

  // VAT (only shown if tax > 0; if vatValid B2B sale, tax is already 0)
  if (parseFloat(totals.tax || 0) > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: `VAT${vatValid ? " (B2B - Reverse Charge)" : ""}`,
        },
        unit_amount: toAmount(totals.tax),
      },
      quantity: 1,
    });
  }

  let sessionUrl = null;
  let initError = null;

  try {
    const stripe = await StripeFun();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${siteUrl}/checkout/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        trackingId,
        vatValid: vatValid ? "true" : "false",
        vatNumber: vatNumber?.toString() || "",
        customerName: `${firstName || ""} ${lastName || ""}`.trim(),
      },
      tax_id_collection: { enabled: true },
      billing_address_collection: "auto",
    });
    sessionUrl = session.url;
  } catch (error) {
    console.error("Stripe Checkout Session error:", error);
    initError = error.message;
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full max-w-[1280px] mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to initialize payment. Please try again later.
        </div>
      </div>
    );
  }

  redirect(sessionUrl);
}

