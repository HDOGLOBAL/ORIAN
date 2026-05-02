// "use client";

// import { addToCart, isOrderPaid } from "@/database/queries";
// import { useCart } from "@/providers/CartContext";
// import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";
// import Cookies from "js-cookie";
// import { serverRevalidate } from "@/utils/serverRev";

// export default function AddCard({
//   productId,
//   quantities = 1,
//   quantity = 1,
//   singleProduct = false,
// }) {
//   const { fetchCart } = useCart();

//   const handleClick = async () => {
//     try {
//       // Prevent adding if out of stock
//       if (!quantities || quantities <= 0) {
//         toast.error("Sorry! This product is out of stock", {
//           position: "bottom-right",
//         });
//         return;
//       }

//       // Ensure trackingId exists
//       let trackingId = Cookies.get("trackingId");
//       const isPaid = await isOrderPaid(trackingId);

//       if (!trackingId || isPaid) {
//         trackingId = uuidv4();
//         Cookies.set("trackingId", trackingId, { expires: 30, path: "/" });
//       }

//       const countryData = Cookies.get("selectedCountry");

//       const parsedCountry = countryData ? JSON.parse(countryData) : null;

//       const response = await addToCart({
//         trackingId,
//         productId,
//         country: parsedCountry?.name || "",
//         quantity,
//       });

//       if (response?.success) {
//         toast.success("Added to cart", { position: "bottom-right" });
//         await serverRevalidate();
//         await fetchCart();
//       } else {
//         toast.info(response?.message || "Already added", {
//           position: "bottom-right",
//         });
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       toast.error("Something went wrong.", { position: "bottom-right" });
//     }
//   };

//   return singleProduct ? (
//     <button
//       onClick={handleClick}
//       className="border border-red-600 rounded-full py-3 font-bold text-[16px] cursor-pointer"
//     >
//       Add To Cart
//     </button>
//   ) : (
//     <button
//       onClick={handleClick}
//       className="font-bold text-[16px] text-white bg-red-600 rounded-full py-3 px-6 cursor-pointer transition duration-300 hover:bg-red-700 hover:shadow-md flex items-center justify-center"
//     >
//       <i className="fa-solid fa-bag-shopping mr-2"></i>
//       Add To Cart
//     </button>
//   );
// }


"use client";
import { addToCart, isOrderPaid } from "@/database/queries";
import { useCart } from "@/providers/CartContext";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { serverRevalidate } from "@/utils/serverRev";
import { useState } from "react";
import { FaShoppingBag, FaSpinner } from "react-icons/fa";

export default function AddCard({
  productId,
  quantities = 1,
  quantity = 1,
  singleProduct = false,
  className = "",
  disabled = false,
}) {
  const { fetchCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Internationalization mappings
  const textMap = {
    addToCart: {
      pt: "Adicionar",
      fr: "Ajouter",
      es: "Añadir",
      en: "Add to Cart",
      he: "הוסף לעגלה",
      de: "Warenkorb",
    },

    outOfStock: {
      pt: "Desculpe! Este produto está fora de estoque",
      fr: "Désolé! Ce produit est en rupture de stock",
      es: "¡Lo siento! Este producto está agotado",
      en: "Sorry! This product is out of stock",
      he: "מצטערים! מוצר זה אזל מהמלאי",
      de: "Entschuldigung! Dieses Produkt ist nicht auf Lager",
    },
    addedToCart: {
      pt: "Adicionado ao carrinho",
      fr: "Ajouté au panier",
      es: "Añadido al carrito",
      en: "Added to cart",
      he: "נוסף לעגלה",
      de: "Zum Warenkorb hinzugefügt",
    },
    alreadyAdded: {
      pt: "Já adicionado",
      fr: "Déjà ajouté",
      es: "Ya agregado",
      en: "Already added",
      he: "כבר נוסף",
      de: "Bereits hinzugefügt",
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

  // Helper function to get localized text
  const getText = (key) => {
    return textMap[key][uiLang] || textMap[key].en;
  };

  const handleClick = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      // Prevent adding if out of stock
      if (!quantities || quantities <= 0) {
        toast.error(getText("outOfStock"), {
          position: "bottom-right",
        });
        return;
      }

      // Ensure trackingId exists
      let trackingId = Cookies.get("trackingId");
      const isPaid = trackingId ? await isOrderPaid(trackingId) : true;

      if (!trackingId || isPaid) {
        trackingId = uuidv4();
        Cookies.set("trackingId", trackingId, { expires: 30, path: "/" });
      }

      const countryData = Cookies.get("selectedCountry");
      const parsedCountry = countryData ? JSON.parse(countryData) : null;

      const response = await addToCart({
        trackingId,
        productId,
        country: parsedCountry?.name || "",
        quantity,
      });

      if (response?.success) {
        toast.success(getText("addedToCart"), { position: "bottom-right" });
        await serverRevalidate();
        await fetchCart();
      } else {
        toast.info(response?.message || getText("alreadyAdded"), {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(getText("somethingWentWrong"), { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Base classes for both button styles
  const baseClasses =
    "rounded-full py-3 font-bold text-[16px] cursor-pointer transition duration-300 flex items-center justify-center";

  // Classes for single product style
  const singleProductClasses = "border border-red-600 hover:bg-red-50";

  // Classes for regular style
  const regularClasses =
    "text-white bg-red-600 hover:bg-red-700 hover:shadow-md px-6";

  // Disabled state classes
  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Combine classes based on props
  const buttonClasses = `
    ${baseClasses}
    ${singleProduct ? singleProductClasses : regularClasses}
    ${disabled || isLoading ? disabledClasses : ""}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      aria-label={getText("addToCart")}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          {singleProduct ? "" : getText("addToCart")}
        </>
      ) : (
        <>
          {!singleProduct && <FaShoppingBag className="mr-2" />}
          {getText("addToCart")}
        </>
      )}
    </button>
  );
}