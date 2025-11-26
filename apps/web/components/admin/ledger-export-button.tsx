"use client";

import { useState } from "react";
import { apiBaseUrl } from "@/lib/api/client";
import { buildQueryString } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

type Props = {
  token: string;
  params: Record<string, string | number | undefined>;
  endpoint: "ledger" | "usage";
};

const endpointMap = {
  ledger: "/admin/export/ledger.csv",
  usage: "/admin/export/usage.csv"
} as const;

export const LedgerExportButton = ({ token, params, endpoint }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const query = buildQueryString(params).replace(/^\?/, "");
      const url = `${apiBaseUrl}${endpointMap[endpoint]}${query ? `?${query}` : ""}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.download = `${endpoint}-export-${ts}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);
      window.alert("Failed to export CSV. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={loading}
      className="border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-slate-900"
    >
      {loading ? "Preparing..." : "Export CSV"}
    </Button>
  );
};
