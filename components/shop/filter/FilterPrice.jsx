"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterPrice({ lan }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [value, setValue] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    const name = e.target.name;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }));
  };

  useEffect(() => {
    const filterPrice = params.get("priceFilter");
    if (filterPrice) {
      const decodedPrice = decodeURI(filterPrice);

      const queryInFilterPrice = decodedPrice.split("|");
      const obj = {
        min: Number(queryInFilterPrice[0]),
        max: Number(queryInFilterPrice[1]),
      };
      setValue(obj);
    }
  }, []);

  useEffect(() => {
    if (value.min < value.max) {
      params.set("priceFilter", encodeURI(`${value.min}|${value.max}`));
    } else {
      params.delete("priceFilter");
    }

    replace(`${pathname}?${params.toString()}`);
  }, [value]);

  return (
    <div className="pt-4">
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
        {lan}
      </h3>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          name="min"
          id="min"
          onChange={handleChange}
          className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
          placeholder="min"
        />
        <span className="mx-3 text-gray-500">-</span>
        <input
          type="text"
          name="max"
          id="max"
          onChange={handleChange}
          className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
          placeholder="max"
        />
      </div>
    </div>
  );
}
