"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { planOptions } from "@/components/plan-selector";

type Mode = "signin" | "register";
type RegisterStep = 1 | 2;
type PlanId = (typeof planOptions)[number]["id"];
const DEFAULT_PLAN: PlanId = "starter";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [registerStep, setRegisterStep] = useState<RegisterStep>(2);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";
  const hasInitializedIntent = useRef(false);

  const openRegister = (planOverride?: PlanId) => {
    setMode("register");
    setError(null);
    setLoginMode("user");
    setRegisterStep(2);
    setSelectedPlan(planOverride ?? DEFAULT_PLAN);
    setRegisterEmail("");
    setRegisterName("");
    setRegisterPassword("");
    setRegisterError(null);
    setPaymentStatus("idle");
  };

  useEffect(() => {
    if (hasInitializedIntent.current) {
      return;
    }
    if (!searchParams) {
      return;
    }

    const registerIntent = searchParams.get("register");
    const planIntent = searchParams.get("plan")?.toLowerCase() as PlanId | undefined;
    const shouldRegister =
      registerIntent !== null &&
      registerIntent.toLowerCase() !== "false" &&
      registerIntent !== "0";

    if (shouldRegister) {
      hasInitializedIntent.current = true;
      if (planIntent) {
        const planMatch = planOptions.find((option) => option.id === planIntent);
        if (planMatch) {
          openRegister(planMatch.id);
          return;
        }
      }
      openRegister();
    }
  }, [searchParams]);

  const backToSignIn = () => {
    setMode("signin");
    setRegisterStep(1);
    setSelectedPlan(DEFAULT_PLAN);
    setRegisterError(null);
    setPaymentStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    if (loginMode === "admin") {
      const username = String(formData.get("admin-username") ?? "").trim();
      const password = String(formData.get("admin-password") ?? "").trim();

      if (!username || !password) {
        setError("Username and password are required.");
        return;
      }

      setLoading(true);
      const response = await signIn("super-admin", {
        username,
        password,
        redirect: false,
        callbackUrl
      });
      setLoading(false);

      if (response?.error) {
        setError("Invalid credentials.");
        return;
      }

      router.push(response?.url ?? callbackUrl);
      return;
    }

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("user-password") ?? "").trim();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });
    setLoading(false);

    if (response?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(response?.url ?? callbackUrl);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const googleCallback = `/google-gateway?next=${encodeURIComponent(callbackUrl)}`;
    await signIn("google", { callbackUrl: googleCallback });
    setLoading(false);
  };

  const handlePlanSelect = (plan: PlanId) => {
    setSelectedPlan(plan);
    setRegisterStep(2);
    setRegisterError(null);
    setPaymentStatus("idle");
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = registerEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setRegisterError("Enter a valid email address to continue.");
      return;
    }

    if (!strongPasswordRegex.test(registerPassword.trim())) {
      setRegisterError(
        "Choose a stronger password (10+ chars, upper & lower case, number, special symbol)."
      );
      return;
    }

    setRegisterEmail(normalizedEmail);
    setRegisterLoading(true);
    setRegisterError(null);
    setPaymentStatus("processing");

    try {
      const response = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          plan: selectedPlan,
          name: registerName.trim() || undefined,
          password: registerPassword.trim()
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data as any)?.error ?? "Registration failed. Please try again.");
      }

      setPaymentStatus("success");
      const destination =
        callbackUrl && callbackUrl !== "/dashboard"
          ? `${callbackUrl}${callbackUrl.includes("?") ? "&" : "?"}plan=${selectedPlan}`
          : `/dashboard?plan=${selectedPlan}`;
      const signInResult = await signIn("register", {
        email: normalizedEmail,
        plan: selectedPlan,
        name: registerName.trim(),
        redirect: false,
        callbackUrl: destination
      });

      if (signInResult?.error) {
        setRegisterError(
          "Your account is ready, but we could not start a session. Please try signing in again."
        );
        return;
      }

      router.push(signInResult?.url ?? destination);
    } catch (err) {
      console.error("Registration failed", err);
      setPaymentStatus("idle");
      setRegisterError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const selectedPlanDetails =
    planOptions.find((option) => option.id === selectedPlan) ?? null;
  const passwordIsStrong = strongPasswordRegex.test(registerPassword.trim());

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] px-4 py-6">
      <div className="absolute inset-0 -z-20">
        <div className="pointer-events-none absolute inset-0 animate-[pulse_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.15),transparent_55%)]" />
      </div>
      <div className="absolute -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/25 blur-3xl" />

      {mode === "signin" ? (
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/10 px-6 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-10"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
              Sign In
            </p>
            <h1 className="text-2xl font-semibold text-slate-100">
              Welcome Back to Front Cloud Creative
            </h1>
            <p className="text-sm text-slate-400">
              Access your creative intelligence workspace.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("user");
                  setError(null);
                }}
                className={`w-full rounded-full px-3 py-1 transition ${
                  loginMode === "user"
                    ? "bg-indigo-500/70 text-white shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Member Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode("admin");
                  setError(null);
                }}
                className={`w-full rounded-full px-3 py-1 transition ${
                  loginMode === "admin"
                    ? "bg-indigo-500/70 text-white shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Admin Login
              </button>
            </div>

            {loginMode === "user" ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="user-password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    id="user-password"
                    name="user-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="admin-username" className="block text-sm font-medium text-slate-300">
                    Admin username
                  </label>
                  <input
                    id="admin-username"
                    name="admin-username"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300">
                    Admin password
                  </label>
                  <input
                    id="admin-password"
                    name="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                  />
                </div>
              </>
            )}
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
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="space-y-3 pt-2 text-center">
            <p className="text-sm text-slate-400">
              {`Don't have an account? `}
              <button
                type="button"
                onClick={openRegister}
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Register
              </button>
            </p>
            <p className="text-[11px] text-slate-500">
              By continuing you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-indigo-300 underline decoration-indigo-400/70 underline-offset-2 transition hover:text-indigo-200"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-and-conditions"
                className="text-indigo-300 underline decoration-indigo-400/70 underline-offset-2 transition hover:text-indigo-200"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </form>
      ) : (
        <div className="relative w-full max-w-3xl space-y-8 rounded-2xl border border-white/10 bg-white/10 px-6 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
                Register
              </p>
              <h1 className="text-2xl font-semibold text-slate-100">
                Launch your Front Cloud Creative Workspace
              </h1>
              <p className="text-sm text-slate-400">
                Select a plan, confirm your email, and we will simulate your payment instantly.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={backToSignIn}
              className="self-end text-sm font-medium text-indigo-200 hover:text-indigo-100"
            >
              Back to sign in
            </Button>
          </div>

          {registerStep === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-300">
                Choose the subscription that matches your creative momentum.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {planOptions.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`group flex h-full flex-col justify-between rounded-2xl border px-5 py-6 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        isSelected
                          ? "border-indigo-400/80 bg-indigo-500/20 shadow-xl shadow-indigo-500/20"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/60 hover:bg-indigo-500/10"
                      }`}
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
                            {plan.label}
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-slate-100">{plan.price}</p>
                        </div>
                        <p className="text-sm text-slate-300">{plan.description}</p>
                        <ul className="space-y-2 text-sm text-slate-400">
                          {plan.perks.map((perk) => (
                            <li key={perk} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <span className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-200 transition group-hover:text-white">
                        Select {plan.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {registerStep === 2 && selectedPlanDetails && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-indigo-400/40 bg-indigo-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
                    Selected Plan
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {selectedPlanDetails.label}
                  </h2>
                  <p className="text-sm text-indigo-100/80">{selectedPlanDetails.description}</p>
                </div>
                <p className="text-3xl font-semibold text-white">{selectedPlanDetails.price}</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="register-email" className="block text-sm font-medium text-slate-200">
                    Work email
                  </label>
                  <input
                    id="register-email"
                    name="register-email"
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    disabled={registerLoading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="register-name" className="block text-sm font-medium text-slate-200">
                    Full name <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="register-name"
                    name="register-name"
                    type="text"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    disabled={registerLoading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    placeholder="Taylor Creative"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="register-password" className="block text-sm font-medium text-slate-200">
                    Create password
                  </label>
                  <input
                    id="register-password"
                    name="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    disabled={registerLoading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    autoComplete="new-password"
                    placeholder="Strong password (10+ chars)"
                  />
                  <p className="text-xs text-slate-400">
                    Use at least 10 characters with uppercase, lowercase, number, and special symbol.
                  </p>
                  {registerPassword && !passwordIsStrong && (
                    <p className="text-xs text-rose-400">
                      Password is not strong enough yet.
                    </p>
                  )}
                </div>
              </div>

              {registerError && <p className="text-sm text-rose-400">{registerError}</p>}
              {paymentStatus === "processing" && (
                <p className="text-sm text-indigo-200">
                  Processing your secure payment... This only takes a moment.
                </p>
              )}
              {paymentStatus === "success" && (
                <p className="text-sm text-emerald-300">
                  Payment confirmed! Finalizing your workspace experience.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRegisterStep(1)}
                  className="text-sm font-medium text-indigo-200 hover:text-indigo-100"
                  disabled={registerLoading}
                >
                  Change plan
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-300"
                  disabled={registerLoading || !passwordIsStrong}
                >
                  {registerLoading ? "Creating your account..." : `Start ${selectedPlanDetails.label}`}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={backToSignIn}
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Sign in
              </button>
            </p>
            <p className="text-[11px] text-slate-500">
              By continuing you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-indigo-300 underline decoration-indigo-400/70 underline-offset-2 transition hover:text-indigo-200"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-and-conditions"
                className="text-indigo-300 underline decoration-indigo-400/70 underline-offset-2 transition hover:text-indigo-200"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
