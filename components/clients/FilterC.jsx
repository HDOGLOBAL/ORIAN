

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  getManufacturers,
  getSubcategoriesByCategory,
  getCategoriesByManufacturer,
} from "@/database/queries";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function FilterCWrapper() {
  const router = useRouter();
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [filters, setFilters] = useState({
    manufacturer: "",
    category: "",
    subcategory: "",
  });
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const isRtl = uiLang === "he";

  // Internationalization mappings
  const textMap = {
    selectManufacturer: {
      pt: "SELECIONE FABRICANTE",
      fr: "SÉLECTIONNER FABRICANT",
      es: "SELECCIONAR FABRICANTE",
      en: "SELECT MANUFACTURER",
      he: "בחר יצרן",
      de: "HERSTELLER WÄHLEN",
    },
    selectCategory: {
      pt: "SELECIONE CATEGORIA",
      fr: "SÉLECTIONNER CATÉGORIE",
      es: "SELECCIONAR CATEGORÍA",
      en: "SELECT CATEGORY",
      he: "בחר קטגוריה",
      de: "KATEGORIE WÄHLEN",
    },
    selectSubcategory: {
      pt: "SELECIONE SUBCATEGORIA",
      fr: "SÉLECTIONNER SOUS-CATÉGORIE",
      es: "SELECCIONAR SUBCATEGORÍA",
      en: "SELECT SUBCATEGORY",
      he: "בחר תת-קטגוריה",
      de: "UNTERKATEGORIE WÄHLEN",
    },
    noSubcategory: {
      pt: "SEM SUBCATEGORIA",
      fr: "PAS DE SOUS-CATÉGORIE",
      es: "SIN SUBCATEGORÍA",
      en: "NO SUBCATEGORY",
      he: "אין תת-קטגוריה",
      de: "KEINE UNTERKATEGORIE",
    },
    selectManufacturerFirst: {
      pt: "SELECIONE UM FABRICANTE PRIMEIRO",
      fr: "SÉLECTIONNER UN FABRICANT D'ABORD",
      es: "SELECCIONAR FABRICANTE PRIMERO",
      en: "SELECT MANUFACTURER FIRST",
      he: "בחר יצרן תחילה",
      de: "ERST HERSTELLER WÄHLEN",
    },
    selectCategoryFirst: {
      pt: "SELECIONE UMA CATEGORIA PRIMEIRO",
      fr: "SÉLECTIONNER UNE CATÉGORIE D'ABORD",
      es: "SELECCIONAR CATEGORÍA PRIMERO",
      en: "SELECT CATEGORY FIRST",
      he: "בחר קטגוריה תחילה",
      de: "ERST KATEGORIE WÄHLEN",
    },
    search: {
      pt: "Pesquisar",
      fr: "Rechercher",
      es: "Buscar",
      en: "Search",
      he: "חיפוש",
      de: "Suchen",
    },
  };

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  // Helper function to get localized name
  const getLocalizedName = (obj) => {
    if (!obj) return "";

    const nameMap = {
      pt: obj.namePt,
      fr: obj.nameFr,
      es: obj.nameEs,
      he: obj.nameHe,
      de: obj.nameDe,
      en: obj.name,
    };

    return nameMap[uiLang] || nameMap.en || obj.name;
  };

  useEffect(() => {
    const fetchData = async () => {
      const manufacturersData = await getManufacturers();
      setManufacturers(manufacturersData);
    };
    fetchData();
  }, []);

  // Fetch categories based on selected manufacturer
  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedManufacturer) {
        const data = await getCategoriesByManufacturer(selectedManufacturer);
        setCategories(data || []);
      } else {
        setCategories([]);
      }
      setSelectedCategory("");
      setSubcategories([]);
    };
    fetchCategories();
  }, [selectedManufacturer]);

  // Fetch subcategories based on selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        const data = await getSubcategoriesByCategory(selectedCategory);
        setSubcategories(data || []);
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "manufacturer") {
      setSelectedManufacturer(value);
      setFilters((prev) => ({
        ...prev,
        manufacturer: value,
        category: "",
        subcategory: "",
      }));
    } else if (name === "category") {
      setSelectedCategory(value);
      setFilters((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters.manufacturer)
      params.append("manufacturer", filters.manufacturer);
    if (filters.category) params.append("category", filters.category);
    if (filters.subcategory) params.append("subcategory", filters.subcategory);
    // Redirect to shop page with filters
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-[1260px] mx-auto px-1" dir={isRtl ? "rtl" : "ltr"}>
      <div className={`w-full flex flex-col justify-center items-center gap-4 lg:rounded-[35px] p-4 bg-white ${isRtl ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        {/* Manufacturer Select */}
        <select
          name="manufacturer"
          value={filters.manufacturer}
          onChange={handleFilterChange}
          className={`border border-[#00000033] px-4 lg:px-6 py-2 text-[16px] rounded-[20px] focus:outline-none focus:border-[#1e40af] w-full lg:flex-1 font-sans bg-white text-[#1e3a5c] placeholder-[#1e3a5c] ${isRtl ? "text-right" : ""}`}
          style={{ minHeight: '62px', fontWeight: 400, letterSpacing: '0.5px', boxShadow: '0 2px 8px #00000010' }}
        >
          <option value="">{getText("selectManufacturer")}</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer?.id} value={manufacturer.id}>
              {getLocalizedName(manufacturer)}
            </option>
          ))}
        </select>
        {/* Category Select */}
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          disabled={!filters.manufacturer}
          className={`border border-[#00000033] px-4 lg:px-6 py-2 text-[14px] rounded-[20px] focus:outline-blue focus:border-gray-500 w-full lg:flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${isRtl ? "text-right" : ""}`}
          style={{ minHeight: '62px' }}
        >
          <option value="">{filters.manufacturer ? getText("selectCategory") : getText("selectManufacturerFirst")}</option>
          {categories.map((category) => (
            <option key={category?.id} value={category?.id}>
              {getLocalizedName(category)}
            </option>
          ))}
        </select>
        {/* Subcategory Select */}
        <select
          name="subcategory"
          value={filters.subcategory}
          onChange={handleFilterChange}
          disabled={!filters.category}
          className={`border border-[#00000033] px-4 lg:px-6 py-2 text-[14px] rounded-[20px] focus:outline-blue focus:border-gray-500 w-full lg:flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${isRtl ? "text-right" : ""}`}
          style={{ minHeight: '62px' }}
        >
          <option value="">
            {!filters.category
              ? getText("selectCategoryFirst")
              : subcategories.length
              ? getText("selectSubcategory")
              : getText("noSubcategory")}
          </option>
          {subcategories.map((sub) => (
            <option key={sub?.id} value={sub?.id}>
              {getLocalizedName(sub)}
            </option>
          ))}
        </select>
        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="bg-[#e91325] px-4 py-2 text-base lg:text-md rounded-[20px] text-white font-bold transition-colors w-full lg:w-32 border-0 hover:bg-[#d10f1f] active:bg-[#d10f1f] focus:bg-[#d10f1f] focus:outline-none"
          style={{ minHeight: '62px' }}
        >
          {getText("search")}
        </button>
      </div>
    </div>
  );
}
