"use client";

import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const NoCard = () => {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    title: {
      en: "No Cart Added",
      pt: "Nenhum Carrinho Adicionado",
      fr: "Aucun Panier Ajouté",
      es: "Ningún Carrito Añadido",
      he: "עגלת הקניות ריקה",
      de: "Kein Warenkorb hinzugefügt",
    },
    message: {
      en: "Please add your cart",
      pt: "Por favor, adicione seu carrinho",
      fr: "Veuillez ajouter votre panier",
      es: "Por favor, añade tu carrito",
      he: "אנא הוסף פריטים לעגלה",
      de: "Bitte fügen Sie Artikel zum Warenkorb hinzu",
    },
  };

  // Get localized text with English fallback
  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  return (
    <div className="p-4 rounded-md border mb-8 border-gray-600/30">
      <h2 className="text-2xl font-bold text-primary">{getText("title")}</h2>
      <p className="text-slate-600">{getText("message")}</p>
    </div>
  );
};

export default NoCard;
