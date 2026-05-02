"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function Logout() {
  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default Link behavior

    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await signOut({ callbackUrl: "/auth/login" });
    }
  };

  return (
    <Link
      href="/auth/login"
      onClick={handleLogout}
      className="text-blueGray-700 hover:text-[#0ea5e9] text-[14px] uppercase py-3 flex gap-2"
    >
      Logout
    </Link>
  );
}
