import { ReactNode } from "react";
import { requireServerRole } from "@/lib/roles";
import { AdminSideNav } from "@/components/admin/admin-side-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireServerRole(["owner", "admin", "analyst", "support", "billing"]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[220px_1fr] lg:gap-8 lg:px-10">
      <aside className="lg:border-r lg:border-slate-200/70 lg:pr-8 lg:dark:border-slate-800/80">
        <div className="space-y-4 pr-6 pt-2 lg:pr-0 lg:pt-6">
          <AdminSideNav />
        </div>
      </aside>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
