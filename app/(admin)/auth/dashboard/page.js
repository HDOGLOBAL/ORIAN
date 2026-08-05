import { Suspense } from "react";
import DashboardSkeleton from "./component/DashboardSkelton";
import DashboardMain from "./component/DashboardMain";

export default async function DashboardPage() {
  return (
    <div className="relative md:ml-64 bg-slate-100 min-h-screen">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardMain />
      </Suspense>
    </div>
  );
}
