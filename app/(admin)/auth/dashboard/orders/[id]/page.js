"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { toast } from "react-toastify";
import { formatDate } from "@/utils/localDate";
import Link from "next/link";
import {
  getOrderById,
  updateOrderStatusById,
  updateOrderPaymentStatus,
  updateOrderInfoById,
} from "@/database/queries";

const getStatusClass = (status) => {
  if (status === "Ordered") return "bg-blue-100 text-blue-800";
  if (status === "Processing") return "bg-yellow-100 text-yellow-800";
  if (status === "Shipped") return "bg-purple-100 text-purple-800";
  if (status === "Delivered") return "bg-green-100 text-green-800";
  return "bg-red-100 text-red-800";
};

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    invoiceNumber: "",
    deliveryCompany: "",
    shippingDate: "",
    shippingPrice: "0",
  });
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  const formatDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      // This would be your function to get a single order by ID
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
      setOrderInfo({
        invoiceNumber: orderData.invoiceNumber || "",
        deliveryCompany: orderData.deliveryCompany || "",
        shippingDate: formatDateInput(orderData.shippingDate),
        shippingPrice:
          orderData.totals?.shipping != null
            ? String(orderData.totals.shipping)
            : "0",
      });
    } catch (err) {
      setError("Failed to load order details. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrderInfo = async () => {
    try {
      setIsSavingInfo(true);
      const updated = await updateOrderInfoById(orderId, orderInfo);
      setOrder((prev) => ({
        ...prev,
        invoiceNumber: updated.invoiceNumber,
        deliveryCompany: updated.deliveryCompany,
        shippingDate: updated.shippingDate,
        totals: updated.totals,
      }));
      toast.success("Order details updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update order details", {
        position: "bottom-right",
      });
      console.error("Order info update error:", err);
    } finally {
      setIsSavingInfo(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      await updateOrderStatusById(orderId, newStatus);
      setOrder((prev) => ({ ...prev, currentStatus: newStatus }));
      toast.success("Order status updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update order status", {
        position: "bottom-right",
      });
      console.error("Status update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePaymentStatus = async () => {
    try {
      setIsUpdating(true);
      const newStatus = !order.paid;
      await updateOrderPaymentStatus(orderId, newStatus);
      setOrder((prev) => ({ ...prev, paid: newStatus }));
      toast.success(`Order marked as ${newStatus ? "paid" : "unpaid"}!`, {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update payment status", {
        position: "bottom-right",
      });
      console.error("Payment status update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
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
            Order Details
          </h2>
          <div className="text-center py-10 text-red-500">{error}</div>
          <button
            onClick={fetchOrder}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            Order Details
          </h2>
          <div className="text-center py-10 text-gray-500">
            Order not found.
          </div>
          <Link
            href="/auth/dashboard/orders"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCompanyOrder =
    order.salesChannel === "Company" || order.orderType === "Old";
  const backHref = isCompanyOrder
    ? "/auth/dashboard/company-orders"
    : "/auth/dashboard/orders";

  const cardClass = "bg-gray-50 rounded-lg p-3";
  const editableCardClass = "bg-white border border-blue-200 rounded-lg p-3";
  const cardTitleClass = "text-base font-semibold text-gray-800 mb-3";
  const editableCardTitleClass = "text-base font-semibold text-[#0eadef] mb-3";
  const fieldLabelClass = "block text-xs font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <div className="bg-white p-4 rounded shadow">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-light text-[#0eadef]">
              Order nº{order.orderNumber || "-"} — {order.trackingId || "-"}
            </h2>
            {isCompanyOrder && (
              <span className="px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                Company
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                order.currentStatus
              )}`}
            >
              {order.currentStatus}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                order.paid
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {order.paid ? "Paid" : "Unpaid"}
            </span>
          </div>
          <Link
            href={backHref}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            ← Back to {isCompanyOrder ? "Company Orders" : "Orders"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Items */}
            <div className={cardClass}>
              <h3 className={cardTitleClass}>Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-3 py-1.5 border">SKU / Code</th>
                      <th className="px-3 py-1.5 border">Product Name</th>
                      <th className="px-3 py-1.5 border">Quantity</th>
                      <th className="px-3 py-1.5 border">Price</th>
                      <th className="px-3 py-1.5 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 border font-mono">
                          {item.sku || item.id}
                        </td>
                        <td className="px-3 py-1.5 border">{item.name}</td>
                        <td className="px-3 py-1.5 border text-center">
                          {item.qty}
                        </td>
                        <td className="px-3 py-1.5 border">
                          {order.totals.currency} {item.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-1.5 border font-medium">
                          {order.totals.currency}{" "}
                          {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Totals */}
            <div className={cardClass}>
              <h3 className={cardTitleClass}>Order Totals</h3>
              <div className="max-w-md space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Subtotal:</span>
                  <span>
                    {order.totals.currency} {Number(order.totals.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Discount:</span>
                  <span className="text-red-600">
                    -{order.totals.currency} {Number(order.totals.discount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Shipping:</span>
                  <span>
                    {order.totals.currency} {Number(order.totals.shipping).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Tax:</span>
                  <span>
                    {order.totals.currency} {Number(order.totals.tax).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold text-base">Grand Total:</span>
                  <span className="font-semibold text-base">
                    {order.totals.currency} {Number(order.totals.grandTotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Comments */}
            {order.orderComment && (
              <div className={cardClass}>
                <h3 className={cardTitleClass}>Order Comments</h3>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-700">{order.orderComment}</p>
                </div>
              </div>
            )}

            {/* Billing, Delivery & Shipping */}
            <div className={editableCardClass}>
              <h3 className={editableCardTitleClass}>
                Billing, Delivery & Shipping
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={fieldLabelClass}>Invoice Number</label>
                  <input
                    type="text"
                    value={orderInfo.invoiceNumber}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        invoiceNumber: e.target.value,
                      }))
                    }
                    placeholder="e.g. INV-2025-001"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={fieldLabelClass}>Delivery Company</label>
                  <input
                    type="text"
                    value={orderInfo.deliveryCompany}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        deliveryCompany: e.target.value,
                      }))
                    }
                    placeholder="e.g. FedEX, UPS..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={fieldLabelClass}>Shipping price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderInfo.shippingPrice}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        shippingPrice: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={fieldLabelClass}>Shipping date</label>
                  <input
                    type="date"
                    value={orderInfo.shippingDate}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        shippingDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                onClick={saveOrderInfo}
                disabled={isSavingInfo}
                className="mt-3 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isSavingInfo ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status & Payment */}
            <div className={editableCardClass}>
              <h3 className={editableCardTitleClass}>Status & Payment</h3>
              <div className="mb-4">
                <label className={fieldLabelClass}>Update Status:</label>
                <select
                  value={order.currentStatus}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={isUpdating}
                  className={`${inputClass} disabled:opacity-50`}
                >
                  <option value="Ordered">Ordered</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment:</span>
                <button
                  onClick={togglePaymentStatus}
                  disabled={isUpdating}
                  className={`px-3 py-1 rounded text-sm ${
                    order.paid
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  } disabled:opacity-50`}
                >
                  {order.paid ? "Paid" : "Unpaid"}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Address */}
            <div className={cardClass}>
              <h3 className={cardTitleClass}>Customer & Shipping</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="text-right">
                    {order.firstName} {order.lastName}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Email:</span>
                  <span className="text-right break-all">{order.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{order.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">VAT Number:</span>
                  <span>{order.vatNumber || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">VAT Valid:</span>
                  <span
                    className={
                      order.vatValid ? "text-green-600" : "text-red-600"
                    }
                  >
                    {order.vatValid ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Address:</span>
                  <span className="text-right break-all">
                    {order.streetAddress || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">City:</span>
                  <span>{order.city || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">State:</span>
                  <span>{order.state || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ZIP Code:</span>
                  <span>{order.zip || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Same as Billing:</span>
                  <span>{order.sameAddress ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            {/* Reference */}
            <div className={cardClass}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Reference
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Order Number:</span>
                  <span className="font-semibold">
                    {order.orderNumber || "-"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="font-mono text-xs break-all">
                    {order.transactionId || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Tracking ID:</span>
                  <span className="font-mono text-xs">
                    {order.trackingId}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium">Order Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Coupon Used:</span>
                    <span>{order.coupon}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
