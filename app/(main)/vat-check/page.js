"use client";

import React, { useState } from "react";

export default function VatChecker() {
  const [vat, setVat] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (vat.length < 3) {
      alert("Enter VAT number starting with country code");
      return;
    }

    setLoading(true);
    setResult(null);

    const countryCode = vat.slice(0, 2).toUpperCase();
    const vatNumber = vat.slice(2).replace(/\s+/g, "");
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-manufacture`;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/eu-uk-vat-check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryCode, vatNumber }),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ valid: false, error: "Error checking VAT number" });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          EU VAT Validator
        </h2>

        <input
          type="text"
          placeholder="e.g. DE123456789"
          value={vat}
          onChange={(e) => setVat(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Checking..." : "Check VAT Number"}
        </button>

        {result && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-semibold ${
              result.valid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.valid
              ? "✅ Valid VAT Number"
              : result.error || "❌ Invalid VAT Number"}
          </div>
        )}
      </div>
    </div>
  );
}
