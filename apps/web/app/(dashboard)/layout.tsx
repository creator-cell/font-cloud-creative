import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { SideNav } from "@/components/side-nav";
import { DashboardTopbar } from "@/components/dashboard-topbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="flex flex-none border-b border-slate-200 bg-white lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <SideNav />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden lg:h-screen">
        <DashboardTopbar plan={session.user.plan ?? "starter"} userName={session.user.name} />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
