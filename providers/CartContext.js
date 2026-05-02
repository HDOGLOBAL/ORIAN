"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      // Get or create trackingId from cookie
      let trackingId = Cookies.get("trackingId");

      const params = new URLSearchParams();

      if (trackingId) params.append("trackingId", trackingId);

      const res = await fetch(`/api/get-cart?${params.toString()}`);
      const data = await res.json();
      if (res.status === 200) {
        setCart(data);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.error("Fetch cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
