
export default function ProductCardC() {
  return (
    <div className="bg-white p-3 rounded-2xl border-spacing-1">
      <img
        src="https://i.ibb.co/hRzFKvnD/60e0638a76288d19f154fb8f9b723f09e1918dad.png"
        alt="Item Image"
      />
      <p className="font-medium text-2xl mb-2">
        ZANUSSI HOOD DISHWASHER OWERFLOW PIPE WITH FILTER
      </p>
      {/* Pricing */}
      <div className="flex items-center gap-2">
        <p className="font-bold text-xl">$48.33</p>
        <p className="font-medium text-[14px] text-gray-500 line-through">
          $295.05
        </p>
      </div>
      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-7">
        <button className="font-bold text-[16px] text-red-600 border border-red-600 rounded-full py-3 cursor-pointer">
          View Details
        </button>
        <button className="font-bold text-[16px] text-white bg-red-600 rounded-full py-3 cursor-pointer">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
