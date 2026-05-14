"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function ClearCookie() {
  useEffect(() => {
    Cookies.remove("trackingId");
  }, []);
  return null;
}
