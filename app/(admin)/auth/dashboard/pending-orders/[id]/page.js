"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { toast } from "react-toastify";
import { formatDate } from "@/utils/localDate";
import Link from "next/link";
import {
  getPendingOrderById,
  updatePendingOrderById,
  updatePendingOrderStatusById,
} from "@/database/queries";

const emptyPart = () => ({ manufacturer: "", partsNumber: "", qty: 1 });

export default function PendingOrderDetails() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    parts: [],
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = await getPendingOrderById(orderId);
      setOrder(orderData);
      setFormData({
        firstName: orderData.firstName || "",
        lastName: orderData.lastName || "",
        address: orderData.address || "",
        email: orderData.email || "",
        parts: (orderData.parts || []).map((p) => ({
          manufacturer: p.manufacturer || "",
          partsNumber: p.partsNumber || "",
          qty: p.qty || 1,
        })),
      });
    } catch (err) {
      setError("Failed to load pending order details. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updatePart = (index, field, value) =>
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));

  const addPart = () =>
    setFormData((prev) => ({ ...prev, parts: [...prev.parts, emptyPart()] }));

  const removePart = (index) =>
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));

  const saveOrder = async () => {
    try {
      setIsUpdating(true);
      const updated = await updatePendingOrderById(orderId, formData);
      setOrder(updated);
      toast.success("Pending order updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update pending order", {
        position: "bottom-right",
      });
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      await updatePendingOrderStatusById(orderId, newStatus);
      setOrder((prev) => ({ ...prev, currentStatus: newStatus }));
      toast.success("Pending order status updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to update pending order status", {
        position: "bottom-right",
      });
      console.error("Status update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

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
            Pending Order Details
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
            Pending Order Details
          </h2>
          <div className="text-center py-10 text-gray-500">
            Pending order not found.
          </div>
          <Link
            href="/auth/dashboard/pending-orders"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
          >
            Back to Pending Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusClass =
    order.currentStatus === "Ordered"
      ? "bg-blue-100 text-blue-800"
      : order.currentStatus === "Processing"
      ? "bg-yellow-100 text-yellow-800"
      : order.currentStatus === "Shipped"
      ? "bg-purple-100 text-purple-800"
      : order.currentStatus === "Delivered"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <div className="bg-white p-4 sm:p-6 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-light text-[#0eadef]">
              Pending Order — {order.firstName} {order.lastName}
            </h2>
          </div>
          <Link
            href="/auth/dashboard/pending-orders"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-center"
          >
            ← Back to Pending Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Pending Order Status
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Current Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${statusClass}`}>
                {order.currentStatus}
              </span>
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
            <div className="mt-4">
              <span className="font-medium block mb-1">Created:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parts */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Parts</h3>
            <button
              type="button"
              onClick={addPart}
              className="text-sm px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
            >
              + Add part
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-xs font-medium text-gray-500">
                  <th className="text-left py-1 pr-2">Manufacturer</th>
                  <th className="text-left py-1 pr-2">Parts numbers</th>
                  <th className="text-left py-1 pr-2 w-[70px]">Quantity</th>
                  <th className="py-1 w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {formData.parts.map((part, index) => (
                  <tr key={index}>
                    <td className="py-1 pr-2">
                      <input
                        className={inputClass}
                        placeholder="Manufacturer"
                        value={part.manufacturer}
                        onChange={(e) =>
                          updatePart(index, "manufacturer", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-1 pr-2">
                      <input
                        className={inputClass}
                        placeholder="Parts number"
                        value={part.partsNumber}
                        onChange={(e) =>
                          updatePart(index, "partsNumber", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-1 pr-2">
                      <input
                        type="number"
                        min="1"
                        className={inputClass}
                        value={part.qty}
                        onChange={(e) => updatePart(index, "qty", e.target.value)}
                      />
                    </td>
                    <td className="py-1 text-right">
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="text-red-500 hover:text-red-700 text-lg leading-none"
                        aria-label="Remove part"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={saveOrder}
            disabled={isUpdating}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
