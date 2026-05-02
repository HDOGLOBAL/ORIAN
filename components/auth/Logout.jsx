"use client";

import getDomain from "@/utils/getDomain";
import { signOut } from "next-auth/react";

export default function Logout({ langCode,logout }) {
  const url = getDomain();

  return (
    <span onClick={() => signOut({ callbackUrl: `${url}/${langCode}` })} >
      <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:text-white hover:bg-red-500">
        {logout}
      </div>
    </span>
  );
}
