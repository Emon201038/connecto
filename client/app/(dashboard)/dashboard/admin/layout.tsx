import React from "react";
import DashboardSidebar, { MobileSidebarTrigger } from "./DashboardSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types";

const AdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session) redirect("/login?callback=/admin");
  if (session.role !== UserRole.ADMIN) redirect("/");
  return (
    <div className="flex flex-col lg:flex-row h-screen ">
      <MobileSidebarTrigger userRole={session.role} />

      <DashboardSidebar userRole={session.role} />

      <main className="flex-1 overflow-y-auto mt-16">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
