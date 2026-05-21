// FAQPage JSON-LD — gives expandable FAQ rich snippets directly in Google search results
// These appear as dropdown accordions under your listing — takes up much more space = more clicks

export const FAQS = {
  en: [
    { q: "Do you ship spare parts worldwide?",
      a: "Yes, HDO Trade ships tested spare parts to customers worldwide with fast delivery and full tracking." },
    { q: "Are all spare parts tested before shipping?",
      a: "Every spare part sold under the HDO TRADE brand is tested by our technical team and passes strict quality control before shipping." },
    { q: "How can I find the right spare part for my machine?",
      a: "Search by manufacturer, category, or part name in our shop. If you can't find what you need, contact our import department via WhatsApp or email and we'll locate it for you." },
    { q: "What payment methods do you accept?",
      a: "We accept credit and debit cards, bank transfers, and PayPal. Currencies supported: EUR, USD, GBP." },
    { q: "How quickly do you respond to enquiries?",
      a: "Our WhatsApp support is available 24/7. Email enquiries receive a response within one business day." },
  ],
  pt: [
    { q: "Enviam peças sobresselentes para todo o mundo?",
      a: "Sim, a HDO Trade envia peças testadas para clientes em todo o mundo com entrega rápida e rastreamento completo." },
    { q: "Todas as peças são testadas antes do envio?",
      a: "Cada peça vendida sob a marca HDO TRADE é testada pela nossa equipa técnica e passa por controlo de qualidade rigoroso." },
    { q: "Como posso encontrar a peça certa para a minha máquina?",
      a: "Pesquise por fabricante, categoria ou nome da peça na nossa loja. Se não encontrar, contacte-nos por WhatsApp ou email." },
    { q: "Que métodos de pagamento aceitam?",
      a: "Aceitamos cartões de crédito e débito, transferências bancárias e PayPal. Moedas: EUR, USD, GBP." },
    { q: "Quão rápido respondem a pedidos?",
      a: "O nosso suporte por WhatsApp está disponível 24/7. Emails recebem resposta num dia útil." },
  ],
  de: [
    { q: "Versenden Sie Ersatzteile weltweit?",
      a: "Ja, HDO Trade versendet geprüfte Ersatzteile weltweit mit schneller Lieferung und vollständiger Sendungsverfolgung." },
    { q: "Werden alle Ersatzteile vor dem Versand getestet?",
      a: "Jedes unter der Marke HDO TRADE verkaufte Ersatzteil wird von unserem technischen Team getestet und durchläuft eine strenge Qualitätskontrolle." },
    { q: "Wie finde ich das richtige Ersatzteil für meine Maschine?",
      a: "Suchen Sie in unserem Shop nach Hersteller, Kategorie oder Teilenamen. Unser Import-Team hilft Ihnen per WhatsApp oder E-Mail." },
    { q: "Welche Zahlungsmethoden akzeptieren Sie?",
      a: "Wir akzeptieren Kredit- und Debitkarten, Banküberweisungen und PayPal. Währungen: EUR, USD, GBP." },
    { q: "Wie schnell antworten Sie auf Anfragen?",
      a: "Unser WhatsApp-Support ist 24/7 verfügbar. E-Mails werden innerhalb eines Werktages beantwortet." },
  ],
  fr: [
    { q: "Expédiez-vous les pièces dans le monde entier?",
      a: "Oui, HDO Trade expédie des pièces testées dans le monde entier avec livraison rapide et suivi complet." },
    { q: "Toutes les pièces sont-elles testées avant expédition?",
      a: "Chaque pièce vendue sous la marque HDO TRADE est testée par notre équipe technique et passe un contrôle qualité strict." },
    { q: "Comment trouver la bonne pièce pour ma machine?",
      a: "Recherchez par fabricant, catégorie ou nom de pièce dans notre boutique. Notre équipe vous aide par WhatsApp ou email." },
    { q: "Quels modes de paiement acceptez-vous?",
      a: "Nous acceptons les cartes bancaires, virements et PayPal. Devises: EUR, USD, GBP." },
    { q: "Quel est le délai de réponse?",
      a: "Notre support WhatsApp est disponible 24/7. Les emails reçoivent une réponse en un jour ouvrable." },
  ],
  es: [
    { q: "¿Envían repuestos a todo el mundo?",
      a: "Sí, HDO Trade envía repuestos testados globalmente con entrega rápida y seguimiento completo." },
    { q: "¿Todos los repuestos se prueban antes del envío?",
      a: "Cada repuesto vendido bajo la marca HDO TRADE es probado por nuestro equipo técnico y pasa un control de calidad estricto." },
    { q: "¿Cómo encuentro el repuesto correcto para mi máquina?",
      a: "Busque por fabricante, categoría o nombre en nuestra tienda. Nuestro equipo le ayuda por WhatsApp o email." },
    { q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos tarjetas, transferencias bancarias y PayPal. Monedas: EUR, USD, GBP." },
    { q: "¿Cuánto tardan en responder?",
      a: "Nuestro soporte WhatsApp está disponible 24/7. Los emails reciben respuesta en un día hábil." },
  ],
  he: [
    { q: "האם אתם שולחים חלקי חילוף לכל העולם?",
      a: "כן, HDO Trade שולחת חלקי חילוף מבוקרים לכל העולם עם משלוח מהיר ומעקב מלא." },
    { q: "האם כל חלקי החילוף נבדקים לפני המשלוח?",
      a: "כל חלק חילוף נבדק על ידי הצוות הטכני שלנו ועובר בקרת איכות קפדנית לפני המשלוח." },
    { q: "איך אני מוצא את החלק הנכון?",
      a: "חפשו לפי יצרן, קטגוריה או שם החלק בחנות שלנו. אם לא מצאתם — פנו אלינו בוואטסאפ או באימייל." },
    { q: "אילו אמצעי תשלום אתם מקבלים?",
      a: "אנו מקבלים כרטיסי אשראי, העברות בנקאיות ו-PayPal. מטבעות: EUR, USD, GBP." },
    { q: "תוך כמה זמן אתם מגיבים?",
      a: "תמיכת הוואטסאפ זמינה 24/7. אימיילים מקבלים מענה תוך יום עסקים." },
  ],
};

export default function FAQSchema({ lang = "en" }) {
  const faqs = FAQS[lang] || FAQS.en;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
