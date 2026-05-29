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
import { BsGrid3X3Gap } from "react-icons/bs";
import { useDomain } from "@/providers/useDomain";
import { useEffect, useState } from "react";
import { getFeaturedCategories } from "@/database/queries";
import { getUiLanguage } from "@/utils/uiLanguage";

// Static fallback used when DB returns no featured categories
const STATIC_CATEGORIES = [
  {
    id: "dishwasher",
    slug: "dishwasher",
    icon: "/client/categories/dishwasher/1.jpg",
    images: [
      "/client/categories/dishwasher/1.jpg",
      "/client/categories/dishwasher/2.jpg",
      "/client/categories/dishwasher/3.jpg",
      "/client/categories/dishwasher/4.jpg",
      "/client/categories/dishwasher/5.jpg",
    ],
    names: { en: "Dishwasher Spare Parts", pt: "Peças para Máquinas de Lavar", fr: "Pièces Lave-vaisselle", es: "Repuestos Lavavajillas", de: "Geschirrspüler-Ersatzteile" },
  },
  {
    id: "mixer",
    slug: "mixer",
    icon: "/client/categories/mixer/1.jpg",
    images: [
      "/client/categories/mixer/1.jpg",
      "/client/categories/mixer/2.jpg",
      "/client/categories/mixer/3.jpg",
      "/client/categories/mixer/4.jpg",
    ],
    names: { en: "Hand Mixer Accessories", pt: "Acessórios para Misturadoras", fr: "Accessoires Batteur", es: "Accesorios para Batidora", de: "Handmixer-Zubehör" },
  },
  {
    id: "juicer",
    slug: "juicer",
    icon: "/client/categories/juicer/1.jpg",
    images: [
      "/client/categories/juicer/1.jpg",
      "/client/categories/juicer/2.jpg",
      "/client/categories/juicer/3.jpg",
      "/client/categories/juicer/4.jpg",
      "/client/categories/juicer/5.jpg",
    ],
    names: { en: "Juicer Spare Parts", pt: "Peças para Espremidores", fr: "Pièces Presse-agrumes", es: "Repuestos Exprimidora", de: "Entsafter-Ersatzteile" },
  },
  {
    id: "vegetable-cutter",
    slug: "vegetable-cutter",
    icon: "/client/categories/vegetable-cutter/1.jpg",
    images: [
      "/client/categories/vegetable-cutter/1.jpg",
      "/client/categories/vegetable-cutter/2.jpg",
      "/client/categories/vegetable-cutter/3.jpg",
      "/client/categories/vegetable-cutter/4.jpg",
      "/client/categories/vegetable-cutter/5.jpg",
    ],
    names: { en: "Vegetable Cutter Parts", pt: "Peças para Cortadores", fr: "Pièces Coupe-légumes", es: "Repuestos Cortaverduras", de: "Gemüseschneider-Teile" },
  },
  {
    id: "kitchen-tap",
    slug: "kitchen-tap",
    icon: "/client/categories/kitchen-tap/1.jpg",
    images: [
      "/client/categories/kitchen-tap/1.jpg",
      "/client/categories/kitchen-tap/2.jpg",
      "/client/categories/kitchen-tap/3.jpg",
      "/client/categories/kitchen-tap/4.jpg",
    ],
    names: { en: "Commercial Kitchen Taps", pt: "Torneiras para Cozinha", fr: "Robinets Cuisine Pro", es: "Grifos Cocina Profesional", de: "Gastro-Küchenarmaturen" },
  },
  {
    id: "replacement-parts",
    slug: "replacement-parts",
    icon: "/client/categories/replacement-parts/1.jpg",
    images: [
      "/client/categories/replacement-parts/1.jpg",
      "/client/categories/replacement-parts/2.jpg",
      "/client/categories/replacement-parts/3.jpg",
      "/client/categories/replacement-parts/4.jpg",
      "/client/categories/replacement-parts/5.jpg",
    ],
    names: { en: "HDO Replacement Parts", pt: "Peças de Substituição HDO", fr: "Pièces de Rechange HDO", es: "Repuestos HDO", de: "HDO-Ersatzteile" },
  },
];

function CategoryCircle({ category, color, onOpen }) {
  const imgs = category.images?.length ? category.images : category.icon ? [category.icon] : [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 2500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div
      className="flex flex-col items-center text-center w-full cursor-pointer group"
      onClick={() => imgs.length > 0 && onOpen(imgs, idx)}
    >
      <div
        className={`w-44 h-44 sm:w-44 sm:h-44 lg:w-[220px] lg:h-[220px] rounded-full bg-white border border-gray-200 overflow-hidden shadow-md group-hover:shadow-lg relative`}
      >
        {imgs[idx] ? (
          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
            <div className="relative w-full h-full p-3">
              <Image
                src={imgs[idx]}
                alt={category.name}
                fill
                sizes="220px"
                className="object-contain transition-opacity duration-500"
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center text-xs px-2">{category.name}</div>
        )}
      </div>
      <p className="mt-2 text-sm md:text-base line-clamp-2 group-hover:text-[#0eadef] transition-colors duration-300">
        {category.name}
      </p>
    </div>
  );
}

export default function FeaturedCategories({ initialCategories = null }) {
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const resolveCategories = (cats) => {
    if (!cats || cats.length === 0) return STATIC_CATEGORIES.map(c => ({ ...c, name: c.names[uiLang] || c.names.en }));
    // Merge DB categories with static image arrays by slug
    return cats.map((cat) => {
      const staticMatch = STATIC_CATEGORIES.find((s) => s.slug === cat.slug);
      return {
        ...cat,
        images: cat.images?.length ? cat.images : staticMatch?.images || (cat.icon ? [cat.icon] : []),
        icon: cat.icon || staticMatch?.icon || "",
      };
    });
  };
  const [categories, setCategories] = useState(resolveCategories(initialCategories));
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { images: [], index: number }

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
      setCategories(resolveCategories(fetchedCategories.slice(0, 6)));
    } catch (error) {
      console.error("Error fetching featured categories:", error);
      setCategories(resolveCategories([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCategories !== null) return;
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
    en: "Shop by Category",
    pt: "Comprar por Categoria",
    fr: "Acheter par Catégorie",
    es: "Comprar por Categoría",
    he: "קנה לפי קטגוריה",
    de: "Nach Kategorie kaufen",
  };

  const subtitleMap = {
    en: "Browse our wide range of spare parts for industrial kitchen equipment",
    pt: "Explore a nossa vasta gama de peças para equipamentos de cozinha industrial",
    fr: "Parcourez notre large gamme de pièces pour équipements de cuisine industrielle",
    es: "Explore nuestra amplia gama de repuestos para equipos de cocina industrial",
    he: "עיינו במגוון הרחב של חלקי החילוף שלנו לציוד מטבח תעשייתי",
    de: "Entdecken Sie unser breites Sortiment an Ersatzteilen für Industrieküchen",
  };

  const viewAllMap = {
    en: "View All Categories",
    pt: "Ver Todas as Categorias",
    fr: "Voir Toutes les Catégories",
    es: "Ver Todas las Categorías",
    he: "ראה את כל הקטגוריות",
    de: "Alle Kategorien anzeigen",
  };

  const sectionTitle = titleMap[uiLang] || "Shop by Category";
  const sectionSubtitle = subtitleMap[uiLang] || subtitleMap.en;
  const viewAllLabel = viewAllMap[uiLang] || viewAllMap.en;

  if (isLoading) {
    return (
      <section className="max-w-[1276px] w-full mx-auto py-10 px-4">
        <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[40px] mb-2">
          {sectionTitle}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">{sectionSubtitle}</p>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c41e3a]"></div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="max-w-[1276px] w-full mx-auto py-10 px-4">
        <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[40px] mb-2">
          {sectionTitle}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">{sectionSubtitle}</p>
        <div className="text-center text-gray-500">No categories available</div>
      </section>
    );
  }

  return (
    <section className="max-w-[1276px] w-full mx-auto py-10 px-4">
      <h2 className="text-center font-bold text-[#1A1D21] text-[28px] sm:text-[32px] md:text-[40px] mb-2">
        {sectionTitle}
      </h2>
      <p className="text-center text-gray-500 text-sm mb-8">{sectionSubtitle}</p>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 justify-items-center">
        {categories.map((category, index) => (
          <CategoryCircle
            key={category.id}
            category={category}
            color={colors[index % colors.length]}
            onOpen={(imgs, startIdx) => setLightbox({ images: imgs, index: startIdx })}
          />
        ))}

        {/* View All Categories tile */}
        <Link
          href="/shop"
          className="flex flex-col items-center text-center w-full group cursor-pointer"
        >
          <div className="w-44 h-44 sm:w-44 sm:h-44 lg:w-[220px] lg:h-[220px] rounded-full bg-[#c41e3a] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md">
            <BsGrid3X3Gap className="text-white text-4xl" />
          </div>
          <p className="mt-2 text-sm md:text-base text-[#c41e3a] font-semibold line-clamp-2">
            {viewAllLabel}
          </p>
        </Link>
      </div>

      {/* Lightbox modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300"
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <Image
                src={lightbox.images[lightbox.index]}
                alt="Product photo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {lightbox.images.length > 1 && (
              <div className="flex justify-center gap-3 mt-4">
                {lightbox.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox((lb) => ({ ...lb, index: i }))}
                    className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                      i === lightbox.index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" width={56} height={56} className="object-cover w-full h-full" unoptimized />
                  </button>
                ))}
              </div>
            )}
            {lightbox.images.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white text-4xl hover:text-gray-300 hidden sm:block"
                  onClick={() => setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }))}
                >
                  ‹
                </button>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white text-4xl hover:text-gray-300 hidden sm:block"
                  onClick={() => setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.images.length }))}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
