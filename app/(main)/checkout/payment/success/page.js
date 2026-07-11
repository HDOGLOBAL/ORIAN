import { clearGuestCart, StripeFun, markOrderAsPaid } from "@/database/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ClearCookie from "./ClearCookie";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }) {
  const params = await searchParams;
  const { session_id: sessionId, payment_intent: paymentIntentId } = params;

  if (!sessionId && !paymentIntentId) redirect("/");

  let stripe;
  try {
    stripe = await StripeFun();
  } catch {
    return <ErrorPage message="Payment service unavailable. Please contact support." />;
  }

  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;

  let status = "default";
  let displayId = "";
  let amount = 0;
  let currencyCode = "eur";

  try {
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      console.log("Session:", session);
      console.log(JSON.stringify(session));

      displayId = session.payment_intent || sessionId;
      amount = session.amount_total || 0;
      currencyCode = session.currency || "eur";

      if (
        session.status === "complete" ||
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required"
      ) {
        status = "succeeded";
        if (trackingId) {
          try { await markOrderAsPaid(trackingId, session.payment_intent); } catch { }
          try { await clearGuestCart(trackingId); } catch { }
        }
      } else if (
        session.payment_status === "unpaid" &&
        session.status !== "complete"
      ) {
        status = "requires_payment_method";
      } else {
        status = "processing";
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      status = paymentIntent.status;
      displayId = paymentIntentId;
      amount = paymentIntent.amount || 0;
      currencyCode = paymentIntent.currency || "eur";

      if (status === "succeeded" && trackingId) {
        try { await markOrderAsPaid(trackingId, paymentIntentId); } catch { }
        try { await clearGuestCart(trackingId); } catch { }
      }
    }
  } catch (err) {
    console.error("Success page error:", err);
    return <ErrorPage message="Failed to retrieve payment details. If you were charged, please contact support with your order reference." />;
  }

  const isSuccess = status === "succeeded";
  const isFailed = status === "requires_payment_method";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {isSuccess && <ClearCookie />}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`p-6 text-center ${isSuccess ? "bg-green-50" : isFailed ? "bg-red-50" : "bg-blue-50"}`}>
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: isSuccess ? "#30B130" : isFailed ? "#DF1B41" : "#6D6E78" }}
          >
            {isSuccess ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-800" : isFailed ? "text-red-800" : "text-blue-800"}`}>
            {isSuccess ? "Payment Succeeded" : isFailed ? "Payment Failed" : "Payment Processing"}
          </h2>
          <p className="text-gray-600">
            {isSuccess
              ? "Your order has been confirmed. Thank you!"
              : isFailed
                ? "Your payment was not completed. Please try again."
                : "Your payment is being processed. We'll update you shortly."}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500 w-24">Reference</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono break-all">{displayId}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Status</td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{status.replace(/_/g, " ")}</td>
                  </tr>
                  {amount > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-500">Amount</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(amount / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: currencyCode.toUpperCase(),
                        })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            {isFailed && (
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Try Again
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorPage({ message }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href="/" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Go Home
        </Link>
      </div>
    </div>
  );
}

