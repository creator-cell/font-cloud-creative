"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const AdminErrorState = ({ message }: { message: string }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin access required</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
    <div className="flex items-center gap-4">
      <Link href="/admin-login" className="inline-flex">
        <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Go to admin login</Button>
      </Link>
      <Link href="/" className="inline-flex">
        <Button variant="secondary" className="rounded-full">Back to homepage</Button>
      </Link>
    </div>
  </div>
);
