// import Image from "next/image";
// import banner1 from "@/public/client/banner/imageBanner1.png";
// import banner2 from "@/public/client/imageBanner2.png";
// import banner3 from "@/public/client/feature.jpg";
// import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

// export default function ImageBanners() {
//   return (
//     <section className="w-full max-w-[1276px] mx-auto px-4 py-10 space-y-6">
//       {/* Banner 1 - with buttons */}
//       <div className="w-full lg:h-[692px] relative overflow-hidden rounded-xl shadow aspect-[16/9] sm:aspect-[3/1]">
//         <Image
//           src={banner3}
//           alt="Banner 1"
//           fill
//           unoptimized
//           className="object-cover"
//           sizes="(max-width: 768px) 100vw, 1000px"
//           priority
//         />

//         {/* Buttons: centered on mobile, left on desktop */}
//         <div className="absolute bottom-4 sm:bottom-6 left-1/2 sm:left-6 transform sm:transform-none -translate-x-1/2 sm:translate-x-0 w-full sm:w-auto px-4 sm:px-0">
//           <div className="flex flex-col items-center sm:items-start justify-center sm:justify-start gap-3 w-full">
//             {/* WhatsApp Button */}
//             <a
//               href="https://wa.me/+351935210099"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition w-full sm:w-[280px] text-sm sm:text-base"
//             >
//               <FaWhatsapp className="text-lg text-white" />
//               Send Message on WhatsApp
//             </a>

//             {/* Email Button */}
//             <a
//               href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@hdotrade.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:text-white inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#000000] px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition w-full sm:w-[280px] text-sm sm:text-base"
//             >
//               <FaEnvelope className="text-lg " />
//               Send Message on Gmail
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Banner 2 and 3 - plain */}
//       {[banner1, banner2].map((img, idx) => (
//         <div
//           key={idx}
//           className="w-full relative overflow-hidden rounded-xl shadow aspect-[16/9] sm:aspect-[3/1]"
//         >
//           <Image
//             src={img}
//             alt={`Slide ${idx + 1}`}
//             fill
//             unoptimized
//             className="object-fill"
//             priority={idx === 0}
//           />
//         </div>
//       ))}
//     </section>
//   );
// }


'use client'
import Image from "next/image";
import banner1 from "@/public/client/banner/imageBanner1.png";
import banner2 from "@/public/client/imageBanner2.png";
import banner3 from "@/public/client/feature.jpg";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function ImageBanners() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    whatsappText: {
      en: "Send Message on WhatsApp",
      pt: "Enviar Mensagem no WhatsApp",
      fr: "Envoyer un Message sur WhatsApp",
      es: "Enviar Mensaje por WhatsApp",
      he: "שלח הודעה בוואטסאפ",
      de: "Nachricht auf WhatsApp senden",
    },
    gmailText: {
      en: "Send Message on Gmail",
      pt: "Enviar Mensagem no Gmail",
      fr: "Envoyer un Message sur Gmail",
      es: "Enviar Mensaje por Gmail",
      he: "שלח הודעה בג'ימייל",
      de: "Nachricht per Gmail senden",
    },
    bannerAlt: {
      en: "Banner",
      pt: "Banner",
      fr: "Bannière",
      es: "Banner",
      he: "באנר",
      de: "Banner",
    },
    slideAlt: {
      en: "Slide",
      pt: "Slide",
      fr: "Diapositive",
      es: "Diapositiva",
      he: "שקופית",
      de: "Folie",
    },
  };

  // Get localized text with English fallback
  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  return (
    <section className="w-full max-w-[1276px] mx-auto px-4 py-10 space-y-6">
      {/* Banner 1 - with buttons */}
      <div className="w-full lg:h-[692px] relative overflow-hidden rounded-xl shadow aspect-[16/9] sm:aspect-[3/1]">
        <Image
          src={banner3}
          alt={`${getText("bannerAlt")} 1`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1000px"
          priority
        />
        {/* Buttons: centered on mobile, left on desktop */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 sm:left-6 transform sm:transform-none -translate-x-1/2 sm:translate-x-0 w-full sm:w-auto px-4 sm:px-0">
          <div className="flex flex-col items-center sm:items-start justify-center sm:justify-start gap-3 w-full">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/+351935210099"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition w-full sm:w-[370px] text-sm sm:text-base"
            >
              <FaWhatsapp className="text-lg text-white" />
              {getText("whatsappText")}
            </a>
            {/* Email Button */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@hdotrade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#000000] px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition w-full sm:w-[370px] text-sm sm:text-base"
            >
              <FaEnvelope className="text-lg " />
              {getText("gmailText")}
            </a>
          </div>
        </div>
      </div>
      {/* Banner 2 and 3 - plain */}
      {[banner1, banner2].map((img, idx) => (
        <div
          key={idx}
          className="w-full relative overflow-hidden rounded-xl shadow aspect-[16/9] sm:aspect-[3/1]"
        >
          <Image
            src={img}
            alt={`${getText("slideAlt")} ${idx + 1}`}
            fill
            unoptimized
            className="object-fill"
            priority={idx === 0}
          />
        </div>
      ))}
    </section>
  );
}
