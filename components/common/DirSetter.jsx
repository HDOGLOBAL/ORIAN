"use client";
import { useEffect } from "react";
import { useDomain } from "@/providers/useDomain";

export default function DirSetter() {
  const lang = useDomain();
  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
