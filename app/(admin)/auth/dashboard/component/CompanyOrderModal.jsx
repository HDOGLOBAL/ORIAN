"use client";

import { useState } from "react";

export default function CompanyOrderModal({ saving, onClose, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [shipping, setShipping] = useState("0");
  const [awb, setAwb] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [shippingDate, setShippingDate] = useState("");
  const [items, setItems] = useState([{ name: "", code: "", qty: 1, price: 0 }]);

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { name: "", code: "", qty: 1, price: 0 }]);

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );
  const grandTotal = subtotal + (Number(shipping) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter(
      (it) => it.name.trim() && Number(it.qty) > 0
    );
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      state: state.trim(),
      email: email.trim(),
      streetAddress: streetAddress.trim(),
      phone: phone.trim(),
      city: city.trim(),
      zip: zip.trim(),
      deliveryCompany: deliveryCompany.trim(),
      shipping: Number(shipping) || 0,
      awb: awb.trim(),
      invoiceNumber: invoiceNumber.trim(),
      shippingDate: shippingDate || "",
      items: validItems.map((it) => ({
        name: it.name.trim(),
        code: it.code.trim(),
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
          <h3 className="text-xl font-semibold text-gray-800">Company Order</h3>
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
              <label className={labelClass}>State</label>
              <input
                className={inputClass}
                value={state}
                onChange={(e) => setState(e.target.value)}
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
              <label className={labelClass}>Street Address</label>
              <input
                className={inputClass}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
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
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                + Add item
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_110px_70px_110px_40px] gap-2 text-xs font-medium text-gray-500 mb-1">
                <span>Item name</span>
                <span>Product code</span>
                <span>Quantity</span>
                <span>Price/Net Value (€)</span>
                <span></span>
              </div>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_110px_70px_110px_40px] gap-2 items-center"
                >
                  <input
                    className={inputClass}
                    placeholder="name"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="code"
                    value={item.code}
                    onChange={(e) => updateItem(index, "code", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="Quantity"
                    value={item.qty}
                    onChange={(e) => updateItem(index, "qty", e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    placeholder="Price/Net Value (€)"
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
                placeholder="e.g. UPS, FedEX..."
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
              <label className={labelClass}>AWB (tracking number) *</label>
              <input
                className={inputClass}
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="Tracking number"
                required
                onInvalid={(e) =>
                  e.currentTarget.setCustomValidity(
                    "AWB (tracking number) is required"
                  )
                }
                onInput={(e) => e.currentTarget.setCustomValidity("")}
              />
            </div>
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input
                className={inputClass}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Shipping date</label>
              <input
                type="date"
                className={inputClass}
                value={shippingDate}
                onChange={(e) => setShippingDate(e.target.value)}
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
