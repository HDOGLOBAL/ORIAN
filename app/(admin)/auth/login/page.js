"use client";

import Image from "next/image";
import ChatButton from "@/components/chatbot/ChatButton";
import React, { useState } from "react";
import logo from "@/public/client/logo.png";
import { login } from "@/action";
import { useRouter } from "next/navigation";
import { serverRevalidate } from "@/utils/serverRev";
export default function LoginPage() {
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      alert("Email and Password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await login({ email, password });
      await serverRevalidate();
      router.push("/auth/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="bg-white shadow-lg rounded-lg border-0 p-6">
          <div className="text-center mb-6">
            <Image
              src={logo}
              width={100}
              height={100}
              alt="logo"
              className="mx-auto"
            />
            <p className="text-blueGray-600 text-lg font-medium mt-2">
              Login with credentials
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blueGray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-blueGray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0eadef] hover:shadow-lg"
                } text-white font-semibold uppercase text-sm px-6 py-3 rounded shadow transition duration-150 ease-in-out`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ChatButton/>
    </div>
  );
}
