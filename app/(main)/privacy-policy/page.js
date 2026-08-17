import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";
import { getUiLanguage } from "@/utils/uiLanguage";

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("privacy", lang, domain);
}

export default async function PrivacyPolicyPage() {
  const lang = await getRequestLanguage();
  const uiLang = getUiLanguage(lang);

  const textMap = {
    title: {
      pt: "Política de Privacidade",
      fr: "Politique de Confidentialité",
      es: "Política de Privacidad",
      en: "Privacy Policy",
      he: "מדיניות פרטיות",
      de: "Datenschutzrichtlinie",
      it: "Privacy Policy",
    },
    introduction: {
      pt: "Esta Política de Privacidade descreve como a <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (\"nós\", \"nosso\" ou \"empresa\") coleta, usa e protege suas informações pessoais quando você visita ou utiliza o site <strong>hdotrade.com</strong> (\"Site\") e nossos serviços relacionados.",
      fr: "Cette Politique de Confidentialité décrit comment <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (« nous », « notre » ou « l'entreprise ») collecte, utilise et protège vos informations personnelles lorsque vous visitez ou utilisez le site Web <strong>hdotrade.com</strong> (« Site Web ») et nos services connexes.",
      es: "Esta Política de Privacidad describe cómo <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (\"nosotros\", \"nuestro\" o \"la empresa\") recopila, usa y protege su información personal cuando visita o utiliza el sitio web <strong>hdotrade.com</strong> (\"Sitio Web\") y nuestros servicios relacionados.",
      en: "This Privacy Policy describes how <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (\"we\", \"our\", or \"company\") collects, uses, and protects your personal information when you visit or use the <strong>hdotrade.com</strong> website (\"Website\") and our related services.",
      he: "מדיניות פרטיות זו מתארת כיצד <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (\"אנחנו\", \"שלנו\" או \"החברה\") אוספת, משתמשת ומגנה על המידע האישי שלך כאשר אתה מבקר או משתמש באתר <strong>hdotrade.com</strong> (\"האתר\") בשירותים הנלווים.",
      de: "Diese Datenschutzrichtlinie beschreibt, wie <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> („wir", „unser" oder „Unternehmen") Ihre persönlichen Daten erhebt, verwendet und schützt, wenn Sie die Website <strong>hdotrade.com</strong> („Website") und unsere zugehörigen Dienste besuchen oder nutzen.",
      it: "La presente Informativa sulla Privacy descrive come <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> (\"noi\", \"nostro\" o \"l'azienda\") raccoglie, utilizza e protegge le sue informazioni personali quando visita o utilizza il sito web <strong>hdotrade.com</strong> (\"Sito Web\") e i nostri servizi correlati.",
    },
    collectTitle: {
      pt: "Informações que Coletamos",
      fr: "Informations que Nous Collectons",
      es: "Información que Recopilamos",
      en: "Information We Collect",
      he: "מידע שאנו אוספים",
      de: "Informationen, die Wir Erheben",
      it: "Informazioni che Raccogliamo",
    },
    collectParagraph: {
      pt: "Podemos coletar os seguintes tipos de informações pessoais: nome, endereço de e-mail, número de telefone, endereço de faturamento e entrega, informações de pagamento e dados de navegação (como endereço IP, tipo de navegador e páginas visitadas).",
      fr: "Nous pouvons collecter les types d'informations personnelles suivants : nom, adresse e-mail, numéro de téléphone, adresse de facturation et de livraison, informations de paiement et données de navigation (telles que l'adresse IP, le type de navigateur et les pages visitées).",
      es: "Podemos recopilar los siguientes tipos de información personal: nombre, dirección de correo electrónico, número de teléfono, dirección de facturación e envío, información de pago y datos de navegación (como dirección IP, tipo de navegador y páginas visitadas).",
      en: "We may collect the following types of personal information: name, email address, phone number, billing and shipping address, payment information, and browsing data (such as IP address, browser type, and pages visited).",
      he: "אנו עשויים לאסוף סוגי מידע אישי הבאים: שם, כתובת דוא\"ל, מספר טלפון, כתובת חיוב ומשלוח, מידע תשלומי ונתוני גלישה (ככתובת IP, סוג דפדפן ודפים שנבקרו).",
      de: "Wir können die folgenden Arten personenbezogener Daten erheben: Name, E-Mail-Adresse, Telefonnummer, Rechnungs- und Lieferadresse, Zahlungsinformationen und Browsedaten (wie IP-Adresse, Browsertyp und besuchte Seiten).",
      it: "Potremmo raccogliere i seguenti tipi di informazioni personali: nome, indirizzo e-mail, numero di telefono, indirizzo di fatturazione e spedizione, informazioni di pagamento e dati di navigazione (come indirizzo IP, tipo di browser e pagine visitate).",
    },
    useTitle: {
      pt: "Como Usamos Suas Informações",
      fr: "Comment Nous Utilisons Vos Informations",
      es: "Cómo Usamos Su Información",
      en: "How We Use Your Information",
      he: "כיצד אנו משתמשים ב מידע שלך",
      de: "Wie Wir Ihre Informationen Verwenden",
      it: "Come Utilizziamo le Tue Informazioni",
    },
    useList: [
      {
        pt: "Processar e completar seus pedidos",
        fr: "Traiter et compléter vos commandes",
        es: "Procesar y completar sus pedidos",
        en: "Process and fulfill your orders",
        he: "לעבד ולהשלים את ההזמנות שלך",
        de: "Ihre Bestellungen bearbeiten und erfüllen",
        it: "Elaborare e completare i tuoi ordini",
      },
      {
        pt: "Comunicar-nos sobre seu pedido ou conta",
        fr: "Communiquer avec vous concernant votre commande ou compte",
        es: "Comunicarnos sobre su pedido o cuenta",
        en: "Communicate with you about your order or account",
        he: "לתקשר איתך לגבי ההזמנה או החשבון שלך",
        de: "Mit Ihnen über Ihre Bestellung oder Ihr Konto kommunizieren",
        it: "Comunicare con te riguardo al tuo ordine o account",
      },
      {
        pt: "Enviar atualizações de envio e notificações",
        fr: "Envoyer des mises à jour d'expédition et des notifications",
        es: "Enviar actualizaciones de envío y notificaciones",
        en: "Send shipping updates and notifications",
        he: "לשלוח עדכוני משלוח והתראות",
        de: "Versandupdates und Benachrichtigungen senden",
        it: "Inviare aggiornamenti di spedizione e notifiche",
      },
      {
        pt: "Melhorar nosso site e serviços",
        fr: "Améliorer notre site Web et nos services",
        es: "Mejorar nuestro sitio web y servicios",
        en: "Improve our website and services",
        he: "לשפר את האתר והשירותים שלנו",
        de: "Unsere Website und Dienste verbessern",
        it: "Migliorare il nostro sito web e i servizi",
      },
      {
        pt: "Cumprir obrigações legais e regulatórias",
        fr: "Respecter les obligations légales et réglementaires",
        es: "Cumplir con obligaciones legales y regulatorias",
        en: "Comply with legal and regulatory obligations",
        he: "לעמוד בחובות משפטיות ורגולטוריות",
        de: "Gesetzliche und regulatorische Pflichten erfüllen",
        it: "Adempiere agli obblighi legali e regolamentari",
      },
    ],
    sharingTitle: {
      pt: "Compartilhamento de Informações",
      fr: "Partage des Informations",
      es: "Compartición de Información",
      en: "Information Sharing",
      he: "שיתוף מידע",
      de: "Informationsteilung",
      it: "Condivisione delle Informazioni",
    },
    sharingParagraph: {
      pt: "Não vendemos suas informações pessoais. Podemos compartilhar seus dados com terceiros apenas para: processar pagamentos, entregar encomendas, cumprir obrigações legais ou proteger nossos direitos. Todos os terceiros são obrigados a proteger suas informações.",
      fr: "Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos données avec des tiers uniquement pour : traiter les paiements, livrer les commandes, respecter les obligations légales ou protéger nos droits. Tous les tiers sont tenus de protéger vos informations.",
      es: "No vendemos su información personal. Podemos compartir sus datos con terceros solo para: procesar pagos, entregar pedidos, cumplir obligaciones legales o proteger nuestros derechos. Todos los terceros están obligados a proteger su información.",
      en: "We do not sell your personal information. We may share your data with third parties only to: process payments, deliver orders, comply with legal obligations, or protect our rights. All third parties are required to protect your information.",
      he: "אינו מוכרים את המידע האישי שלך. אנו עשויים לשתף את הנתונים שלך עם צדדים שלישיים רק כדי: לעבד תשלומים, לספק הזמנות, לעמוד בחובות משפטיות או להגן על הזכויות שלנו. כל הצדדים השלישיים מחויבים להגן על המידע שלך.",
      de: "Wir verkaufen Ihre persönlichen Daten nicht. Wir können Ihre Daten nur an Dritte weitergeben, um: Zahlungen zu bearbeiten, Bestellungen zu liefern, gesetzliche Pflichten zu erfüllen oder unsere Rechte zu schützen. Alle Dritten sind zum Schutz Ihrer Daten verpflichtet.",
      it: "Non vendiamo le tue informazioni personali. Potremmo condividere i tuoi dati con terze parti solo per: elaborare i pagamenti, consegnare gli ordini, adempiere agli obblighi legali o proteggere i nostri diritti. Tutte le terze parti sono obbligate a proteggere le tue informazioni.",
    },
    securityTitle: {
      pt: "Segurança dos Dados",
      fr: "Sécurité des Données",
      es: "Seguridad de los Datos",
      en: "Data Security",
      he: "אבטחת נתונים",
      de: "Datensicherheit",
      it: "Sicurezza dei Dati",
    },
    securityParagraph: {
      pt: "Empregamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.",
      fr: "Nous employons des mesures de sécurité techniques et organisationnelles pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cependant, aucun méthode de transmission par Internet ou de stockage électronique n'est sécurisée à 100 %.",
      es: "Empleamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro.",
      en: "We employ technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of Internet transmission or electronic storage is 100% secure.",
      he: "אנו משתמשים באמצעי אבטחה טכניים וארגוניים כדי להגן על המידע האישי שלך מפני גישה בלתי מורשית, שינוי, גילוי או השמדה. עם זאת, אף שיטת העברה באינטרנט או אחסון אלקטרוני אינו מאובטח ב-100%.",
      de: "Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre persönlichen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen. Dennoch ist keine Methode der Internetübertragung oder elektronischen Speicherung zu 100 % sicher.",
      it: "Adottiamo misure di sicurezza tecniche e organizzative per proteggere le tue informazioni personali contro accessi non autorizzati, modifiche, divulgazioni o distruzioni. Tuttavia, nessun metodo di trasmissione Internet o archiviazione elettronica è sicuro al 100%.",
    },
    cookiesTitle: {
      pt: "Cookies",
      fr: "Cookies",
      es: "Cookies",
      en: "Cookies",
      he: "עוגיות",
      de: "Cookies",
      it: "Cookie",
    },
    cookiesParagraph: {
      pt: "O nosso site utiliza cookies e tecnologias semelhantes para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.",
      fr: "Notre site Web utilise des cookies et des technologies similaires pour améliorer votre expérience de navigation, analyser le trafic du site et personnaliser le contenu. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.",
      es: "Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puede gestionar sus preferencias de cookies en la configuración de su navegador.",
      en: "Our website uses cookies and similar technologies to improve your browsing experience, analyze site traffic, and personalize content. You can manage your cookie preferences in your browser settings.",
      he: "האתר שלנו משתמש בעוגיות ובטכנולוגיות דומות כדי לשפר את חוויית הגלישה שלך, לנתח תעבורה באתר ול personalize תוכן. אתה יכול לנהל את ההעדפות שלך בהגדרות הדפדפן.",
      de: "Unsere Website verwendet Cookies und ähnliche Technologien, um Ihr Browsererlebnis zu verbessern, den Website-Verkehr zu analysieren und Inhalte zu personalisieren. Sie können Ihre Cookie-Einstellungen in Ihren Browsereinstellungen verwalten.",
      it: "Il nostro sito web utilizza cookie e tecnologie simili per migliorare la tua esperienza di navigazione, analizzare il traffico del sito e personalizzare i contenuti. Puoi gestire le tue preferenze cookie nelle impostazioni del tuo browser.",
    },
    rightsTitle: {
      pt: "Seus Direitos",
      fr: "Vos Droits",
      es: "Sus Derechos",
      en: "Your Rights",
      he: "הזכויות שלך",
      de: "Ihre Rechte",
      it: "I Tuoi Diritti",
    },
    rightsParagraph: {
      pt: "De acordo com o Regulamento Geral de Proteção de Dados (RGPD) e outras leis aplicáveis, você tem o direito de: acessar, corrigir ou excluir seus dados pessoais; solicitar a portabilidade dos seus dados; opor-se ao processamento de seus dados; e retirar o consentimento a qualquer momento.",
      fr: "Conformément au Règlement Général sur la Protection des Données (RGPD) et aux autres lois applicables, vous avez le droit de : accéder, corriger ou supprimer vos données personnelles ; demander la portabilité de vos données ; vous opposer au traitement de vos données ; et retirer votre consentement à tout moment.",
      es: "De acuerdo con el Reglamento General de Protección de Datos (RGPD) y otras leyes aplicables, usted tiene derecho a: acceder, corregir o eliminar sus datos personales; solicitar la portabilidad de sus datos; oponerse al procesamiento de sus datos; y retirar su consentimiento en cualquier momento.",
      en: "Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the right to: access, correct, or delete your personal data; request data portability; object to the processing of your data; and withdraw consent at any time.",
      he: "בהתאם לתקנת הגנת המידע הכללית (GDPR) ולחוקים אחרים החלים, יש לך הזכות: לגשת, לתקן או למחוק את הנתונים האישיים שלך; לבקש ניידות נתונים; להתנגד לעיבוד הנתונים שלך; ולמשוך הסכמה בכל עת.",
      de: "Gemäß der Datenschutz-Grundverordnung (DSGVO) und anderen geltenden Gesetzen haben Sie das Recht auf: Zugang zu Ihren persönlichen Daten, deren Berichtigung oder Löschung; Datenübertragbarkeit; Widerspruch gegen die Verarbeitung Ihrer Daten; und den Widerruf Ihrer Einwilligung jederzeit.",
      it: "In conformità al Regolamento Generale sulla Protezione dei Dati (GDPR) e altre leggi applicabili, hai il diritto di: accedere, correggere o eliminare i tuoi dati personali; richiedere la portabilità dei dati; opporti al trattamento dei tuoi dati; e revocare il consenso in qualsiasi momento.",
    },
    contactTitle: {
      pt: "Contacte-nos",
      fr: "Contactez-Nous",
      es: "Contáctenos",
      en: "Contact Us",
      he: "צור קשר",
      de: "Kontaktieren Sie Uns",
      it: "Contattaci",
    },
    contactParagraph: {
      pt: "Se tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato connosco através do nosso site ou por e-mail.",
      fr: "Si vous avez des questions concernant cette Politique de Confidentialité ou la manière dont nous traitons vos données personnelles, veuillez nous contacter via notre site Web ou par e-mail.",
      es: "Si tiene preguntas sobre esta Política de Privacidad o sobre cómo tratamos sus datos personales, contáctenos a través de nuestro sitio web o por correo electrónico.",
      en: "If you have questions about this Privacy Policy or how we handle your personal data, please contact us through our website or by email.",
      he: "אם יש לך שאלות לגבי מדיניות פרטיות זו או לגבי cách אנו מטפלים בנתונים האישיים שלך, אנא צור קשר דרך האתר שלנו או באמצעות דוא\"ל.",
      de: "Wenn Sie Fragen zu dieser Datenschutzrichtlinie oder zu unserem Umgang mit Ihren persönlichen Daten haben, kontaktieren Sie uns bitte über unsere Website oder per E-Mail.",
      it: "Se hai domande sulla presente Informativa sulla Privacy o sul modo in cui trattiamo i tuoi dati personali, contattaci attraverso il nostro sito web o via e-mail.",
    },
    lastUpdated: {
      pt: "Este documento foi atualizado pela última vez em 15 de junho de 2021",
      fr: "Ce document a été mis à jour pour la dernière fois le 15 juin 2021",
      es: "Este documento fue actualizado por última vez el 15 de junio de 2021",
      en: "This document was last updated on June 15, 2021",
      he: "מסמך זה עודכן לאחרונה ב-15 ביוני 2021",
      de: "Dieses Dokument wurde zuletzt am 15. Juni 2021 aktualisiert",
      it: "Questo documento è stato aggiornato l'ultima volta il 15 giugno 2021",
    },
  };

  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  const getListItems = (key) => {
    return textMap[key].map((item, index) => (
      <li key={index} className="text-gray-700 leading-relaxed">
        {item[uiLang] || item.en}
      </li>
    ));
  };

  return (
    <div className="relative md:ml-64 bg-gray-50 min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
          {getText("title")}
        </h1>
        <p
          className="mb-4 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getText("introduction") }}
        />
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("collectTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("collectParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("useTitle")}
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
            {getListItems("useList")}
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("sharingTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("sharingParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("securityTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("securityParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("cookiesTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("cookiesParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("rightsTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("rightsParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("contactTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("contactParagraph")}
          </p>
        </section>
        <p className="text-gray-500 text-sm mt-10">{getText("lastUpdated")}</p>
      </div>
    </div>
  );
}
