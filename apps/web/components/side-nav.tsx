"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  MessageSquare,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
  allowedRoles?: string[];
};

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/projects", label: "Projects", Icon: FolderKanban },
  { href: "/brand-voice", label: "Brand Voice", Icon: MessageSquare },
  {
    href: "/chat/single",
    label: "AI Chat",
    Icon: MessageSquare,
    allowedRoles: ["owner", "admin", "developer"],
  },
  { href: "/generate", label: "Generate", Icon: Sparkles },
  { href: "/billing", label: "Billing", Icon: CreditCard },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export const SideNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const roles = session?.user?.roles?.map((role) => role.toLowerCase()) ?? [];

  const visibleLinks = navLinks.filter(({ allowedRoles }) => {
    if (!allowedRoles?.length) return true;
    if (!roles.length) return false;
    return allowedRoles.some((role) => roles.includes(role));
  });

  return (
    <aside className="flex h-full w-full flex-col bg-white lg:sticky lg:top-0 lg:h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 px-6 pb-6 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <Image src="/logo.svg" alt="Front Cloud Creative" width={28} height={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Front Cloud</p>
            <p className="text-xs text-slate-500">Creative AI Platform</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {visibleLinks.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <Icon
                  className={clsx(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-slate-200 bg-slate-50 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Token Usage</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <div className="h-full w-[18%] rounded-full bg-sky-500" />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>21,370</span>
          <span>300,000</span>
        </div>
        <span className="mt-4 inline-block rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-600">
          starter
        </span>
      </div>
    </aside>
  );
};
