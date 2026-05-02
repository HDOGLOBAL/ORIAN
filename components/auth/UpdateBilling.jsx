"use client";

import { accountRevalidate } from "@/utils/accountRevalidate";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateBilling({ dbUser, lan, langCode }) {
  const router = useRouter();

  const data = dbUser?.billingAddress;

  const [updates, setUpdates] = useState({
    id: dbUser?.id,
    city: data?.city || "",
    houseName: data?.houseName || "",
    postcode: data?.postcode || "",
    phone: data?.phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdates({
      ...updates,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/update-billing", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        id: updates.id,
        city: updates.city,
        houseName: updates.houseName,
        postcode: updates.postcode,
        phone: updates.phone,
      }),
    });

    setUpdates(null);
    await accountRevalidate();

    res.status === 201 && router.push(`/${langCode}/account`);
  };

  return (
    <>
      {/* <div className="text-xl text-red-500 text-center">{error && error}</div> */}
      <form action="#" method="post" autoComplete="off" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div>
            <label htmlFor="name" className="text-gray-600 mb-2 block">
              {lan?.city}
            </label>
            <input
              type="text"
              name="city"
              id="name"
              value={updates?.city}
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="Town/City"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="name" className="text-gray-600 mb-2 block">
              {lan?.house}
            </label>
            <input
              type="text"
              name="houseName"
              id="name"
              value={updates?.houseName}
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="House/Number.."
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-gray-600 mb-2 block">
              {lan?.post}
            </label>
            <input
              type="number"
              name="postcode"
              value={updates?.postcode}
              id="number"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="Post code"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-gray-600 mb-2 block">
              {lan?.phone}
            </label>
            <input
              type="number"
              name="phone"
              value={updates?.phone}
              id="number"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="Phone Number"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            {lan?.update}
          </button>
        </div>
      </form>
    </>
  );
}
