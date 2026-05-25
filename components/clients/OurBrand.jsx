'use client'
import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaMinus } from "react-icons/fa";
import aboutImg from "@/public/client/about.png";
import { FAQS } from "@/components/seo/FAQSchema";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const SECTION_TEXT = {
  en: {
    faqTitle: "Frequently Asked Questions",
    seoTitle: "Global Supplier of Premium Industrial Kitchen Spare Parts",
    seoText: `At HDO Global Trade, we are your one-stop shop for high-quality commercial kitchen spare parts, accessories, and small appliances.

We specialize in supplying essential components for a wide range of professional kitchen equipment. Our extensive inventory ensures you can find the right part for any machine, including:

Prep Equipment: juicers, Blenders, immersion blenders (hand mixers), planetary mixers, vegetable cutters, slicers.

Cooking & Bakery: Commercial ovens, planetary mixers, and cooking equipment.

Cleaning & Cooling: Professional dishwashers and refrigeration units.

Whether you operate a restaurant, hotel, bakery, catering service, or any other food service business, HDO Global Trade provides reliable solutions tailored to your needs. We are committed to supporting your kitchen with:

Fast International Shipping: Delivering parts wherever you are.
Competitive Pricing: Quality components that fit your budget.
Expert Support: Ongoing maintenance assistance to keep your kitchen running smoothly.

Need a specific part? Contact HDO Global Trade today and get your kitchen equipment back in operation quickly and efficiently.`,
  },
  pt: {
    faqTitle: "Perguntas Frequentes",
    seoText: "O seu destino único para peças sobresselentes e de substituição para cozinhas industriais. Fornecemos peças testadas para máquinas de lavar louça, misturadoras, espremidores, cortadores de legumes, torneiras e mais. Compatíveis com Santos, Electrolux, Sirman, Dynamic, Robot-Coupe e outras marcas.",
  },
  fr: {
    faqTitle: "Questions Fréquentes",
    seoText: "Votre destination unique pour les pièces détachées de cuisine professionnelle. Nous fournissons des pièces testées pour lave-vaisselles, mixeurs, presse-agrumes, coupe-légumes, robinets et plus. Compatibles avec Santos, Electrolux, Sirman, Dynamic, Robot-Coupe.",
  },
  es: {
    faqTitle: "Preguntas Frecuentes",
    seoText: "Su destino único para repuestos de cocina industrial. Suministramos piezas probadas para lavavajillas, batidoras, exprimidores, cortadoras, grifos y más. Compatibles con Santos, Electrolux, Sirman, Dynamic, Robot-Coupe.",
  },
  he: {
    faqTitle: "שאלות נפוצות",
    seoText: "היעד שלכם לחלקי חילוף למטבח מסחרי. אנחנו מספקים חלקים מבוקרים למדיחי כלים, מיקסרים, סוחטים, קוצצי ירקות, ברזי מטבח ועוד. תואמים לסנטוס, אלקטרולוקס, סירמן, דיינמיק, רובוט-קוף ומותגים נוספים.",
  },
  de: {
    faqTitle: "Häufig gestellte Fragen",
    seoText: "Ihre erste Anlaufstelle für Ersatz- und Verschleißteile für Großküchen. Wir liefern geprüfte Teile für Spülmaschinen, Mixer, Entsafter, Gemüseschneider, Küchenarmaturen und mehr. Kompatibel mit Santos, Electrolux, Sirman, Dynamic, Robot-Coupe.",
  },
};

export default function OurBrand() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = SECTION_TEXT[uiLang] || SECTION_TEXT.en;
  const isRtl = uiLang === "he";
  const faqs = FAQS[uiLang] || FAQS.en;
  const [openIdx, setOpenIdx] = useState(null);

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

        {/* RIGHT: HDO Trademark Image + SEO text */}
        <div className="flex flex-col gap-4">
          <Image
            src={aboutImg}
            alt="HDO Global Trade — Equal Quality at Better Price"
            className="w-full h-auto rounded-xl shadow-md"
            unoptimized
          />
          {t.seoTitle && (
            <h3 className="font-bold text-gray-900 text-base mb-2">{t.seoTitle}</h3>
          )}
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {t.seoText}
          </p>
        </div>
      </div>
    </section>
  );
}


