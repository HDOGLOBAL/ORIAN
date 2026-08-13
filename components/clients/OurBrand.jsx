'use client'
import Link from "next/link";
import Image from "next/image";
import aboutImg from "@/public/client/about.png";
import FaqAccordion from "./FaqAccordion";
import { FAQS, getFeaturedFaqs } from "@/components/seo/FAQSchema";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const SECTION_TEXT = {
  en: {
    faqTitle: "Frequently Asked Questions",
    seeAllQuestions: "View all questions",
    seoTitle: "Global Supplier of Premium Industrial Kitchen Spare Parts",
    seoIntro: "At HDO Global Trade, we are your one stop shop for high quality commercial kitchen spare parts, accessories, and small appliances. We specialize in supplying essential components for a wide range of professional kitchen equipment.",
    seoSupplyHeading: "What We Supply",
    seoSupplyItems: [
      "Prep Equipment: juicers, blenders, immersion blenders (hand mixers), planetary mixers, vegetable cutters, slicers.",
      "Cooking & Bakery: commercial ovens, planetary mixers, and cooking equipment.",
      "Cleaning & Cooling: professional dishwashers and refrigeration units.",
    ],
    seoWhyHeading: "Serving Professionals Worldwide",
    seoWhyIntro: "Whether you operate a restaurant, hotel, bakery, catering service, or any other food service business, HDO Global Trade provides reliable solutions tailored to your needs. We are committed to supporting your kitchen with:",
    seoWhyItems: [
      "Fast International Shipping: delivering parts wherever you are.",
      "Competitive Pricing: quality components that fit your budget.",
      "Expert Support: ongoing maintenance assistance to keep your kitchen running smoothly.",
    ],
    seoCta: "Need a specific part? Contact HDO Global Trade today and get your kitchen equipment back in operation quickly and efficiently.",
  },
  pt: {
    faqTitle: "Perguntas Frequentes",
    seeAllQuestions: "Ver todas as perguntas",
    seoTitle: "Fornecedor Global de Peças Premium para Cozinhas Industriais",
    seoIntro: "Na HDO Global Trade, somos a sua loja única para peças sobresselentes, acessórios e pequenos eletrodomésticos de alta qualidade para cozinhas comerciais. Especializamo-nos no fornecimento de componentes essenciais para uma vasta gama de equipamentos profissionais de cozinha.",
    seoSupplyHeading: "O Que Fornecemos",
    seoSupplyItems: [
      "Equipamento de Preparação: espremidores, liquidificadores, batedoras de imersão (batedoras de mão), batedoras planetárias, cortadores de legumes, fatiadores.",
      "Cozedura e Pastelaria: fornos comerciais, batedoras planetárias e equipamento de cozinha.",
      "Limpeza e Refrigeração: máquinas de lavar loiça profissionais e unidades de refrigeração.",
    ],
    seoWhyHeading: "Ao Serviço de Profissionais em Todo o Mundo",
    seoWhyIntro: "Quer opere um restaurante, hotel, padaria, serviço de catering ou qualquer outro negócio de serviços alimentares, a HDO Global Trade fornece soluções fiáveis adaptadas às suas necessidades. Estamos empenhados em apoiar a sua cozinha com:",
    seoWhyItems: [
      "Envio Internacional Rápido: entrega de peças onde quer que esteja.",
      "Preços Competitivos: componentes de qualidade que cabem no seu orçamento.",
      "Suporte Especializado: assistência contínua de manutenção para manter a sua cozinha a funcionar sem problemas.",
    ],
    seoCta: "Precisa de uma peça específica? Contacte a HDO Global Trade hoje e coloque o seu equipamento de cozinha novamente em funcionamento de forma rápida e eficiente.",
  },
  fr: {
    faqTitle: "Questions Fréquentes",
    seeAllQuestions: "Voir toutes les questions",
    seoTitle: "Fournisseur Mondial de Pièces Premium pour Cuisines Industrielles",
    seoIntro: "Chez HDO Global Trade, nous sommes votre guichet unique pour des pièces détachées, accessoires et petits appareils de haute qualité pour cuisines commerciales. Nous sommes spécialisés dans la fourniture de composants essentiels pour une large gamme d'équipements de cuisine professionnelle.",
    seoSupplyHeading: "Ce Que Nous Fournissons",
    seoSupplyItems: [
      "Équipement de Préparation : presse-agrumes, mixeurs, mixeurs plongeants (batteurs à main), batteurs planétaires, coupe-légumes, trancheurs.",
      "Cuisson et Boulangerie : fours commerciaux, batteurs planétaires et équipements de cuisson.",
      "Nettoyage et Réfrigération : lave-vaisselle professionnels et unités de réfrigération.",
    ],
    seoWhyHeading: "Au Service des Professionnels du Monde Entier",
    seoWhyIntro: "Que vous exploitiez un restaurant, un hôtel, une boulangerie, un service de restauration ou tout autre établissement de restauration, HDO Global Trade propose des solutions fiables adaptées à vos besoins. Nous nous engageons à soutenir votre cuisine avec :",
    seoWhyItems: [
      "Livraison Internationale Rapide : livraison de pièces où que vous soyez.",
      "Prix Compétitifs : des composants de qualité adaptés à votre budget.",
      "Support Expert : une assistance maintenance continue pour que votre cuisine fonctionne sans accroc.",
    ],
    seoCta: "Vous cherchez une pièce spécifique ? Contactez HDO Global Trade aujourd'hui et remettez votre équipement de cuisine en service rapidement et efficacement.",
  },
  es: {
    faqTitle: "Preguntas Frecuentes",
    seeAllQuestions: "Ver todas las preguntas",
    seoTitle: "Proveedor Global de Repuestos Premium para Cocinas Industriales",
    seoIntro: "En HDO Global Trade, somos su tienda única para repuestos, accesorios y pequeños electrodomésticos de alta calidad para cocinas comerciales. Nos especializamos en el suministro de componentes esenciales para una amplia gama de equipos profesionales de cocina.",
    seoSupplyHeading: "Lo Que Suministramos",
    seoSupplyItems: [
      "Equipo de Preparación: exprimidores, licuadoras, batidoras de inmersión (batidoras de mano), batidoras planetarias, cortadoras de verduras, cortafiambres.",
      "Cocción y Panadería: hornos comerciales, batidoras planetarias y equipos de cocción.",
      "Limpieza y Refrigeración: lavavajillas profesionales y unidades de refrigeración.",
    ],
    seoWhyHeading: "Al Servicio de Profesionales en Todo el Mundo",
    seoWhyIntro: "Ya sea que opere un restaurante, hotel, panadería, servicio de catering o cualquier otro negocio de servicios alimentarios, HDO Global Trade ofrece soluciones fiables adaptadas a sus necesidades. Estamos comprometidos a apoyar su cocina con:",
    seoWhyItems: [
      "Envío Internacional Rápido: entrega de piezas dondequiera que esté.",
      "Precios Competitivos: componentes de calidad que se ajustan a su presupuesto.",
      "Soporte Experto: asistencia continua de mantenimiento para que su cocina funcione sin problemas.",
    ],
    seoCta: "¿Necesita una pieza específica? Contacte a HDO Global Trade hoy y ponga su equipo de cocina en funcionamiento de manera rápida y eficiente.",
  },
  he: {
    faqTitle: "שאלות נפוצות",
    seeAllQuestions: "לכל השאלות",
    seoTitle: "ספק עולמי של חלקי חילוף פרימיום למטבחים תעשייתיים",
    seoIntro: "ב-HDO Global Trade, אנחנו החנות המושלמת שלכם לחלקי חילוף, אביזרים ומכשירים קטנים איכותיים למטבחים מסחריים. אנחנו מתמחים באספקת רכיבים חיוניים למגוון רחב של ציוד מטבח מקצועי.",
    seoSupplyHeading: "מה אנו מספקים",
    seoSupplyItems: [
      "ציוד הכנה: סוחטים, בלנדרים, בלנדרים ידניים (מקצפות יד), מיקסרים פלנטריים, חותכי ירקות, פורסים.",
      "בישול ואפייה: תנורים מסחריים, מיקסרים פלנטריים וציוד בישול.",
      "ניקיון וקירור: מדיחי כלים מקצועיים ויחידות קירור.",
    ],
    seoWhyHeading: "בשירות אנשי מקצוע ברחבי העולם",
    seoWhyIntro: "בין אם אתם מפעילים מסעדה, מלון, מאפייה, שירות קייטרינג או כל עסק אחר בתחום שירותי המזון, HDO Global Trade מספקת פתרונות אמינים המותאמים לצרכים שלכם. אנחנו מחויבים לתמוך במטבח שלכם עם:",
    seoWhyItems: [
      "משלוח בינלאומי מהיר: אספקת חלקים לכל מקום שבו אתם נמצאים.",
      "תמחור תחרותי: רכיבים איכותיים שמתאימים לתקציב שלכם.",
      "תמיכה מומחית: סיוע תחזוקה שוטף כדי שהמטבח שלכם יפעל בצורה חלקה.",
    ],
    seoCta: "מחפשים חלק ספציפי? צרו קשר עם HDO Global Trade עוד היום והחזירו את ציוד המטבח שלכם לפעולה במהירות וביעילות.",
  },
  de: {
    faqTitle: "Häufig gestellte Fragen",
    seeAllQuestions: "Alle Fragen ansehen",
    seoTitle: "Globaler Lieferant von Premium-Ersatzteilen für Industrieküchen",
    seoIntro: "Bei HDO Global Trade sind wir Ihr One-Stop-Shop für hochwertige Ersatzteile, Zubehör und Kleingeräte für gewerbliche Küchen. Wir sind spezialisiert auf die Lieferung wesentlicher Komponenten für eine breite Palette professioneller Küchengeräte.",
    seoSupplyHeading: "Was Wir Liefern",
    seoSupplyItems: [
      "Vorbereitungsgeräte: Entsafter, Mixer, Stabmixer (Handmixer), Planetenmixer, Gemüseschneider, Aufschnittmaschinen.",
      "Kochen und Backen: gewerbliche Öfen, Planetenmixer und Kochgeräte.",
      "Reinigung und Kühlung: professionelle Spülmaschinen und Kühlaggregate.",
    ],
    seoWhyHeading: "Im Dienst von Fachleuten Weltweit",
    seoWhyIntro: "Ob Sie ein Restaurant, Hotel, eine Bäckerei, einen Cateringservice oder ein anderes Gastronomieunternehmen betreiben, HDO Global Trade bietet zuverlässige Lösungen, die auf Ihre Bedürfnisse zugeschnitten sind. Wir sind bestrebt, Ihre Küche zu unterstützen mit:",
    seoWhyItems: [
      "Schnellem Internationalem Versand: Lieferung von Teilen, wohin auch immer Sie sie benötigen.",
      "Wettbewerbsfähigen Preisen: Qualitätskomponenten, die in Ihr Budget passen.",
      "Fachkundigem Support: laufende Wartungsunterstützung, damit Ihre Küche reibungslos läuft.",
    ],
    seoCta: "Suchen Sie ein bestimmtes Teil? Kontaktieren Sie HDO Global Trade noch heute und bringen Sie Ihre Küchengeräte schnell und effizient wieder in Betrieb.",
  },
  it: {
    faqTitle: "Domande Frequenti",
    seeAllQuestions: "Vedi tutte le domande",
    seoTitle: "Fornitore Globale di Ricambi Premium per Cucine Industriali",
    seoIntro: "In HDO Global Trade, siamo il vostro punto di riferimento unico per ricambi, accessori e piccoli elettrodomestici di alta qualità per cucine commerciali. Siamo specializzati nella fornitura di componenti essenziali per un'ampia gamma di attrezzature professionali da cucina.",
    seoSupplyHeading: "Cosa Forniamo",
    seoSupplyItems: [
      "Attrezzature di Preparazione: spremiagrumi, frullatori, frullatori a immersione (sbattitori manuali), impastatrici planetarie, taglialegumi, affettatrici.",
      "Cottura e Panificazione: forni commerciali, impastatrici planetarie e attrezzature per la cottura.",
      "Pulizia e Refrigerazione: lavastoviglie professionali e unità di refrigerazione.",
    ],
    seoWhyHeading: "Al Servizio di Professionisti in Tutto il Mondo",
    seoWhyIntro: "Che gestiate un ristorante, un hotel, un panificio, un servizio di catering o qualsiasi altra attività di ristorazione, HDO Global Trade offre soluzioni affidabili su misura per le vostre esigenze. Ci impegniamo a supportare la vostra cucina con:",
    seoWhyItems: [
      "Spedizioni Internazionali Rapide: consegna di ricambi ovunque vi troviate.",
      "Prezzi Competitivi: componenti di qualità adatti al vostro budget.",
      "Supporto Esperto: assistenza continua per la manutenzione, per mantenere la vostra cucina sempre efficiente.",
    ],
    seoCta: "Cercate un ricambio specifico? Contattate HDO Global Trade oggi e rimettete in funzione le vostre attrezzature da cucina in modo rapido ed efficiente.",
  },
};

export default function OurBrand() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const t = SECTION_TEXT[uiLang] || SECTION_TEXT.en;
  const isRtl = lang === "he";
  const faqs = getFeaturedFaqs(FAQS[lang] || FAQS.en);

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
          <FaqAccordion faqs={faqs} />
          <Link
            href="/faq"
            className="mt-4 inline-flex items-center gap-2 text-[#c41e3a] font-semibold text-sm hover:underline transition-colors"
          >
            {t.seeAllQuestions}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* RIGHT: HDO Trademark Image + structured SEO copy */}
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
          {t.seoIntro && (
            <p className="text-gray-600 text-sm leading-relaxed">{t.seoIntro}</p>
          )}
          {t.seoSupplyHeading && (
            <h4 className="font-semibold text-gray-900 text-sm mt-2">{t.seoSupplyHeading}</h4>
          )}
          {t.seoSupplyItems?.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm leading-relaxed">
              {t.seoSupplyItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {t.seoWhyHeading && (
            <h4 className="font-semibold text-gray-900 text-sm mt-2">{t.seoWhyHeading}</h4>
          )}
          {t.seoWhyIntro && (
            <p className="text-gray-600 text-sm leading-relaxed">{t.seoWhyIntro}</p>
          )}
          {t.seoWhyItems?.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm leading-relaxed">
              {t.seoWhyItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {t.seoCta && (
            <p className="text-gray-700 text-sm leading-relaxed font-medium">{t.seoCta}</p>
          )}
        </div>
      </div>
    </section>
  );
}
