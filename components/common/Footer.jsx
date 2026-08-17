"use client";
import worldDisImg from "@/public/client/worldDis.png";
import payment1 from "@/public/client/payment1.png";
import payment2 from "@/public/client/payment2.png";
import payment3 from "@/public/client/payment3.png";
import payment4 from "@/public/client/payment4.png";
import payment5 from "@/public/client/payment5.png";
import payment6 from "@/public/client/payment6.png";
import logo from "@/public/client/logo.png";
import Image from "next/image";
import {
  FbIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/public/icons/icons";

import Link from "next/link";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function Footer() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Internationalization mappings
  const textMap = {
    findProduct: {
      pt: "Encontrar Produto",
      fr: "Trouver un Produit",
      es: "Encontrar Producto",
      en: "Find Product",
      he: "מצא מוצר",
      de: "Produkt finden",
      it: "Trova Prodotto",
    },
    getHelp: {
      pt: "Obter Ajuda",
      fr: "Obtenir de l'Aide",
      es: "Obtener Ayuda",
      en: "Get help",
      he: "קבל עזרה",
      de: "Hilfe erhalten",
      it: "Chiedi Aiuto",
    },
    aboutUs: {
      pt: "Sobre N׳s",
      fr: "À Propos",
      es: "Sobre Nosotros",
      en: "About us",
      he: "אודותינו",
      de: "Über uns",
      it: "Chi Siamo",
    },
    privacyPolicy: {
      pt: "Política de Privacidade",
      fr: "Politique de Confidentialité",
      es: "Política de Privacidad",
      en: "Privacy Policy",
      he: "מדיניות פרטיות",
      de: "Datenschutzrichtlinie",
      it: "Privacy Policy",
    },
    refundsReturns: {
      pt: "Reembolsos e Devoluções",
      fr: "Remboursements et Retours",
      es: "Reembolsos y Devoluciones",
      en: "Refunds & Returns",
      he: "החזרות והחלפות",
      de: "Rückerstattungen & Rücksendungen",
      it: "Rimborsi e Resi",
    },
    termsConditions: {
      pt: "Termos e Condições",
      fr: "Termes et Conditions",
      es: "Términos y Condiciones",
      en: "Terms Conditions",
      he: "תנאים והגבלות",
      de: "AGB",
      it: "Termini e Condizioni",
    },
    onlineComplaintsBook: {
      pt: "Livro de Reclamações Online",
      fr: "Livre de Réclamations en Ligne",
      es: "Libro de Reclamaciones en Línea",
      en: "Online Complaints Book",
      he: "ספר תלונות מקוון",
      de: "Online-Beschwerdeformular",
      it: "Libro dei Reclami Online",
    },
    followUs: {
      pt: "Siga-nos",
      fr: "Suivez-nous",
      es: "Síganos",
      en: "Follow us",
      he: "עקב אחרינו",
      de: "Folgen Sie uns",
      it: "Seguici",
    },
    copyright: {
      pt: "Direitos de autor © {company} {year}",
      fr: "Droit d'auteur © {company} {year}",
      es: "Derechos de autor © {company} {year}",
      en: "Copyright © {company} {year}",
      he: "זכויות יוצרים © {company} {year}",
      de: "Urheberrecht © {company} {year}",
      it: "Diritti d'autore © {company} {year}",
    },
    weAccept: {
      pt: "Aceitamos",
      fr: "Nous acceptons",
      es: "Aceptamos",
      en: "We accept",
      he: "אנו מקבלים",
      de: "Wir akzeptieren",
      it: "Accettiamo",
    },
    worldwideShipping: {
      pt: "Envio Mundial",
      fr: "Livraison Mondiale",
      es: "Envío Mundial",
      en: "Worldwide Shipping",
      he: "משלוח בינלאומי",
      de: "Weltweiter Versand",
      it: "Spedizione Mondiale",
    },
    visa: {
      pt: "Visa",
      fr: "Visa",
      es: "Visa",
      en: "Visa",
      he: "ויזה",
      de: "Visa",
    },
    mastercard: {
      pt: "Mastercard",
      fr: "Mastercard",
      es: "Mastercard",
      en: "Mastercard",
      he: "מאסטרקארד",
      de: "Mastercard",
    },
    paypal: {
      pt: "PayPal",
      fr: "PayPal",
      es: "PayPal",
      en: "PayPal",
      he: "פייפאל",
      de: "PayPal",
    },
    americanExpress: {
      pt: "American Express",
      fr: "American Express",
      es: "American Express",
      en: "American Express",
      he: "אמריקן אקספרס",
      de: "American Express",
    },
    applePay: {
      pt: "Apple Pay",
      fr: "Apple Pay",
      es: "Apple Pay",
      en: "Apple Pay",
      he: "אפל פי",
      de: "Apple Pay",
    },
    googlePay: {
      pt: "Google Pay",
      fr: "Google Pay",
      es: "Google Pay",
      en: "Google Pay",
      he: "גוגל פי",
      de: "Google Pay",
    },
    loading: {
      pt: "Carregando produtos...",
      fr: "Chargement des produits...",
      es: "Cargando productos...",
      en: "Loading products...",
      he: "טוען מוצרים...",
      de: "Produkte werden geladen...",
      it: "Caricamento prodotti...",
    },
    catDishwasher: {
      pt: "Peças para máquinas de lavar louça",
      fr: "Pièces détachées lave-vaisselle",
      es: "Repuestos para lavavajillas",
      en: "Dishwasher spare parts",
      he: "חלקי חילוף למדיחי כלים",
      de: "Spülmaschinen-Ersatzteile",
      it: "Ricambi lavastoviglie",
    },
    catVegCutter: {
      pt: "Peças para cortadores de legumes",
      fr: "Pièces coupe-légumes",
      es: "Repuestos para cortaverduras",
      en: "Vegetable cutter spare parts",
      he: "חלקי חילוף לקוצצי ירקות",
      de: "Gemüseschneider-Ersatzteile",
      it: "Ricambi tagliaverdure",
    },
    catJuicer: {
      pt: "Peças para espremidores",
      fr: "Pièces presse-agrumes",
      es: "Repuestos para exprimidores",
      en: "Juicer spare parts",
      he: "חלקי חילוף למסחטות",
      de: "Entsafter-Ersatzteile",
      it: "Ricambi spremiagrumi",
    },
    catMixer: {
      pt: "Peças para misturadoras",
      fr: "Pièces batteur / mixeur",
      es: "Repuestos para batidoras",
      en: "Hand mixer spare parts",
      he: "חלקי חילוף למיקסרים",
      de: "Handmixer-Ersatzteile",
      it: "Ricambi mixer",
    },
    catKitchenTap: {
      pt: "Torneiras de cozinha comerciais",
      fr: "Robinetterie cuisine professionnelle",
      es: "Grifería de cocina profesional",
      en: "Commercial kitchen taps",
      he: "ברזי מטבח מסחריים",
      de: "Gastro-Küchenarmaturen",
      it: "Rubinetteria cucina professionale",
    },
    catReplacement: {
      pt: "Peças de substituição HDO",
      fr: "Pièces de rechange HDO",
      es: "Repuestos HDO",
      en: "HDO replacement parts",
      he: "חלקי חילוף HDO",
      de: "HDO-Ersatzteile",
      it: "Ricambi HDO",
    },
  };

  // Helper function to get localized text
  const getText = (key, params = {}) => {
    let text = textMap[key][uiLang] || textMap[key].en;
    // Replace parameters in the text
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    return text;
  };



  return (
    <footer className="bg-red-600 text-white">
      {/* Top Section */}
      <div className="bg-[#061E3E] py-10 text-white">
        <div className="max-w-[1440px] w-full lg:justify-items-end mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* Logo and Address */}
          <div className="text-left mt-[-40px]">
            <Image src={logo} alt="HDO Logo" width={110} height={110} />
            <p className="text-[14px] leading-relaxed">
              Quinta das rosas lote 3 R/C Esq, 6200-551 Covilhã, Portugal
            </p>
            <p className="mt-4 text-[16px] font-medium">
              {getText("followUs")}
            </p>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://www.facebook.com/share/1CzKXrc7ke/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FbIcon />
              </a>
              <a
                href="https://www.instagram.com/hdo_global_trade?igsh=bDE2NzR6bGhxdndm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com/company/hdotrade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://twitter.com/hdotrade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
            </div>
          </div>
          {/* Product Links */}
          <div className="text-left">
            <h4 className="font-semibold mb-2 text-[16px]">
              {getText("findProduct")}
            </h4>
            <ul className="space-y-1 text-[14px]">
              <li><Link href="/shop?category=dishwasher" className="text-white hover:underline hover:text-gray-200">{getText("catDishwasher")}</Link></li>
              <li><Link href="/shop?category=vegetable-cutter" className="text-white hover:underline hover:text-gray-200">{getText("catVegCutter")}</Link></li>
              <li><Link href="/shop?category=juicer" className="text-white hover:underline hover:text-gray-200">{getText("catJuicer")}</Link></li>
              <li><Link href="/shop?category=mixer" className="text-white hover:underline hover:text-gray-200">{getText("catMixer")}</Link></li>
              <li><Link href="/shop?category=kitchen-tap" className="text-white hover:underline hover:text-gray-200">{getText("catKitchenTap")}</Link></li>
              <li><Link href="/shop" className="text-white hover:underline hover:text-gray-200">{getText("catReplacement")}</Link></li>
            </ul>
          </div>
          {/* Help Links */}
          <div className="text-left">
            <h4 className="font-semibold mb-2 text-[16px]">
              {getText("getHelp")}
            </h4>
            <ul className="space-y-1 text-[14px]">
              <li>
                <Link
                  href="/about"
                  className="text-white hover:underline hover:text-gray-200"
                >
                  {getText("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:underline hover:text-gray-200"
                >
                  {getText("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds-returns"
                  className="text-white hover:underline hover:text-gray-200"
                >
                  {getText("refundsReturns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-white hover:underline hover:text-gray-200"
                >
                  {getText("termsConditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.livroreclamacoes.pt/Inicio/"
                  className="text-white hover:underline hover:text-gray-200"
                >
                  {getText("onlineComplaintsBook")}
                </Link>
              </li>
            </ul>
          </div>
          {/* Shipping Image */}
          <div className="flex justify-center lg:justify-start items-start">
            <Image
              src={worldDisImg}
              alt={getText("worldwideShipping")}
              width={160}
              height={130}
              sizes="160px"
            />
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#e91325] py-4 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div>
            {getText("copyright", {
              company: "HDOGLOBALTRADE",
              year: new Date().getFullYear(),
            })}
          </div>
          <div>
            <span className="text-start sm:text-center">
              {getText("weAccept")}
            </span>
            <div className="flex items-center py-4 space-x-2">
              <Image
                src={payment1}
                alt={getText("visa")}
                className="h-5"
                width={50}
                height={60}
              />
              <Image
                src={payment2}
                alt={getText("mastercard")}
                className="h-5"
                width={50}
                height={60}
              />
              <Image
                src={payment3}
                alt={getText("paypal")}
                className="h-5"
                width={50}
                height={60}
              />
              <Image
                src={payment4}
                alt={getText("americanExpress")}
                className="h-5"
                width={50}
                height={60}
              />
              <Image
                src={payment5}
                alt={getText("applePay")}
                className="h-5"
                width={50}
                height={60}
              />
              <Image
                src={payment6}
                alt={getText("googlePay")}
                className="h-5"
                width={50}
                height={60}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}