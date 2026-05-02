import { getTrendingProduct } from "@/database/queries";
import ProductCard from "../shop/ProductCard";
import { getCurrency } from "@/utils/getCookieServer";
 
export default async function TrendingProducts({ trendLang, langCode }) {
  
  let products;
  try {
    products = await getTrendingProduct();
  } catch (err) {
    console.error(err);
  }
 
  const currency = await getCurrency();
 
  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        {trendLang?.home?.trend}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            lan={trendLang?.shop?.addCard}
            langCode={langCode}
            key={product?.id}
            product={product}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
 