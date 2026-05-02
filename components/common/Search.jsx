"use client";
import { SearchIcon } from "@/public/icons/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Internationalization mappings
  const textMap = {
    all: {
      pt: "Todos",
      fr: "Tous",
      es: "Todos",
      en: "All",
      he: "הכל",
      de: "Alle",
    },
    searchPlaceholder: {
      pt: "Pesquisar um produto...",
      fr: "Rechercher un produit...",
      es: "Buscar un producto...",
      en: "Search a product ...",
      he: "חפש מוצר...",
      de: "Produkt suchen...",
    },
  };

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const doSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("search", searchValue);
    replace(`/shop?${params.toString()}`);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
  };

  return (
    <div className="w-full sm:w-[300px] xl:w-[430px] max-w-xl flex relative">
      {/* "All" part */}
      <div className="flex items-center px-4 bg-gray-100 border border-gray-500 border-r-0 rounded-l-[20px]">
        <span className="text-[#1a1d21] text-base">{getText("all")}</span>
      </div>

      <input
        type="text"
        name="search"
        id="search"
        value={searchValue}
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
        placeholder={getText("searchPlaceholder")}
        className="flex-1 border text-gray-800  border-gray-500 rounded-r-[20px] px-4 py-2 pr-12 focus:outline-none focus:border-gray-500 focus:ring-0"
        aria-label={getText("searchPlaceholder")}
      />
      {/* Search icon button */}
      <button
        onClick={doSearch}
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label={getText("searchPlaceholder")}
      >
        <SearchIcon />
      </button>
    </div>
  );
}
