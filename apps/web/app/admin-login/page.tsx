"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/admin" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    const response = await signIn("super-admin", {
      username,
      password,
      redirect: false
    });

    setLoading(false);

    if (response?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] px-4 py-10">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.15),transparent_55%)]" />
      </div>
      <div className="absolute -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/20 blur-3xl" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm space-y-8 rounded-2xl border border-white/10 bg-white/10 p-10 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Super Admin</p>
          <h1 className="text-2xl font-semibold text-slate-100">Welcome Back to Front Cloud Creative</h1>
          <p className="text-sm text-slate-400">
            Access your creative intelligence workspace.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-300"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400/70">
          <span className="h-px flex-1 bg-slate-500/40" />
          or
          <span className="h-px flex-1 bg-slate-500/40" />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleGoogleSignIn}
          className="w-full items-center rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/70"
        >
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
