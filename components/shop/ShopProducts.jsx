// import NoProduct from "./filter/NoProduct";
// import ClientPaginatedProducts from "../clients/Paginate";

// export default function ShopProducts({ products, currency, paginationData }) {
//   return (
//     <>
//       {products.length > 0 ? (
//         <ClientPaginatedProducts
//           products={products}
//           currency={currency}
//           paginationData={paginationData}
//         />
//       ) : (
//         <div className="col-span-3">
//           <div className="grid md:grid-cols-1 grid-cols-2 gap-6">
//             <NoProduct />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import NoProduct from "./filter/NoProduct";
import ClientPaginatedProducts from "../clients/Paginate";

export default function ShopProducts({ products, currency, rates, paginationData }) {
  return (
    <>
      {products.length > 0 ? (
        <ClientPaginatedProducts
          products={products}
          currency={currency}
          rates={rates}
          paginationData={paginationData}
        />
      ) : (
        <div className="col-span-3">
          <div className="grid md:grid-cols-1 grid-cols-2 gap-6">
            <NoProduct />
          </div>
        </div>
      )}
    </>
  );
}