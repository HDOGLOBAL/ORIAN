"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm({ lan }) {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const conPassword = formData.get("confirm");

      if (password === conPassword) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        res.status === 201 && router.push("/login");
      } else {
        throw new Error("Password & confirmation password not matched");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="text-xl text-red-500 text-center">{error && error}</div>
      <form
        action="#"
        method="post"
        autoComplete="off"
        onSubmit={handleRegister}
      >
        <div className="space-y-2">
          <div>
            <label htmlFor="name" className="text-gray-600 mb-2 block">
              {lan?.name}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="Full Name"
            />
          </div>
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
          <div>
            <label htmlFor="confirm" className="text-gray-600 mb-2 block">
              {lan?.ConfPassword}
            </label>
            <input
              type="password"
              name="confirm"
              id="confirm"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="*******"
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="aggrement"
              id="aggrement"
              className="text-primary focus:ring-0 rounded-sm cursor-pointer"
            />
            <label
              htmlFor="aggrement"
              className="text-gray-600 ml-3 cursor-pointer"
            >
              {lan?.conditionTitlel}{" "}
              <Link href="#" className="text-primary">
                {lan?.condition}
              </Link>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            {lan?.create}
          </button>
        </div>
      </form>
    </>
  );
}
