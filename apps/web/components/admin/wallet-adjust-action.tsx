"use client";

import { useState } from "react";
import { adjustWalletBalance, type AdminWalletSummary } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

type Props = {
  token: string;
  wallet: AdminWalletSummary;
};

export const WalletAdjustAction = ({ token, wallet }: Props) => {
  const [pending, setPending] = useState(false);

  const handleAdjust = async () => {
    const amountInput = window.prompt(
      `Enter token adjustment for ${wallet.email} (use negative value to debit):`
    );
    if (amountInput === null) return;
    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount === 0) {
      alert("Please enter a non-zero numeric amount");
      return;
    }

    const reason = window.prompt("Enter a short reason for this adjustment:");
    if (!reason) {
      alert("Reason is required");
      return;
    }

    const confirmation = window.prompt(
      `Type the user's email (${wallet.email}) to confirm this adjustment:`
    );
    if (confirmation?.trim().toLowerCase() !== wallet.email.toLowerCase()) {
      alert("Confirmation does not match user email. Adjustment cancelled.");
      return;
    }

    try {
      setPending(true);
      await adjustWalletBalance(token, {
        userId: wallet.userId,
        amountTokens: amount,
        reason
      });
      window.alert("Wallet updated");
      window.location.reload();
    } catch (err) {
      console.error(err);
      window.alert("Failed to adjust wallet. See console for details.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleAdjust}
      disabled={pending}
      className="px-3 py-1 text-sm border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-slate-900"
    >
      {pending ? "Updating..." : "Adjust"}
    </Button>
  );
};
