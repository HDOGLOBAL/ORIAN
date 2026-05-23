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
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import hero1 from "@/public/client/hero2.jpg";
import hero2 from "@/public/client/section1.png";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

const i18n = {
  en: {
    titleBlack: "Industrial Kitchen",
    titleRed: "Equipment & Spare Parts",
    subtitle: "High quality parts for professional kitchens – Worldwide Shipping",
    description:
      "We supply a wide range of spare parts and accessories for industrial kitchen equipment. Top brands, reliable service and fast shipping to customers around the world.",
    shopNow: "Shop Now",
    viewMore: "View More",
  },
  pt: {
    titleBlack: "Equipamento de Cozinha",
    titleRed: "Industrial & Peças Sobresselentes",
    subtitle: "Peças de alta qualidade para cozinhas profissionais – Envio Mundial",
    description:
      "Fornecemos uma ampla gama de peças sobresselentes e acessórios para equipamento de cozinha industrial. Marcas de topo, serviço fiável e envio rápido.",
    shopNow: "Comprar Agora",
    viewMore: "Ver Mais",
  },
  fr: {
    titleBlack: "Équipement de Cuisine",
    titleRed: "Industrielle & Pièces Détachées",
    subtitle: "Pièces de haute qualité pour cuisines professionnelles – Livraison mondiale",
    description:
      "Nous fournissons une large gamme de pièces détachées et accessoires pour équipements de cuisine industrielle. Marques de premier plan, service fiable.",
    shopNow: "Acheter Maintenant",
    viewMore: "Voir Plus",
  },
  es: {
    titleBlack: "Equipos de Cocina",
    titleRed: "Industrial & Repuestos",
    subtitle: "Repuestos de alta calidad para cocinas profesionales – Envío mundial",
    description:
      "Suministramos una amplia gama de repuestos y accesorios para equipos de cocina industrial. Marcas líderes, servicio fiable y envío rápido.",
    shopNow: "Comprar Ahora",
    viewMore: "Ver Más",
  },
  de: {
    titleBlack: "Gewerbliche Küche",
    titleRed: "Ausrüstung & Ersatzteile",
    subtitle: "Hochwertige Teile für professionelle Küchen – Weltweiter Versand",
    description:
      "Wir liefern eine breite Palette an Ersatzteilen und Zubehör für Gewerbeküchen. Top-Marken, zuverlässiger Service und schneller Versand weltweit.",
    shopNow: "Jetzt kaufen",
    viewMore: "Mehr anzeigen",
  },
  he: {
    titleBlack: "ציוד מטבח תעשייתי",
    titleRed: "וחלקי חילוף",
    subtitle: "חלקי חילוף איכותיים למטבחים מקצועיים – משלוח לכל העולם",
    description:
      "אנו מספקים מגוון רחב של חלקי חילוף ואביזרים לציוד מטבח תעשייתי. מותגים מובילים, שירות אמין ומשלוח מהיר.",
    shopNow: "קנה עכשיו",
    viewMore: "ראה עוד",
  },
};

export default function Banner() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const isRtl = uiLang === "he";
  const t = i18n[uiLang] || i18n.en;

  return (
    <div className="w-full max-w-[1260px] mx-auto px-4 my-2" dir={isRtl ? "rtl" : "ltr"}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={700}
        loop
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden shadow-md [&_.swiper-pagination]:bottom-3 [&_.swiper-pagination-bullet]:bg-gray-400 [&_.swiper-pagination-bullet-active]:bg-[#c41e3a]"
      >
        <SwiperSlide>
          <div className="flex flex-col md:flex-row w-full min-h-[300px] md:h-[380px] lg:h-[420px] bg-white">
            {/* LEFT — text panel */}
            <div className={`flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 md:py-0 ${isRtl ? "items-end text-right" : "items-start text-left"}`}>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight text-gray-900 mb-1">
                {t.titleBlack}
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight text-[#c41e3a] mb-3">
                {t.titleRed}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2">{t.subtitle}</p>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6 leading-relaxed">{t.description}</p>
              <div className={`flex gap-3 flex-wrap ${isRtl ? "flex-row-reverse" : ""}`}>
                <Link
                  href="/shop"
                  className="bg-[#c41e3a] hover:bg-[#a01829] text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow hover:shadow-md"
                >
                  {t.shopNow}
                </Link>
                <Link
                  href="/shop"
                  className="border border-gray-400 text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                >
                  {t.viewMore}
                </Link>
              </div>
            </div>
            {/* RIGHT — image panel */}
            <div className="w-full md:w-[52%] relative min-h-[200px] md:min-h-0">
              <Image
                src={hero1}
                alt="Dynamic Mixer Spare Parts & Accessories — HDO Trade"
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          </div>
        </SwiperSlide>
        {/* Slide 2 — mirrored layout */}
        <SwiperSlide>
          <div className="flex flex-col md:flex-row-reverse w-full min-h-[300px] md:h-[380px] lg:h-[420px] bg-white">
            <div className={`flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 md:py-0 ${isRtl ? "items-end text-right" : "items-start text-left"}`}>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight text-gray-900 mb-1">
                All Types of
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight text-[#c41e3a] mb-3">
                Commercial Kitchen Taps
              </h2>
              <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                Professional Grade — Worldwide Shipping
              </p>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
                Complete range of commercial kitchen faucets and tap components — mixer taps, pre-rinse taps, wall taps and more. Fast worldwide delivery.
              </p>
              <div className={`flex gap-3 flex-wrap ${isRtl ? "flex-row-reverse" : ""}`}>
                <Link href="/shop" className="bg-[#c41e3a] hover:bg-[#a01829] text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow hover:shadow-md">
                  {t.shopNow}
                </Link>
                <Link href="/shop" className="border border-gray-400 text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200">
                  {t.viewMore}
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[52%] relative min-h-[200px] md:min-h-0">
              <Image
                src={hero2}
                alt="Commercial Kitchen Taps — HDO Trade"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
