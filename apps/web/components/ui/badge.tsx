import { clsx } from "clsx";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning";
};

export const Badge = ({ className, tone = "default", ...props }: BadgeProps) => {
  const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
    default: "bg-gray-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    warning: "bg-amber-500/20 text-amber-600 dark:text-amber-300"
  };
  return (
    <span
      className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
};
