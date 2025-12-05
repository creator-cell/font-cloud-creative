"use client";

import { useEffect, useRef, useState } from "react";
import { createCheckoutSession, createPortalSession, rechargeWallet } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";

type ToastState = { type: "success" | "error"; message: string; id: number };

export const BillingActions = ({ token, plan }: { token: string; plan: string }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastProgress, setToastProgress] = useState(0);
  const toastCounter = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const duration = 2000;
    setToastProgress(0);
    // start animation on next frame to ensure transition fires each time
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setToastProgress(100))
    );
    const timeout = setTimeout(() => setToast(null), duration);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [toast?.id]);

  const startCheckout = async (targetPlan: "starter" | "pro" | "team") => {
    setLoading(targetPlan);
    try {
      const { url } = await createCheckoutSession(token, targetPlan);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Try again later.");
    } finally {
      setLoading(null);
    }
  };

  const openPortal = async () => {
    setLoading("portal");
    try {
      const { url } = await createPortalSession(token);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Unable to open billing portal.");
    } finally {
      setLoading(null);
    }
  };

  const recharge = async () => {
    setLoading("recharge");
    try {
      await rechargeWallet(token, { tokens: 15000 });
      setToast({
        type: "success",
        message: "Wallet recharged with 15,000 tokens.",
        id: ++toastCounter.current
      });
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Unable to recharge wallet. Try again later.",
        id: ++toastCounter.current
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {toast ? (
        <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
          <div
            className={`pointer-events-auto w-72 rounded-xl border px-4 py-3 text-sm shadow-xl transition-transform duration-200 ${
              toast.type === "success"
                ? "border-sky-300 bg-sky-500 text-white"
                : "border-rose-300 bg-rose-600 text-white"
            }`}
            key={toast.id}
          >
            <p>{toast.message}</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white/80"
                style={{ width: `${toastProgress}%`, transition: "width 2s linear" }}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-3">
      <Button onClick={openPortal} disabled={loading === "portal"} className="w-full">
        {loading === "portal" ? "Opening portal..." : "Open billing portal"}
      </Button>
      <Button
        variant="secondary"
        onClick={recharge}
        disabled={loading === "recharge"}
        className="w-full"
      >
        {loading === "recharge" ? "Processing..." : "Recharge 15,000 tokens"}
      </Button>
      {plan === "free" && (
        <div className="grid gap-2 md:grid-cols-3">
          {["starter", "pro", "team"].map((target) => (
            <Button
              key={target}
              variant="secondary"
              onClick={() => startCheckout(target as "starter" | "pro" | "team")}
              disabled={loading === target}
            >
              {loading === target ? "Redirecting..." : `Upgrade to ${target}`}
            </Button>
          ))}
        </div>
      )}
      </div>
    </>
  );
};
