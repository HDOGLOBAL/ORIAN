'use client'
import Image from "next/image";
import banner1 from "@/public/client/brand1.png";
import banner2 from "@/public/client/brand2.png";
import banner3 from "@/public/client/brand3.png";
import banner4 from "@/public/client/brand4.png";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function OurBrand({
  title = "Some of Our Brands",
  color = "#1A1D21",
}) {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  const titleMap = {
    en: "Some of Our Brands",
    pt: "Algumas das Nossas Marcas",
    fr: "Quelques-unes de Nos Marques",
    es: "Algunas de Nuestras Marcas",
    he: "חלק מהמותגים שלנו",
    de: "Einige unserer Marken",
  };

  const brandAltMap = {
    en: "Brand",
    pt: "Marca",
    fr: "Marque",
    es: "Marca",
    he: "מותג",
    de: "Marke",
  };

  const localizedTitle = titleMap[uiLang] || title;
  const brandAltText = brandAltMap[uiLang] || "Brand";

  return (
    <div className="max-w-[1280px] mx-auto my-[70px] px-4">
      <h1
        style={{ color }}
        className="text-center font-[700] text-[32px] md:text-[48px] mb-8"
      >
        {localizedTitle}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[banner1, banner2, banner3, banner4].map((banner, idx) => (
          <div
            key={idx}
            className="relative w-full aspect-[16/9] border border-[#82818180] rounded-xl"
          >
            <Image
              src={banner}
              alt={`${brandAltText} ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover rounded-xl"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
