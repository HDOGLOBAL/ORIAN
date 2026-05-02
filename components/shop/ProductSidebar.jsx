import { getAllCategory } from "@/database/queries";
import FilterCategory from "./filter/FilterCategory";
import FilterPrice from "./filter/FilterPrice";
import FilterSize from "./filter/FilterSize";

export default async function ProductSidebar({ lan }) {
  const allCategories = await getAllCategory();

  return (
    <>
      {/* <!-- ./sidebar --> */}
      <div className="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hiddenb hidden md:block">
        <div className="divide-y divide-gray-200 space-y-5">
          <FilterCategory lan={lan?.category} allCategories={allCategories} />
          <FilterPrice lan={lan?.price} />
          <FilterSize lan={lan?.size} />
        </div>
      </div>
      {/* <!-- products --> */}
    </>
  );
}
