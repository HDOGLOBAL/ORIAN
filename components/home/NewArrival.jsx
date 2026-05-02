import { getNewArivalProduct } from "@/database/queries";
import ProductCard from "../shop/ProductCard";
import { getCurrency } from "@/utils/getCookieServer";
 
export default async function NewArrival({ nawLang, langCode }) {
  let newProduct;
  try {
    const products = await getNewArivalProduct();
    newProduct = products.slice(0, 6);
  } catch (err) {
    console.error(err);
  }
 
  const currency = await getCurrency();
 
  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        {nawLang?.home?.new}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {newProduct?.map((product) => (
          <ProductCard
            langCode={langCode}
            lan={nawLang?.shop?.addCard}
            key={product?.id}
            product={product}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
 