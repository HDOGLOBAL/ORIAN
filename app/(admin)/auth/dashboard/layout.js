import { redirect } from "next/navigation";
import AdminSidebar from "./component/AdminSidebar";
import { requireAdmin } from "@/database/queries";

export default async function Layout({ children }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
