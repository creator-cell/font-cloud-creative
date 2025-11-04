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

  if (session.requiresPlan && session.user.provider === "google") {
    redirect("/google-onboarding?next=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="flex flex-none border-b border-slate-200 bg-white lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <SideNav />
      </aside>
      <div className="flex flex-1 flex-col lg:h-screen lg:overflow-hidden">
        <DashboardTopbar plan={session.user.plan ?? "starter"} userName={session.user.name} />
        <main className="flex-1 overflow-y-auto px-5 py-4 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
