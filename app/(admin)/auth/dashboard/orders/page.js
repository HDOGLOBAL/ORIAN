"use client";

import {
  deleteOrderById,
  getPaginatedOrders,
  updateOrderStatusById,
} from "@/database/queries";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { formatDate } from "@/utils/localDate";
import ReactPaginate from "react-paginate";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalOrders, setTotalOrders] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Status filter
  const [statusFilter, setStatusFilter] = useState("all");

  // Memoized calculations
  const pageCount = useMemo(
    () => Math.ceil(totalOrders / itemsPerPage),
    [totalOrders, itemsPerPage]
  );
  const showingRange = useMemo(() => {
    const start = currentPage * itemsPerPage + 1;
    const end = Math.min((currentPage + 1) * itemsPerPage, totalOrders);
    return { start, end };
  }, [currentPage, itemsPerPage, totalOrders]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      // Optimistic update
      setOrders((prev) => prev.filter((o) => o._id !== id));
      await deleteOrderById(id);
      toast.success("Order deleted successfully!", {
        position: "bottom-right",
      });

      // Refresh data but don't reset pagination
      fetchOrders(currentPage, itemsPerPage, searchQuery, statusFilter);
    } catch (err) {
      // Revert optimistic update on error
      fetchOrders(currentPage, itemsPerPage, searchQuery, statusFilter);
      toast.error("Failed to delete order", {
        position: "bottom-right",
      });
      console.error("Delete error:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update the order status in the database
      await updateOrderStatusById(orderId, newStatus);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, currentStatus: newStatus } : order
        )
      );

      toast.success("Order status updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update order status", {
        position: "bottom-right",
      });
      console.error("Status update error:", err);
    }
  };

  const fetchOrders = useCallback(
    async (page, limit, query = "", status = "all") => {
      try {
        setIsLoading(true);
        setIsSearching(!!query);
        const offset = page * limit;
        const result = await getPaginatedOrders({
          offset,
          limit,
          searchQuery: query,
          statusFilter: status,
        });
        setOrders(result.orders);
        setTotalOrders(result.totalCount);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounced search function
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timer = setTimeout(() => {
      setCurrentPage(0);
      fetchOrders(0, itemsPerPage, searchQuery, statusFilter);
    }, 1500);

    setSearchTimeout(timer);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery, statusFilter, itemsPerPage, fetchOrders]);

  useEffect(() => {
    fetchOrders(currentPage, itemsPerPage, searchQuery, statusFilter);
  }, [currentPage, itemsPerPage, fetchOrders]);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(0);
  };

  // Handle manual search trigger
  const handleManualSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setCurrentPage(0);
    fetchOrders(0, itemsPerPage, searchQuery, statusFilter);
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
            Order Management
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
            Order Management
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
          Order Management
        </h2>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders by name, email, tracking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={isLoading}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={isLoading}
            >
              <option value="all">All Statuses</option>
              <option value="Ordered">Ordered</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleManualSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>

            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Search by customer name, email, or Transaction ID.
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
            Showing {showingRange.start} to {showingRange.end} of {totalOrders}{" "}
            entries
            {(searchQuery || statusFilter !== "all") && (
              <span className="ml-2 text-blue-500">(filtered)</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Transaction ID</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Items</th>
                <th className="px-4 py-3 border">Total Amount</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Order Date</th>
                <th className="px-4 py-3 border">Payment</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    {searchQuery || statusFilter !== "all"
                      ? "No orders found matching your criteria."
                      : "No orders found."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 border font-mono">
                      {order?.transactionId || "Unpaid"}
                    </td>
                    <td className="px-4 py-2 border">
                      {order?.firstName} {order.lastName}
                    </td>
                    <td className="px-4 py-2 border">{order.email}</td>
                    <td className="px-4 py-2 border">
                      {order.cartItems.length} item(s)
                    </td>
                    <td className="px-4 py-2 border font-semibold">
                      {order.totals.currency}{" "}
                      {order.totals.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={order.currentStatus}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded text-xs border-none outline-none focus:ring-1 focus:ring-blue-300 ${
                          order.currentStatus === "Ordered"
                            ? "bg-blue-100 text-blue-800"
                            : order.currentStatus === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.currentStatus === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.currentStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/auth/dashboard/orders/${order._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                          👁️ View
                        </Link>
                        <button
                          onClick={() => handleDelete(order._id)}
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

