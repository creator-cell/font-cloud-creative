import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { TopBar } from "@/components/top-bar";
import { SideNav } from "@/components/side-nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <TopBar email={session.user.email} plan={session.user.plan} />
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <SideNav />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
