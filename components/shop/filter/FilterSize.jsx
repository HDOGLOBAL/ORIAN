"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterSize({ lan }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const [selectedOption, setSelectedOption] = useState("");

  // Step 2: Handle change
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const filterSize = params.get("size");
    if (filterSize) {
      const decodedSize = decodeURI(filterSize);

      const queryInFilterSize = decodedSize.split("|");

      setSelectedOption(queryInFilterSize);
    }
  }, []);

  useEffect(() => {
    if (selectedOption) {
      params.set("size", encodeURI(selectedOption));
    } else {
      params.delete("size");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedOption]);


  return (
    <div className="pt-4">
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
        {lan}
      </h3>
      <div className="flex items-center gap-2">
        <div className="size-selector">
          <input
            type="radio"
            name="size"
            value="XS"
            checked={selectedOption === "XS"}
            onChange={handleOptionChange}
            id="size-xs"
            className="hidden"
          />
          <label
            htmlFor="size-xs"
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            XS
          </label>
        </div>
        <div className="size-selector">
          <input
            type="radio"
            name="size"
            value="S"
            checked={selectedOption === "S"}
            onChange={handleOptionChange}
            id="size-sm"
            className="hidden"
          />
          <label
            htmlFor="size-sm"
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            S
          </label>
        </div>
        <div className="size-selector">
          <input
            type="radio"
            name="size"
            value="M"
            checked={selectedOption === "M"}
            onChange={handleOptionChange}
            id="size-m"
            className="hidden"
          />
          <label
            htmlFor="size-m"
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            M
          </label>
        </div>
        <div className="size-selector">
          <input
            type="radio"
            name="size"
            value="L"
            checked={selectedOption === "L"}
            onChange={handleOptionChange}
            id="size-l"
            className="hidden"
          />
          <label
            htmlFor="size-l"
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            L
          </label>
        </div>
        <div className="size-selector">
          <input
            type="radio"
            name="size"
            value="XL"
            checked={selectedOption === "XL"}
            onChange={handleOptionChange}
            id="size-xl"
            className="hidden"
          />
          <label
            htmlFor="size-xl"
            className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600"
          >
            XL
          </label>
        </div>
      </div>
    </div>
  );
}
