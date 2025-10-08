"use client";

import { useState } from "react";
import { throttleFreeTier } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

export const ThrottleButton = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!window.confirm("Throttle free tier for the next 12 hours?")) return;
    setLoading(true);
    try {
      await throttleFreeTier(token);
      alert("Free tier throttled for 12 hours");
    } catch (err) {
      console.error(err);
      alert("Failed to throttle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={onClick} disabled={loading}>
      {loading ? "Applying..." : "Throttle free tier today"}
    </Button>
  );
};
