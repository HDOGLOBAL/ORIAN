"use client";
import { FaGlobe, FaShieldAlt, FaMedal, FaHeadset } from "react-icons/fa";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const FEATURES_MAP = {
  en: [
    { title: "Worldwide Shipping", desc: "Fast delivery all over the world" },
    { title: "High Quality Products", desc: "Original and High quality replacement parts" },
    { title: "Trusted Brands", desc: "We work with leading manufacturers all over the world" },
    { title: "Customer Support", desc: "Our team is here to help you find the right part" },
  ],
  pt: [
    { title: "Envio Mundial", desc: "Entrega rápida para mais de 100 países" },
    { title: "Alta Qualidade", desc: "Peças duráveis e fiáveis para longa performance" },
    { title: "Marcas de Confiança", desc: "Trabalhamos com fabricantes líderes" },
    { title: "Apoio ao Cliente", desc: "A nossa equipa ajuda-o a encontrar a peça certa" },
  ],
  fr: [
    { title: "Livraison Mondiale", desc: "Livraison rapide dans plus de 100 pays" },
    { title: "Haute Qualité", desc: "Pièces durables et fiables" },
    { title: "Marques de Confiance", desc: "Nous travaillons avec les fabricants leaders" },
    { title: "Support Client", desc: "Notre équipe vous aide à trouver la bonne pièce" },
  ],
  es: [
    { title: "Envío Mundial", desc: "Entrega rápida a más de 100 países" },
    { title: "Alta Calidad", desc: "Repuestos duraderos y fiables" },
    { title: "Marcas de Confianza", desc: "Trabajamos con fabricantes líderes" },
    { title: "Soporte al Cliente", desc: "Nuestro equipo está aquí para ayudarle" },
  ],
  he: [
    { title: "משלוח לכל העולם", desc: "משלוח מהיר ליותר מ-100 מדינות" },
    { title: "איכות גבוהה", desc: "חלקים עמידים ואמינים לביצועים ארוכי טווח" },
    { title: "מותגים מובילים", desc: "עובדים עם יצרנים מובילים" },
    { title: "תמיכה בלקוחות", desc: "הצוות שלנו כאן לעזור לכם" },
  ],
  de: [
    { title: "Weltweiter Versand", desc: "Schnelle Lieferung in über 100 Länder" },
    { title: "Hohe Qualität", desc: "Langlebige und zuverlässige Ersatzteile" },
    { title: "Vertrauensmarken", desc: "Wir arbeiten mit führenden Herstellern" },
    { title: "Kundensupport", desc: "Unser Team hilft Ihnen, das richtige Teil zu finden" },
  ],
  it: [
    { title: "Spedizione Mondiale", desc: "Consegna rapida in tutto il mondo" },
    { title: "Alta Qualità", desc: "Ricambi originali e di alta qualità" },
    { title: "Marchi Affidabili", desc: "Lavoriamo con i principali produttori" },
    { title: "Assistenza Clienti", desc: "Il nostro team è qui per aiutarti a trovare il pezzo giusto" },
  ],
};

const ICONS = [FaGlobe, FaShieldAlt, FaMedal, FaHeadset];

export default function FeatureIcons() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const features = FEATURES_MAP[uiLang] || FEATURES_MAP.en;
  const isRtl = uiLang === "he";

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map(({ title, desc }, idx) => {
          const Icon = ICONS[idx];
          return (
            <div
              key={title}
              className="flex items-start gap-3 p-4 min-h-[120px] rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Icon className="text-[#c41e3a] text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-snug">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
