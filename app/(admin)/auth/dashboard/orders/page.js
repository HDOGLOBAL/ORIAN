"use client";

import {
  createManualOrder,
  deleteOrderById,
  getAllProducts,
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

  // Add Company Order modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [savingManual, setSavingManual] = useState(false);

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

  const openAddOrderModal = async () => {
    setShowAddModal(true);
    try {
      const products = await getAllProducts();
      setProductList(products);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const submitManualOrder = async (formData) => {
    setSavingManual(true);
    try {
      const result = await createManualOrder(formData);
      if (result && result.success) {
        toast.success("Company order created successfully!", {
          position: "bottom-right",
        });
        setShowAddModal(false);
        fetchOrders(0, itemsPerPage, searchQuery, statusFilter);
      } else {
        toast.error(result?.error || "Failed to create company order", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Create manual order error:", err);
      toast.error("Failed to create company order", {
        position: "bottom-right",
      });
    } finally {
      setSavingManual(false);
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
                placeholder="Search by name, email, tracking ID or order nº..."
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
              <option value="all">All Status</option>
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

            <button
              onClick={openAddOrderModal}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              + Add company order
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
            Search by customer name, email, Transaction ID or order nº.
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
              className="border rounded pl-2 pr-6 py-1 text-sm"
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
                <th className="px-4 py-3 border">Order nº </th>
                <th className="px-4 py-3 border">Transaction ID</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Items</th>
                <th className="px-4 py-3 border">Total Amount</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Order Date</th>
                <th className="px-4 py-3 border">Payment</th>
                <th className="px-4 py-3 border">Type</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
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
                    <td className="px-4 py-2 border font-semibold">
                      {order?.orderNumber || "-"}
                    </td>
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
                        className={`pl-2 pr-6 py-1 rounded text-xs border-none outline-none focus:ring-1 focus:ring-blue-300 ${
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
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderType === "Old"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.orderType === "Old" ? "Old" : "New"}
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

      {showAddModal && (
        <AddCompanyOrderModal
          products={productList}
          saving={savingManual}
          onClose={() => setShowAddModal(false)}
          onSubmit={submitManualOrder}
        />
      )}
    </div>
  );
}

function AddCompanyOrderModal({ products, saving, onClose, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [shipping, setShipping] = useState("0");
  const [awb, setAwb] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 1, price: 0 }]);

  const autoPrice = (productId) => {
    const product = products.find((p) => String(p.id) === String(productId));
    return product ? product.price?.eur || 0 : 0;
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        if (field === "productId") {
          return { ...it, productId: value, price: autoPrice(value) };
        }
        return { ...it, [field]: value };
      })
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { productId: "", qty: 1, price: 0 }]);

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );
  const grandTotal = subtotal + (Number(shipping) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.warning("Customer first and last name are required");
      return;
    }
    const validItems = items.filter((it) => it.productId && Number(it.qty) > 0);
    if (validItems.length === 0) {
      toast.warning("Add at least one product");
      return;
    }
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      streetAddress: streetAddress.trim(),
      state: state.trim(),
      city: city.trim(),
      zip: zip.trim(),
      deliveryCompany: deliveryCompany.trim(),
      shipping: Number(shipping) || 0,
      awb: awb.trim(),
      invoiceNumber: invoiceNumber.trim(),
      items: validItems.map((it) => ({
        productId: it.productId,
        qty: Number(it.qty),
        price: Number(it.price) || 0,
      })),
      paid: true,
    });
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Add company order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First name *</label>
              <input
                className={inputClass}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Last name *</label>
              <input
                className={inputClass}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Street address</label>
              <input
                className={inputClass}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  className={inputClass}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                className={inputClass}
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Items *</label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                + Add item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_80px_120px_40px] gap-2 items-center"
                >
                  <select
                    className={inputClass}
                    value={item.productId}
                    onChange={(e) =>
                      updateItem(index, "productId", e.target.value)
                    }
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={String(p.id)} value={String(p.id)}>
                        {p.name} — €{p.price?.eur || 0}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={item.qty}
                    onChange={(e) => updateItem(index, "qty", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-lg leading-none"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Delivery company</label>
              <input
                className={inputClass}
                value={deliveryCompany}
                onChange={(e) => setDeliveryCompany(e.target.value)}
                placeholder="e.g. FedEX, UP ..."
              />
            </div>
            <div>
              <label className={labelClass}>Shipping price (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>AWB (Tracking number)</label>
              <input
                className={inputClass}
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <label className={labelClass}>Invoice </label>
              <input
                className={inputClass}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Subtotal:</span> €{subtotal.toFixed(2)}{" "}
              ·{" "}
              <span className="font-medium">Shipping:</span> €
              {(Number(shipping) || 0).toFixed(2)} ·{" "}
              <span className="font-semibold text-gray-900">Total:</span> €
              {grandTotal.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

