import { ReactNode } from "react";
import { requireServerRole } from "@/lib/roles";
import { TopBar } from "@/components/top-bar";
import { AdminSideNav } from "@/components/admin/admin-side-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireServerRole(["owner", "admin", "analyst", "support", "billing"]);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <TopBar email={session.user.email} plan={session.user.plan} />
      <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <AdminSideNav />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
