// "use client";

// import ReactPaginate from "react-paginate";
// import ProductCard from "../shop/ProductCard";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ClientPaginatedProducts({
//   products,
//   currency,
//   paginationData,
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   if (!paginationData) {
//     return (
//       <div className="col-span-3 max-w-[1280px] w-full mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
//           {products.map((product) => (
//             <ProductCard
//               key={product?.id}
//               product={product}
//               currency={currency}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const { totalCount, totalPages, currentPage } = paginationData;

//   const handlePageChange = ({ selected }) => {
//     const newPage = selected + 1; // ReactPaginate is 0-indexed, our API is 1-indexed

//     // Update URL with new page parameter
//     const params = new URLSearchParams(searchParams);
//     params.set("page", newPage.toString());

//     // Scroll to top for better UX
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     // Navigate to new page
//     router.push(`?${params.toString()}`);
//   };

//   // Filter only active products
//   const activeProducts = products.filter((item) => item.isActive === true);


//   return (
//     <div className="col-span-3 max-w-[1280px] w-full mx-auto">
//       {/* Results count */}
//       <div className="text-sm text-gray-600 mb-4">
//         Showing {activeProducts.length} of {totalCount} products
//       </div>
//       {/* Products Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
//         {activeProducts.map((product) => (
//           <ProductCard
//             key={product?.id}
//             product={product}
//             currency={currency}
//           />
//         ))}
//       </div>
//       {/* No products message */}
//       {activeProducts.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No active products found</p>
//         </div>
//       )}
 
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-5">
//           <ReactPaginate
//             previousLabel="‹"
//             nextLabel="›"
//             pageCount={totalPages}
//             forcePage={currentPage - 1} // Convert to 0-indexed for ReactPaginate
//             onPageChange={handlePageChange}
//             containerClassName="flex items-center space-x-2"
//             pageClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//             activeClassName="bg-red-600 text-white border-red-600"
//             previousClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//             nextClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//             disabledClassName="opacity-50 cursor-not-allowed hover:bg-transparent"
//             breakLabel="..."
//             breakClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500"
//             marginPagesDisplayed={1}
//             pageRangeDisplayed={3}
//           />
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import ReactPaginate from "react-paginate";
import ProductCard from "../shop/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientPaginatedProducts({
  products,
  currency,
  rates,
  paginationData,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!paginationData) {
    return (
      <div className="col-span-3 max-w-[1280px] w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {products.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              currency={currency}
              rates={rates}
            />
          ))}
        </div>
      </div>
    );
  }

  const { totalCount, totalPages, currentPage } = paginationData;

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate is 0-indexed, our API is 1-indexed

    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigate to new page
    router.push(`?${params.toString()}`);
  };

  // Filter only active products
  const activeProducts = products.filter((item) => item.isActive === true);


  return (
    <div className="col-span-3 max-w-[1280px] w-full mx-auto">
      {/* Results count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {activeProducts.length} of {totalCount} products
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {activeProducts.map((product) => (
          <ProductCard
            key={product?.id}
            product={product}
            currency={currency}
            rates={rates}
          />
        ))}
      </div>
      {/* No products message */}
      {activeProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No active products found</p>
        </div>
      )}
 
      {totalPages > 1 && (
        <div className="flex justify-center mt-5">
          <ReactPaginate
            previousLabel="‹"
            nextLabel="›"
            pageCount={totalPages}
            forcePage={currentPage - 1} // Convert to 0-indexed for ReactPaginate
            onPageChange={handlePageChange}
            containerClassName="flex items-center space-x-2"
            pageClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            activeClassName="bg-red-600 text-white border-red-600"
            previousClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            nextClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            disabledClassName="opacity-50 cursor-not-allowed hover:bg-transparent"
            breakLabel="..."
            breakClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500"
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
          />
        </div>
      )}
    </div>
  );
}