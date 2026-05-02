import { getUserByMail } from "@/database/queries";
import AdminMain from "./AdminMain";
import { auth } from "@/auth";

export default async function page() {
  const session = await auth();
  const admin = await getUserByMail(session?.user?.email);

  return <AdminMain adminIn={admin?.id} />;
}
