"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/action";
import { serverRevalidate } from "@/utils/serverRev";
import Link from "next/link";

export default function LoginForm({ langCode, lan }) {
  const [err, setErr] = useState("");

  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      await login(formData);
      await serverRevalidate();
      router.push(`/${langCode}/`);
    } catch (err) {
      setErr("Email or Password mismatched");
    }
  };

  return (
    <>
      {err && <div className="text-sm text-red-500 ">{err}</div>}
      <form action="#" method="post" autoComplete="off" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div>
            <label htmlFor="email" className="text-gray-600 mb-2 block">
              {lan?.email}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="youremail.@domain.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-600 mb-2 block">
              {lan?.password}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="*******"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              className="text-primary focus:ring-0 rounded-sm cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-gray-600 ml-3 cursor-pointer"
            >
              {lan?.remember}
            </label>
          </div>
          <Link href="#" className="text-primary">
            {lan?.forgot}
          </Link>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}
