"use client";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaWhatsapp, FaEnvelope, FaCheck } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import logo from "@/public/client/logo.png";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const TEXT = {
  en: {
    col1: { title: "How to Find the Right Part", desc: "Use your equipment model number or part description to quickly find the correct spare part you need.", btn: "Search Parts" },
    col2: { title: "Why Choose HDO Trade?", items: ["High quality and durable parts", "Wide range for top brands", "Expert support and advice", "Secure online shopping"] },
    col3: { title: "Need Help?", desc: "Our team is ready to help you find exactly what you need.", btn: "Contact Us" },
  },
  pt: {
    col1: { title: "Como Encontrar a Peça Certa", desc: "Use o número do modelo ou descrição da peça para encontrar rapidamente o que precisa.", btn: "Pesquisar Peças" },
    col2: { title: "Porquê a HDO Trade?", items: ["Peças de alta qualidade e duradouras", "Vasta gama de marcas líder", "Suporte especializado", "Compras online seguras"] },
    col3: { title: "Precisa de Ajuda?", desc: "A nossa equipa está pronta para o ajudar a encontrar exatamente o que precisa.", btn: "Contacte-nos" },
  },
  fr: {
    col1: { title: "Comment Trouver la Bonne Pièce", desc: "Utilisez le numéro de modèle ou la description pour trouver rapidement la pièce qu'il vous faut.", btn: "Chercher des Pièces" },
    col2: { title: "Pourquoi HDO Trade?", items: ["Pièces de haute qualité et durables", "Large gamme de marques leaders", "Support expert", "Achats en ligne sécurisés"] },
    col3: { title: "Besoin d'Aide?", desc: "Notre équipe est prête à vous aider à trouver exactement ce dont vous avez besoin.", btn: "Contactez-nous" },
  },
  es: {
    col1: { title: "Cómo Encontrar el Repuesto", desc: "Use el número de modelo o descripción para encontrar rápidamente el repuesto correcto.", btn: "Buscar Repuestos" },
    col2: { title: "¿Por qué HDO Trade?", items: ["Repuestos de alta calidad y duraderos", "Amplia gama de marcas líderes", "Soporte experto", "Compras online seguras"] },
    col3: { title: "¿Necesitas Ayuda?", desc: "Nuestro equipo está listo para ayudarte a encontrar exactamente lo que necesitas.", btn: "Contáctanos" },
  },
  he: {
    col1: { title: "כיצד למצוא את החלק הנכון", desc: "השתמשו במספר הדגם או בתיאור החלק לחיפוש מהיר.", btn: "חפש חלקים" },
    col2: { title: "למה HDO Trade?", items: ["חלקים איכותיים ועמידים", "מגוון רחב של מותגים מובילים", "תמיכה מקצועית", "קניות מקוונת בטוחה"] },
    col3: { title: "צריכים עזרה?", desc: "הצוות שלנו מוכן לעזור לכם למצוא בדיוק את מה שאתם צריכים.", btn: "צרו קשר" },
  },
  de: {
    col1: { title: "Das richtige Ersatzteil finden", desc: "Verwenden Sie die Modellnummer oder Teilebeschreibung, um schnell das richtige Ersatzteil zu finden.", btn: "Teile Suchen" },
    col2: { title: "Warum HDO Trade?", items: ["Hochwertige und langlebige Teile", "Breites Sortiment für Top-Marken", "Fachkundiger Support", "Sicheres Online-Shopping"] },
    col3: { title: "Brauchen Sie Hilfe?", desc: "Unser Team ist bereit, Ihnen zu helfen, genau das zu finden, was Sie benötigen.", btn: "Kontaktieren" },
  },
};

export default function Banner2() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = TEXT[uiLang] || TEXT.en;
  const isRtl = uiLang === "he";

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Col 1: How to Find */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.col1.title}</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed flex-1">{t.col1.desc}</p>
          <div className="flex justify-center my-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#c41e3a] flex items-center justify-center bg-white shadow-md">
              <FaSearch className="text-2xl text-[#c41e3a]" />
            </div>
          </div>
          <Link
            href="/shop"
            className="mt-4 border-2 border-[#c41e3a] text-[#c41e3a] text-center py-2.5 px-6 rounded-full font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            {t.col1.btn}
          </Link>
        </div>

        {/* Col 2: Why Choose HDO Trade */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{t.col2.title}</h3>
          <ul className="space-y-2.5 w-full mb-4">
            {t.col2.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCheck className="text-[#c41e3a] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-center flex-1">
            <Image
              src={logo}
              alt="HDO Global Trade Logo"
              width={200}
              height={165}
              className="object-contain"
            />
          </div>
        </div>

        {/* Col 3: Need Help */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.col3.title}</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">{t.col3.desc}</p>
          <div className="flex flex-col gap-2 mt-auto">
            <a
              href="https://wa.me/351935210099"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-full font-semibold text-sm hover:bg-[#1fb855] transition-colors"
            >
              <FaWhatsapp className="text-lg" />
              WhatsApp
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=sales@hdotrade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              <FaEnvelope className="text-lg" />
              Email
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#c41e3a] text-white py-2.5 px-4 rounded-full font-semibold text-sm hover:bg-[#a01829] transition-colors"
            >
              <MdChat className="text-lg" />
              {t.col3.btn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
