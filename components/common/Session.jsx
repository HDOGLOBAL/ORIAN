"use client";

import { useSession } from "next-auth/react";
export default function Session() {
  const session = useSession();
  return <>Hello, {session?.data?.user?.name}</>;
}
