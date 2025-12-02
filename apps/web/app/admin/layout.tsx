import { ReactNode } from "react";
import { requireServerRole } from "@/lib/roles";
import { AdminSideNav } from "@/components/admin/admin-side-nav";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireServerRole(
    ["owner", "admin", "analyst", "support", "billing"],
    { redirectTo: "/admin-login" }
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="flex flex-none border-b border-slate-200 bg-white lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex w-full flex-col"><AdminSideNav /></div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden lg:h-screen">
        <AdminTopbar userName={session.user?.name ?? undefined} />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
