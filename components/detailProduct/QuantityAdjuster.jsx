"use client";

import React, { useState } from "react";

export default function QuantityAdjuster({ maxQuantity = Infinity, disabled = false }) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <div
        onClick={disabled ? undefined : decreaseQuantity}
        className={`h-8 w-8 text-xl flex items-center justify-center select-none ${disabled ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
      >
        -
      </div>
      <div className="h-8 w-8 text-base flex items-center justify-center">
        {quantity}
      </div>
      <div
        onClick={disabled ? undefined : increaseQuantity}
        className={`h-8 w-8 text-xl flex items-center justify-center select-none ${disabled ? "text-gray-400 cursor-not-allowed" : quantity >= maxQuantity ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
      >
        +
      </div>
    </>
  );
}
