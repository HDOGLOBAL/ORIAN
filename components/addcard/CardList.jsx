"use client";
import { convertPrice, formatPrice } from "@/utils/getExchangeRates";
import Link from "next/link";
import List from "./List";
import NoCard from "./NoCard";
import useCurrency from "@/providers/useCurrency";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const CardList = ({ products, trackingId, currency: currencyProp, rates = { usd: 1.08, gbp: 0.86 } }) => {
  const currencyFromHook = useCurrency() ?? "euro";
  const currency = currencyProp || currencyFromHook;
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    shoppingCart: {
      en: "Shopping Cart",
      pt: "Carrinho de Compras",
      fr: "Panier",
      es: "Carrito de Compras",
      he: "עגלת קניות",
      de: "Warenkorb",
      it: "Carrello",
    },
    subTotal: {
      en: "Sub-Total",
      pt: "Subtotal",
      fr: "Sous-total",
      es: "Subtotal",
      he: "סכום ביניים",
      de: "Zwischensumme",
      it: "Subtotale",
    },
    items: {
      en: "items",
      pt: "itens",
      fr: "articles",
      es: "artículos",
      he: "פריטים",
      de: "Artikel",
      it: "articoli",
    },
    checkout: {
      en: "Checkout",
      pt: "Finalizar Compra",
      fr: "Paiement",
      es: "Proceder al Pago",
      he: "לתשלום",
      de: "Zur Kasse",
      it: "Cassa",
    },
  };

  // Get localized text with English fallback
  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  const subtotal = products
    .reduce((total, p) => {
      const price = convertPrice(p.price?.eur, currency, rates);
      return total + price * p.cartQuantity;
    }, 0)
    .toFixed(2);

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md max-w-[1000px] w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{getText("shoppingCart")}</h2>
        </div>
        {/* Product list */}
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <List product={product} key={index} trackingId={trackingId} currency={currency} rates={rates} />
            ))
          ) : (
            <div className="flex justify-center">
              <div className="grid md:grid-cols-1 grid-cols-2 gap-6">
                <NoCard />
              </div>
            </div>
          )}
        </div>
        {/* Divider */}
        <hr className="my-4" />
        {/* Subtotal */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500">{getText("subTotal")}</p>
            <p className="text-xs text-gray-500">
              {products.length} {getText("items")}
            </p>
          </div>
          <p className="text-xl font-semibold" suppressHydrationWarning>
            {formatPrice(parseFloat(subtotal), currency)}
          </p>
        </div>
        {/* Checkout button */}
        <div className="flex justify-center mt-2">
          {products.length > 0 ? (
            <Link
              href={`/checkout`}
              className="w-full py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm text-center hover:from-blue-500 hover:to-blue-700 transition duration-300"
            >
              {getText("checkout")}
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-2 rounded-full bg-gray-400 text-white font-semibold text-sm cursor-not-allowed"
            >
              {getText("checkout")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardList;