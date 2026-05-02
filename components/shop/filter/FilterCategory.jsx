"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterCategory({ allCategories, lan }) {
  const [query, setQuery] = useState([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setQuery((prev) => [...prev, name]);
    } else {
      const filtered = query.filter((item) => item !== name);
      setQuery(filtered);
    }
  };

  useEffect(() => {
    const filterCat = params.get("filterCat");
    if (filterCat) {
      const decodedCat = decodeURI(filterCat);
      const queryInFilterCat = decodedCat.split("|");
      setQuery(queryInFilterCat);
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      params.set("filterCat", encodeURI(query.join("|")));
    } else {
      params.delete("filterCat");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [query]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
        {lan}
      </h3>
      <div className="space-y-2">
        {allCategories.map((category, index) => (
          <div key={index} className="flex items-center">
            <input
              onChange={handleChange}
              type="checkbox"
              name={category}
              checked={query.includes(category)}
              id="cat-1"
              className="text-primary focus:ring-0 rounded-sm cursor-pointer"
            />
            <label
              htmlFor="cat-1"
              className="text-gray-600 ml-3 cusror-pointer"
            >
              {capitalizeFirstLetter(category)}
            </label>
            {/* <div className="ml-auto text-gray-600 text-sm">(0)</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
