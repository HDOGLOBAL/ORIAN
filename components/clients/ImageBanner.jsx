import Image from "next/image";
import elBanner from "@/public/client/banner/imageBanner1.png";
import sirmanBanner from "@/public/client/imageBanner2.png";

export default function ImageBanners() {
  return (
    <section className="w-full max-w-[1276px] mx-auto px-4 pb-4 space-y-4">
      <div className="w-full overflow-hidden rounded-xl shadow-sm relative h-[220px] sm:h-[280px] md:h-[360px] lg:h-[440px]">
        <Image
          src={elBanner}
          alt="All parts for Electrolux Professional commercial kitchen equipment"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1276px"
          priority
        />
      </div>
      <div className="w-full overflow-hidden rounded-xl shadow-sm relative h-[220px] sm:h-[280px] md:h-[360px] lg:h-[440px]">
        <Image
          src={sirmanBanner}
          alt="All Sirman commercial kitchen equipment spare parts"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1276px"
        />
      </div>
    </section>
  );
}
