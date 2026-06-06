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
    heading2: "Spare Parts & Accessories for the Commercial Kitchen",
    p1: "HDO Global Trade specializes in expert sourcing for commercial kitchen machinery. We aren't just a supplier; we are your dedicated technical partner. Our experts leverage deep industry knowledge to identify the exact OEM or aftermarket spare parts you need, helping you minimize costly downtime and extend the life of your equipment.",
    p2: "We believe that behind every successful kitchen is machinery that never misses a beat. That's why we combine a vast global supply network with a personal touch — when you reach out, you're speaking to professionals who understand your equipment. With fast international shipping and a commitment to technical precision, we ensure your kitchen stays operational, efficient, and profitable — no matter where you are in the world.",
    note: "Don't let your equipment downtime hurt your business. Contact our expert team on email, phone, or WhatsApp today, and let us find the exact part you need to get back to full operation.",
    badge1: "Contact our customer service by WhatsApp",
    badge2: "Contact our customer service by Email",
  },
  pt: {
    heading1: "A Sua Loja Única para",
    heading2: "Peças e Acessórios para a Cozinha Comercial",
    p1: "A HDO Global Trade é especialista no fornecimento de peças para maquinaria de cozinha comercial. Não somos apenas um fornecedor — somos o seu parceiro técnico dedicado. Os nossos especialistas utilizam um profundo conhecimento do setor para identificar as peças sobresselentes OEM ou alternativas de que necessita, ajudando-o a minimizar paragens dispendiosas e a prolongar a vida útil do seu equipamento.",
    p2: "Acreditamos que por trás de cada cozinha de sucesso está maquinaria que nunca falha. Por isso, combinamos uma vasta rede global de fornecimento com um toque pessoal — quando nos contacta, está a falar com profissionais que compreendem o seu equipamento. Com envio internacional rápido e um compromisso com a precisão técnica, garantimos que a sua cozinha se mantém operacional, eficiente e rentável — independentemente de onde esteja no mundo.",
    note: "Não deixe que as paragens do equipamento prejudiquem o seu negócio. Contacte a nossa equipa especializada por email, telefone ou WhatsApp e deixe-nos encontrar a peça exata de que precisa para voltar à plena operação.",
    badge1: "Contate nosso atendimento pelo WhatsApp",
    badge2: "Contate nosso atendimento pelo E-mail",
  },
  fr: {
    heading1: "Votre Boutique Unique pour",
    heading2: "Pièces Détachées et Accessoires pour la Cuisine Commerciale",
    p1: "HDO Global Trade est spécialisé dans l'approvisionnement expert en machines de cuisine commerciale. Nous ne sommes pas qu'un simple fournisseur — nous sommes votre partenaire technique dédié. Nos experts s'appuient sur une connaissance approfondie du secteur pour identifier les pièces détachées OEM ou alternatives exactes dont vous avez besoin, vous aidant à minimiser les temps d'arrêt coûteux et à prolonger la durée de vie de vos équipements.",
    p2: "Nous croyons que derrière chaque cuisine performante se trouve une machinerie qui ne manque jamais un battement. C'est pourquoi nous combinons un vaste réseau d'approvisionnement mondial avec une touche personnelle — lorsque vous nous contactez, vous parlez à des professionnels qui comprennent vos équipements. Avec une livraison internationale rapide et un engagement envers la précision technique, nous garantissons que votre cuisine reste opérationnelle, efficace et rentable — où que vous soyez dans le monde.",
    note: "Ne laissez pas les pannes d'équipement nuire à votre activité. Contactez notre équipe d'experts par email, téléphone ou WhatsApp dès aujourd'hui et laissez-nous trouver la pièce exacte dont vous avez besoin pour reprendre la pleine activité.",
    badge1: "Contactez notre service par WhatsApp",
    badge2: "Contactez notre service par E-mail",
  },
  es: {
    heading1: "Tu Tienda Única para",
    heading2: "Repuestos y Accesorios para la Cocina Comercial",
    p1: "HDO Global Trade se especializa en el suministro experto de maquinaria de cocina comercial. No somos solo un proveedor — somos su socio técnico dedicado. Nuestros expertos aprovechan un profundo conocimiento del sector para identificar los repuestos OEM o alternativos exactos que necesita, ayudándole a minimizar costosos tiempos de inactividad y a prolongar la vida útil de su equipo.",
    p2: "Creemos que detrás de cada cocina exitosa hay maquinaria que nunca falla. Por eso combinamos una amplia red global de suministro con un toque personal — cuando se pone en contacto con nosotros, habla con profesionales que entienden su equipo. Con envío internacional rápido y un compromiso con la precisión técnica, garantizamos que su cocina se mantenga operativa, eficiente y rentable — sin importar dónde se encuentre en el mundo.",
    note: "No deje que el tiempo de inactividad del equipo perjudique su negocio. Contacte a nuestro equipo de expertos por email, teléfono o WhatsApp hoy mismo y permítanos encontrar el repuesto exacto que necesita para volver a la plena operación.",
    badge1: "Contacte a nuestro servicio por WhatsApp",
    badge2: "Contacte a nuestro servicio por E-mail",
  },
  he: {
    heading1: "החנות המושלמת שלכם ל",
    heading2: "חלקי חילוף ואביזרים למטבח המסחרי",
    p1: "HDO Global Trade מתמחה באספקת חלקי חילוף למכונות מטבח מסחרי. אנחנו לא סתם ספק — אנחנו השותף הטכני המסור שלכם. המומחים שלנו משתמשים בידע מעמיק בתעשייה כדי לזהות את חלקי החילוף המקוריים (OEM) או התואמים המדויקים שאתם צריכים, ועוזרים לכם למזער השבתות יקרות ולהאריך את חיי הציוד שלכם.",
    p2: "אנחנו מאמינים שמאחורי כל מטבח מצליח עומדת מכונה שלעולם לא נכשלת. לכן אנחנו משלבים רשת אספקה עולמית רחבה עם מגע אישי — כשאתם פונים אלינו, אתם מדברים עם אנשי מקצוע שמבינים את הציוד שלכם. עם משלוח בינלאומי מהיר ומחויבות לדיוק טכני, אנחנו מבטיחים שהמטבח שלכם יישאר פעיל, יעיל ורווחי — לא משנה היכן אתם בעולם.",
    note: "אל תתנו להשבתת ציוד לפגוע בעסק שלכם. צרו קשר עם צוות המומחים שלנו באימייל, בטלפון או בוואטסאפ עוד היום, ותנו לנו למצוא את החלק המדויק שאתם צריכים כדי לחזור לפעילות מלאה.",
    badge1: "צרו קשר עם שירות הלקוחות שלנו בוואטסאפ",
    badge2: "צרו קשר עם שירות הלקוחות שלנו במייל",
  },
  de: {
    heading1: "Ihr One-Stop-Shop für",
    heading2: "Ersatzteile und Zubehör für die Gewerbeküche",
    p1: "HDO Global Trade ist spezialisiert auf die fachkundige Beschaffung von Ersatzteilen für gewerbliche Küchenmaschinen. Wir sind nicht nur ein Lieferant — wir sind Ihr engagierter technischer Partner. Unsere Experten nutzen tiefgreifendes Branchenwissen, um genau die OEM- oder kompatiblen Ersatzteile zu identifizieren, die Sie benötigen, und helfen Ihnen dabei, kostspielige Ausfallzeiten zu minimieren und die Lebensdauer Ihrer Geräte zu verlängern.",
    p2: "Wir glauben, dass hinter jeder erfolgreichen Küche Maschinen stehen, die niemals ausfallen. Deshalb kombinieren wir ein umfassendes globales Liefernetzwerk mit persönlicher Betreuung — wenn Sie sich an uns wenden, sprechen Sie mit Fachleuten, die Ihre Geräte verstehen. Mit schnellem internationalem Versand und einem Engagement für technische Präzision stellen wir sicher, dass Ihre Küche betriebsbereit, effizient und profitabel bleibt — egal wo auf der Welt Sie sich befinden.",
    note: "Lassen Sie nicht zu, dass Geräteausfälle Ihrem Geschäft schaden. Kontaktieren Sie noch heute unser Expertenteam per E-Mail, Telefon oder WhatsApp und lassen Sie uns das genaue Ersatzteil finden, das Sie benötigen, um den vollen Betrieb wiederherzustellen.",
    badge1: "Kontaktieren Sie unseren Kundenservice per WhatsApp",
    badge2: "Kontaktieren Sie unseren Kundenservice per E-Mail",
  },
  it: {
    heading1: "Il Vostro Punto di Riferimento per",
    heading2: "Ricambi e Accessori per la Cucina Commerciale",
    p1: "HDO Global Trade è specializzata nell'approvvigionamento esperto di macchinari per cucine commerciali. Non siamo solo un fornitore — siamo il vostro partner tecnico dedicato. I nostri esperti sfruttano una profonda conoscenza del settore per identificare i ricambi OEM o aftermarket esatti di cui avete bisogno, aiutandovi a ridurre al minimo i costosi tempi di fermo e a prolungare la vita delle vostre attrezzature.",
    p2: "Crediamo che dietro ogni cucina di successo ci siano macchinari che non perdono mai un colpo. Ecco perché combiniamo una vasta rete di approvvigionamento globale con un tocco personale — quando ci contattate, parlate con professionisti che comprendono le vostre attrezzature. Con spedizioni internazionali rapide e un impegno per la precisione tecnica, garantiamo che la vostra cucina resti operativa, efficiente e redditizia — ovunque voi siate nel mondo.",
    note: "Non lasciate che i tempi di fermo delle attrezzature danneggino la vostra attività. Contattate il nostro team di esperti via email, telefono o WhatsApp oggi stesso e lasciateci trovare il ricambio esatto di cui avete bisogno per tornare alla piena operatività.",
    badge1: "Contattate il nostro servizio clienti su WhatsApp",
    badge2: "Contattate il nostro servizio clienti via Email",
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
