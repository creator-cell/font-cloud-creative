"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { planOptions } from "@/components/plan-selector";
import { Button } from "@/components/ui/button";
import { completePlanSelection } from "@/lib/api/endpoints";

type PlanId = (typeof planOptions)[number]["id"];

interface GoogleOnboardingProps {
  email: string;
  token: string;
  nextPath: string;
}

export function GoogleOnboarding({ email, token, nextPath }: GoogleOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const normalizedEmail = useMemo(() => email.toLowerCase(), [email]);
  const selectedPlanDetails = selectedPlan
    ? planOptions.find((plan) => plan.id === selectedPlan)
    : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlan) {
      setError("Select a plan to continue.");
      setStep(1);
      return;
    }

    setProcessing(true);
    setError(null);
    setPaymentStatus("processing");
    try {
      await completePlanSelection(token, selectedPlan);
      setPaymentStatus("success");
      await signIn("register", {
        email: normalizedEmail,
        plan: selectedPlan,
        redirect: false
      });
      router.push(nextPath);
    } catch (err) {
      console.error("Failed to complete plan selection", err);
      setPaymentStatus("idle");
      setError("We could not complete your payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] px-4 py-8">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 animate-[pulse_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.2),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.15),transparent_55%)]" />
      </div>
      <div className="relative w-full max-w-3xl space-y-8 rounded-2xl border border-white/10 bg-white/10 px-6 py-10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
              Finish onboarding
            </p>
            <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              Choose your plan to activate your workspace
            </h1>
            <p className="text-sm text-slate-400">
              Your Google account is linked. Select a plan and confirm payment to enter the
              dashboard.
            </p>
          </div>
          <div className="rounded-full border border-indigo-400/60 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
            Step {step} of 2
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-300">
              Pick the subscription that matches your team's ambitions.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {planOptions.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setStep(2);
                      setError(null);
                    }}
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
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </div>
        )}

        {step === 2 && selectedPlanDetails && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-indigo-400/40 bg-indigo-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                Selected plan
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedPlanDetails.label}</h2>
                  <p className="text-sm text-indigo-100/80">{selectedPlanDetails.description}</p>
                </div>
                <p className="text-3xl font-semibold text-white">{selectedPlanDetails.price}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  Google account
                </span>
                <span className="text-base font-semibold text-slate-100">{normalizedEmail}</span>
              </div>
              <p>
                Your account will activate immediately after payment. A confirmation email will be
                sent to <span className="text-indigo-200">{normalizedEmail}</span>.
              </p>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
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
                className="text-sm font-medium text-indigo-200 hover:text-indigo-100"
                onClick={() => {
                  setStep(1);
                  setPaymentStatus("idle");
                }}
                disabled={processing}
              >
                Choose a different plan
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-300"
                disabled={processing}
              >
                {processing ? "Activating..." : `Activate ${selectedPlanDetails.label}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
