import { forwardRef } from "react";
import { clsx } from "clsx";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={clsx(
      "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
