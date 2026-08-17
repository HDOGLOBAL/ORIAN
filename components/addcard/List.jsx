"use client";
import { convertPrice, formatPrice } from "@/utils/getExchangeRates";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo, useCallback } from "react";
import { getProductById, incrementItemQuantity } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";
import RemoveCard from "./RemoveCard";
import placeholder from "@/public/client/banner/placeholder.png";
import useCurrency from "@/providers/useCurrency";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function List({ product, user, trackingId, currency: currencyProp, rates = { usd: 1.08, gbp: 0.86 } }) {
  const [quantity, setQuantity] = useState(product?.cartQuantity || 1);
  const currencyFromHook = useCurrency();
  const currency = currencyProp || currencyFromHook;
  const [isUpdating, setIsUpdating] = useState(false);
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  // Language mappings
  const textMap = {
    availability: {
      en: "Availability:",
      pt: "Disponibilidade:",
      fr: "Disponibilité:",
      es: "Disponibilidad:",
      he: "זמינות:",
      de: "Verfügbarkeit:",
    },
    inStock: {
      en: "In Stock",
      pt: "Em Estoque",
      fr: "En Stock",
      es: "En Stock",
      he: "במלאי",
      de: "Auf Lager",
    },
    outOfStock: {
      en: "Out of Stock",
      pt: "Fora de Estoque",
      fr: "En Rupture de Stock",
      es: "Agotado",
      he: "אזל מהמלאי",
      de: "Nicht vorrätig",
    },
    noMoreAvailable: {
      en: "Sorry! no more available",
      pt: "Desculpe! não há mais disponível",
      fr: "Désolé! plus disponible",
      es: "¡Lo siento! no hay más disponible",
      he: "מצטערים! אין עוד זמין",
      de: "Entschuldigung! Nicht mehr verfügbar",
    },
    minQuantity: {
      en: "Minimum quantity is 1",
      pt: "Quantidade mínima é 1",
      fr: "La quantité minimale est 1",
      es: "La cantidad mínima es 1",
      he: "כמות מינימאלית היא 1",
      de: "Mindestmenge ist 1",
    },
    errorUpdating: {
      en: "Error updating quantity",
      pt: "Erro ao atualizar quantidade",
      fr: "Erreur de mise à jour de la quantité",
      es: "Error al actualizar la cantidad",
      he: "שגיאה בעדכון הכמות",
      de: "Fehler beim Aktualisieren der Menge",
    },
  };

  // Get localized text with English fallback
  const getText = (key) => textMap[key][uiLang] || textMap[key].en;

  // Calculate total price directly from state
  const totalPrice = useMemo(() => {
    const price = convertPrice(product?.price?.eur, currency, rates);
    return (quantity * price).toFixed(2);
  }, [quantity, currency, product?.price?.eur, rates]);

  // Memoized debounce functions
  const debouncedUpdate = useMemo(() => {
    return (func) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), 200);
      };
    };
  }, []);

  const handleQuantityChange = useCallback(
    async (isIncrease) => {
      if (isUpdating) return;
      setIsUpdating(true);
      try {
        const latestProduct = await getProductById(product?.id);
        const newQuantity = isIncrease ? quantity + 1 : quantity - 1;
        // Validate quantity
        if (isIncrease && latestProduct?.quantity <= 0) {
          toast.error(getText("noMoreAvailable"), { position: "bottom-right" });
          return;
        }
        if (!isIncrease && newQuantity < 1) {
          toast.error(getText("minQuantity"), { position: "bottom-right" });
          return;
        }
        // Optimistic update
        setQuantity(newQuantity);
        await incrementItemQuantity(
          trackingId,
          user?.id,
          product?.id,
          isIncrease
        );
        await serverRevalidate();
      } catch (error) {
        // Revert on error
        setQuantity(quantity);
        toast.error(getText("errorUpdating"), { position: "bottom-right" });
        console.error("Error in quantity update:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, quantity, product?.id, user?.id, trackingId, getText]
  );

  const handleIncrease = useMemo(
    () => debouncedUpdate(() => handleQuantityChange(true)),
    [debouncedUpdate, handleQuantityChange]
  );

  const handleDecrease = useMemo(
    () => debouncedUpdate(() => handleQuantityChange(false)),
    [debouncedUpdate, handleQuantityChange]
  );

  const handleImageError = (e) => {
    e.target.src = "/default-product-image.jpg";
  };

  // Get localized product name
  const productName = useMemo(() => {
    const nameMap = {
      pt: product?.namePt,
      fr: product?.nameFr,
      es: product?.nameEs,
      he: product?.nameHe,
      de: product?.nameDe,
    };
    return nameMap[lang] || product?.name;
  }, [product, lang]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border gap-4 md:gap-6 p-4 border-gray-200 rounded w-full">
      {/* Image with error handling */}
      <div className="w-full md:w-28">
        <Image
          src={product?.image || placeholder}
          width={80}
          height={80}
          alt={productName || "Product image"}
          className="w-full max-w-[80px] md:max-w-none"
          onError={handleImageError}
        />
      </div>
      {/* Product Info */}
      <div className="w-full md:w-1/3">
        <h2
          className={`text-gray-800 text-lg md:text-xl font-medium uppercase ${
            lang === "he" ? "text-right" : ""
          }`}
          dir={lang === "he" ? "rtl" : "ltr"}
        >
          <Link href={`/shop/${product.id}`}>{productName}</Link>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {getText("availability")}
          {product.quantity > 0 ? (
            <span className="text-green-600">
              {" "}
              {getText("inStock")} ({product.quantity})
            </span>
          ) : (
            <span className="text-red-600 font-semibold"> {getText("outOfStock")}</span>
          )}
        </p>
        {product.quantity <= 0 && (
          <p className="text-red-500 text-xs mt-1">
            {getText("noMoreAvailable")}
          </p>
        )}
      </div>
      {/* Price */}
      <div className="text-primary text-lg font-semibold">
        {formatPrice(parseFloat(totalPrice), currency)}
      </div>
      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          onClick={handleDecrease}
          disabled={isUpdating || quantity <= 1}
        >
          -
        </button>
        <span className="text-gray-900">{quantity}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          onClick={handleIncrease}
          disabled={isUpdating || product.quantity <= 0 || quantity >= product.quantity}
        >
          +
        </button>
      </div>
      {/* Remove Button */}
      <div className="w-full justify-start md:w-auto">
        <RemoveCard productId={product?.id} trackingId={trackingId} />
      </div>
    </div>
  );
}