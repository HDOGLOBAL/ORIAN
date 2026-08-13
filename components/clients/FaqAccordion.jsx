"use client";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function FaqAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="border border-gray-100 rounded-xl overflow-hidden shadow-sm"
        >
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 text-sm pr-4 leading-snug">
              {faq.q}
            </span>
            <span className="flex-shrink-0 text-[#c41e3a]">
              {openIdx === idx ? <FaMinus size={12} /> : <FaPlus size={12} />}
            </span>
          </button>
          {openIdx === idx && (
            <div className="px-4 pb-4 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-gray-50">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
