import Link from "next/link";
import FaqAccordion from "@/components/clients/FaqAccordion";
import FAQSchema, { FAQS } from "@/components/seo/FAQSchema";
import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("faq", lang, domain);
}

const PAGE_TEXT = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about ordering spare parts from HDO Trade.",
    contact: "Still have questions? Contact us and we'll help you find the right part.",
    contactLink: "Contact us",
  },
  pt: {
    title: "Perguntas Frequentes",
    subtitle: "Tudo o que precisa de saber sobre encomendar peças sobresselentes na HDO Trade.",
    contact: "Ainda tem dúvidas? Contacte-nos e ajudamo-lo a encontrar a peça certa.",
    contactLink: "Contacte-nos",
  },
  fr: {
    title: "Questions Fréquentes",
    subtitle: "Tout ce qu'il faut savoir sur la commande de pièces détachées chez HDO Trade.",
    contact: "Encore des questions ? Contactez-nous et nous vous aiderons à trouver la bonne pièce.",
    contactLink: "Contactez-nous",
  },
  es: {
    title: "Preguntas Frecuentes",
    subtitle: "Todo lo que necesita saber sobre pedir repuestos en HDO Trade.",
    contact: "¿Todavía tiene preguntas? Contáctenos y le ayudaremos a encontrar la pieza correcta.",
    contactLink: "Contáctenos",
  },
  he: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שצריך לדעת על הזמנת חלקי חילוף מ-HDO Trade.",
    contact: "עדיין יש שאלות? צרו קשר ונעזור לכם למצוא את החלק הנכון.",
    contactLink: "צרו קשר",
  },
  de: {
    title: "Häufig gestellte Fragen",
    subtitle: "Alles, was Sie über die Bestellung von Ersatzteilen bei HDO Trade wissen müssen.",
    contact: "Noch Fragen? Kontaktieren Sie uns – wir helfen Ihnen, das richtige Teil zu finden.",
    contactLink: "Kontaktieren Sie uns",
  },
  it: {
    title: "Domande Frequenti",
    subtitle: "Tutto quello che c'è da sapere sull'ordine di ricambi presso HDO Trade.",
    contact: "Ancora domande? Contattateci e vi aiuteremo a trovare il ricambio giusto.",
    contactLink: "Contattateci",
  },
};

export default async function FaqPage() {
  const lang = await getRequestLanguage();
  const t = PAGE_TEXT[lang] || PAGE_TEXT.en;
  const faqs = FAQS[lang] || FAQS.en;
  const isRtl = lang === "he";

  return (
    <>
      <FAQSchema lang={lang} />
      <section className="w-full max-w-[1280px] mx-auto px-4 py-10" dir={isRtl ? "rtl" : "ltr"}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {t.title}
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-8">{t.subtitle}</p>
        <FaqAccordion faqs={faqs} />
        <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
          <p className="text-gray-700 text-sm md:text-base mb-3">{t.contact}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#c41e3a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#a31830] transition-colors"
          >
            {t.contactLink}
          </Link>
        </div>
      </section>
    </>
  );
}
