'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getProducts } from "@/database/queries";
import { FAQS } from "@/components/seo/FAQSchema";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const SECTION_TEXT = {
  en: { faqTitle: "Frequently Asked Questions", topTitle: "Our Top Selling Parts" },
  pt: { faqTitle: "Perguntas Frequentes", topTitle: "As Nossas Peças Mais Vendidas" },
  fr: { faqTitle: "Questions Fréquentes", topTitle: "Nos Pièces les Plus Vendues" },
  es: { faqTitle: "Preguntas Frecuentes", topTitle: "Nuestros Repuestos Más Vendidos" },
  he: { faqTitle: "שאלות נפוצות", topTitle: "החלקים הנמכרים ביותר שלנו" },
  de: { faqTitle: "Häufig gestellte Fragen", topTitle: "Unsere meistverkauften Teile" },
};

export default function OurBrand() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = SECTION_TEXT[uiLang] || SECTION_TEXT.en;
  const isRtl = uiLang === "he";
  const faqs = FAQS[uiLang] || FAQS.en;
  const [openIdx, setOpenIdx] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts({ limit: 4 })
      .then((res) => {
        if (res?.products) setProducts(res.products.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: FAQ Accordion */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {t.faqTitle}
          </h2>
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
        </div>

        {/* RIGHT: Top Selling Parts */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {t.topTitle}
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "/client/banner/placeholder.png"
                      }
                      alt={product.title || "Spare part"}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 border-t border-gray-50">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                      {product.title}
                    </p>
                    {product.price?.eur && (
                      <p className="text-xs font-bold text-[#c41e3a] mt-1">
                        €{Number(product.price.eur).toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-2 border-t border-gray-50 space-y-1">
                    <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


