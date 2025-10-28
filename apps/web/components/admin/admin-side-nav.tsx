"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CreditCard,
  ClipboardList,
  Cpu,
  Flag,
  ScrollText,
  LifeBuoy,
  Megaphone,
  Wallet,
  Receipt,
  BellRing,
  DollarSign,
  type LucideIcon
} from "lucide-react";

type AdminNavLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const links: AdminNavLink[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/wallets", label: "Wallets", Icon: Wallet },
  { href: "/admin/ledger", label: "Ledger", Icon: Receipt },
  { href: "/admin/usage", label: "Usage", Icon: BarChart3 },
  { href: "/admin/alerts", label: "Alerts", Icon: BellRing },
  { href: "/admin/pricing", label: "Pricing", Icon: DollarSign },
  { href: "/admin/billing", label: "Billing", Icon: CreditCard },
  { href: "/admin/plans", label: "Plans", Icon: ClipboardList },
  { href: "/admin/models", label: "Models", Icon: Cpu },
  { href: "/admin/flags", label: "Flags", Icon: Flag },
  { href: "/admin/logs", label: "Audit", Icon: ScrollText },
  { href: "/admin/support", label: "Support", Icon: LifeBuoy },
  { href: "/admin/announcements", label: "Announcements", Icon: Megaphone }
];

export const AdminSideNav = () => {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col bg-white">
      <Link
        href="/"
        className="flex items-center gap-3 px-6 pb-6 pt-6 transition hover:bg-slate-100 dark:hover:bg-slate-800/80"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
          <Image src="/logo.svg" alt="Front Cloud Creative" width={28} height={28} priority />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Front Cloud</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Admin Console</p>
        </div>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <link.Icon
                className={clsx(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"
                )}
                aria-hidden="true"
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-slate-200 bg-slate-50 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Session</p>
        <p className="mt-3 text-sm text-slate-600">Manage system settings and operations.</p>
      </div>
    </aside>
  );
};
