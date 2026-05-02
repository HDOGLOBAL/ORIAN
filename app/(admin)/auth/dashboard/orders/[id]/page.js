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
} from "@/database/queries";

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingTransactionId] = useState(false);
  const [newTransactionId, setNewTransactionId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      // This would be your function to get a single order by ID
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
      setNewTransactionId(orderData.transactionId || "");
    } catch (err) {
      setError("Failed to load order details. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-[#0eadef]">
            Order Details: {order.trackingId}
          </h2>
          <Link
            href="/auth/dashboard/orders"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Status Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Order Status
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Current Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
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
                {order.currentStatus}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Payment Status:</span>
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status:
              </label>
              <select
                value={order.currentStatus}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={isUpdating}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="Ordered">Ordered</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Transaction Details
            </h3>
            <div className="mb-4">
              <span className="font-medium block mb-1">Transaction ID:</span>
              {isEditingTransactionId ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTransactionId}
                    onChange={(e) => setNewTransactionId(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter transaction ID"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-mono bg-gray-100 p-2 rounded-md">
                    {order.transactionId || "Not provided"}
                  </span>
                </div>
              )}
            </div>
            <div className="mb-2">
              <span className="font-medium block mb-1">Order Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium block mb-1">Tracking ID:</span>
              <span className="font-mono">{order.trackingId}</span>
            </div>
            {order.coupon && (
              <div className="mb-2">
                <span className="font-medium block mb-1">Coupon Used:</span>
                <span>{order.coupon}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Customer Information
            </h3>
            <div className="mb-3">
              <span className="font-medium block mb-1">Name:</span>
              <span>
                {order.firstName} {order.lastName}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">Email:</span>
              <span>{order.email}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">Phone:</span>
              <span>{order.phone}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">VAT Number:</span>
              <span>{order.vatNumber}</span>
            </div>
            <div>
              <span className="font-medium block mb-1">VAT Valid:</span>
              <span
                className={order.vatValid ? "text-green-600" : "text-red-600"}
              >
                {order.vatValid ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Shipping Address
            </h3>
            <div className="mb-3">
              <span className="font-medium block mb-1">Address:</span>
              <span>{order.streetAddress}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">City:</span>
              <span>{order.city}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">State:</span>
              <span>{order.state}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium block mb-1">ZIP Code:</span>
              <span>{order.zip}</span>
            </div>
            <div>
              <span className="font-medium block mb-1">
                Shipping Address Same as Billing:
              </span>
              <span>{order.sameAddress ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Order Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Product ID</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border font-mono">{item.id}</td>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border text-center">{item.qty}</td>
                    <td className="px-4 py-2 border">
                      {order.totals.currency} {item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border font-medium">
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
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Order Totals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>
                {order.totals.currency} {order.totals.subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Discount:</span>
              <span className="text-red-600">
                -{order.totals.currency} {order.totals.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping:</span>
              <span>
                {order.totals.currency} {order.totals.shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tax:</span>
              <span>
                {order.totals.currency} {order.totals.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2 col-span-2">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="font-bold text-lg">
                {order.totals.currency} {order.totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Comments */}
        {order.orderComment && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Order Comments
            </h3>
            <div className="bg-white p-4 rounded border">
              <p className="text-gray-700">{order.orderComment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
