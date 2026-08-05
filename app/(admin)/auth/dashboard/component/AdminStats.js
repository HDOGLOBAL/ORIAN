import React from "react";
import CardStats from "./CardStats";
import { CartIcon, ProductsDash } from "@/public/icons/icons";

export default function HeaderStats({
  productLength,
  categoryLength,
  cartListLength,
  orderCount,
}) {
  return (
    <section className="relative rounded-2xl bg-gradient-to-br from-[#0eadef] via-sky-600 to-blue-700 px-4 pt-8 pb-32 shadow-lg sm:px-6">
      <div className="px-2 mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-blue-100">
          Overview of your store
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardStats
          statSubtitle="Total Products"
          statTitle={productLength}
          statIconName={<ProductsDash />}
          statIconColor="bg-gradient-to-br from-[#0eadef] to-sky-600"
        />
        <CardStats
          statSubtitle="New Orders"
          statTitle={orderCount}
          statIconName={<ProductsDash />}
          statIconColor="bg-gradient-to-br from-orange-400 to-orange-600"
        />
        <CardStats
          statSubtitle="Categories"
          statTitle={categoryLength}
          statIconName={<ProductsDash />}
          statIconColor="bg-gradient-to-br from-pink-400 to-pink-600"
        />
        <CardStats
          statSubtitle="Carts"
          statTitle={cartListLength}
          statIconName={<CartIcon />}
          statIconColor="bg-gradient-to-br from-red-400 to-red-600"
        />
      </div>
    </section>
  );
}
