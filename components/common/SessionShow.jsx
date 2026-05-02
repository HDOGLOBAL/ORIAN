"use client";
import { useSession } from "next-auth/react";

export default function SessionShow({ header }) {
  const session = useSession();
  return <>{session ? session?.user?.name.split(" ")[0] : header?.account}</>;
}
