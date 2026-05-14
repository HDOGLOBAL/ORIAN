// "use client";

// import { MdKeyboardArrowRight } from "react-icons/md";
// import { RiCheckboxCircleLine } from "react-icons/ri";
// import { FaWhatsapp } from "react-icons/fa";
// import { SiGmail } from "react-icons/si";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import placeholder from "@/public/client/banner/placeholder.png";
// import AddCard from "../shop/AddCard";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";
// import { v4 as uuidv4 } from "uuid";
// import { addToCart } from "@/database/queries";
// import { serverRevalidate } from "@/utils/serverRev";
// import { useCart } from "@/providers/CartContext";
// import { useRouter } from "next/navigation";
// import { useDomain } from "@/providers/useDomain";

// const ProductPage = ({ product, currency }) => {
//   const [isClient, setIsClient] = useState(false);
//   const [count, setCount] = useState(1);

//   const lang = useDomain();

//   // console.log("Product data:.............", product);

//   const nameMap = {
//     pt: product?.namePt,
//     fr: product?.nameFr,
//     es: product?.nameEs,
//   };

//   const descriptionMap = {
//     pt: product?.descriptionPt,
//     fr: product?.descriptionFr,
//     es: product?.descriptionEs,
//   };

//   const stockMap = {
//     pt: "Em estoque",
//     fr: "En stock",
//     es: "En stock",
//   };

//   const quantityMap = {
//     pt: "Quantidade",
//     fr: "Quantité",
//     es: "Cantidad",
//   };
//   const inStock = stockMap[lang] || "In stock";
//   const productName = nameMap[lang] || product?.name;
//   const productDescription = descriptionMap[lang] || product?.description;
//   const quantityText = quantityMap[lang] || "Quantity";


//   const { fetchCart } = useCart();
//   const router = useRouter();

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // 🔹 Handle count increment/decrement
//   const handleCountChange = (action) => {
//     if (action === "increment") {
//       if (count < product?.quantity) {
//         setCount(count + 1);
//       } else {
//         toast.info(`Only ${product?.quantity} items in stock`, {
//           position: "bottom-right",
//         });
//       }
//     } else if (action === "decrement") {
//       if (count > 1) setCount(count - 1);
//     }
//   };

//   // 🔹 Shop Now Handler (add then redirect)
//   const handleShopNow = async () => {
//     try {
//       if (!product?.quantity || product?.quantity <= 0) {
//         toast.error("Sorry! This product is out of stock", {
//           position: "bottom-right",
//         });
//         return;
//       }

//       // Ensure count does not exceed stock
//       const finalCount = count > product.quantity ? product.quantity : count;

//       let trackingId = Cookies.get("trackingId");
//       if (!trackingId) {
//         trackingId = uuidv4();
//         Cookies.set("trackingId", trackingId, { expires: 30, path: "/" });
//       }

//       const countryData = Cookies.get("selectedCountry");
//       const parsedCountry = countryData ? JSON.parse(countryData) : null;

//       const response = await addToCart({
//         trackingId,
//         productId: product?.id,
//         quantity: finalCount,
//         country: parsedCountry?.name || "",
//       });

//       if (response?.success || response?.message) {
//         await serverRevalidate();
//         await fetchCart();
//         router.push("/checkout");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       toast.error("Something went wrong.", { position: "bottom-right" });
//     }
//   };

//   return (
//     <div className="max-w-[1280px] mx-auto px-3 pb-[50px]">
//       {/* Breadcrumb */}
//       <div className="my-16 flex items-center gap-1">
//         <p className="text-[16px]">Home</p>
//         <MdKeyboardArrowRight className="text-xl" />
//         <p className="text-[16px] text-gray-600">MANUFACTURER</p>
//         <MdKeyboardArrowRight className="text-xl" />
//         <p className="text-[14px] md:text-[16px] font-bold">{productName}</p>
//       </div>

//       {/* Content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Image */}
//         <div className="border border-gray-600 p-11 rounded-2xl flex justify-center">
//           <Image
//             src={product?.image || placeholder}
//             width={700}
//             height={700}
//             alt={product?.name}
//             priority
//           />
//         </div>

//         {/* Card */}
//         <div className="border border-red-600 bg-[#FFF6F6] rounded-2xl">
//           <div className="pt-[18px] px-7">
//             <h1 className="font-medium text-4xl">{productName}</h1>

//             {/* Stock Status */}
//             <p className="flex items-center gap-2 mt-4">
//               {product?.quantity > 0 ? (
//                 <>
//                   <RiCheckboxCircleLine className="text-2xl text-green-600" />
//                   <span className="font-bold text-2xl text-green-600">
//                     {inStock}
//                   </span>
//                 </>
//               ) : (
//                 <span className="font-bold text-2xl text-red-600">
//                   Out of stock
//                 </span>
//               )}
//             </p>

//             {/* Price */}
//             <p className="font-bold text-2xl mb-4">
//               {currency === "euro" ? "€" : "$"}
//               {currency === "euro"
//                 ? product?.discountPrice?.eur || product?.price?.eur
//                 : product?.discountPrice?.usd || product?.price?.usd}
//             </p>

//             {/* Quantity */}
//             <p className="font-bold text-[16px] mb-4">{quantityText}</p>
//             <div className="flex items-center justify-center border border-gray-400 rounded-2xl px-2 py-2 w-[135px] space-x-4 mb-4">
//               <button
//                 onClick={() => handleCountChange("decrement")}
//                 className="text-2xl font-bold cursor-pointer text-gray-600"
//               >
//                 −
//               </button>
//               <span className="text-xl text-gray-600">{count}</span>
//               <button
//                 onClick={() => handleCountChange("increment")}
//                 className="text-2xl font-bold cursor-pointer text-gray-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="px-7">
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <AddCard
//                 productId={product?.id}
//                 quantity={count}
//                 singleProduct={true}
//               />

//               <button
//                 onClick={handleShopNow}
//                 className="bg-red-600 rounded-full text-white font-bold text-[16px] cursor-pointer"
//               >
//                 Shop now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="mt-20 grid grid-cols-1 lg:grid-cols-2">
//         <div>
//           <div className="flex items-center">
//             <h5 className="bg-red-600 p-4 rounded-l-full font-bold md:text-2xl text-white">
//               Product Details
//             </h5>
//             <h5 className="border border-red-600 p-3.5 rounded-r-full md:text-2xl font-bold">
//               Additional information
//             </h5>
//           </div>

//           <div className="md:w-[570px] mt-10 text-gray-600">
//             {isClient ? (
//               <div dangerouslySetInnerHTML={{ __html: productDescription }} />
//             ) : (
//               <div className="min-h-[200px] bg-gray-100 animate-pulse rounded"></div>
//             )}
//           </div>
//         </div>

//         <div className="pt-7 lg:pt-0">
//           <button className="flex items-center justify-center gap-2 w-full border border-red-600 py-3 font-bold text-[16px] rounded-full cursor-pointer mb-3.5">
//             <FaWhatsapp className="text-green-500 text-[16px]" /> Send message
//             on Whats App
//           </button>
//           <button className="flex items-center justify-center gap-2 w-full border border-red-600 py-3 font-bold text-[16px] rounded-full cursor-pointer">
//             <SiGmail className="text-orange-400 text-[16px]" /> Send message on
//             Email
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;


"use client";
import { MdKeyboardArrowRight, MdChat } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import placeholder from "@/public/client/banner/placeholder.png";
import AddCard from "../shop/AddCard";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { addToCart } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { useCart } from "@/providers/CartContext";
import { useRouter } from "next/navigation";
import { useDomain } from "@/providers/useDomain";
import ChatButton from "../chatbot/ChatButton";
import { useSupportStatus } from "@/providers/SupportStatusProvider";
import { convertPrice, formatPrice } from "@/utils/getExchangeRates";
import { getUiLanguage } from "@/utils/uiLanguage";
import DetailGallery from "@/components/detailProduct/DetailGallery";

const ProductPage = ({ product, currency, lang: langProp, rates = { usd: 1.08, gbp: 0.86 } }) => {
  const [isClient, setIsClient] = useState(false);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showChat, setShowChat] = useState(false);
  const { isSupportOnline } = useSupportStatus?.() || { isSupportOnline: false };
  const domainLang = useDomain();
  const lang = langProp || domainLang;
  const uiLang = getUiLanguage(lang);
  const isHebrewProduct = lang === "he";

  // Internationalization mappings
  const textMap = {
    home: {
      pt: "Início",
      fr: "Accueil",
      es: "Inicio",
      en: "Home",
      he: "בית",
      de: "Startseite",
    },
    manufacturer: {
      pt: "FABRICANTE",
      fr: "FABRICANT",
      es: "FABRICANTE",
      en: "MANUFACTURER",
      he: "יצרן",
      de: "HERSTELLER",
    },
    productDetails: {
      pt: "Detalhes do Produto",
      fr: "Détails du Produit",
      es: "Detalles del Producto",
      en: "Product Details",
      he: "פרטי מוצר",
      de: "Produktdetails",
    },
    additionalInfo: {
      pt: "Informações Adicionais",
      fr: "Informations Supplémentaires",
      es: "Información Adicional",
      en: "Additional information",
      he: "מידע נוסף",
      de: "Zusätzliche Informationen",
    },
    shopNow: {
      pt: "Comprar agora",
      fr: "Acheter maintenant",
      es: "Comprar ahora",
      en: "Shop now",
      he: "קנה עכשיו",
      de: "Jetzt kaufen",
    },
    sendWhatsApp: {
      pt: "Enviar mensagem no WhatsApp",
      fr: "Envoyer un message sur WhatsApp",
      es: "Enviar mensaje por WhatsApp",
      en: "Send message on WhatsApp",
      he: "שלח הודעה בוואטסאפ",
      de: "Nachricht per WhatsApp senden",
    },
    sendEmail: {
      pt: "Enviar mensagem por E-mail",
      fr: "Envoyer un message par E-mail",
      es: "Enviar mensaje por Correo",
      en: "Send message on Email",
      he: "שלח הודעה במייל",
      de: "Nachricht per E-Mail senden",
    },
    outOfStock: {
      pt: "Fora de estoque",
      fr: "Rupture de stock",
      es: "Fuera de stock",
      en: "Out of stock",
      he: "אזל מהמלאי",
      de: "Nicht auf Lager",
    },
    onlyInStock: {
      pt: "Apenas {quantity} itens em estoque",
      fr: "Seulement {quantity} articles en stock",
      es: "Solo {quantity} artículos en stock",
      en: "Only {quantity} items in stock",
      he: "נותרו {quantity} פריטים בלבד",
      de: "Nur noch {quantity} Artikel auf Lager",
    },
    outOfStockError: {
      pt: "Desculpe! Este produto está fora de estoque",
      fr: "Désolé! Ce produit est en rupture de stock",
      es: "¡Lo siento! Este producto está agotado",
      en: "Sorry! This product is out of stock",
      he: "מצטערים! מוצר זה אזל מהמלאי",
      de: "Entschuldigung! Dieses Produkt ist nicht auf Lager",
    },
    somethingWentWrong: {
      pt: "Algo deu errado.",
      fr: "Une erreur s'est produite.",
      es: "Algo salió mal.",
      en: "Something went wrong.",
      he: "משהו השתבש.",
      de: "Etwas ist schiefgelaufen.",
    },
  };

  const nameMap = {
    pt: product?.namePt,
    fr: product?.nameFr,
    es: product?.nameEs,
    he: product?.nameHe,
    en: product?.name,
    de: product?.nameDe,
  };

  const descriptionMap = {
    pt: product?.descriptionPt,
    fr: product?.descriptionFr,
    es: product?.descriptionEs,
    he: product?.descriptionHe,
    en: product?.description,
    de: product?.descriptionDe,
  };

  const stockMap = {
    pt: "Em estoque",
    fr: "En stock",
    es: "En stock",
    en: "In stock",
    he: "במלאי",
    de: "Auf Lager",
  };

  const quantityMap = {
    pt: "Quantidade",
    fr: "Quantité",
    es: "Cantidad",
    en: "Quantity",
    he: "כמות",
    de: "Menge",
  };

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  // Helper function to get localized text with parameters
  const getTextWithParams = (key, params) => {
    let text = textMap[key][uiLang] || textMap[key].en;
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    return text;
  };

  const inStock = stockMap[uiLang] || stockMap.en;
  const productName = nameMap[lang] || nameMap.en;
  const productDescription = descriptionMap[lang] || descriptionMap.en;
  const quantityText = quantityMap[uiLang] || quantityMap.en;

  const { fetchCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle count increment/decrement
  const handleCountChange = (action) => {
    if (action === "increment") {
      if (count < product?.quantity) {
        setCount(count + 1);
      } else {
        toast.info(
          getTextWithParams("onlyInStock", { quantity: product?.quantity }),
          {
            position: "bottom-right",
          }
        );
      }
    } else if (action === "decrement") {
      if (count > 1) setCount(count - 1);
    }
  };

  // Shop Now Handler (add then redirect)
  const handleShopNow = async () => {
    try {
      if (!product?.quantity || product?.quantity <= 0) {
        toast.error(getText("outOfStockError"), {
          position: "bottom-right",
        });
        return;
      }

      setIsLoading(true);

      // Ensure count does not exceed stock
      const finalCount = count > product.quantity ? product.quantity : count;

      let trackingId = Cookies.get("trackingId");
      if (!trackingId) {
        trackingId = uuidv4();
        Cookies.set("trackingId", trackingId, { expires: 30, path: "/" });
      }

      const countryData = Cookies.get("selectedCountry");
      const parsedCountry = countryData ? JSON.parse(countryData) : null;

      const response = await addToCart({
        trackingId,
        productId: product?.id,
        quantity: finalCount,
        country: parsedCountry?.name || "",
      });

      if (response?.success || response?.message) {
        await serverRevalidate();
        await fetchCart();
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(getText("somethingWentWrong"), { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WhatsApp contact
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `${productName}`
    );
    window.open(`https://wa.me/351935210099?text=${message}`, "_blank");
  };

  // Handle Email contact
const handleEmailContact = () => {
  const subject = encodeURIComponent(`Inquiry about ${productName}`);
  const body = encodeURIComponent(
    `${productName}`
  );
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=sales@hdotrade.com&su=${subject}&body=${body}`;
  window.open(gmailLink, "_blank");
};

// Handle Chat Open
const handleChatOpen = () => {
  setShowChat(true);
};


  // Render additional information content
  const renderAdditionalInfo = () => {
    if (!product) return null;

    return (
      <div className="space-y-4">
        {product.weight && (
          <div className="flex">
            <span className="font-bold w-1/3">Weight:</span>
            <span>{product.weight} kg</span>
          </div>
        )}
        {product.dimensions && (
          <div className="flex">
            <span className="font-bold w-1/3">Dimensions:</span>
            <span>{product.dimensions}</span>
          </div>
        )}
        {product.material && (
          <div className="flex">
            <span className="font-bold w-1/3">Material:</span>
            <span>{product.material}</span>
          </div>
        )}
        {product.brand && (
          <div className="flex">
            <span className="font-bold w-1/3">Brand:</span>
            <span>{product.brand}</span>
          </div>
        )}
      </div>
    );
  };

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-3 pb-[50px] text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-3 pb-[50px]">
      {/* Breadcrumb */}
      <div className="my-16 flex items-center gap-1">
        <p className="text-[16px]">{getText("home")}</p>
        <MdKeyboardArrowRight className="text-xl" />
        <p className="text-[16px] text-gray-600">
          {product?.manufacturerIds?.length > 0
            ? product.manufacturerIds.map((m, idx) =>
                typeof m === "object" && m ? (
                  <span key={m.id || m._id || idx}>
                    {idx > 0 && ", "}
                    <Link href={`/shop?manufacturer=${m.id || m._id}`} className="hover:underline hover:text-red-600 transition-colors">
                      {m.name}
                    </Link>
                  </span>
                ) : null
              ).filter(Boolean)
            : typeof product?.manufacturerId === "object" && product?.manufacturerId ? (
                <Link href={`/shop?manufacturer=${product.manufacturerId.id || product.manufacturerId._id}`} className="hover:underline hover:text-red-600 transition-colors">
                  {product.manufacturerId?.name}
                </Link>
              ) : getText("manufacturer")}
        </p>
        <MdKeyboardArrowRight className="text-xl" />
        <p
          className="text-[14px] md:text-[16px] font-bold"
          dir={isHebrewProduct ? "rtl" : "ltr"}
        >
          {productName}
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="border border-gray-600 p-4 rounded-2xl">
          <DetailGallery
            images={
              product?.images?.length > 0
                ? product.images
                : product?.image
                ? [product.image]
                : []
            }
          />
        </div>

        {/* Card */}
        <div className="border p-5 border-red-600 bg-[#FFF6F6] rounded-2xl">
          <div className="pt-[18px] px-7">
            <h1
              className={`font-medium text-4xl ${isHebrewProduct ? "text-right" : ""}`}
              dir={isHebrewProduct ? "rtl" : "ltr"}
            >
              {productName}
            </h1>

            {/* Stock Status */}
            <p className="flex items-center gap-2 mt-4">
              {product?.quantity > 0 ? (
                <>
                  <RiCheckboxCircleLine className="text-2xl text-green-600" />
                  <span className="font-bold text-2xl text-green-600">
                    {inStock}
                  </span>
                </>
              ) : (
                <span className="font-bold text-2xl text-red-600">
                  {getText("outOfStock")}
                </span>
              )}
            </p>

            {/* Manufacturer */}
            {(product?.manufacturerIds?.length > 0 || product?.manufacturerId) && (
              <p className="flex items-center gap-2 mt-2 text-gray-700">
                <span className="font-semibold">{getText("manufacturer")}:</span>
                <span>
                  {product?.manufacturerIds?.length > 0
                    ? product.manufacturerIds
                        .map((m, idx) =>
                          typeof m === "object" && m ? (
                            <span key={m.id || m._id || idx}>
                              {idx > 0 && ", "}
                              <Link
                                href={`/shop?manufacturer=${m.id || m._id}`}
                                className="hover:underline hover:text-red-600 transition-colors"
                              >
                                {m.name}
                              </Link>
                            </span>
                          ) : null
                        )
                        .filter(Boolean)
                    : typeof product?.manufacturerId === "object" && product?.manufacturerId ? (
                        <Link
                          href={`/shop?manufacturer=${product.manufacturerId.id || product.manufacturerId._id}`}
                          className="hover:underline hover:text-red-600 transition-colors"
                        >
                          {product.manufacturerId?.name}
                        </Link>
                      ) : null}
                </span>
              </p>
            )}

            {/* Category */}
            {(product?.categoryIds?.length > 0 || product?.categoryId) && (
              <p className="flex items-center gap-2 mt-2 text-gray-700">
                <span className="font-semibold">CATEGORY:</span>
                <span>
                  {product?.categoryIds?.length > 0
                    ? product.categoryIds
                        .map((c, idx) =>
                          typeof c === "object" && c ? (
                            <span key={c.id || c._id || idx}>
                              {idx > 0 && ", "}
                              <Link
                                href={`/shop?category=${c.id || c._id}`}
                                className="hover:underline hover:text-red-600 transition-colors"
                              >
                                {c.name}
                              </Link>
                            </span>
                          ) : null
                        )
                        .filter(Boolean)
                    : typeof product?.categoryId === "object" && product?.categoryId ? (
                        <Link
                          href={`/shop?category=${product.categoryId.id || product.categoryId._id}`}
                          className="hover:underline hover:text-red-600 transition-colors"
                        >
                          {product.categoryId?.name}
                        </Link>
                      ) : null}
                </span>
              </p>
            )}

            {/* Subcategory */}
            {(product?.subcategoryIds?.length > 0 || product?.subcategoryId) && (
              <p className="flex items-center gap-2 mt-2 text-gray-700">
                <span className="font-semibold">SUBCATEGORY:</span>
                <span>
                  {product?.subcategoryIds?.length > 0
                    ? product.subcategoryIds
                        .map((s, idx) =>
                          typeof s === "object" && s ? (
                            <span key={s.id || s._id || idx}>
                              {idx > 0 && ", "}
                              <Link
                                href={`/shop?subcategory=${s.id || s._id}`}
                                className="hover:underline hover:text-red-600 transition-colors"
                              >
                                {s.name}
                              </Link>
                            </span>
                          ) : null
                        )
                        .filter(Boolean)
                    : typeof product?.subcategoryId === "object" && product?.subcategoryId ? (
                        <Link
                          href={`/shop?subcategory=${product.subcategoryId.id || product.subcategoryId._id}`}
                          className="hover:underline hover:text-red-600 transition-colors"
                        >
                          {product.subcategoryId?.name}
                        </Link>
                      ) : null}
                </span>
              </p>
            )}

            {/* Price */}
            <p className="font-bold text-2xl mt-4 mb-4" suppressHydrationWarning>
              {formatPrice(convertPrice(product?.price?.eur, currency, rates), currency)}
            </p>

            {/* Quantity */}
            <p className="font-bold text-[16px] mb-4">{quantityText}</p>
            <div className="flex items-center justify-center border border-gray-400 rounded-2xl px-2 py-2 w-[135px] space-x-4 mb-4">
              <button
                onClick={() => handleCountChange("decrement")}
                className="text-2xl font-bold cursor-pointer text-gray-600"
                disabled={count <= 1}
              >
                −
              </button>
              <span className="text-xl text-gray-600">{count}</span>
              <button
                onClick={() => handleCountChange("increment")}
                className="text-2xl font-bold cursor-pointer text-gray-600"
                disabled={count >= product?.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-7">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <AddCard
                productId={product?.id}
                quantity={count}
                singleProduct={true}
                disabled={true}
              />
              <button
                onClick={handleShopNow}
                disabled={true}
                className="bg-gray-400 rounded-full text-white font-bold text-[16px] cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
              >
                {getText("shopNow")}
              </button>
            </div>
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppContact}
              className="w-full bg-[#25D366] md:mt-16 text-white py-3 font-bold text-[16px] rounded-full cursor-pointer hover:bg-[#1fb855] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-3"
            >
              <FaWhatsapp className="text-white text-xl" />
              Ask us Price on WhatsApp
            </button>

            {/* Email Button */}
            <button
              onClick={handleEmailContact}
              className="w-full bg-white text-gray-800 mt-3 py-3 font-bold text-[16px] rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg border-2 border-gray-300"
            >
              <SiGmail className="text-[#EA4335] text-xl" />
              Ask us Price on Email
            </button>

            {/* Chat Button */}
            <button
              onClick={handleChatOpen}
              className="w-full bg-[#c41e3a] text-white mt-3 py-3 font-bold text-[16px] rounded-full cursor-pointer hover:bg-[#a01829] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              disabled={!isSupportOnline}
              style={{ opacity: !isSupportOnline ? 0.5 : 1, pointerEvents: !isSupportOnline ? 'none' : 'auto' }}
            >
              <MdChat className="text-white text-xl" />
              Ask us Price on Chat
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-20 ">
        <div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActiveTab("details")}
              className={`p-4 rounded-l-full font-bold md:text-2xl ${
                activeTab === "details"
                  ? "bg-red-600 text-white"
                  : "border border-red-600"
              }`}
            >
              {getText("productDetails")}
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`p-3.5 rounded-r-full md:text-2xl font-bold ${
                activeTab === "additional"
                  ? "bg-red-600 text-white"
                  : "border border-red-600"
              }`}
            >
              {getText("additionalInfo")}
            </button>
          </div>

          <div
            className={`md:w-[570px] mt-10 text-gray-600 ${isHebrewProduct ? "text-right" : ""}`}
            dir={isHebrewProduct ? "rtl" : "ltr"}
          >
            {isClient ? (
              activeTab === "details" ? (
                <div dangerouslySetInnerHTML={{ __html: productDescription }} />
              ) : (
                renderAdditionalInfo()
              )
            ) : (
              <div className="min-h-[200px] bg-gray-100 animate-pulse rounded"></div>
            )}
          </div>
        </div>


      </div>

      {/* Chat Component */}
      {showChat && <ChatButton initialOpen={true} />}
    </div>
  );
};

export default ProductPage;