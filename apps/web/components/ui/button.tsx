import { forwardRef } from "react";
import { clsx } from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", className, ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-brand text-black hover:bg-indigo-500 focus-visible:ring-indigo-300",
    secondary: "bg-gray-200 text-slate-900 hover:bg-gray-300 focus-visible:ring-gray-400 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-gray-200 hover:text-slate-900 focus-visible:ring-gray-300 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
  };
  return (
    <button ref={ref} className={clsx(base, variants[variant], className)} {...props} />
  );
});

Button.displayName = "Button";
