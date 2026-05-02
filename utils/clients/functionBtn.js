import { useState } from "react";

export default function QuantitySelector() {
  const [count, setCount] = useState(1);

  return (
    <div className="flex items-center justify-center border border-gray-400 rounded-2xl px-2 py-2 w-[135px] space-x-4">
      <button
        onClick={() => setCount(count > 1 ? count - 1 : 1)}
        className="text-2xl font-bold cursor-pointer text-gray-600"
      >
        −
      </button>
      <span className="text-xl text-gray-600">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="text-2xl font-bold cursor-pointer text-gray-600"
      >
        +
      </button>
    </div>
  );
}
