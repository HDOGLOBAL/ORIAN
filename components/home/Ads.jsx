import Image from "next/image";
import Link from "next/link";

export default function Ads() {
  return (
    <div className="container pb-16">
      <Link href="#">
        <Image
          src="/assets/images/offer.jpg"
          alt="product 1"
          className="w-full"
          width={400}
          height={400}
        />
      </Link>
    </div>
  );
}
