"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import defaultImg from "@/public/default.png";
import { accountRevalidate } from "@/utils/accountRevalidate";

export default function UpdateUser({ dbUser, lan }) {
  const { data: session, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [updates, setUpdates] = useState({
    id: dbUser.id,
    name: user?.name || "",
    contact: dbUser?.contact,
    image: dbUser?.image || null,
  });
  const [avatarPreview, setAvatarPreview] = useState(
    dbUser?.image || defaultImg
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdates({
      ...updates,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };

    setUpdates({
      ...updates,
      image: e.target.files[0],
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // image upload ...............................

    let result;
    if (updates?.image) {
      const data = new FormData();
      data.append("image", updates?.image);

      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=776520d87aad1b00203fd3ec267cec5b",
        {
          method: "POST",
          body: data,
        }
      );
      result = await response.json();
    }

    // image upload ...............................

    const res = await fetch("/api/auth/update", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        id: updates.id,
        name: updates.name,
        contact: updates.contact,
        image: result?.data?.url,
      }),
    });

    await update({
      ...session,
      user: {
        ...session?.user,
        name: updates.name,
        image: result?.data?.url,
      },
    });

    await accountRevalidate();

    res.status === 201 && router.push("/account");
  };

  return (
    <>
      {/* <div className="text-xl text-red-500 text-center">{error && error}</div> */}
      <form action="#" method="post" autoComplete="off" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div>
            <label htmlFor="name" className="text-gray-600 mb-2 block">
              {lan?.name}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={updates?.name}
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="Full Name"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-gray-600 mb-2 block">
              {lan?.phone}
            </label>
            <input
              type="number"
              name="contact"
              value={updates?.contact}
              id="contact"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="+88017**********"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-4 p-4">
            <div className="flex">
              <Image
                width={50}
                height={50}
                className="w-14 h-14 rounded-full"
                alt="l"
                src={avatarPreview}
              />
            </div>
            <div>
              <input
                type="file"
                id="imageInput"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
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
