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
    <>
      {/* Header */}
      <div className="relative bg-slate-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Products"
                  statTitle={productLength}
                  statIconName={<ProductsDash />}
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="New Orders"
                  statTitle={orderCount}
                  statIconName={<ProductsDash />}
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Categories"
                  statTitle={categoryLength}
                  statIconName={<ProductsDash />}
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Carts"
                  statTitle={cartListLength}
                  statIconName={<CartIcon />}
                  statIconColor="bg-[#e91325]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
