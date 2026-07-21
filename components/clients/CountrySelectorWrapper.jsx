"use client";
import dynamic from "next/dynamic";

const CountrySelector = dynamic(
  () => import("./CountryModal"),
  { ssr: false }
);

export default function CountrySelectorWrapper() {
  return <CountrySelector />;
}
