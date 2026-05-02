"use client";

import banner1 from "@/public/client/banner/button1.png";
import banner2 from "@/public/client/banner/button2.png";
import Link from "next/link";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function ButtonImg() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Internationalization mappings
  const textMap = {
    shopNow: {
      pt: "Comprar Agora",
      fr: "Acheter Maintenant",
      es: "Comprar Ahora",
      en: "Shop Now",
      he: "קנה עכשיו",
      de: "Jetzt kaufen",
    },
  };

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-[1279px] mx-auto">
      {/* Card 1 */}
      <div
        className="relative bg-cover bg-center rounded-xl shadow-md h-[400px] md:h-[766px]"
        style={{ backgroundImage: `url(${banner1.src})` }}
      >
        <div className="absolute inset-0 flex mb-[130px] flex-col justify-end md:justify-center items-center p-4">
          <Link
            href="/shop"
            className="bg-red-600 text-white w-full md:w-auto max-w-[310px] px-6 py-2 transition hover:translate-y-1 rounded-full text-sm sm:text-base flex justify-center items-center whitespace-nowrap"
          >
            {getText("shopNow")}
          </Link>
        </div>
      </div>
      {/* Card 2 */}
      <div
        className="relative bg-cover bg-center rounded-xl shadow-md h-[400px] md:h-[766px]"
        style={{ backgroundImage: `url(${banner2.src})` }}
      >
        <div className="absolute inset-0 flex mb-[130px] flex-col justify-end md:justify-center items-center p-4">
          <Link
            href="/shop"
            className="bg-red-600 text-white w-full md:w-auto max-w-[310px] px-6 py-2 transition hover:translate-y-1 rounded-full text-sm sm:text-base flex justify-center items-center whitespace-nowrap"
          >
            {getText("shopNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
