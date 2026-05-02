"use client";

import { removeWishList } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";

export default function RemoveFromWish({ userid, productId }) {
  const handleClick = async () => {
    await removeWishList(userid, productId);
    toast.info("Removed from wish list", {
      position: "bottom-right",
    });
    await serverRevalidate();
  };
  return (
    <>
      <div
        onClick={handleClick}
        className="text-gray-600 cursor-pointer hover:text-primary"
      >
        <i className="fa-solid fa-trash"></i>
      </div>
    </>
  );
}
