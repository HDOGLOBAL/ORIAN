// "use client";

// import Link from "next/link";
// import CheckoutList from "./CheckoutList";

// export default function CartedItem({ summery }) {
//   return (
//     <>
//       <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
//         order summary
//       </h4>
//       <div className="space-y-2">
//         {summery?.cartInfo.map((item, index) => (
//           <CheckoutList item={item} key={index} />
//         ))}
//       </div>

//       <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
//         <p>subtotal</p>
//         <p>${summery?.estimate}</p>
//       </div>

//       <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
//         <p>shipping</p>
//         <p>Free</p>
//       </div>

//       <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
//         <p className="font-semibold">Total</p>
//         <p>${summery?.estimate}</p>
//       </div>

//       <div className="flex items-center mb-4 mt-2">
//         <input
//           type="checkbox"
//           name="aggrement"
//           id="aggrement"
//           className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3"
//         />
//         <label
//           htmlFor="aggrement"
//           className="text-gray-600 ml-3 cursor-pointer text-sm"
//         >
//           I agree to the{" "}
//           <Link href="#" className="text-primary">
//             terms & conditions
//           </Link>
//         </label>
//       </div>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import CheckoutList from "./CheckoutList";

// ✅ Added currency prop — defaults to "pound" since site is UK-based
export default function CartedItem({ summery, currency = "pound" }) {
  // Determine currency symbol
  const symbol =
    currency === "euro" ? "€" : currency === "pound" ? "£" : "$";

  return (
    <>
      <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
        order summary
      </h4>
      <div className="space-y-2">
        {summery?.cartInfo.map((item, index) => (
          <CheckoutList item={item} key={index} currency={currency} />
        ))}
      </div>

      <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
        <p>subtotal</p>
        {/* ✅ Dynamic symbol instead of hardcoded $ */}
        <p>{symbol}{summery?.estimate}</p>
      </div>

      <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
        <p>shipping</p>
        <p>Free</p>
      </div>

      <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
        <p className="font-semibold">Total</p>
        {/* ✅ Dynamic symbol instead of hardcoded $ */}
        <p>{symbol}{summery?.estimate}</p>
      </div>

      <div className="flex items-center mb-4 mt-2">
        <input
          type="checkbox"
          name="aggrement"
          id="aggrement"
          className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3"
        />
        <label
          htmlFor="aggrement"
          className="text-gray-600 ml-3 cursor-pointer text-sm"
        >
          I agree to the{" "}
          <Link href="#" className="text-primary">
            terms & conditions
          </Link>
        </label>
      </div>
    </>
  );
}
