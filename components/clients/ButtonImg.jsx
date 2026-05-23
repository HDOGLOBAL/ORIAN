"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import teamImg from "@/public/client/feature.jpg";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const TEXT = {
  en: {
    heading1: "Your One-Stop Shop for",
    heading2: "Industrial Kitchen Spare Parts",
    p1: "At HDO Trade, we specialize in providing high-quality spare parts and accessories for industrial kitchen equipment. Our extensive catalog includes parts for mixers, slicers, juicers, and more, compatible with leading brands such as Santos, Electrolux, Sirman, and Dynamic.",
    p2: "We supply restaurants, hotels, bakeries, and food service businesses worldwide, offering reliable solutions, competitive pricing, and fast international shipping. Whether you need a replacement part or ongoing maintenance support, we ensure you receive the right product quickly and efficiently.",
    note: "Looking for a specific part? Use our search tool or contact our team for assistance.",
    badge1: "Contact our customer service by WhatsApp",
    badge2: "Contact our customer service by Email",
  },
  pt: {
    heading1: "A Sua Loja Única para",
    heading2: "Peças de Cozinha Industrial",
    p1: "Na HDO Trade, especializamo-nos em fornecer peças e acessórios de alta qualidade para equipamentos de cozinha industrial. O nosso catálogo abrangente inclui peças para misturadores, fatiadores, espremidores e mais, compatíveis com Santos, Electrolux, Sirman e Dynamic.",
    p2: "Fornecemos restaurantes, hotéis, padarias e empresas de serviços alimentares em todo o mundo, oferecendo soluções fiáveis, preços competitivos e envio internacional rápido.",
    note: "Procura uma peça específica? Utilize a nossa ferramenta de pesquisa ou contacte a nossa equipa.",
    badge1: "Contate nosso atendimento pelo WhatsApp",
    badge2: "Contate nosso atendimento pelo E-mail",
  },
  fr: {
    heading1: "Votre Boutique Unique pour",
    heading2: "Pièces de Cuisine Industrielle",
    p1: "Chez HDO Trade, nous nous spécialisons dans la fourniture de pièces détachées et accessoires de haute qualité pour équipements de cuisine industrielle. Notre catalogue comprend des pièces pour mixeurs, trancheurs, presse-agrumes et plus, compatibles avec Santos, Electrolux, Sirman et Dynamic.",
    p2: "Nous fournissons des restaurants, hôtels, boulangeries et entreprises de restauration dans le monde entier, offrant des solutions fiables, des prix compétitifs et une livraison internationale rapide.",
    note: "Vous cherchez une pièce spécifique ? Utilisez notre outil de recherche ou contactez notre équipe.",
    badge1: "Contactez notre service par WhatsApp",
    badge2: "Contactez notre service par E-mail",
  },
  es: {
    heading1: "Tu Tienda Única para",
    heading2: "Repuestos de Cocina Industrial",
    p1: "En HDO Trade, nos especializamos en proporcionar repuestos y accesorios de alta calidad para equipos de cocina industrial. Nuestro catálogo incluye piezas para batidoras, cortadoras, exprimidores y más, compatibles con Santos, Electrolux, Sirman y Dynamic.",
    p2: "Suministramos restaurantes, hoteles, panaderías y empresas de servicios alimentarios en todo el mundo, ofreciendo soluciones fiables, precios competitivos y envío internacional rápido.",
    note: "¿Buscas una pieza específica? Usa nuestra herramienta de búsqueda o contacta a nuestro equipo.",
    badge1: "Contacte a nuestro servicio por WhatsApp",
    badge2: "Contacte a nuestro servicio por E-mail",
  },
  he: {
    heading1: "החנות המושלמת שלכם ל",
    heading2: "חלקי חילוף למטבח תעשייתי",
    p1: "ב-HDO Trade אנחנו מתמחים במתן חלקי חילוף ואביזרים איכותיים לציוד מטבח תעשייתי. הקטלוג שלנו כולל חלקים למיקסרים, פורסי, סוחטים ועוד, מתאימים לסנטוס, אלקטרולוקס, סירמן ודיינמיק.",
    p2: "אנחנו מספקים מסעדות, מלונות, מאפיות ועסקי שירותי מזון ברחבי העולם, מציעים פתרונות אמינים, תמחור תחרותי ומשלוח בינלאומי מהיר.",
    note: "מחפשים חלק ספציפי? השתמשו בכלי החיפוש שלנו או צרו קשר עם הצוות שלנו.",
    badge1: "צרו קשר עם שירות הלקוחות שלנו בוואטסאפ",
    badge2: "צרו קשר עם שירות הלקוחות שלנו במייל",
  },
  de: {
    heading1: "Ihr One-Stop-Shop für",
    heading2: "Industrieküchen-Ersatzteile",
    p1: "Bei HDO Trade sind wir auf hochwertige Ersatzteile und Zubehör für Industrieküchen-Equipment spezialisiert. Unser Sortiment umfasst Teile für Mixer, Aufschnittmaschinen, Entsafter und mehr, kompatibel mit Santos, Electrolux, Sirman und Dynamic.",
    p2: "Wir beliefern Restaurants, Hotels, Bäckereien und Gastronomieunternehmen weltweit mit zuverlässigen Lösungen, wettbewerbsfähigen Preisen und schnellem internationalem Versand.",
    note: "Suchen Sie ein bestimmtes Teil? Nutzen Sie unser Suchwerkzeug oder kontaktieren Sie unser Team.",
    badge1: "Kontaktieren Sie unseren Kundenservice per WhatsApp",
    badge2: "Kontaktieren Sie unseren Kundenservice per E-Mail",
  },
};

export default function ButtonImg() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = TEXT[uiLang] || TEXT.en;
  const isRtl = uiLang === "he";

  const handleWhatsApp = () => {
    window.open("https://wa.me/351935210099", "_blank");
  };

  const handleEmail = () => {
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=sales@hdotrade.com&su=Customer%20Service%20Inquiry`;
    window.open(gmail, "_blank");
  };

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left: Team Photo with green badges */}
        <div className="relative w-full md:w-[42%] rounded-2xl overflow-hidden min-h-[340px]">
          <Image
            src={teamImg}
            alt="HDO Trade team — industrial kitchen spare parts specialists"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute bottom-5 left-4 flex flex-col gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-[#1ebe5d] transition-all duration-200"
            >
              <FaWhatsapp className="text-white text-lg flex-shrink-0" />
              {t.badge1}
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            >
              <SiGmail className="text-[#EA4335] text-lg flex-shrink-0" />
              {t.badge2}
            </button>
          </div>
        </div>
        {/* Right: Text content */}
        <div className="flex flex-col justify-center w-full md:w-[58%]">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {t.heading1}
            <br />
            {t.heading2}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            {t.p1}
          </p>
          <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
            {t.p2}
          </p>
          <div className="flex items-start gap-2 text-gray-500 text-sm border-t border-gray-100 pt-4">
            <FaSearch className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{t.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
