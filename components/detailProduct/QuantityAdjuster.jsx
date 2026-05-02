"use client";

import React, { useState } from "react";

export default function QuantityAdjuster() {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <div
        onClick={decreaseQuantity}
        className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
      >
        -
      </div>
      <div className="h-8 w-8 text-base flex items-center justify-center">
        {quantity}
      </div>
      <div
        onClick={increaseQuantity}
        className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
      >
        +
      </div>
    </>
  );
}
