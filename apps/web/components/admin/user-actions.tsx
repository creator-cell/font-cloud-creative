"use client";

import { useState } from "react";
import { setUserPlan, grantUserTokens } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

interface Props {
  token: string;
  userId: string;
  email: string;
  plan: string;
}

export const UserActions = ({ token, userId, email, plan }: Props) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSetPlan = async () => {
    const nextPlan = window.prompt(`Set plan for ${email}`, plan);
    if (!nextPlan) return;
    setLoading("plan");
    try {
      await setUserPlan(token, userId, { plan: nextPlan });
      alert("Plan updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update plan");
    } finally {
      setLoading(null);
    }
  };

  const handleGrantTokens = async () => {
    const tokens = window.prompt("Extra tokens to grant", "50000");
    if (!tokens) return;
    const reason = window.prompt("Reason", "Support grant");
    if (!reason) return;
    setLoading("tokens");
    try {
      await grantUserTokens(token, userId, {
        extraTokens: parseInt(tokens, 10),
        reason
      });
      alert("Grant recorded");
    } catch (err) {
      console.error(err);
      alert("Failed to grant tokens");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onClick={handleSetPlan}
        disabled={loading === "plan"}
        className="px-3 py-1 text-sm"
      >
        Set Plan
      </Button>
      <Button
        variant="ghost"
        onClick={handleGrantTokens}
        disabled={loading === "tokens"}
        className="px-3 py-1 text-sm"
      >
        Grant Tokens
      </Button>
    </div>
  );
};
