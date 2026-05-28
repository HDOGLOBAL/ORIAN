import Image from "next/image";
import elBanner from "@/public/client/banner/imageBanner1.png";
import sirmanBanner from "@/public/client/imageBanner2.png";

export default function ImageBanners() {
  return (
    <section className="w-full max-w-[1276px] mx-auto px-4 pb-4 space-y-4">
      <div className="w-full overflow-hidden rounded-xl shadow-sm">
        <Image
          src={elBanner}
          alt="All parts for Electrolux Professional commercial kitchen equipment"
          className="w-full h-auto block"
          priority
        />
      </div>
      <div className="w-full overflow-hidden rounded-xl shadow-sm">
        <Image
          src={sirmanBanner}
          alt="All Sirman commercial kitchen equipment spare parts"
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
}
