"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { planOptions } from "@/components/plan-selector";

export const dynamic = "force-dynamic";

type Mode = "signin" | "register" | "forgot";
type RegisterStep = 1 | 2;
const freePlanOption = [
  {
    id: "free" as const,
    label: "Free",
    price: "$0",
    description: "Try the studio with shared capacity and community prompts.",
    perks: ["Shared usage pool", "Community templates", "Email support"]
  }
] as const;

type RegisterPlan = (typeof freePlanOption)[number] | (typeof planOptions)[number];
type RegisterPlanId = RegisterPlan["id"];
const registerPlanOptions: RegisterPlan[] = [...freePlanOption, ...planOptions];
const DEFAULT_PLAN: RegisterPlanId = "free";
const countryCodes = [
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+1", label: "United States (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+91", label: "India (+91)" },
  { value: "+55", label: "Brazil (+55)" },
] as const;
const defaultCountryCode = "+966" as const;

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [registerStep, setRegisterStep] = useState<RegisterStep>(2);
  const [selectedPlan, setSelectedPlan] = useState<RegisterPlanId>(DEFAULT_PLAN);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerCountryCode, setRegisterCountryCode] =
    useState<(typeof countryCodes)[number]["value"]>(defaultCountryCode);
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";
  const hasInitializedIntent = useRef(false);

  const openRegister = (planOverride?: RegisterPlanId) => {
    setMode("register");
    setError(null);
    setRegisterStep(2);
    setSelectedPlan(planOverride ?? DEFAULT_PLAN);
    setRegisterEmail("");
    setRegisterName("");
    setRegisterCountryCode(defaultCountryCode);
    setRegisterPhone("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterError(null);
    setPaymentStatus("idle");
    setShowRegisterSuccess(false);
    setForgotEmail("");
    setForgotError(null);
    setForgotSuccess(false);
    setForgotLoading(false);
  };

  const openForgotPassword = () => {
    setMode("forgot");
    setError(null);
    setForgotEmail("");
    setForgotError(null);
    setForgotSuccess(false);
  };

  useEffect(() => {
    if (hasInitializedIntent.current) {
      return;
    }
    if (!searchParams) {
      return;
    }

    const registerIntent = searchParams.get("register");
    const planIntent = searchParams.get("plan")?.toLowerCase() as RegisterPlanId | undefined;
    const shouldRegister =
      registerIntent !== null &&
      registerIntent.toLowerCase() !== "false" &&
      registerIntent !== "0";

    if (shouldRegister) {
      hasInitializedIntent.current = true;
      if (planIntent) {
        const planMatch = registerPlanOptions.find((option) => option.id === planIntent);
        if (planMatch) {
          openRegister(planMatch.id);
          return;
        }
      }
      openRegister();
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      mode === "register" &&
      !registerPlanOptions.some((option) => option.id === selectedPlan)
    ) {
      setSelectedPlan(DEFAULT_PLAN);
    }
  }, [mode, selectedPlan]);

  const backToSignIn = () => {
    setMode("signin");
    setRegisterStep(2);
    setSelectedPlan(DEFAULT_PLAN);
    setRegisterError(null);
    setPaymentStatus("idle");
    setRegisterLoading(false);
    setRegisterConfirmPassword("");
    setShowRegisterSuccess(false);
    setForgotEmail("");
    setForgotError(null);
    setForgotSuccess(false);
    setForgotLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
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
    await signIn("google", { callbackUrl: "/dashboard" });
    setLoading(false);
  };

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = forgotEmail.trim().toLowerCase();
    if (!normalized) {
      setForgotError("Enter a valid email to continue.");
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setForgotSuccess(true);
    } catch (err) {
      console.error("Forgot password flow failed", err);
      setForgotError("We couldn't process the request. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handlePlanSelect = (plan: RegisterPlanId) => {
    setSelectedPlan(plan);
    setRegisterStep(2);
    setRegisterError(null);
    setPaymentStatus("idle");
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = registerEmail.trim().toLowerCase();
    const phone = registerPhone.trim();
    const password = registerPassword.trim();
    const confirmPassword = registerConfirmPassword.trim();
    if (!normalizedEmail) {
      setRegisterError("Enter a valid email address to continue.");
      return;
    }

    if (!phone) {
      setRegisterError("Enter a contact number to continue.");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setRegisterError(
        "Choose a stronger password (10+ chars, upper & lower case, number, special symbol)."
      );
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Password and confirmation must match.");
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
          contactNumber: `${registerCountryCode} ${phone}`,
          password
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data as any)?.error ?? "Registration failed. Please try again.");
      }

      setPaymentStatus("success");
      const signInResult = await signIn("register", {
        email: normalizedEmail,
        plan: selectedPlan,
        name: registerName.trim(),
        redirect: false,
        callbackUrl: "/"
      });

      if (signInResult?.error) {
        setRegisterError(
          "Your account is ready, but we could not start a session. Please try signing in again."
        );
        return;
      }

      setShowRegisterSuccess(true);
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
    registerPlanOptions.find((option) => option.id === selectedPlan) ?? registerPlanOptions[0];
  const passwordIsStrong = strongPasswordRegex.test(registerPassword.trim());
  const passwordsMatch =
    !!registerPassword.trim() && registerPassword.trim() === registerConfirmPassword.trim();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] px-4 py-6">
      <div className="absolute inset-0 -z-20">
        <div className="pointer-events-none absolute inset-0 animate-[pulse_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.15),transparent_55%)]" />
      </div>
      <div className="absolute -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/25 blur-3xl" />
      {showRegisterSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-300/30 bg-slate-900/90 p-6 text-center shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
              Registration Complete
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Welcome to Front Cloud Creative</h2>
            <p className="mt-2 text-sm text-slate-300">
              Your workspace is getting ready. You will notify you shortly.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                onClick={() => router.push("/")}
              >
                Go to homepage
              </Button>
            </div>
          </div>
        </div>
      )}

      {mode === "signin" && (
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
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                placeholder="you@email.com"
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
            <div className="text-right">
              <button
                type="button"
                onClick={openForgotPassword}
                className="text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Forgot password?
              </button>
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
            className="w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="space-y-3 pt-2 text-center">
            <p className="text-sm text-slate-400">
              {`Don't have an account? `}
              <button
                type="button"
                onClick={() => openRegister()}
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
      )}

      {mode === "register" && (
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
          </div>

          {registerStep === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-300">
                Choose the subscription that matches your creative momentum.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {registerPlanOptions.map((plan) => {
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

          {registerStep === 2 && (
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
                    Email
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
                    placeholder="you@email.com"
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
                  <label className="block text-sm font-medium text-slate-200">
                    Contact number
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px,1fr]">
                    <select
                      value={registerCountryCode}
                      onChange={(event) =>
                        setRegisterCountryCode(event.target.value as (typeof countryCodes)[number]["value"])
                      }
                      disabled={registerLoading}
                      className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    >
                      {countryCodes.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="register-phone"
                      name="register-phone"
                      type="tel"
                      value={registerPhone}
                      onChange={(event) => setRegisterPhone(event.target.value)}
                      disabled={registerLoading}
                      className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                      placeholder="555 123 4567"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Include a reachable number with country code for onboarding updates.
                  </p>
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
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="register-password-confirm"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Confirm password
                  </label>
                  <input
                    id="register-password-confirm"
                    name="register-password-confirm"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(event) => setRegisterConfirmPassword(event.target.value)}
                    disabled={registerLoading}
                    className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                  />
                  {registerConfirmPassword && !passwordsMatch && (
                    <p className="text-xs text-rose-400">Passwords do not match yet.</p>
                  )}
                </div>
              </div>

              {registerError && <p className="text-sm text-rose-400">{registerError}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                onClick={() => setRegisterStep(1)}
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                disabled={registerLoading}
              >
                Change plan
              </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-300"
                  disabled={registerLoading || !passwordIsStrong || !passwordsMatch}
                >
                  {registerLoading ? "Creating your account..." : `Start ${selectedPlanDetails.label}`}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3 text-center">
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

      {mode === "forgot" && (
        <form
          onSubmit={handleForgotSubmit}
          className="relative w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/10 px-6 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-10"
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
              Reset Password
            </p>
            <h1 className="text-2xl font-semibold text-slate-100">Forgot your password?</h1>
            <p className="text-sm text-slate-400">
              Enter your email and we will send a reset link to get you back in.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="forgot-email"
              name="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={forgotEmail}
              onChange={(event) => setForgotEmail(event.target.value)}
              disabled={forgotLoading || forgotSuccess}
              className="w-full rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="you@email.com"
            />
          </div>

          {forgotError && <p className="text-sm text-rose-400">{forgotError}</p>}
          {forgotSuccess && (
            <p className="text-sm text-emerald-300">
              If an account exists for {forgotEmail.trim().toLowerCase()}, you'll receive a reset link
              shortly.
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-300"
            disabled={forgotLoading}
          >
            {forgotLoading ? "Sending..." : forgotSuccess ? "Resend link" : "Send reset link"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={backToSignIn}
            className="mx-auto block rounded-full px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            Back to sign in
          </Button>
        </form>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  );
}
