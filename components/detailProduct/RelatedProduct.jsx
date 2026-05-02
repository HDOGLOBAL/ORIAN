import { getProductByCategory } from "@/database/queries";
import { getCurrency } from "@/utils/getCookieServer";
import ProductCard from "../shop/ProductCard";
import RelatedTitle from "./RelatedTitle";

const RelatedProduct = async ({ category }) => {
  const relatedProduct = await getProductByCategory(category);
  const newRelatedProduct = relatedProduct.slice(0, 3);
  const currency = await getCurrency();

  return (
    <div className="bg-[#f4f3ef]">
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="p-4 md:p-8 lg:p-20">
          <RelatedTitle />

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-16 mb-20">
            {newRelatedProduct.map((product) => (
              <ProductCard
                key={product?.id}
                product={product}
                relatedProduct={true}
                currency={currency}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;
