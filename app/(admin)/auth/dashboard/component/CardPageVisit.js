// components

import { getToRefillProducts } from "@/database/queries";
import Link from "next/link";

export default async function CardPageVisits() {
  const refillProducts = await getToRefillProducts();

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Quantity to order
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Products that need restocking
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
            {refillProducts.length} to refill
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-transparent border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Manufacturer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Min Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Order Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {refillProducts.length > 0 ? (
              refillProducts.map((product) => {
                const orderQty = product?.minStock - product?.quantity;
                return (
                  <tr
                    key={product?.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-3">
                      <div className="truncate max-w-[150px] text-sm text-slate-700 md:max-w-full">
                        {product?.manufacturerName || product?.manufacturerId || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="truncate max-w-[180px] text-sm font-medium text-slate-800 md:max-w-full">
                        {product?.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                        {product?.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product?.minStock}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {orderQty}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#0eadef] transition-colors hover:bg-sky-600"
                        href={`/auth/dashboard/products/${product?.id}`}
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  No products to refill
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
