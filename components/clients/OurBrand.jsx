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
    seoTitle: "Your One-Stop Shop for Industrial Kitchen Spare Parts",
    seoText: `HDO Global Trade specializes in expert sourcing for commercial kitchen machinery. We aren't just a supplier; we are your dedicated technical partner. Our experts leverage deep industry knowledge to identify the exact OEM or aftermarket spare parts you need, helping you minimize costly downtime and extend the life of your equipment.

We believe that behind every successful kitchen is machinery that never misses a beat. That's why we combine a vast global supply network with a personal touch — when you reach out, you're speaking to professionals who understand your equipment. With fast international shipping and a commitment to technical precision, we ensure your kitchen stays operational, efficient, and profitable — no matter where you are in the world.

Don't let equipment downtime hurt your business. Contact our expert team via email, phone, or WhatsApp today, and let us find the exact part you need to get back to full operation.`,
  },
  pt: {
    faqTitle: "Perguntas Frequentes",
    seoTitle: "A Sua Loja Única para Peças de Cozinha Industrial",
    seoText: `A HDO Global Trade é especialista no fornecimento de peças para maquinaria de cozinha comercial. Não somos apenas um fornecedor — somos o seu parceiro técnico dedicado. Os nossos especialistas utilizam um profundo conhecimento do setor para identificar as peças sobresselentes OEM ou alternativas de que necessita, ajudando-o a minimizar paragens dispendiosas e a prolongar a vida útil do seu equipamento.

Acreditamos que por trás de cada cozinha de sucesso está maquinaria que nunca falha. Por isso, combinamos uma vasta rede global de fornecimento com um toque pessoal — quando nos contacta, está a falar com profissionais que compreendem o seu equipamento. Com envio internacional rápido e um compromisso com a precisão técnica, garantimos que a sua cozinha se mantém operacional, eficiente e rentável — independentemente de onde esteja no mundo.

Não deixe que as paragens do equipamento prejudiquem o seu negócio. Contacte a nossa equipa especializada por email, telefone ou WhatsApp e deixe-nos encontrar a peça exata de que precisa para voltar à plena operação.`,
  },
  fr: {
    faqTitle: "Questions Fréquentes",
    seoTitle: "Votre Boutique Unique pour Pièces de Cuisine Industrielle",
    seoText: `HDO Global Trade est spécialisé dans l'approvisionnement expert en machines de cuisine commerciale. Nous ne sommes pas qu'un simple fournisseur — nous sommes votre partenaire technique dédié. Nos experts s'appuient sur une connaissance approfondie du secteur pour identifier les pièces détachées OEM ou alternatives exactes dont vous avez besoin, vous aidant à minimiser les temps d'arrêt coûteux et à prolonger la durée de vie de vos équipements.

Nous croyons que derrière chaque cuisine performante se trouve une machinerie qui ne manque jamais un battement. C'est pourquoi nous combinons un vaste réseau d'approvisionnement mondial avec une touche personnelle — lorsque vous nous contactez, vous parlez à des professionnels qui comprennent vos équipements. Avec une livraison internationale rapide et un engagement envers la précision technique, nous garantissons que votre cuisine reste opérationnelle, efficace et rentable — où que vous soyez dans le monde.

Ne laissez pas les pannes d'équipement nuire à votre activité. Contactez notre équipe d'experts par email, téléphone ou WhatsApp dès aujourd'hui et laissez-nous trouver la pièce exacte dont vous avez besoin pour reprendre la pleine activité.`,
  },
  es: {
    faqTitle: "Preguntas Frecuentes",
    seoTitle: "Tu Tienda Única para Repuestos de Cocina Industrial",
    seoText: `HDO Global Trade se especializa en el suministro experto de maquinaria de cocina comercial. No somos solo un proveedor — somos su socio técnico dedicado. Nuestros expertos aprovechan un profundo conocimiento del sector para identificar los repuestos OEM o alternativos exactos que necesita, ayudándole a minimizar costosos tiempos de inactividad y a prolongar la vida útil de su equipo.

Creemos que detrás de cada cocina exitosa hay maquinaria que nunca falla. Por eso combinamos una amplia red global de suministro con un toque personal — cuando se pone en contacto con nosotros, habla con profesionales que entienden su equipo. Con envío internacional rápido y un compromiso con la precisión técnica, garantizamos que su cocina se mantenga operativa, eficiente y rentable — sin importar dónde se encuentre en el mundo.

No deje que el tiempo de inactividad del equipo perjudique su negocio. Contacte a nuestro equipo de expertos por email, teléfono o WhatsApp hoy mismo y permítanos encontrar el repuesto exacto que necesita para volver a la plena operación.`,
  },
  he: {
    faqTitle: "שאלות נפוצות",
    seoTitle: "החנות המושלמת שלכם לחלקי חילוף למטבח תעשייתי",
    seoText: `HDO Global Trade מתמחה באספקת חלקי חילוף למכונות מטבח מסחרי. אנחנו לא סתם ספק — אנחנו השותף הטכני המסור שלכם. המומחים שלנו משתמשים בידע מעמיק בתעשייה כדי לזהות את חלקי החילוף המקוריים (OEM) או התואמים המדויקים שאתם צריכים, ועוזרים לכם למזער השבתות יקרות ולהאריך את חיי הציוד שלכם.

אנחנו מאמינים שמאחורי כל מטבח מצליח עומדת מכונה שלעולם לא נכשלת. לכן אנחנו משלבים רשת אספקה עולמית רחבה עם מגע אישי — כשאתם פונים אלינו, אתם מדברים עם אנשי מקצוע שמבינים את הציוד שלכם. עם משלוח בינלאומי מהיר ומחויבות לדיוק טכני, אנחנו מבטיחים שהמטבח שלכם יישאר פעיל, יעיל ורווחי — לא משנה היכן אתם בעולם.

אל תתנו להשבתת ציוד לפגוע בעסק שלכם. צרו קשר עם צוות המומחים שלנו באימייל, בטלפון או בוואטסאפ עוד היום, ותנו לנו למצוא את החלק המדויק שאתם צריכים כדי לחזור לפעילות מלאה.`,
  },
  de: {
    faqTitle: "Häufig gestellte Fragen",
    seoTitle: "Ihr One-Stop-Shop für Industrieküchen-Ersatzteile",
    seoText: `HDO Global Trade ist spezialisiert auf die fachkundige Beschaffung von Ersatzteilen für gewerbliche Küchenmaschinen. Wir sind nicht nur ein Lieferant — wir sind Ihr engagierter technischer Partner. Unsere Experten nutzen tiefgreifendes Branchenwissen, um genau die OEM- oder kompatiblen Ersatzteile zu identifizieren, die Sie benötigen, und helfen Ihnen dabei, kostspielige Ausfallzeiten zu minimieren und die Lebensdauer Ihrer Geräte zu verlängern.

Wir glauben, dass hinter jeder erfolgreichen Küche Maschinen stehen, die niemals ausfallen. Deshalb kombinieren wir ein umfassendes globales Liefernetzwerk mit persönlicher Betreuung — wenn Sie sich an uns wenden, sprechen Sie mit Fachleuten, die Ihre Geräte verstehen. Mit schnellem internationalem Versand und einem Engagement für technische Präzision stellen wir sicher, dass Ihre Küche betriebsbereit, effizient und profitabel bleibt — egal wo auf der Welt Sie sich befinden.

Lassen Sie nicht zu, dass Geräteausfälle Ihrem Geschäft schaden. Kontaktieren Sie noch heute unser Expertenteam per E-Mail, Telefon oder WhatsApp und lassen Sie uns das genaue Ersatzteil finden, das Sie benötigen, um den vollen Betrieb wiederherzustellen.`,
  },
  it: {
    faqTitle: "Domande Frequenti",
    seoTitle: "Il Vostro Punto di Riferimento per Ricambi per Cucine Industriali",
    seoText: `HDO Global Trade è specializzata nell'approvvigionamento esperto di macchinari per cucine commerciali. Non siamo solo un fornitore — siamo il vostro partner tecnico dedicato. I nostri esperti sfruttano una profonda conoscenza del settore per identificare i ricambi OEM o aftermarket esatti di cui avete bisogno, aiutandovi a ridurre al minimo i costosi tempi di fermo e a prolungare la vita delle vostre attrezzature.

Crediamo che dietro ogni cucina di successo ci siano macchinari che non perdono mai un colpo. Ecco perché combiniamo una vasta rete di approvvigionamento globale con un tocco personale — quando ci contattate, parlate con professionisti che comprendono le vostre attrezzature. Con spedizioni internazionali rapide e un impegno per la precisione tecnica, garantiamo che la vostra cucina resti operativa, efficiente e redditizia — ovunque voi siate nel mondo.

Non lasciate che i tempi di fermo delle attrezzature danneggino la vostra attività. Contattate il nostro team di esperti via email, telefono o WhatsApp oggi stesso e lasciateci trovare il ricambio esatto di cui avete bisogno per tornare alla piena operatività.`,
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


