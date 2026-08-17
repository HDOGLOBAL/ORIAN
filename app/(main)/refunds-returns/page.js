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

  return getSeoMetadata("refunds", lang, domain);
}

export default async function RefundsReturnsPage() {
  const lang = await getRequestLanguage();
  const uiLang = getUiLanguage(lang);

  const textMap = {
    title: {
      pt: "Reembolsos e Devoluções",
      fr: "Remboursements et Retours",
      es: "Reembolsos y Devoluciones",
      en: "Refunds & Returns",
      he: "החזרות והחלפות",
      de: "Rückerstattungen & Rücksendungen",
      it: "Rimborsi e Resi",
    },
    introduction: {
      pt: "Na <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, queremos que você esteja satisfeito com sua compra. Se por algum motivo não estiver completamente satisfeito, por favor revise nossa política abaixo.",
      fr: "Chez <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, nous voulons que vous soyez satisfait de votre achat. Si pour une raison quelconque vous n'êtes pas entièrement satisfait, veuillez consulter notre politique ci-dessous.",
      es: "En <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, queremos que esté satisfecho con su compra. Si por algún motivo no está completamente satisfecho, revise nuestra política a continuación.",
      en: "At <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, we want you to be satisfied with your purchase. If for any reason you are not completely satisfied, please review our policy below.",
      he: "ב<strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, אנו רוצים שתהיה מרוצה מהרכישה שלך. אם מסיבה כלשהי אינך מרוצה לחלוטין, אנא עיין במדיניות שלנו למטה.",
      de: "Bei <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong> möchten wir, dass Sie mit Ihrem Einkauf zufrieden sind. Falls Sie aus irgendeinem Grund nicht vollständig zufrieden sind, lesen Sie bitte unsere Richtlinie unten.",
      it: "Presso <strong>HDO GLOBAL TRADE, UNIPESSOAL LDA</strong>, vogliamo che tu sia soddisfatto del tuo acquisto. Se per qualsiasi motivo non sei completamente soddisfatto, consulta la nostra politica qui sotto.",
    },
    eligibilityTitle: {
      pt: "Elegibilidade para Devolução",
      fr: "Éligibilité au Retour",
      es: "Elegibilidad para Devolución",
      en: "Return Eligibility",
      he: "זכאות להחזרה",
      de: "Rücksendeberechtigung",
      it: "Idoneità al Reso",
    },
    eligibilityParagraph: {
      pt: "Para ser elegível para uma devolução, o item deve estar em sua condição original, não utilizado e na mesma embalagem em que foi recebido. Você tem 30 dias a partir da data de recebimento para solicitar uma devolução.",
      fr: "Pour être éligible à un retour, l'article doit être dans son état original, non utilisé et dans le même emballage dans lequel il a été reçu. Vous disposez de 30 jours à compter de la date de réception pour demander un retour.",
      es: "Para ser elegible para una devolución, el artículo debe estar en su estado original, no utilizado y en el mismo empaque en que fue recibido. Tiene 30 días a partir de la fecha de recepción para solicitar una devolución.",
      en: "To be eligible for a return, the item must be in its original condition, unused, and in the same packaging it was received. You have 30 days from the date of receipt to request a return.",
      he: "כדי להיות זכאי להחזרה, המוצר חייב להיות במצבו המקורי, לא בשימוש ובאותה אריזה שבה התקבל. יש לך 30 יום מיום הקבלה לבקש החזרה.",
      de: "Um für eine Rücksendung berechtigt zu sein, muss der Artikel sich in seinem Originalzustand befinden, unbenutzt sein und sich in der gleichen Verpackung befinden, in der er erhalten wurde. Sie haben 30 Tage ab dem Empfangsdatum, um eine Rücksendung zu beantragen.",
      it: "Per essere idoneo al reso, l'articolo deve essere nelle sue condizioni originali, non utilizzato e nella stessa confezione in cui è stato ricevuto. Hai 30 giorni dalla data di ricezione per richiedere un reso.",
    },
    nonReturnableTitle: {
      pt: "Itens Não Devolvíveis",
      fr: "Articles Non Retournables",
      es: "Artículos No Devolvibles",
      en: "Non-Returnable Items",
      he: "מוצרים שלא ניתן להחזיר",
      de: "Nicht Rücksendbare Artikel",
      it: "Articoli Non Resi",
    },
    nonReturnableList: [
      {
        pt: "Itens personalizados ou sob encomenda",
        fr: "Articles personnalisés ou fabriqués sur commande",
        es: "Artículos personalizados o fabricados bajo pedido",
        en: "Customized or made-to-order items",
        he: "מוצרים מותאמים אישית או מיוצרים בהזמנה",
        de: "Personalisierte oder nach Bestellung gefertigte Artikel",
        it: "Articoli personalizzati o prodotti su ordinazione",
      },
      {
        pt: "Itens danados pelo usuário após a entrega",
        fr: "Articles endommagés par l'utilisateur après la livraison",
        es: "Artículos dañados por el usuario después de la entrega",
        en: "Items damaged by the user after delivery",
        he: "מוצרים שנפגעו על ידי הלקוח לאחר המסירה",
        de: "Vom Kunden nach Lieferung beschädigte Artikel",
        it: "Articoli danneggiati dall'utente dopo la consegna",
      },
      {
        pt: "Itens sem a embalagem original",
        fr: "Articles sans l'emballage d'origine",
        es: "Artículos sin el empaque original",
        en: "Items without original packaging",
        he: "מוצרים ללא האריזה המקורית",
        de: "Artikel ohne Originalverpackung",
        it: "Articoli senza la confezione originale",
      },
      {
        pt: "Peças de reposição instaladas ou usadas",
        fr: "Pièces de rechange installées ou utilisées",
        es: "Repuestos instalados o utilizados",
        en: "Replacement parts installed or used",
        he: "חלקי חילוף שהותקנו או נוצלו",
        de: "Installierte oder benutzte Ersatzteile",
        it: "Ricambi installati o utilizzati",
      },
    ],
    processTitle: {
      pt: "Processo de Devolução",
      fr: "Processus de Retour",
      es: "Proceso de Devolución",
      en: "Return Process",
      he: "תהליך החזרה",
      de: "Rücksendeprozess",
      it: "Processo di Reso",
    },
    processList: [
      {
        pt: "Entre em contato connosco através do nosso site ou por e-mail com seu número de pedido e motivo da devolução.",
        fr: "Contactez-nous via notre site Web ou par e-mail avec votre numéro de commande et le motif du retour.",
        es: "Contáctenos a través de nuestro sitio web o por correo electrónico con su número de pedido y el motivo de la devolución.",
        en: "Contact us through our website or by email with your order number and reason for return.",
        he: "צור קשר דרך האתר שלנו או באמצעות דוא\"ל עם מספר ההזמנה וסיבת ההחזרה.",
        de: "Kontaktieren Sie uns über unsere Website oder per E-Mail mit Ihrer Bestellnummer und dem Grund für die Rücksendung.",
        it: "Contattaci attraverso il nostro sito web o via e-mail con il tuo numero d'ordine e il motivo del reso.",
      },
      {
        pt: "Aguarde as instruções de devolução da nossa equipe.",
        fr: "Attendez les instructions de retour de notre équipe.",
        es: "Espere las instrucciones de devolución de nuestro equipo.",
        en: "Wait for return instructions from our team.",
        he: "המתן להוראות החזרה מהצוות שלנו.",
        de: "Warten Sie auf Rücksendeanweisungen von unserem Team.",
        it: "Attendi le istruzioni di reso dal nostro team.",
      },
      {
        pt: "Envie o item de volta conforme as instruções fornecidas.",
        fr: "Renvoyez l'article conformément aux instructions fournies.",
        es: "Envíe el artículo de vuelta según las instrucciones proporcionadas.",
        en: "Send the item back following the provided instructions.",
        he: "שלח את המוצר חזרה לפי ההוראות שסופקו.",
        de: "Senden Sie den Artikel gemäß den bereitgestellten Anweisungen zurück.",
        it: "Invia l'articolo indietro seguendo le istruzioni fornite.",
      },
      {
        pt: "Após a recepção e inspeção, processaremos seu reembolso.",
        fr: "Après réception et inspection, nous traiterons votre remboursement.",
        es: "Después de la recepción e inspección, procesaremos su reembolso.",
        en: "After receipt and inspection, we will process your refund.",
        he: "לאחר קבלה ובדיקה, נעבד את ההחזר שלך.",
        de: "Nach Eingang und Prüfung werden wir Ihre Rückerstattung bearbeiten.",
        it: "Dopo la ricezione e l'ispezione, elaboreremo il tuo rimborso.",
      },
    ],
    refundTitle: {
      pt: "Reembolso",
      fr: "Remboursement",
      es: "Reembolso",
      en: "Refund",
      he: "החזר",
      de: "Rückerstattung",
      it: "Rimborso",
    },
    refundParagraph: {
      pt: "Uma vez que sua devolução seja recebida e inspecionada, enviaremos um e-mail para notificá-lo da aprovação ou rejeição do reembolso. Se aprovado, o reembolso será processado e um crédito será aplicado automaticamente ao seu método de pagamento original, dentro de 5 a 10 dias úteis.",
      fr: "Une fois votre retour reçu et inspecté, nous vous enverrons un e-mail pour vous informer de l'approbation ou du rejet du remboursement. Si approuvé, le remboursement sera traité et un crédit sera appliqué automatiquement à votre méthode de paiement d'origine, dans un délai de 5 à 10 jours ouvrables.",
      es: "Una vez que su devolución sea recibida e inspeccionada, le enviaremos un correo electrónico para notificarle la aprobación o rechazo del reembolso. Si se aprueba, el reembolso será procesado y un crédito será aplicado automáticamente a su método de pago original, dentro de 5 a 10 días hábiles.",
      en: "Once your return is received and inspected, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will be automatically applied to your original method of payment within 5 to 10 business days.",
      he: "לאחר קבלת ההחזרה ובדיקה, נשלח לך דוא\"ל כדי ליידע אותך על אישור או דחיית ההחזר. אם יאושר, ההחזר יעובד וזיכוי יוחל אוטומטית על שיטת התשלום המקורית שלך תוך 5 עד 10 ימי עסקים.",
      de: "Sobald Ihre Rücksendung eingegangen und geprüft wurde, senden wir Ihnen eine E-Mail, um Sie über die Genehmigung oder Ablehnung Ihrer Rückerstattung zu informieren. Bei Genehmigung wird Ihre Rückerstattung bearbeitet und ein Guthaben wird automatisch auf Ihre ursprüngliche Zahlungsmethode innerhalb von 5 bis 10 Werktagen angewendet.",
      it: "Una volta che il tuo reso sarà ricevuto e ispezionato, ti invieremo una e-mail per notificarti l'approvazione o il rifiuto del rimborso. Se approvato, il tuo rimborso sarà elaborato e un credito sarà applicato automaticamente al tuo metodo di pagamento originale entro 5-10 giorni lavorativi.",
    },
    shippingTitle: {
      pt: " Custos de Envio de Devolução",
      fr: "Frais de Livraison de Retour",
      es: "Costos de Envío de Devolución",
      en: "Return Shipping Costs",
      he: "עלויות משלוח החזרה",
      de: "Rücksendeversandkosten",
      it: "Costi di Spedizione per il Reso",
    },
    shippingParagraph: {
      pt: "Os custos de envio de devolução são de responsabilidade do cliente, exceto em casos de produtos defeituuosos ou enviados incorretamente pela nossa parte.",
      fr: "Les frais de livraison de retour sont à la charge du client, sauf en cas de produits défectueux ou envoyés par erreur de notre part.",
      es: "Los costos de envío de devolución corren por cuenta del cliente, excepto en casos de productos defectuosos o enviados incorrectamente por nuestra parte.",
      en: "Return shipping costs are the responsibility of the customer, except in cases of defective products or items incorrectly shipped by us.",
      he: "עלויות משלוח החזרה הן באחריות הלקוח, מלבד מקרים של מוצרים פגומים או שנשלחו שלא כדין על ידינו.",
      de: "Die Rücksendeversandkosten trägt der Kunde, außer bei fehlerhaften Produkten oder fälschlich von uns versendeten Artikeln.",
      it: "I costi di spedizione per il reso sono a carico del cliente, tranne nei casi di prodotti difettosi o articoli spediti erroneamente da parte nostra.",
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
      pt: "Se tiver dúvidas sobre nossa política de reembolsos e devoluções, entre em contato connosco através do nosso site ou por e-mail.",
      fr: "Si vous avez des questions concernant notre politique de remboursements et retours, veuillez nous contacter via notre site Web ou par e-mail.",
      es: "Si tiene preguntas sobre nuestra política de reembolsos y devoluciones, contáctenos a través de nuestro sitio web o por correo electrónico.",
      en: "If you have questions about our refunds and returns policy, please contact us through our website or by email.",
      he: "אם יש לך שאלות לגבי מדיניות ההחזרות וההחלפות שלנו, אנא צור קשר דרך האתר שלנו או באמצעות דוא\"ל.",
      de: "Wenn Sie Fragen zu unserer Rückerstattungs- und Rücksenderichtlinie haben, kontaktieren Sie uns bitte über unsere Website oder per E-Mail.",
      it: "Se hai domande sulla nostra politica di rimborsi e resi, contattaci attraverso il nostro sito web o via e-mail.",
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
            {getText("eligibilityTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("eligibilityParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("nonReturnableTitle")}
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
            {getListItems("nonReturnableList")}
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("processTitle")}
          </h2>
          <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-1">
            {getListItems("processList")}
          </ol>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("refundTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("refundParagraph")}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getText("shippingTitle")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getText("shippingParagraph")}
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
