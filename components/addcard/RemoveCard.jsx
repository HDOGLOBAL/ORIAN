"use client";

import { removeCardList } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";
import { useCart } from "@/providers/CartContext";

export default function RemoveCard({ user, productId, trackingId }) {
  const { fetchCart } = useCart();
  const handleClick = async () => {
    await removeCardList(user?.id, trackingId, productId);
    toast.info("Removed from wish list", {
      position: "bottom-right",
    });
    await serverRevalidate();
    await fetchCart();
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="text-gray-600 grid justify-items-center cursor-pointer hover:text-primary"
      >
        <a href="">
          <i className="fa-solid fa-trash"></i>
        </a>
        <a className="text-red-500 text-sm">Remove</a>
      </div>
    </>
  );
}
