
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import ClientDashboard from "./_components/ClientDashboard";
import NotifyUsersForm from "./_components/NotifyUsersForm";

export default async function AdminDashboardPage() {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="p-4 space-y-10">
      <ClientDashboard />
      <NotifyUsersForm />
    </div>
  );
}
