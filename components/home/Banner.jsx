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

const shopNowText = { en: "Shop Now", pt: "Comprar Agora", fr: "Acheter Maintenant", es: "Comprar Ahora", de: "Jetzt kaufen", he: "קנה עכשיו" };
const viewMoreText = { en: "View More", pt: "Ver Mais", fr: "Voir Plus", es: "Ver Más", de: "Mehr anzeigen", he: "ראה עוד" };

export default function Banner() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const shopNow = shopNowText[uiLang] || shopNowText.en;
  const viewMore = viewMoreText[uiLang] || viewMoreText.en;

  return (
    <div className="w-full max-w-[1260px] mx-auto px-4 my-2">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={700}
        loop
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden shadow-md [&_.swiper-pagination]:bottom-3 [&_.swiper-pagination-bullet]:bg-white/60 [&_.swiper-pagination-bullet-active]:bg-white"
      >
        {/* Slide 1 — Dynamic Mixer */}
        <SwiperSlide>
          <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[440px]">
            <Image
              src={hero1}
              alt="Dynamic Mixer Spare Parts & Accessories — HDO Trade"
              fill
              unoptimized
              className="object-fill"
              priority
            />
            <div className="absolute bottom-6 right-[6%] flex gap-3 z-10">
              <Link
                href="/shop"
                className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 shadow"
            >
              {shopNow}
            </Link>
              <Link
                href="/shop"
                className="bg-transparent text-white border border-white hover:bg-white/20 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200"
              >
                {viewMore}
              </Link>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 — Commercial Kitchen Taps */}
        <SwiperSlide>
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src={hero2}
              alt="Commercial Kitchen Taps — HDO Trade"
              fill
              unoptimized
              className="object-fill"
            />
            <div className="absolute bottom-6 right-[6%] flex gap-3 z-10">
              <Link
                href="/shop"
                className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 shadow"
            >
              {shopNow}
            </Link>
              <Link
                href="/shop"
                className="bg-transparent text-white border border-white hover:bg-white/20 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200"
              >
                {viewMore}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
