// "use client";

// import { deleteProductById, getPaginatedProducts } from "@/database/queries";
// import Image from "next/image";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import placeholder from "@/public/client/banner/placeholder.png";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { trimWords } from "@/utils/trimWords";
// import { formatDate } from "@/utils/localDate";
// import ReactPaginate from "react-paginate";

// export default function AllProducts() {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalProducts, setTotalProducts] = useState(0);

//   // Search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   // Memoized calculations
//   const pageCount = useMemo(
//     () => Math.ceil(totalProducts / itemsPerPage),
//     [totalProducts, itemsPerPage]
//   );
//   const showingRange = useMemo(() => {
//     const start = currentPage * itemsPerPage + 1;
//     const end = Math.min((currentPage + 1) * itemsPerPage, totalProducts);
//     return { start, end };
//   }, [currentPage, itemsPerPage, totalProducts]);

//   const handleDelete = async (id) => {
//     const confirmed = confirm("Are you sure you want to delete this product?");
//     if (!confirmed) return;

//     try {
//       // Optimistic update
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       await deleteProductById(id);
//       toast.success("Product deleted successfully!", {
//         position: "bottom-right",
//       });

//       // Refresh data but don't reset pagination
//       fetchProducts(currentPage, itemsPerPage, searchQuery);
//     } catch (err) {
//       // Revert optimistic update on error
//       fetchProducts(currentPage, itemsPerPage, searchQuery);
//       toast.error("Failed to delete product", {
//         position: "bottom-right",
//       });
//       console.error("Delete error:", err);
//     }
//   };

//   const fetchProducts = useCallback(async (page, limit, query = "") => {
//     try {
//       setIsLoading(true);
//       setIsSearching(!!query);
//       const offset = page * limit;
//       const result = await getPaginatedProducts({
//         offset,
//         limit,
//         searchQuery: query,
//       });
//       setProducts(result.products);
//       setTotalProducts(result.totalCount);
//     } catch (err) {
//       setError("Failed to load products. Please try again.");
//       console.error("Fetch error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Debounced search function
//   useEffect(() => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     const timer = setTimeout(() => {
//       setCurrentPage(0);
//       fetchProducts(0, itemsPerPage, searchQuery);
//     }, 1000); // Reduced from 2000ms to 500ms for better UX

//     setSearchTimeout(timer);

//     return () => {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }
//     };
//   }, [searchQuery, itemsPerPage, fetchProducts]);

//   useEffect(() => {
//     fetchProducts(currentPage, itemsPerPage, searchQuery);
//   }, [currentPage, itemsPerPage, fetchProducts]);

//   // Handle page change
//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchQuery("");
//     setCurrentPage(0);
//   };

//   // Handle manual search trigger
//   const handleManualSearch = () => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
//     setCurrentPage(0);
//     fetchProducts(0, itemsPerPage, searchQuery);
//   };

//   // Handle Enter key in search
//   const handleSearchKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleManualSearch();
//     }
//   };

//   if (isLoading && !isSearching) {
//     return (
//       <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-2xl font-light text-[#0eadef] mb-6">
//             All Products
//           </h2>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-2xl font-light text-[#0eadef] mb-6">
//             All Products
//           </h2>
//           <div className="text-center py-10 text-red-500">{error}</div>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-2xl font-light text-[#0eadef] mb-6">
//           All Products
//         </h2>

//         {/* Search Bar */}
//         <div className="mb-6 relative">
//           <div className="flex items-center">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search products by name and ID..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleSearchKeyPress}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 disabled={isLoading}
//               />
//               {searchQuery && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   aria-label="Clear search"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={handleManualSearch}
//               disabled={isLoading}
//               className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading ? "Searching..." : "Search"}
//             </button>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             Search by product name or ID. Results update as you type.
//           </p>
//         </div>

//         {/* Items per page selector and pagination info */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center">
//             <span className="mr-2 text-gray-700">Show</span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(0);
//               }}
//               className="border rounded p-1 text-sm"
//               disabled={isLoading}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="25">25</option>
//               <option value="50">50</option>
//             </select>
//             <span className="ml-2 text-gray-700">entries</span>
//           </div>
//           <div className="text-gray-700 text-sm">
//             Showing {showingRange.start} to {showingRange.end} of{" "}
//             {totalProducts} entries
//             {searchQuery && (
//               <span className="ml-2 text-blue-500">(filtered)</span>
//             )}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left border border-gray-200">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-4 py-3 border">Image</th>
//                 <th className="px-4 py-3 border">Name</th>
//                 <th className="px-4 py-3 border">SKU</th>
//                 <th className="px-4 py-3 border">Status</th>
//                 <th className="px-4 py-3 border">Published Date</th>
//                 <th className="px-4 py-3 border">Manufacturer</th>
//                 <th className="px-4 py-3 border">Price (USD)</th>
//                 <th className="px-4 py-3 border">Price (EUR)</th>
//                 <th className="px-4 py-3 border">Stock</th>
//                 <th className="px-4 py-3 border">Category</th>
//                 <th className="px-4 py-3 border text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="11"
//                     className="text-center py-6 text-gray-500 italic"
//                   >
//                     {searchQuery
//                       ? "No products found matching your search."
//                       : "No products found."}
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="hover:bg-gray-50 transition-colors duration-150"
//                   >
//                     <td className="px-4 py-2 border flex justify-center">
//                       <Image
//                         src={product?.image || placeholder}
//                         alt={product?.name || "Product image"}
//                         width={80}
//                         height={80}
//                         className="object-contain"
//                         loading="lazy"
//                       />
//                     </td>
//                     <td className="px-4 py-2 border font-medium">
//                       {trimWords(product?.name, 28)}
//                     </td>
//                     <td className="px-4 py-2 border font-medium">
//                       {product?.sku}
//                     </td>
//                     <td className="px-4 py-2 border font-medium">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           product?.isActive
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {product?.isActive ? "Public" : "Private"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 border font-medium">
//                       {formatDate(product?.createdAt)}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {product?.manufacturer?.name || "N/A"}
//                     </td>
//                     <td className="px-4 py-2 border text-green-600 font-semibold">
//                       ${product?.price?.usd || "0.00"}
//                     </td>
//                     <td className="px-4 py-2 border text-blue-600 font-semibold">
//                       €{product?.price?.eur || "0.00"}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           product?.quantity > 10
//                             ? "bg-green-100 text-green-800"
//                             : product?.quantity > 0
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {product?.quantity || 0}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {product?.category?.name || "N/A"}
//                     </td>
//                     <td className="px-4 py-2 border text-center">
//                       <div className="flex justify-center gap-2">
//                         <Link
//                           href={`/auth/dashboard/products/${product?.id}`}
//                           className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
//                         >
//                           ✏️ Edit
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(product?.id)}
//                           className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
//                         >
//                           🗑 Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         {pageCount > 1 && (
//           <div className="flex justify-between items-center mt-6">
//             <div className="text-sm text-gray-700">
//               Page {currentPage + 1} of {pageCount}
//             </div>
//             <ReactPaginate
//               previousLabel="‹"
//               nextLabel="›"
//               pageCount={pageCount}
//               onPageChange={handlePageChange}
//               containerClassName="flex items-center space-x-2"
//               pageClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//               activeClassName="bg-blue-500 text-white border-blue-500"
//               previousClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//               nextClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
//               disabledClassName="opacity-50 cursor-not-allowed"
//               breakLabel="..."
//               breakClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500"
//               marginPagesDisplayed={1}
//               pageRangeDisplayed={3}
//               forcePage={currentPage}
//               disableInitialCallback={true}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// Client-side component (AllProducts)
"use client";
import { deleteProductById, getPaginatedProducts } from "@/database/queries";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import placeholder from "@/public/client/banner/placeholder.png";
import { toast } from "react-toastify";
import Link from "next/link";
import { trimWords } from "@/utils/trimWords";
import { formatDate } from "@/utils/localDate";
import ReactPaginate from "react-paginate";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0); // 0-based for ReactPaginate
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Memoized calculations
  const pageCount = useMemo(
    () => Math.ceil(totalProducts / itemsPerPage),
    [totalProducts, itemsPerPage]
  );

  const showingRange = useMemo(() => {
    const start = currentPage * itemsPerPage + 1;
    const end = Math.min((currentPage + 1) * itemsPerPage, totalProducts);
    return { start, end };
  }, [currentPage, itemsPerPage, totalProducts]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
    try {
      // Optimistic update
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await deleteProductById(id);
      toast.success("Product deleted successfully!", {
        position: "bottom-right",
      });
      // Refresh data but don't reset pagination
      fetchProducts(currentPage, itemsPerPage, searchQuery);
    } catch (err) {
      // Revert optimistic update on error
      fetchProducts(currentPage, itemsPerPage, searchQuery);
      toast.error("Failed to delete product", {
        position: "bottom-right",
      });
      console.error("Delete error:", err);
    }
  };

  // FIXED: Proper offset calculation and removed server page override
  const fetchProducts = useCallback(async (page, limit, query = "") => {
    try {
      setIsLoading(true);
      setIsSearching(!!query);
      // FIXED: Calculate offset correctly for 0-based page
      const offset = page * limit;
      console.log("CLIENT: Requesting page:", page, "Offset:", offset);
      const result = await getPaginatedProducts({
        offset,
        limit,
        searchQuery: query,
        includeInactive: true,
      });
      console.log(
        "CLIENT: Server returned products:",
        result.products.length,
        "Total count:",
        result.totalCount
      );
      setProducts(result.products);
      setTotalProducts(result.totalCount);
      // FIXED: Don't override currentPage from server response
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search function
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timer = setTimeout(() => {
      setCurrentPage(0); // Reset to first page on search
      fetchProducts(0, itemsPerPage, searchQuery);
    }, 1000);
    setSearchTimeout(timer);
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery, itemsPerPage, fetchProducts]);

  // Fetch products when page or itemsPerPage changes
  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, itemsPerPage, fetchProducts]);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    console.log("Page changed to:", selected);
    setCurrentPage(selected);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(0);
  };

  // Handle manual search trigger
  const handleManualSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setCurrentPage(0);
    fetchProducts(0, itemsPerPage, searchQuery);
  };

  // Handle Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualSearch();
    }
  };

  if (isLoading && !isSearching) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            All Products
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            All Products
          </h2>
          <div className="text-center py-10 text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-light text-[#0eadef] mb-6">
          All Products
        </h2>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by name and ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={isLoading}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleManualSearch}
              disabled={isLoading}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search by product name or ID. Results update as you type.
          </p>
        </div>

        {/* Items per page selector and pagination info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="border rounded p-1 text-sm"
              disabled={isLoading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="ml-2 text-gray-700">entries</span>
          </div>
          <div className="text-gray-700 text-sm">
            Showing {showingRange.start} to {showingRange.end} of{" "}
            {totalProducts} entries
            {searchQuery && (
              <span className="ml-2 text-blue-500">(filtered)</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Image</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">SKU</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Published Date</th>
                <th className="px-4 py-3 border">Manufacturer</th>
                {/* <th className="px-4 py-3 border">Price (USD)</th> */}
                <th className="px-4 py-3 border">Price (EUR)</th>
                <th className="px-4 py-3 border">Stock</th>
                <th className="px-4 py-3 border">Min Stock</th>
                <th className="px-4 py-3 border">Category</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    {searchQuery
                      ? "No products found matching your search."
                      : "No products found."}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 border flex justify-center">
                      <Image
                        src={product?.image || placeholder}
                        alt={product?.name || "Product image"}
                        width={80}
                        height={80}
                        className="object-contain"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {trimWords(product?.name, 28)}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {product?.sku}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product?.isActive ? "Public" : "Private"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {formatDate(product?.createdAt)}
                    </td>
                    <td className="px-4 py-2 border">
                      {product?.manufacturer?.name || "N/A"}
                    </td>
                    {/* <td className="px-4 py-2 border text-green-600 font-semibold">
                      ${product?.price?.usd || "0.00"}
                    </td> */}
                    <td className="px-4 py-2 border text-blue-600 font-semibold">
                      €{product?.price?.eur || "0.00"}
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product?.quantity > 10
                            ? "bg-green-100 text-green-800"
                            : product?.quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product?.quantity || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <span>
                        {product?.minStock || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {product?.category?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/auth/dashboard/products/${product?.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product?.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage + 1} of {pageCount}
            </div>
            <ReactPaginate
              previousLabel="‹"
              nextLabel="›"
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName="flex items-center space-x-2"
              pageClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              activeClassName="bg-blue-500 text-white border-blue-500"
              previousClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              nextClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              disabledClassName="opacity-50 cursor-not-allowed"
              breakLabel="..."
              breakClassName="border border-gray-300 rounded w-10 h-10 flex items-center justify-center text-gray-500"
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              forcePage={currentPage}
              disableInitialCallback={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
