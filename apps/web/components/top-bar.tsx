import { PlanBadge } from "@/components/plan-badge";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export const TopBar = ({ email, plan }: { email?: string | null; plan: string }) => (
  <header className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/80">
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Front Cloud Creative</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{email ?? ""}</p>
    </div>
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <PlanBadge plan={plan} />
      <SignOutButton />
    </div>
  </header>
);
