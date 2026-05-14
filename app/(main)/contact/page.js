import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import ContactImg from "@/public/client/contact.png";
import ContactImg2 from "@/public/client/banner/contact.png";
import Image from "next/image";
import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";
import { getUiLanguage } from "@/utils/uiLanguage";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import FAQSchema from "@/components/seo/FAQSchema";

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("contact", lang, domain);
}

export default async function ContactPage() {
  const lang = await getRequestLanguage();
  const uiLang = getUiLanguage(lang);
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  // Internationalization mappings
  const textMap = {
    mainHeading: {
      pt: "Se precisar de ajuda, não hesite em contactar a nossa equipa de apoio!",
      fr: "Si vous avez besoin d'aide, n'hésitez pas à contacter notre équipe de support!",
      es: "Si necesita ayuda, no dude en contactar a nuestro equipo de soporte!",
      en: "If you need help, don't hesitate to contact our support team!",
      he: "אם אתה זקוק לעזרה, אל תהסס לפנות לצוות התמיכה שלנו!",
      de: "Wenn Sie Hilfe benötigen, zögern Sie nicht, unser Support-Team zu kontaktieren!",
    },
    number: {
      pt: "Número",
      fr: "Numéro",
      es: "Número",
      en: "Number",
      he: "מספר",
      de: "Nummer",
    },
    whatsapp: {
      pt: "WhatsApp",
      fr: "WhatsApp",
      es: "WhatsApp",
      en: "WhatsApp",
      he: "וואטסאפ",
      de: "WhatsApp",
    },
    officeNumber: {
      pt: "Número da escritório",
      fr: "Numéro de bureau",
      es: "Número de oficina",
      en: "Office number",
      he: "מספר משרד",
      de: "Büronummer",
    },
    mobileOffice: {
      pt: "Telemóvel escritório",
      fr: "Mobile bureau",
      es: "Móvil oficina",
      en: "Mob office",
      he: "טלפון נייד של המשרד",
      de: "Büro-Mobiltelefon",
    },
    emailUs: {
      pt: "Envie-nos um Email",
      fr: "Envoyez-nous un Email",
      es: "Envíenos un Email",
      en: "Email Us",
      he: "שלחו לנו אימייל",
      de: "E-Mail senden",
    },
    importDepartment: {
      pt: "Departamento de Importação",
      fr: "Département d'Importation",
      es: "Departamento de Importación",
      en: "Import Department",
      he: "מחלקת יבוא",
      de: "Importabteilung",
    },
    salesDepartmentGlobal: {
      pt: "Departamento de Vendas Global",
      fr: "Département des Ventes Global",
      es: "Departamento de Ventas Global",
      en: "Sales Department Global",
      he: "מחלקת מכירות גלובלית",
      de: "Globale Vertriebsabteilung",
    },
    salesDepartmentEurope: {
      pt: "Departamento de Vendas Europa",
      fr: "Département des Ventes Europe",
      es: "Departamento de Ventas Europa",
      en: "Sales Department Europ",
      he: "מחלקת מכירות אירופה",
      de: "Vertriebsabteilung Europa",
    },
    accountancyDepartmentGlobal: {
      pt: "Departamento de Contabilidade Global",
      fr: "Département de Comptabilité Global",
      es: "Departamento de Contabilidad Global",
      en: "Accountancy Department Global",
      he: "מחלקת הנהלת חשבונות גלובלית",
      de: "Globale Buchhaltungsabteilung",
    },
    accountancyDepartmentEurope: {
      pt: "Departamento de Contabilidade Europa",
      fr: "Département de Comptabilité Europe",
      es: "Departamento de Contabilidad Europa",
      en: "Accountancy Department Europ",
      he: "מחלקת הנהלת חשבונות אירופה",
      de: "Buchhaltungsabteilung Europa",
    },
    officesWarehouse: {
      pt: "Escritórios, armazém, loja física",
      fr: "Bureaux, entrepôt, magasin physique",
      es: "Oficinas, almacén, tienda física",
      en: "Offices, warehouse, physical store",
      he: "משרדים, מחסן, חנות פיזית",
      de: "Büros, Lager, Ladengeschäft",
    },
    officeHours: {
      pt: "Horário de Atendimento",
      fr: "Heures d'Ouverture",
      es: "Horario de Atención",
      en: "Office Hours",
      he: "שעות פעילות",
      de: "Öffnungszeiten",
    },
    mondayFriday: {
      pt: "Segunda - Sexta 9h - 18h",
      fr: "Lundi - Vendredi 9h - 18h",
      es: "Lunes - Viernes 9h - 18h",
      en: "Monday - Friday 9 AM - 6 PM",
      he: "יום שני - יום שישי 9:00 - 18:00",
      de: "Montag - Freitag 9:00 - 18:00 Uhr",
    },
    addressLine1: {
      pt: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
      fr: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
      es: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
      en: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
      he: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
      de: "Quinta das rosas lote 3 RC Esq 6200-551 Covilha Portugal",
    },
    addressLine2: {
      pt: "armazém - rua de espinho santo peraboa covilha portugal",
      fr: "entrepôt - rua de espinho santo peraboa covilha portugal",
      es: "almacén - rua de espinho santo peraboa covilha portugal",
      en: "warehouse - rua de espinho santo peraboa covilha portugal",
      he: "warehouse - rua de espinho santo peraboa covilha portugal",
      de: "Lager - rua de espinho santo peraboa covilha portugal",
    },
  };

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  return (
    <>
      <LocalBusinessSchema domain={domain} />
      <FAQSchema lang={lang} />
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="my-20">
          <div
            className="relative lg:py-20 py-12 px-6 lg:px-28 rounded-3xl max-h-[318px] overflow-hidden bg-gray-300"
            style={{
              backgroundImage: `url(${ContactImg.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-red-500/80"></div>
            <h1
              className="relative text-[32px] md:text-[55px] leading-[1.2] font-[900] text-white text-center"
              style={{ textShadow: "0 6px 20px rgba(0, 0, 0, 0.6)" }}
            >
              {getText("mainHeading")}
            </h1>
          </div>
          {/* Card Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
            {/* Card 1 */}
            <div className="bg-[#f4f3ef] rounded-xl">
              <div className="flex items-center justify-center gap-2.5 py-4 border-b border-gray-300">
                <span className="bg-[#e91325] p-1.5 rounded-[8px]">
                  <FiPhone className="text-xl text-white" />
                </span>
                <p className="text-xl font-bold">{getText("number")}</p>
              </div>
              <div className="flex flex-col items-center justify-center py-8 space-y-4 text-left">
                <p className="text-[16px] font-bold text-red-600">
                  <span className="text-[#767778]">{getText("whatsapp")}</span>{" "}
                  +351 927408959
                </p>
                <p className="text-[16px] font-bold text-red-600">
                  <span className="text-[#767778]">
                    {getText("officeNumber")}
                  </span>{" "}
                  +351 275335326
                </p>
                <p className="text-[16px] font-bold text-red-600">
                  <span className="text-[#767778]">
                    {getText("mobileOffice")}
                  </span>{" "}
                  +351 927408959
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#f4f3ef] rounded-xl">
              <div className="flex items-center justify-center gap-2.5 py-4 border-b border-gray-300">
                <span className="bg-[#e91325] p-1.5 rounded-[8px]">
                  <HiOutlineMail className="text-xl text-white" />
                </span>
                <p className="text-xl font-bold">{getText("emailUs")}</p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-[26px] py-10 px-[70px]">
                {/* Side 1 */}
                <div className="space-y-4">
                  <p className="text-[16px] font-bold text-red-600">
                    <span className="text-[#767778]">
                      {getText("importDepartment")} -
                    </span>{" "}
                    import@hdotrade.com
                  </p>
                  <p className="text-[16px] font-bold text-red-600">
                    <span className="text-[#767778]">
                      {getText("salesDepartmentGlobal")} -
                    </span>{" "}
                    sales@hdotrade.com
                  </p>
                  <p className="text-[16px] font-bold text-red-600">
                    <span className="text-[#767778]">
                      {getText("salesDepartmentEurope")} -
                    </span>{" "}
                    sales@Hdotrade.pt
                  </p>
                </div>
                {/* Side 2 */}
                <div className="space-y-4">
                  <p className="text-[16px] font-bold text-red-600">
                    <span className="text-[#767778]">
                      {getText("accountancyDepartmentGlobal")} -
                    </span>{" "}
                    accountancy@hdotrade.com
                  </p>
                  <p className="text-[16px] font-bold text-red-600">
                    <span className="text-[#767778]">
                      {getText("accountancyDepartmentEurope")} -
                    </span>{" "}
                    accountancy@hdotrade.pt
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            {/* Side 1 */}
            <div className="bg-[#f4f3ef] rounded-xl">
              <div className="flex items-center justify-center gap-2.5 py-4 px-3 border-b border-gray-300">
                <span className="bg-[#e91325] p-1.5 rounded-[8px]">
                  <IoLocationOutline className="text-xl text-white" />
                </span>
                <p className="text-xl font-bold">
                  {getText("officesWarehouse")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center pt-4 pb-7 space-y-4 text-center p-1.5 md:px-1">
                <p className="text-[16px] font-bold text-[#767779]">
                  {getText("addressLine1")}
                </p>
                <p className="text-[16px] font-bold text-[#767779]">
                  {getText("addressLine2")}
                </p>
              </div>
            </div>
            {/* Side 2 */}
            <div className="bg-[#f4f3ef] rounded-xl">
              <div className="flex items-center justify-center gap-2.5 py-4 border-b border-gray-300">
                <span className="bg-[#e91325] p-1.5 rounded-[8px]">
                  <FiPhone className="text-xl text-white" />
                </span>
                <p className="text-xl font-bold">{getText("officeHours")}</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[16px] font-bold text-red-600 py-11">
                  {getText("mondayFriday")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20 w-full max-w-[1280px] mx-auto">
          <Image
            src={ContactImg2}
            width={1280}
            height={832}
            className="rounded-2xl w-full h-auto"
            alt="contact img"
            unoptimized
          />
        </div>
      </div>
    </>
  );
}