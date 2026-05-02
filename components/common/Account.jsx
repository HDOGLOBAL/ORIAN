"use client";
import Image from "next/image";
import Link from "next/link";
import AccountOption from "./AccountOption";
import { useEffect, useState, useRef } from "react";
import img from "./../../public/default.png"

export default function Account({ user, session, header, lan }) {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside dropdown
      // The .contains() method checks if a given DOM element (event.target) is a child or descendant of another element (dropdownRef.current).
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {session ? (
        <>
          <div  onClick={() => setShow(!show)} ref={dropdownRef} className="cursor-pointer">
            <div
             
              className="text-2xl flex items-center gap-2"
            >
              {user?.image ? (
                <Image
                  src={user?.image}
                  width={40}
                  height={40}
                  className="rounded-full border-red-500 border-2"
                  alt="profile"
                />
              ) : (
                <>
                <Image
                src={img}
                width={40}
                height={40}
                className="rounded-full border-red-500 border-2"
                alt="profile"
              />
                </>
     
              )}
            </div>
            <div className="text-xs leading-3">
              {session?.user?.name.split(" ")[0]}
            </div>
            {show && <AccountOption lan={lan} header={header} />}
          </div>
        </>
      ) : (
        <>
          <Link href={`/${lan}/login`}>
            <div className="text-2xl">
              <i className="fa-solid fa-right-to-bracket"></i>
            </div>

            <div className="text-xs leading-3"> {header?.login}</div>
          </Link>
        </>
      )}
    </>
  );
}
