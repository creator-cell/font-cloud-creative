"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  userName?: string;
}

export const AdminTopbar = ({ userName }: AdminTopbarProps) => {
  const displayName = userName && userName.trim().length > 0 ? userName : "Administrator";

  const handleLogout = () => {
    void signOut({ callbackUrl: "/admin-login" });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Admin
          </span>
          <span className="text-sm text-slate-500">{displayName}</span>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="text-sm"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </header>
  );
};
