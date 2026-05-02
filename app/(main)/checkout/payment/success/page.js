import { clearGuestCart, StripeFun } from "@/database/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { markOrderAsPaid } from "@/database/queries";
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import { cookies } from "next/headers";

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Payment Succeeded",
    icon: <FaCheck className="text-white" size={16} />,
    iconColor: "#30B130",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
  },
  processing: {
    text: "Payment Processing",
    icon: <FaInfoCircle className="text-white" size={16} />,
    iconColor: "#6D6E78",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
  },
  requires_payment_method: {
    text: "Payment Failed",
    icon: <FaTimes className="text-white" size={16} />,
    iconColor: "#DF1B41",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
  },
  default: {
    text: "Payment Error",
    icon: <FaTimes className="text-white" size={16} />,
    iconColor: "#DF1B41",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
  },
};

export default async function SuccessPage({ searchParams  }) {

    const params = await searchParams;
     const { payment_intent: paymentIntentId } = params;
  // const { payment_intent: paymentIntentId } = searchParams;
  const stripe = await StripeFun();
  const cookieStore = await cookies();
  const trackingId = cookieStore.get("trackingId")?.value;
  if (!paymentIntentId) redirect("/");
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent) redirect("/");

  const { status } = paymentIntent;

  if (status === "succeeded") {
    await markOrderAsPaid(trackingId, paymentIntentId);
    await clearGuestCart(trackingId);
  }

  const statusContent =
    STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP.default;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`p-6 ${statusContent.bgColor} text-center`}>
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: statusContent.iconColor }}
          >
            <div className=" text-white">{statusContent.icon}</div>
          </div>
          <h2 className={`text-2xl font-bold ${statusContent.textColor} mb-2`}>
            {statusContent.text}
          </h2>
          <p className="text-gray-600">
            {status === "succeeded"
              ? "Your payment was successfully processed."
              : status === "processing"
              ? "This may take a few moments to complete."
              : "Please try again or contact support."}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Payment Details
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                      ID
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {paymentIntentId}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                      Status
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {status.replace(/_/g, " ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                      Amount
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {(paymentIntent.amount / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: paymentIntent.currency,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <a
              href={`https://dashboard.stripe.com/payments/${paymentIntentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              View in Stripe Dashboard
              <svg
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

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
