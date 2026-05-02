// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import AddCard from "./AddCard";
// import { InStock } from "@/public/icons/icons";
// import placeholder from "@/public/client/banner/placeholder.png";
// import { useDomain } from "@/providers/useDomain";
// import { getUiLanguage } from "@/utils/uiLanguage";

// function formatPrice(amount, currencyCode) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: currencyCode,
//   }).format(amount);
// }

// export default function ProductCard({
//   product,
//   relatedProduct = false,
//   currency,
// }) {
//   const lang = useDomain();
//   const uiLang = getUiLanguage(lang);

//   const textMap = {
//     viewDetails: {
//       en: "View Details",
//       pt: "Ver Detalhes",
//       fr: "Voir les Détails",
//       es: "Ver Detalles",
//       he: "צפה בפרטים",
//       de: "Details anzeigen",
//     },
//   };

//   const getText = (key) => textMap[key][uiLang] || textMap[key].en;

//   const nameMap = {
//     pt: product?.namePt,
//     fr: product?.nameFr,
//     es: product?.nameEs,
//     he: product?.nameHe,
//     de: product?.nameDe,
//   };
//   const productName = nameMap[lang] || product?.name;

//   const currencyCode =
//     currency === "euro"
//       ? "EUR"
//       : currency === "pound"
//       ? (product?.price?.gbp ? "GBP" : "EUR")
//       : "USD";

//   const mainPrice =
//     currency === "euro"
//       ? product?.price?.eur
//       : currency === "pound"
//       ? product?.price?.gbp || product?.price?.eur
//       : product?.price?.usd || product?.price?.eur;

//   const discountPrice =
//     currency === "euro"
//       ? product?.discountPrice?.eur
//       : currency === "pound"
//       ? product?.discountPrice?.gbp || product?.discountPrice?.eur
//       : product?.discountPrice?.usd || product?.discountPrice?.eur;

//   const discountCurrencyCode =
//     currency === "euro"
//       ? "EUR"
//       : currency === "pound"
//       ? "GBP"
//       : "USD";

//   return (
//     <div
//       className={`bg-white p-3 rounded-[16px] border flex flex-col justify-between ${
//         !relatedProduct ? "border-red-500 h-[486px]" : "h-[450px]"
//       } relative`}
//     >
//       <Link href={`/shop/${product?.id}`} className="absolute inset-0 z-[1]" />

//       {!relatedProduct && (
//         <div className="absolute top-7 z-10 left-3 flex items-center text-green-600 font-semibold">
//           {product?.quantity > 0 && <InStock />}
//         </div>
//       )}
//       <div className="flex flex-col h-full">
//         <div className="relative w-full aspect-square overflow-hidden rounded-xl">
//           <Image
//             src={product?.image || placeholder}
//             alt={productName || "Product image"}
//             fill
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//             className="object-contain transition-transform duration-300 hover:scale-105"
//           />
//         </div>
//         <div className="flex-grow flex flex-col justify-between pt-4">
//           <p
//             className={`font-medium text-xl md:text-2xl my-2 line-clamp-2 ${
//               lang === "he" ? "text-right" : ""
//             }`}
//             dir={lang === "he" ? "rtl" : "ltr"}
//             suppressHydrationWarning
//           >
//             {productName}
//           </p>
//           <div className="flex items-center gap-2 mt-2">
//             <p className="font-bold text-lg md:text-xl" suppressHydrationWarning>
//               {formatPrice(mainPrice, currencyCode)}
//             </p>
//             {discountPrice && (
//               <p className="font-medium text-sm md:text-[14px] text-gray-500 line-through" suppressHydrationWarning>
//                 {formatPrice(discountPrice, discountCurrencyCode)}
//               </p>
//             )}
//           </div>
//           <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
//             <button className="font-bold text-sm md:text-[16px] text-red-600 border border-red-600 rounded-full py-2 md:py-3 cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white">
//               <Link href={`/shop/${product?.id}`} className="block w-full">
//                 {getText("viewDetails")}
//               </Link>
//             </button>
//             <AddCard quantities={product?.quantity} productId={product?.id} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import Link from "next/link";
import AddCard from "./AddCard";
import { InStock } from "@/public/icons/icons";
import placeholder from "@/public/client/banner/placeholder.png";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";
import { convertPrice, formatPrice } from "@/utils/getExchangeRates";

export default function ProductCard({
  product,
  relatedProduct = false,
  currency,
  rates = { usd: 1.08, gbp: 0.86 },
}) {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  const textMap = {
    viewDetails: {
      en: "View Details",
      pt: "Ver Detalhes",
      fr: "Voir les Détails",
      es: "Ver Detalles",
      he: "צפה בפרטים",
      de: "Details anzeigen",
    },
  };

  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  const nameMap = {
    pt: product?.namePt,
    fr: product?.nameFr,
    es: product?.nameEs,
    he: product?.nameHe,
    de: product?.nameDe,
  };
  const productName = nameMap[lang] || product?.name;

  // Always calculate from EUR using live rates
  const eurPrice = product?.price?.eur;
  const eurDiscount = product?.discountPrice?.eur;

  const mainPrice = convertPrice(eurPrice, currency, rates);
  const discountPrice = eurDiscount ? convertPrice(eurDiscount, currency, rates) : null;

  return (
    <div
      className={`bg-white p-3 rounded-[16px] border flex flex-col justify-between ${
        !relatedProduct ? "border-red-500 h-[486px]" : "h-[450px]"
      } relative`}
    >
      <Link href={`/shop/${product?.id}`} className="absolute inset-0 z-[1]" />

      {!relatedProduct && (
        <div className="absolute top-7 z-10 left-3 flex items-center text-green-600 font-semibold">
          {product?.quantity > 0 && <InStock />}
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl">
          <Image
            src={product?.image || placeholder}
            alt={productName || "Product image"}
            width={400}
            height={400}
            className="object-contain transition-transform duration-300 hover:scale-105 w-full h-full"
          />
        </div>
        <div className="flex-grow flex flex-col justify-between pt-4">
          <p
            className={`font-medium text-xl md:text-2xl my-2 line-clamp-2 ${
              lang === "he" ? "text-right" : ""
            }`}
            dir={lang === "he" ? "rtl" : "ltr"}
            suppressHydrationWarning
          >
            {productName}
          </p>
          <div className="flex items-center gap-2 mt-2" suppressHydrationWarning>
            <p className="font-bold text-lg md:text-xl" suppressHydrationWarning>
              {formatPrice(mainPrice, currency)}
            </p>
            {discountPrice && (
              <p className="font-medium text-sm md:text-[14px] text-gray-500 line-through" suppressHydrationWarning>
                {formatPrice(discountPrice, currency)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
            <button className="font-bold text-sm md:text-[16px] text-red-600 border border-red-600 rounded-full py-2 md:py-3 cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white">
              <Link href={`/shop/${product?.id}`} className="block w-full">
                {getText("viewDetails")}
              </Link>
            </button>
            <AddCard quantities={product?.quantity} productId={product?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}