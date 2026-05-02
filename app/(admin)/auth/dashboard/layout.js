import { redirect } from "next/navigation";
import AdminSidebar from "./component/AdminSidebar";
import { auth } from "@/auth"; 

export default async function Layout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
