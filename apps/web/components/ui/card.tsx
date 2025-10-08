import { clsx } from "clsx";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("mb-4 flex flex-col gap-2", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={clsx("text-lg font-semibold text-slate-900", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("text-sm text-slate-600 dark:text-slate-300", className)} {...props} />
);
