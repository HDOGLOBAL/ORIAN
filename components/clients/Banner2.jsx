"use client";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaWhatsapp, FaEnvelope, FaCheck, FaLock, FaGlobe, FaUndo, FaStar } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import logo from "@/public/client/logo.png";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const TEXT = {
  en: {
    col1: { title: "How to Find the Right Part", desc: "Use your equipment model number or part description to quickly find the correct spare part you need.", btn: "Search Parts" },
    col2: { title: "Why Choose HDO Trade?", items: ["High quality and durable parts", "Wide range for top brands", "Expert support and advice", "Secure online shopping"] },
    col3: { title: "Need Help?", desc: "Our team is ready to help you find exactly what you need.", whatsapp: "WhatsApp", email: "Email", btn: "Contact Us" },
  },
  pt: {
    col1: { title: "Como Encontrar a Peça Certa", desc: "Use o número do modelo ou descrição da peça para encontrar rapidamente o que precisa.", btn: "Pesquisar Peças" },
    col2: { title: "Porquê a HDO Trade?", items: ["Peças de alta qualidade e duradouras", "Vasta gama de marcas líder", "Suporte especializado", "Compras online seguras"] },
    col3: { title: "Precisa de Ajuda?", desc: "A nossa equipa está pronta para o ajudar a encontrar exatamente o que precisa.", whatsapp: "WhatsApp", email: "E-mail", btn: "Contacte-nos" },
  },
  fr: {
    col1: { title: "Comment Trouver la Bonne Pièce", desc: "Utilisez le numéro de modèle ou la description pour trouver rapidement la pièce qu'il vous faut.", btn: "Chercher des Pièces" },
    col2: { title: "Pourquoi HDO Trade?", items: ["Pièces de haute qualité et durables", "Large gamme de marques leaders", "Support expert", "Achats en ligne sécurisés"] },
    col3: { title: "Besoin d'Aide?", desc: "Notre équipe est prête à vous aider à trouver exactement ce dont vous avez besoin.", whatsapp: "WhatsApp", email: "E-mail", btn: "Contactez-nous" },
  },
  es: {
    col1: { title: "Cómo Encontrar el Repuesto", desc: "Use el número de modelo o descripción para encontrar rápidamente el repuesto correcto.", btn: "Buscar Repuestos" },
    col2: { title: "¿Por qué HDO Trade?", items: ["Repuestos de alta calidad y duraderos", "Amplia gama de marcas líderes", "Soporte experto", "Compras online seguras"] },
    col3: { title: "¿Necesitas Ayuda?", desc: "Nuestro equipo está listo para ayudarte a encontrar exactamente lo que necesitas.", whatsapp: "WhatsApp", email: "E-mail", btn: "Contáctanos" },
  },
  he: {
    col1: { title: "כיצד למצוא את החלק הנכון", desc: "השתמשו במספר הדגם או בתיאור החלק לחיפוש מהיר.", btn: "חפש חלקים" },
    col2: { title: "למה HDO Trade?", items: ["חלקים איכותיים ועמידים", "מגוון רחב של מותגים מובילים", "תמיכה מקצועית", "קניות מקוונת בטוחה"] },
    col3: { title: "צריכים עזרה?", desc: "הצוות שלנו מוכן לעזור לכם למצוא בדיוק את מה שאתם צריכים.", whatsapp: "WhatsApp", email: "E-mail", btn: "צרו קשר" },
  },
  de: {
    col1: { title: "Das richtige Ersatzteil finden", desc: "Verwenden Sie die Modellnummer oder Teilebeschreibung, um schnell das richtige Ersatzteil zu finden.", btn: "Teile Suchen" },
    col2: { title: "Warum HDO Trade?", items: ["Hochwertige und langlebige Teile", "Breites Sortiment für Top-Marken", "Fachkundiger Support", "Sicheres Online-Shopping"] },
    col3: { title: "Brauchen Sie Hilfe?", desc: "Unser Team ist bereit, Ihnen zu helfen, genau das zu finden, was Sie benötigen.", whatsapp: "WhatsApp", email: "E-Mail", btn: "Kontaktieren" },
  },
  it: {
    col1: { title: "Come Trovare il Ricambio Giusto", desc: "Usa il numero del modello o la descrizione del pezzo per trovare rapidamente il ricambio di cui hai bisogno.", btn: "Cerca Ricambi" },
    col2: { title: "Perché Scegliere HDO Trade?", items: ["Ricambi di alta qualità e duraturi", "Ampia gamma per i marchi principali", "Supporto e consulenza esperti", "Acquisti online sicuri"] },
    col3: { title: "Hai Bisogno di Aiuto?", desc: "Il nostro team è pronto ad aiutarti a trovare esattamente quello di cui hai bisogno.", whatsapp: "WhatsApp", email: "Email", btn: "Contattaci" },
  },
};

const BADGES = {
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
  it: [
    { title: "Pagamento Sicuro", desc: "Checkout 100% sicuro" },
    { title: "Spedizione Mondiale", desc: "Consegna rapida e affidabile" },
    { title: "Resi Facili", desc: "Resi senza problemi" },
    { title: "100% Soddisfazione", desc: "Garantiamo la qualità" },
  ],
};

const BADGE_ICONS = [FaLock, FaGlobe, FaUndo, FaStar];

export default function Banner2() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = TEXT[uiLang] || TEXT.en;
  const badges = BADGES[uiLang] || BADGES.en;
  const isRtl = uiLang === "he";

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: How to Find */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center min-h-[280px]">
          <div className="w-14 h-14 rounded-full bg-[#c41e3a]/10 flex items-center justify-center mb-3">
            <FaSearch className="text-xl text-[#c41e3a]" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1.5">{t.col1.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{t.col1.desc}</p>
          <Link
            href="/shop"
            className="w-full border-2 border-[#c41e3a] text-[#c41e3a] text-center py-2 rounded-full font-semibold text-sm hover:bg-[#c41e3a] hover:text-white transition-colors"
          >
            {t.col1.btn}
          </Link>
        </div>

        {/* Col 2: Why Choose HDO Trade */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center min-h-[280px]">
          <Image
            src={logo}
            alt="HDO Global Trade Logo"
            width={80}
            height={65}
            className="object-contain mb-3"
          />
          <h3 className="text-base font-bold text-gray-900 mb-3">{t.col2.title}</h3>
          <ul className="space-y-2 w-full text-left">
            {t.col2.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCheck className="text-[#c41e3a] text-xs flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Need Help */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-5 flex flex-col min-h-[280px]">
          <h3 className="text-base font-bold text-gray-900 mb-1.5 text-center">{t.col3.title}</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed text-center flex-1">{t.col3.desc}</p>
          <div className="flex flex-col gap-2">
            <a
              href="https://wa.me/351935210099"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 rounded-full font-semibold text-sm hover:bg-[#1fb855] transition-colors"
            >
              <FaWhatsapp className="text-base" />
              {t.col3.whatsapp || "WhatsApp"}
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=sales@hdotrade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              <FaEnvelope className="text-base text-[#EA4335]" />
              {t.col3.email || "Email"}
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#c41e3a] text-white py-2 rounded-full font-semibold text-sm hover:bg-[#a01829] transition-colors"
            >
              <MdChat className="text-base" />
              {t.col3.btn}
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges — inline below cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {badges.map(({ title, desc }, idx) => {
          const Icon = BADGE_ICONS[idx];
          return (
            <div
              key={title}
              className="flex items-center gap-3 p-3 min-h-[72px] bg-white rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100">
                <Icon className="text-gray-600 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-xs leading-tight">{title}</p>
                <p className="text-gray-400 text-[11px] leading-tight mt-0.5">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
