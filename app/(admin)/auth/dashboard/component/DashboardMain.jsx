import {
  getAllCarts,
  getAllProducts,
  getCategories,
  getTotalOrdersCount,
} from "@/database/queries";
import HeaderStats from "./AdminStats";
import CardPageVisits from "./CardPageVisit";

const [products, categories, cartList] = await Promise.all([
  getAllProducts().catch(() => []),
  getCategories().catch(() => []),
  getAllCarts().catch(() => []),
]);

const orderCount = await getTotalOrdersCount();

const stats = {
  productLength: products?.length || 0,
  categoryLength: categories?.length || 0,
  cartListLength: cartList?.length || 0,
  orderCount,
};


export default function DashboardMain() {
  return (
    <>
      <HeaderStats {...stats} />

      <div className="px-4 md:px-10 mx-auto w-full -m-24">
        <div className="flex flex-wrap mt-4">
          <div className="w-full mb-12 xl:mb-0 px-4">
            <CardPageVisits />
          </div>
        </div>
      </div>
    </>
  );
}
