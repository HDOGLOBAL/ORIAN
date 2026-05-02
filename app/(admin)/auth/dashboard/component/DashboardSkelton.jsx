export default function DashboardSkeleton() {
  return (
    <div className="relative md:ml-64 bg-blueGray-100">
      <div className="bg-blueGray-800 pb-32 pt-12">
        <div className="animate-pulse px-4 md:px-10 mx-auto w-full">
          <div className="flex flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <div className="h-40 bg-blueGray-700 rounded-lg mb-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 md:px-10 mx-auto w-full -m-24">
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <div className="h-96 bg-blueGray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
