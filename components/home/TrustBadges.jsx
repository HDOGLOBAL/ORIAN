"use client";
import { FaLock, FaGlobe, FaUndo, FaStar } from "react-icons/fa";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const BADGES_MAP = {
  en: [
    { title: "Secure Payment", desc: "100% secure checkout" },
    { title: "Worldwide Shipping", desc: "Fast & reliable delivery" },
    { title: "Easy Returns", desc: "Hassle-free returns" },
    { title: "100% Satisfaction", desc: "We guarantee quality" },
  ],
  pt: [
    { title: "Pagamento Seguro", desc: "Checkout 100% seguro" },
    { title: "Envio Mundial", desc: "Entrega rápida e fiável" },
    { title: "Devoluções Fáceis", desc: "Devoluções sem problemas" },
    { title: "100% Satisfação", desc: "Garantimos qualidade" },
  ],
  fr: [
    { title: "Paiement Sécurisé", desc: "Paiement 100% sécurisé" },
    { title: "Livraison Mondiale", desc: "Livraison rapide et fiable" },
    { title: "Retours Faciles", desc: "Retours sans tracas" },
    { title: "100% Satisfaction", desc: "Nous garantissons la qualité" },
  ],
  es: [
    { title: "Pago Seguro", desc: "Pago 100% seguro" },
    { title: "Envío Mundial", desc: "Entrega rápida y fiable" },
    { title: "Devoluciones Fáciles", desc: "Sin problemas con devoluciones" },
    { title: "100% Satisfacción", desc: "Garantizamos la calidad" },
  ],
  he: [
    { title: "תשלום מאובטח", desc: "תשלום 100% מאובטח" },
    { title: "משלוח לכל העולם", desc: "משלוח מהיר ואמין" },
    { title: "החזרות קלות", desc: "החזרות ללא בעיות" },
    { title: "100% שביעות רצון", desc: "אנחנו מבטיחים איכות" },
  ],
  de: [
    { title: "Sichere Zahlung", desc: "100% sicherer Checkout" },
    { title: "Weltweiter Versand", desc: "Schnelle & zuverlässige Lieferung" },
    { title: "Einfache Rückgabe", desc: "Unkomplizierte Rückgaben" },
    { title: "100% Zufriedenheit", desc: "Wir garantieren Qualität" },
  ],
};

const ICONS = [FaLock, FaGlobe, FaUndo, FaStar];

export default function TrustBadges() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const badges = BADGES_MAP[uiLang] || BADGES_MAP.en;
  const isRtl = uiLang === "he";

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(({ title, desc }, idx) => {
          const Icon = ICONS[idx];
          return (
            <div
              key={title}
              className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                <Icon className="text-gray-600 text-xl" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{title}</p>
              <p className="text-gray-500 text-xs mt-1 leading-snug">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
