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
    <div className="flex flex-col gap-6">
      <HeaderStats {...stats} />

      <div className="px-4 md:px-6 mx-auto w-full -mt-24">
        <CardPageVisits />
      </div>
    </div>
  );
}
