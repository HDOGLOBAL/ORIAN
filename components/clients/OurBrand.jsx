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
    seoText: `At HDO Global Trade, we are your one stop shop for high quality commercial kitchen spare parts, accessories, and small appliances.

We specialize in supplying essential components for a wide range of professional kitchen equipment. Our extensive inventory ensures you can find the right part for any machine, including:

Prep Equipment: juicers, blenders, immersion blenders (hand mixers), planetary mixers, vegetable cutters, slicers.

Cooking & Bakery: commercial ovens, planetary mixers, and cooking equipment.

Cleaning & Cooling: professional dishwashers and refrigeration units.

Serving Professionals Worldwide — Whether you operate a restaurant, hotel, bakery, catering service, or any other food service business, HDO Global Trade provides reliable solutions tailored to your needs. We are committed to supporting your kitchen with:

Fast International Shipping: delivering parts wherever you are.

Competitive Pricing: quality components that fit your budget.

Expert Support: ongoing maintenance assistance to keep your kitchen running smoothly.

Need a specific part? Contact HDO Global Trade today and get your kitchen equipment back in operation quickly and efficiently.`,
  },
  pt: {
    faqTitle: "Perguntas Frequentes",
    seoTitle: "Fornecedor Global de Peças Premium para Cozinhas Industriais",
    seoText: `Na HDO Global Trade, somos a sua loja única para peças sobresselentes, acessórios e pequenos eletrodomésticos de alta qualidade para cozinhas comerciais.

Especializamo-nos no fornecimento de componentes essenciais para uma vasta gama de equipamentos profissionais de cozinha. O nosso extenso inventário garante que encontra a peça certa para qualquer máquina, incluindo:

Equipamento de Preparação: espremidores, liquidificadores, batedoras de imersão (batedoras de mão), batedoras planetárias, cortadores de legumes, fatiadores.

Cozedura e Pastelaria: fornos comerciais, batedoras planetárias e equipamento de cozinha.

Limpeza e Refrigeração: máquinas de lavar loiça profissionais e unidades de refrigeração.

Ao Serviço de Profissionais em Todo o Mundo — Quer opere um restaurante, hotel, padaria, serviço de catering ou qualquer outro negócio de serviços alimentares, a HDO Global Trade fornece soluções fiáveis adaptadas às suas necessidades. Estamos empenhados em apoiar a sua cozinha com:

Envio Internacional Rápido: entrega de peças onde quer que esteja.

Preços Competitivos: componentes de qualidade que cabem no seu orçamento.

Suporte Especializado: assistência contínua de manutenção para manter a sua cozinha a funcionar sem problemas.

Precisa de uma peça específica? Contacte a HDO Global Trade hoje e coloque o seu equipamento de cozinha novamente em funcionamento de forma rápida e eficiente.`,
  },
  fr: {
    faqTitle: "Questions Fréquentes",
    seoTitle: "Fournisseur Mondial de Pièces Premium pour Cuisines Industrielles",
    seoText: `Chez HDO Global Trade, nous sommes votre guichet unique pour des pièces détachées, accessoires et petits appareils de haute qualité pour cuisines commerciales.

Nous sommes spécialisés dans la fourniture de composants essentiels pour une large gamme d'équipements de cuisine professionnelle. Notre vaste inventaire vous garantit de trouver la bonne pièce pour chaque machine, notamment :

Équipement de Préparation : presse-agrumes, mixeurs, mixeurs plongeants (batteurs à main), batteurs planétaires, coupe-légumes, trancheurs.

Cuisson et Boulangerie : fours commerciaux, batteurs planétaires et équipements de cuisson.

Nettoyage et Réfrigération : lave-vaisselle professionnels et unités de réfrigération.

Au Service des Professionnels du Monde Entier — Que vous exploitiez un restaurant, un hôtel, une boulangerie, un service de restauration ou tout autre établissement de restauration, HDO Global Trade propose des solutions fiables adaptées à vos besoins. Nous nous engageons à soutenir votre cuisine avec :

Livraison Internationale Rapide : livraison de pièces où que vous soyez.

Prix Compétitifs : des composants de qualité adaptés à votre budget.

Support Expert : une assistance maintenance continue pour que votre cuisine fonctionne sans accroc.

Vous cherchez une pièce spécifique ? Contactez HDO Global Trade aujourd'hui et remettez votre équipement de cuisine en service rapidement et efficacement.`,
  },
  es: {
    faqTitle: "Preguntas Frecuentes",
    seoTitle: "Proveedor Global de Repuestos Premium para Cocinas Industriales",
    seoText: `En HDO Global Trade, somos su tienda única para repuestos, accesorios y pequeños electrodomésticos de alta calidad para cocinas comerciales.

Nos especializamos en el suministro de componentes esenciales para una amplia gama de equipos profesionales de cocina. Nuestro extenso inventario le garantiza encontrar la pieza adecuada para cualquier máquina, incluyendo:

Equipo de Preparación: exprimidores, licuadoras, batidoras de inmersión (batidoras de mano), batidoras planetarias, cortadoras de verduras, cortafiambres.

Cocción y Panadería: hornos comerciales, batidoras planetarias y equipos de cocción.

Limpieza y Refrigeración: lavavajillas profesionales y unidades de refrigeración.

Al Servicio de Profesionales en Todo el Mundo — Ya sea que opere un restaurante, hotel, panadería, servicio de catering o cualquier otro negocio de servicios alimentarios, HDO Global Trade ofrece soluciones fiables adaptadas a sus necesidades. Estamos comprometidos a apoyar su cocina con:

Envío Internacional Rápido: entrega de piezas dondequiera que esté.

Precios Competitivos: componentes de calidad que se ajustan a su presupuesto.

Soporte Experto: asistencia continua de mantenimiento para que su cocina funcione sin problemas.

¿Necesita una pieza específica? Contacte a HDO Global Trade hoy y ponga su equipo de cocina en funcionamiento de manera rápida y eficiente.`,
  },
  he: {
    faqTitle: "שאלות נפוצות",
    seoTitle: "ספק עולמי של חלקי חילוף פרימיום למטבחים תעשייתיים",
    seoText: `ב-HDO Global Trade, אנחנו החנות המושלמת שלכם לחלקי חילוף, אביזרים ומכשירים קטנים איכותיים למטבחים מסחריים.

אנחנו מתמחים באספקת רכיבים חיוניים למגוון רחב של ציוד מטבח מקצועי. המלאי הנרחב שלנו מבטיח שתמצאו את החלק הנכון לכל מכונה, כולל:

ציוד הכנה: סוחטים, בלנדרים, בלנדרים ידניים (מקצפות יד), מיקסרים פלנטריים, חותכי ירקות, פורסים.

בישול ואפייה: תנורים מסחריים, מיקסרים פלנטריים וציוד בישול.

ניקיון וקירור: מדיחי כלים מקצועיים ויחידות קירור.

בשירות אנשי מקצוע ברחבי העולם — בין אם אתם מפעילים מסעדה, מלון, מאפייה, שירות קייטרינג או כל עסק אחר בתחום שירותי המזון, HDO Global Trade מספקת פתרונות אמינים המותאמים לצרכים שלכם. אנחנו מחויבים לתמוך במטבח שלכם עם:

משלוח בינלאומי מהיר: אספקת חלקים לכל מקום שבו אתם נמצאים.

תמחור תחרותי: רכיבים איכותיים שמתאימים לתקציב שלכם.

תמיכה מומחית: סיוע תחזוקה שוטף כדי שהמטבח שלכם יפעל בצורה חלקה.

מחפשים חלק ספציפי? צרו קשר עם HDO Global Trade עוד היום והחזירו את ציוד המטבח שלכם לפעולה במהירות וביעילות.`,
  },
  de: {
    faqTitle: "Häufig gestellte Fragen",
    seoTitle: "Globaler Lieferant von Premium-Ersatzteilen für Industrieküchen",
    seoText: `Bei HDO Global Trade sind wir Ihr One-Stop-Shop für hochwertige Ersatzteile, Zubehör und Kleingeräte für gewerbliche Küchen.

Wir sind spezialisiert auf die Lieferung wesentlicher Komponenten für eine breite Palette professioneller Küchengeräte. Unser umfangreiches Sortiment stellt sicher, dass Sie das richtige Teil für jede Maschine finden, darunter:

Vorbereitungsgeräte: Entsafter, Mixer, Stabmixer (Handmixer), Planetenmixer, Gemüseschneider, Aufschnittmaschinen.

Kochen und Backen: gewerbliche Öfen, Planetenmixer und Kochgeräte.

Reinigung und Kühlung: professionelle Spülmaschinen und Kühlaggregate.

Im Dienst von Fachleuten Weltweit — Ob Sie ein Restaurant, Hotel, eine Bäckerei, einen Cateringservice oder ein anderes Gastronomieunternehmen betreiben, HDO Global Trade bietet zuverlässige Lösungen, die auf Ihre Bedürfnisse zugeschnitten sind. Wir sind bestrebt, Ihre Küche zu unterstützen mit:

Schnellem Internationalem Versand: Lieferung von Teilen, wohin auch immer Sie sie benötigen.

Wettbewerbsfähigen Preisen: Qualitätskomponenten, die in Ihr Budget passen.

Fachkundigem Support: laufende Wartungsunterstützung, damit Ihre Küche reibungslos läuft.

Suchen Sie ein bestimmtes Teil? Kontaktieren Sie HDO Global Trade noch heute und bringen Sie Ihre Küchengeräte schnell und effizient wieder in Betrieb.`,
  },
  it: {
    faqTitle: "Domande Frequenti",
    seoTitle: "Fornitore Globale di Ricambi Premium per Cucine Industriali",
    seoText: `In HDO Global Trade, siamo il vostro punto di riferimento unico per ricambi, accessori e piccoli elettrodomestici di alta qualità per cucine commerciali.

Siamo specializzati nella fornitura di componenti essenziali per un'ampia gamma di attrezzature professionali da cucina. Il nostro vasto inventario vi garantisce di trovare il ricambio giusto per qualsiasi macchina, tra cui:

Attrezzature di Preparazione: spremiagrumi, frullatori, frullatori a immersione (sbattitori manuali), impastatrici planetarie, taglialegumi, affettatrici.

Cottura e Panificazione: forni commerciali, impastatrici planetarie e attrezzature per la cottura.

Pulizia e Refrigerazione: lavastoviglie professionali e unità di refrigerazione.

Al Servizio di Professionisti in Tutto il Mondo — Che gestiate un ristorante, un hotel, un panificio, un servizio di catering o qualsiasi altra attività di ristorazione, HDO Global Trade offre soluzioni affidabili su misura per le vostre esigenze. Ci impegniamo a supportare la vostra cucina con:

Spedizioni Internazionali Rapide: consegna di ricambi ovunque vi troviate.

Prezzi Competitivi: componenti di qualità adatti al vostro budget.

Supporto Esperto: assistenza continua per la manutenzione, per mantenere la vostra cucina sempre efficiente.

Cercate un ricambio specifico? Contattate HDO Global Trade oggi e rimettete in funzione le vostre attrezzature da cucina in modo rapido ed efficiente.`,
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


