"use client";

import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const NoProduct = () => {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    title: {
      en: "No Products Found",
      pt: "Nenhum Produto Encontrado",
      fr: "Aucun Produit Trouvé",
      es: "No se Encontraron Productos",
      he: "לא נמצאו מוצרים",
      de: "Keine Produkte gefunden",
      it: "Nessun Prodotto Trovato",
    },
    message: {
      en: "Try changing your search criteria",
      pt: "Tente alterar seus critérios de pesquisa",
      fr: "Essayez de modifier vos critères de recherche",
      es: "Intente cambiar sus criterios de búsqueda",
      he: "נסה לשנות את קריטריוני החיפוש",
      de: "Versuchen Sie, Ihre Suchkriterien zu ändern",
      it: "Prova a modificare i tuoi criteri di ricerca",
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

export default NoProduct;
