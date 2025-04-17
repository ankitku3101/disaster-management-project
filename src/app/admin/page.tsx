// src/app/admin/page.tsx
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import ClientDashboard from "./_components/ClientDashboard"; // move UI logic here

export default async function AdminDashboardPage() {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    redirect("/");
  }

  return <ClientDashboard />;
}
