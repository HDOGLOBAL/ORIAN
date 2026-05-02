import { getProductById } from "@/database/queries";
import { useEffect, useState } from "react";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";

export default function CheckoutList({ item, currency = "pound" }) {
  const [product, setProduct] = useState();
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await getProductById(item?.itemId);
      setProduct(response);
      // ...
    }
    fetchData();
  }, []);

  const nameMap = {
    pt: product?.namePt,
    fr: product?.nameFr,
    es: product?.nameEs,
    he: product?.nameHe,
    de: product?.nameDe,
    en: product?.name,
  };

  const productName = nameMap[lang] || nameMap.en;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h5
            className={`text-gray-800 font-medium ${lang === "he" ? "text-right" : ""}`}
            dir={lang === "he" ? "rtl" : "ltr"}
          >
            {productName}
          </h5>
          {/* <p className="text-sm text-gray-600">Size: M</p> */}
        </div>
        <p className="text-gray-600">{item.itemQuantity}X</p>
        <p className="text-gray-800 font-medium">
          {currency === "euro" ? "€" : currency === "pound" ? "£" : "$"}
          {product?.discount_price}
        </p>
      </div>
    </>
  );
}
