import banner1 from "@/public/client/banner/banner2.png";
import Image from "next/image";

export default function Banner2() {
  return (
    <div className="relative w-full max-w-[1280px] h-[300px] sm:h-[400px] md:h-[546px] mx-auto my-12 px-4">
      <Image
        src={banner1}
        alt="banner1"
        fill
        unoptimized
        className="object-cover rounded-xl"
        priority
      />
    </div>
  );
}
