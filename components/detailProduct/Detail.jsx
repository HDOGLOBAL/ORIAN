// import React from "react";
// import DetailGallery from "./DetailGallery";
// import SocailShare from "./SocailShare";
// import QuantityAdjuster from "./QuantityAdjuster";
// import Addwish from "../shop/Addwish";
// import Rating from "../shop/Rating";
// import AddCard from "../shop/AddCard";

// export default function Detail({ product, userId, lan, currency }) {
//   return (
//     <>
//       <div className="container grid grid-cols-2 gap-6">
//         <DetailGallery images={product?.image} />
//         <div>
//           <h2 className="text-3xl font-medium uppercase mb-2">
//             {product?.name}
//           </h2>
//           <div className="flex items-center mb-4">
//             <div className="flex gap-1 text-sm text-yellow-400">
//               <Rating rating={product?.ratings} />
//             </div>
//             <div className="text-xs text-gray-500 ml-3">
//               ({product?.reviewsNumber} Reviews)
//             </div>
//           </div>
//           <div className="space-y-2">
//             <p className="text-gray-800 font-semibold space-x-2">
//               <span>{lan?.availabile}: </span>

//               <span
//                 className={
//                   product?.quantity > 0 ? "text-green-600" : "text-red-600"
//                 }
//               >
//                 {product?.quantity > 0
//                   ? `In Stock (${product?.quantity})`
//                   : "Out Of Stock"}
//               </span>
//             </p>
//             <p className="space-x-2">
//               <span className="text-gray-800 font-semibold">
//                 {lan?.brand}:{" "}
//               </span>
//               <span className="text-gray-600">{product?.brand}</span>
//             </p>
//             <p className="space-x-2">
//               <span className="text-gray-800 font-semibold">
//                 {lan?.category}:{" "}
//               </span>
//               <span className="text-gray-600">{product?.category}</span>
//             </p>
//             <p className="space-x-2">
//               <span className="text-gray-800 font-semibold">{lan?.SKU}: </span>
//               <span className="text-gray-600">{product?.sku}</span>
//             </p>
//             <p className="space-x-2">
//               <span className="text-gray-800 font-semibold">{lan?.size}: </span>
//               {product?.sizes.map((size, index) => (
//                 <span key={index} className="text-primary font-bold">
//                   {size},
//                 </span>
//               ))}
//             </p>
//           </div>
//           <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
//             <p className="text-xl text-primary font-semibold">
//               {new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency:
//                   currency === "euro"
//                     ? "EUR"
//                     : currency === "pound"
//                     ? "GBP"
//                     : "USD",
//               }).format(
//                 currency === "euro"
//                   ? product?.price?.eur || 0
//                   : currency === "pound"
//                   ? product?.price?.gbp || product?.price?.eur || 0
//                   : product?.price?.usd || product?.price?.eur || 0
//               )}
//             </p>
//             {(currency === "euro"
//               ? product?.discountPrice?.eur
//               : currency === "pound"
//               ? product?.discountPrice?.gbp || product?.discountPrice?.eur
//               : product?.discountPrice?.usd || product?.discountPrice?.eur) && (
//               <p className="text-base text-gray-400 line-through">
//                 {new Intl.NumberFormat("en-US", {
//                   style: "currency",
//                   currency:
//                     currency === "euro"
//                       ? "EUR"
//                       : currency === "pound"
//                       ? "GBP"
//                       : "USD",
//                 }).format(
//                   currency === "euro"
//                     ? product?.discountPrice?.eur
//                     : currency === "pound"
//                     ? product?.discountPrice?.gbp || product?.discountPrice?.eur
//                     : product?.discountPrice?.usd || product?.discountPrice?.eur
//                 )}
//               </p>
//             )}
//           </div>

//           <p className="mt-4 text-gray-600">{product?.description}</p>

//           <div className="mt-4">
//             <h3 className="text-sm text-gray-800 uppercase mb-1">
//               {lan?.quantity}
//             </h3>
//             <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
//               <QuantityAdjuster />
//             </div>
//           </div>

//           <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
//             <AddCard
//               lan={lan?.addcart}
//               userId={userId}
//               quantity={product?.quantity}
//               productId={product?.id}
//               detail={true}
//             />
//             <Addwish
//               lan={lan?.wish}
//               userId={userId}
//               productId={product?.id}
//               fromDetail={true}
//             />
//           </div>

//           <SocailShare />
//         </div>
//       </div>
//     </>
//   );
// }


import React from "react";
import { convertPrice, formatPrice } from "@/utils/getExchangeRates";
import DetailGallery from "./DetailGallery";
import SocailShare from "./SocailShare";
import QuantityAdjuster from "./QuantityAdjuster";
import Addwish from "../shop/Addwish";
import Rating from "../shop/Rating";
import AddCard from "../shop/AddCard";

export default function Detail({ product, userId, lan, currency, rates = { usd: 1.08, gbp: 0.86 } }) {
  return (
    <>
      <div className="container grid grid-cols-2 gap-6">
        <DetailGallery images={product?.images?.length > 0 ? product.images : (product?.image ? [product.image] : [])} />
        <div>
          <h2 className="text-3xl font-medium uppercase mb-2">
            {product?.name}
          </h2>
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              <Rating rating={product?.ratings} />
            </div>
            <div className="text-xs text-gray-500 ml-3">
              ({product?.reviewsNumber} Reviews)
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>{lan?.availabile}: </span>

              <span
                className={
                  product?.quantity > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product?.quantity > 0
                  ? `In Stock (${product?.quantity})`
                  : "Out Of Stock"}
              </span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">
                {lan?.brand}:{" "}
              </span>
              <span className="text-gray-600">{product?.brand}</span>
            </p>
            {(product?.manufacturerIds?.length > 0 || product?.manufacturerId) && (
              <p className="space-x-2">
                <span className="text-gray-800 font-semibold">Manufacturer: </span>
                <span className="text-gray-600">
                  {product?.manufacturerIds?.length > 0
                    ? product.manufacturerIds.map((m) => (typeof m === "object" ? m.name : null)).filter(Boolean).join(", ")
                    : (typeof product?.manufacturerId === "object" ? product.manufacturerId?.name : null)}
                </span>
              </p>
            )}
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">
                {lan?.category}:{" "}
              </span>
              <span className="text-gray-600">{product?.category}</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">{lan?.size}: </span>
              {product?.sizes.map((size, index) => (
                <span key={index} className="text-primary font-bold">
                  {size},
                </span>
              ))}
            </p>
          </div>
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            <p className="text-xl text-primary font-semibold" suppressHydrationWarning>
              {formatPrice(convertPrice(product?.price?.eur, currency, rates), currency)}
            </p>
            {product?.discountPrice?.eur && (
              <p className="text-base text-gray-400 line-through" suppressHydrationWarning>
                {formatPrice(convertPrice(product?.discountPrice?.eur, currency, rates), currency)}
              </p>
            )}
          </div>

          <p className="mt-4 text-gray-600">{product?.description}</p>

          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">
              {lan?.quantity}
            </h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <QuantityAdjuster />
            </div>
          </div>

          <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
            <AddCard
              lan={lan?.addcart}
              userId={userId}
              quantity={product?.quantity}
              productId={product?.id}
              detail={true}
            />
            <Addwish
              lan={lan?.wish}
              userId={userId}
              productId={product?.id}
              fromDetail={true}
            />
          </div>

          <SocailShare />
        </div>
      </div>
    </>
  );
}