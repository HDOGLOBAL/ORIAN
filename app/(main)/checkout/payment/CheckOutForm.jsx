

"use client";
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function PaymentForm({ totals }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    completePayment: {
      en: "Complete Payment",
      pt: "Concluir Pagamento",
      fr: "Finaliser le Paiement",
      es: "Completar Pago",
      he: "השלם תשלום",
      de: "Zahlung abschließen",
      it: "Completa Pagamento",
    },
    total: {
      en: "Total:",
      pt: "Total:",
      fr: "Total:",
      es: "Total:",
      he: "סה\"כ:",
      de: "Gesamt:",
      it: "Totale:",
    },
    payNow: {
      en: "Pay Now",
      pt: "Pagar Agora",
      fr: "Payer Maintenant",
      es: "Pagar Ahora",
      he: "שלם עכשיו",
      de: "Jetzt bezahlen",
      it: "Paga Ora",
    },
    processing: {
      en: "Processing...",
      pt: "Processando...",
      fr: "Traitement...",
      es: "Procesando...",
      he: "מעבד...",
      de: "Verarbeitung...",
      it: "Elaborazione...",
    },
    cardError: {
      en: "An error occurred with your card. Please try again.",
      pt: "Ocorreu um erro com seu cartão. Por favor, tente novamente.",
      fr: "Une erreur est survenue avec votre carte. Veuillez réessayer.",
      es: "Ocurrió un error con su tarjeta. Por favor, inténtelo de nuevo.",
      he: "אירעה שגיאה בכרטיסך. נסה שוב.",
      de: "Ein Fehler ist mit Ihrer Karte aufgetreten. Bitte versuchen Sie es erneut.",
      it: "Si è verificato un errore con la tua carta. Riprova.",
    },
    unexpectedError: {
      en: "An unexpected error occurred.",
      pt: "Ocorreu um erro inesperado.",
      fr: "Une erreur inattendue s'est produite.",
      es: "Ocurrió un error inesperado.",
      he: "אירעה שגיאה בלתי צפויה.",
      de: "Ein unerwarteter Fehler ist aufgetreten.",
      it: "Si è verificato un errore imprevisto.",
    },
  };

  // Get localized text with English fallback
  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment/success`,
      },
    });
    if (error) {
      setMessage(
        error.type === "card_error" || error.type === "validation_error"
          ? getText("cardError")
          : getText("unexpectedError")
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {getText("completePayment")}
      </h1>
      <h1 className="text-l font-bold text-gray-800 mb-6">
        {getText("total")} {`${totals.currency === "euro" ? "€" : "$"}`}
        {totals.grandTotal}
      </h1>
      {/* Payment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-lg p-4">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
        <button
          disabled={isLoading || !stripe}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isLoading || !stripe
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Spinner />
              {getText("processing")}
            </span>
          ) : (
            getText("payNow")
          )}
        </button>
        {message && (
          <div className="text-red-500 text-center py-2 px-4 rounded bg-red-50">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export default function CheckoutForm({ clientSecret, totals }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#ffffff",
              spacingUnit: "4px",
              borderRadius: "8px",
            },
          },
        }}
      >
        <PaymentForm totals={totals} />
      </Elements>
    </div>
  );
}
