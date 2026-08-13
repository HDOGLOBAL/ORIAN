"use client";

import { useState } from "react";

export default function PendingOrderModal({ saving, onClose, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [parts, setParts] = useState([{ manufacturer: "", partsNumber: "", qty: 1 }]);

  const updatePart = (index, field, value) => {
    setParts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addPart = () =>
    setParts((prev) => [...prev, { manufacturer: "", partsNumber: "", qty: 1 }]);

  const removePart = (index) =>
    setParts((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      email: email.trim(),
      parts: parts.map((p) => ({
        manufacturer: p.manufacturer.trim(),
        partsNumber: p.partsNumber.trim(),
        qty: p.qty,
      })),
    });
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Pending Order</h3>
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
              <label className={labelClass}>First name</label>
              <input
                className={inputClass}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input
                className={inputClass}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              <label className={labelClass}>Address</label>
              <input
                className={inputClass}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Parts</label>
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
                  {parts.map((part, index) => (
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
                          onChange={(e) =>
                            updatePart(index, "qty", e.target.value)
                          }
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
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {parts.filter((p) => p.partsNumber.trim() || p.manufacturer.trim())
                .length}{" "}
              part(s)
            </span>
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
