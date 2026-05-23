// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import Image from "next/image";
// import "swiper/css";

// import banner1 from "@/public/client/section1.png";
// import banner2 from "@/public/client/hero2.jpg";

// const slides = [
//   {
//     image: banner1,
//     title: (
//       <>
//         All Types of <br /> Commercial Faucets
//       </>
//     ),
//   },
//   {
//     image: banner2,
//     title: (
//       <>
//         ALL THE SPARE PARTS & <br /> ACCESSORIES FOR DYNAMIC MIXER
//       </>
//     ),
//   },
//   // Add more slides with different titles as needed
// ];

// export default function Banner() {
//   return (
//     <div className="w-full max-w-[1260px] mx-auto px-4">
//       <Swiper
//         modules={[Autoplay]}
//         spaceBetween={20}
//         slidesPerView={1}
//         autoplay={{ delay: 4000, disableOnInteraction: false }}
//         speed={800}
//         loop
//       >
//         {slides.map((slide, idx) => (
//           <SwiperSlide key={idx}>
//             <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[429px] rounded-xl overflow-hidden shadow">
//               <Image
//                 src={slide.image}
//                 alt={`Slide ${idx + 1}`}
//                 fill
//                 unoptimized
//                 className="object-fill"
//                 priority={idx === 0}
//               />

//               {/* Optional Dark Overlay */}
//               <div className="absolute inset-0 bg-opacity-40 sm:bg-opacity-50 z-10" />

//               {/* Text + Buttons - hidden on mobile */}
//               <div className="absolute inset-0 z-20 items-center justify-end hidden sm:flex">
//                 <div className="mr-[18%] max-w-lg text-white text-right">
//                   <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//                     {slide.title}
//                   </h2>
//                   <div className="flex gap-4 justify-end">
//                     <button className="bg-white hover:bg-blue-700 hover:text-white text-blue-600 px-6 py-2 rounded-md transition">
//                       Shop Now
//                     </button>
//                     <button className="bg-transparent text-white border border-white hover:bg-gray-100 hover:text-blue-700 px-6 py-2 rounded-md transition">
//                       View More
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }


"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import banner1 from "@/public/client/section1.png";
import banner2 from "@/public/client/hero2.jpg";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const slides = [
  { image: banner1, titleKey: "commercialFaucets" },
  { image: banner2, titleKey: "sparePartsAccessories" },
];

export default function Banner() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const isRtl = uiLang === "he";

  const textMap = {
    commercialFaucets: {
      pt: { line1: "Todos os Tipos de", line2: "Torneiras Comerciais" },
      fr: { line1: "Tous les Types de", line2: "Robinets Commerciaux" },
      es: { line1: "Todos los Tipos de", line2: "Grifos Comerciales" },
      en: { line1: "All Types of", line2: "Commercial Faucets" },
      he: { line1: "כל סוגי", line2: "ברזי מסחר" },
      de: { line1: "Alle Arten von", line2: "Gewerblichen Armaturen" },
    },
    sparePartsAccessories: {
      pt: { line1: "TODAS AS PEÇAS SOBRESSELENTES &", line2: "ACESSÓRIOS PARA MISTURADOR DINÂMICO" },
      fr: { line1: "TOUTES LES PIÈCES DÉTACHÉES &", line2: "ACCESSOIRES POUR MÉLANGEUR DYNAMIQUE" },
      es: { line1: "TODAS LAS PIEZAS DE REPUESTO &", line2: "ACCESORIOS PARA MEZCLADOR DINÁMICO" },
      en: { line1: "ALL THE SPARE PARTS &", line2: "ACCESSORIES FOR DYNAMIC MIXER" },
      he: { line1: "כל חלקי החילוף והאביזרים", line2: "למיקסר דינמי" },
      de: { line1: "ALLE ERSATZTEILE &", line2: "ZUBEHÖR FÜR DYNAMISCHEN MIXER" },
    },
    shopNow: { pt: "Comprar Agora", fr: "Acheter Maintenant", es: "Comprar Ahora", en: "Shop Now", he: "קנה עכשיו", de: "Jetzt kaufen" },
    viewMore: { pt: "Ver Mais", fr: "Voir Plus", es: "Ver Más", en: "View More", he: "ראה עוד", de: "Mehr anzeigen" },
  };

  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  const getSlideTitle = (titleKey) => {
    const d = getText(titleKey);
    return <>{d.line1}<br />{d.line2}</>;
  };

  return (
    <div className="w-full max-w-[1260px] mx-auto px-4" dir={isRtl ? "rtl" : "ltr"}>
      <Swiper
        key={uiLang}
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={800}
        loop
        dir={isRtl ? "rtl" : "ltr"}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[429px] rounded-xl overflow-hidden shadow">
              <Image
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                fill
                unoptimized
                className="object-fill"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-opacity-40 sm:bg-opacity-50 z-10" />
              <div className="absolute inset-0 z-20 hidden sm:block">
                <div className={`absolute top-1/2 max-w-lg -translate-y-1/2 text-white ${isRtl ? "right-[12%] text-right" : "right-[18%] text-right"}`}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {getSlideTitle(slide.titleKey)}
                  </h2>
                  <div className={`flex gap-4 ${isRtl ? "justify-end flex-row-reverse" : "justify-end"}`}>
                    <button className="bg-white hover:bg-blue-700 hover:text-white text-blue-600 px-6 py-2 rounded-md transition">
                      {getText("shopNow")}
                    </button>
                    <button className="bg-transparent text-white border border-white hover:bg-gray-100 hover:text-blue-700 px-6 py-2 rounded-md transition">
                      {getText("viewMore")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
