"use client";

import { removeCardList } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";
import { useCart } from "@/providers/CartContext";
import { useState } from "react";

export default function RemoveCard({ user, productId, trackingId }) {
  const { fetchCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeCardList(user?.id, trackingId, productId);
      toast.info("Removed from cart", { position: "bottom-right" });
      await serverRevalidate();
      await fetchCart();
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove item", { position: "bottom-right" });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRemoving}
      className="text-gray-600 grid justify-items-center cursor-pointer hover:text-red-500 disabled:opacity-50"
    >
      <i className="fa-solid fa-trash"></i>
      <span className="text-red-500 text-sm">Remove</span>
    </button>
  );
}
