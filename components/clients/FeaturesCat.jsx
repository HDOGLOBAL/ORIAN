// import cat1 from "@/public/client/cat1.png";
// import cat2 from "@/public/client/cat2.png";
// import cat3 from "@/public/client/cat3.png";
// import cat4 from "@/public/client/cat4.png";
// import cat5 from "@/public/client/cat5.png";
// import cat6 from "@/public/client/cat6.png";
// import Image from "next/image";

// export default function FeaturedCategories() {
//   const categories = [
//     {
//       name: "Dishwasher Spare Parts",
//       color: "bg-pink-100",
//       img: cat1,
//     },
//     {
//       name: "Vegetable cutter spare parts",
//       color: "bg-purple-100",
//       img: cat2,
//     },
//     {
//       name: "Juicer spare parts",
//       color: "bg-pink-200",
//       img: cat3,
//     },
//     {
//       name: "Hand mixer spare parts",
//       color: "bg-blue-100",
//       img: cat4,
//     },
//     {
//       name: "Food processor/ bowl cutters spare parts",
//       color: "bg-green-100",
//       img: cat5,
//     },
//     {
//       name: "Cooking application spare parts",
//       color: "bg-orange-100",
//       img: cat6,
//     },
//   ];

//   return (
//     <section className="max-w-[1276px] w-full mx-auto py-12 px-4">
//       <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[48px] mb-8">
//         Featured Categories
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
//         {categories.map((cat, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center text-center w-full"
//           >
//             <div
//               className={`w-40 h-40 sm:w-32 sm:h-32 lg:w-[184px] lg:h-[184px] rounded-full ${cat.color} flex items-center justify-center overflow-hidden`}
//             >
//               <Image
//                 src={cat.img}
//                 alt={cat.name}
//                 className="object-contain"
//                 width={130}
//                 height={130}
//               />
//             </div>
//             <p className="mt-2 text-sm md:text-base">{cat.name}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

'use client'
import Image from "next/image";
import Link from "next/link";
import { useDomain } from "@/providers/useDomain";
import { useEffect, useState } from "react";
import { getFeaturedCategories } from "@/database/queries";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function FeaturedCategories() {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const colors = [
    "bg-pink-100",
    "bg-purple-100",
    "bg-pink-200",
    "bg-blue-100",
    "bg-green-100",
    "bg-orange-100",
  ];

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await getFeaturedCategories();
      // Limit to 6 categories for display
      setCategories(fetchedCategories.slice(0, 6));
    } catch (error) {
      console.error("Error fetching featured categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  // Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const titleMap = {
    pt: "Categorias em Destaque",
    fr: "Catégories Vedettes",
    es: "Categorías Destacadas",
    he: "קטגוריות נבחרות",
    de: "Ausgewählte Kategorien",
  };

  const sectionTitle = titleMap[uiLang] || "Featured Categories";

  if (isLoading) {
    return (
      <section className="max-w-[1276px] w-full mx-auto py-12 px-4">
        <div className="flex justify-center items-center gap-3 mb-8">
          <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[48px]">
            {sectionTitle}
          </h2>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Refresh categories"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="max-w-[1276px] w-full mx-auto py-12 px-4">
        <div className="flex justify-center items-center gap-3 mb-8">
          <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[48px]">
            {sectionTitle}
          </h2>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Refresh categories"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div className="text-center text-gray-500">No categories available</div>
      </section>
    );
  }

  return (
    <section className="max-w-[1276px] w-full mx-auto py-12 px-4">
      <div className="flex justify-center items-center gap-3 mb-8">
        <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[48px]">
          {sectionTitle}
        </h2>
        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          title="Refresh categories"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.id}`}
            className="flex flex-col items-center text-center w-full group cursor-pointer"
          >
            <div
              className={`w-40 h-40 sm:w-32 sm:h-32 lg:w-[184px] lg:h-[184px] rounded-full ${
                colors[index % colors.length]
              } flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-md group-hover:shadow-lg`}
            >
              {category.icon ? (
                <Image
                  src={category.icon}
                  alt={category.name}
                  className="object-contain w-full h-full rounded-full"
                  width={184}
                  height={184}
                  unoptimized={true}
                  priority={false}
                />
              ) : (
                <div className="text-gray-400 text-center text-xs px-2">
                  {category.name}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm md:text-base line-clamp-2 group-hover:text-[#0eadef] transition-colors duration-300">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
