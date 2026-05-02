"use client";

import { AddToWishlist } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";

export default function Addwish({ productId, userId, fromDetail, lan }) {
  const handleClick = async () => {
    if (userId) {
      const mess = await AddToWishlist(userId, productId);
      if (mess) {
        toast.success("Added to the wishlist", {
          position: "bottom-right",
        });
      } else {
        toast.info(" Already in wishlist", {
          position: "bottom-right",
        });
      }
      await serverRevalidate();
    } else {
      toast.error("Login please", {
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      {!fromDetail ? (
        <p
          onClick={handleClick}
          className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
          title="add to wishlist"
        >
          <i className="fa-solid fa-heart"></i>
        </p>
      ) : (
        <button
          onClick={handleClick}
          className="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition"
        >
          <i className="fa-solid fa-heart"></i> {lan}
        </button>
      )}
    </>
  );
}
