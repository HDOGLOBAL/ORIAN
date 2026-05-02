// components

import { getToRefillProducts } from "@/database/queries";
import Link from "next/link";

export default async function CardPageVisits() {
  const refillProducts = await getToRefillProducts();

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="text-[20px] text-blueGray-700">
                Quantity To Order
              </h3>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-3 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Manufacturer Name
                </th>
                <th className="px-3 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Product Name
                </th>
                <th className="px-2 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Stock
                </th>
                <th className="px-2 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Min Stock
                </th>
                <th className="px-2 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Order Qty
                </th>
                <th className="px-2 text-[#0eadef] font-thin bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-2 text-[15px] uppercase border-l-0 border-r-0 text-left">
                  Qty To Order
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {refillProducts.map((product) => (
                <tr key={product?.id}>
                  <th className="px-3 py-2 text-left text-[15px] font-thin">
                    <div className="truncate max-w-[150px] md:max-w-full">
                      {product?.manufacturerName || product?.manufacturerId || '-'}
                    </div>
                  </th>
                  <td className="px-3 py-2 text-sm">
                    <div className="truncate max-w-[150px] md:max-w-full">
                      {product?.name}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-sm">
                    {product?.quantity}
                  </td>
                  <td className="px-2 py-2 text-sm">
                    {product?.minStock}
                  </td>
                  <td className="px-2 py-2 text-sm">
                    {product?.minStock - product?.quantity}
                  </td>
                  <td className="px-2 py-2 text-sm">
                    <div className="flex justify-center">
                      <Link
                        className="text-blue-600 underline"
                        href={`/auth/dashboard/products/${product?.id}`}
                      >
                        LINK
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
