
'use client'
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function RelatedTitle() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Internationalization mappings
  const titleMap = {
    pt: "Produtos Relacionados",
    fr: "Produits Liés",
    es: "Productos Relacionados",
    en: "Related Products",
    he: "מוצרים קשורים",
    de: "Verwandte Produkte",
  };

  // Get localized title with fallback to English
  const title = titleMap[uiLang] || titleMap.en;

  return (
    <h1 className="font-bold text-3xl md:text-5xl text-center pt-9 lg:pt-0">
      {title}
    </h1>
  );
}
