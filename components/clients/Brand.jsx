import Image from "next/image";
import teamImg from "@/public/client/team.jpg";
const brandLogos = [
  {
    name: "Electrolux",
    image: teamImg,
  },
  {
    name: "Celme Electric",
    image: teamImg,
  },
  {
    name: "River",
    image: teamImg,
  },
  {
    name: "Santos",
    image: teamImg,
  },
];

const PopularBrands = () => {
  return (
    <section className="bg-red-600 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">
          Our popular brand
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brandLogos.map((brand, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                className="max-h-16 object-contain"
                width={300}
                height={300}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
