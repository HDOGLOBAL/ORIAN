import Image from "next/image";
import Link from "next/link";
import RemoveFromWish from "./RemoveFromWish";
import AddCard from "../shop/AddCard";
import { getLang } from "@/languages/dynamicLangSwitch";

export default async function WishList({ list, langCode, userId }) {
  const lan = await getLang(langCode);
  return (
    <>
      <div className="flex items-center justify-between border gap-6 p-4 border-gray-200 rounded">
        <div className="w-28">
          <Image
            src={list?.image[0]}
            width={50}
            height={50}
            alt="product image"
            className="w-full"
          />
        </div>
        <div className="w-1/3">
          <h2 className="text-gray-800 text-xl font-medium uppercase">
            <Link href={`/${langCode}/shop/${list?.id}`}>{list?.name}</Link>
          </h2>

          <p className="text-gray-500 text-sm">
            Availability:
            {list?.quantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
        </div>
        <div className="text-primary text-lg font-semibold">${list?.price}</div>

        <AddCard
          fromWish={true}
          productId={list?.id}
          quantity={list?.quantity}
          userId={userId}
          lan={lan?.detail?.addcart}
          detail={true}
        />
        <RemoveFromWish userid={userId} productId={list?.id} />
      </div>
    </>
  );
}
