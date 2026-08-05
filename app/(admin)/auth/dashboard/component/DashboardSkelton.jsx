export default function DashboardSkeleton() {
  return (
    <div className="relative md:ml-64 bg-slate-100">
      <div className="animate-pulse">
        <div className="rounded-2xl bg-gradient-to-br from-[#0eadef] via-sky-600 to-blue-700 px-4 pt-8 pb-32 shadow-lg sm:px-6">
          <div className="h-8 w-48 rounded-lg bg-white/40 mb-3"></div>
          <div className="h-4 w-64 rounded bg-white/40 mb-8"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white/40 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="px-4 md:px-6 mx-auto w-full -mt-24">
          <div className="h-96 bg-white rounded-xl shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}
