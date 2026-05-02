import Image from "next/image";
import Link from "next/link";

export default function Categories({ categoryLang, langCode }) {
  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        {categoryLang}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-1.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/bedroom`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Bedroom
          </Link>
        </div>
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-2.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/mattress`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Mattrass
          </Link>
        </div>
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-3.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/outdoor`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Outdoor
          </Link>
        </div>
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-4.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/sofa`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Sofa
          </Link>
        </div>
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-5.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/living-room`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Living Room
          </Link>
        </div>
        <div className="relative rounded-sm overflow-hidden group">
          <Image
            src="/assets/images/category/category-6.jpg"
            alt="product 1"
            className="w-full"
            width={200}
            height={200}
          />
          <Link
            href={`/${langCode}/category/kitchen`}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
          >
            Kitchen
          </Link>
        </div>
      </div>
    </div>
  );
}
