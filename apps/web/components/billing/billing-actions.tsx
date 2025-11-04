"use client";

import { useState } from "react";
import { createCheckoutSession, createPortalSession, rechargeWallet } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";

export const BillingActions = ({ token, plan }: { token: string; plan: string }) => {
  const [loading, setLoading] = useState<string | null>(null);

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
      alert("Wallet recharged with 15,000 tokens.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Unable to recharge wallet. Try again later.");
    } finally {
      setLoading(null);
    }
  };

  return (
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
  );
};
