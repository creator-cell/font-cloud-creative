"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  acknowledgeAdminAlert,
  fetchAdminAlerts,
  type AdminAlertsResponse,
  type AdminSystemAlert,
  type AdminSystemAlertSeverity,
  type AdminSystemAlertType
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const typeOptions: Array<{ value: "" | AdminSystemAlertType; label: string }> = [
  { value: "", label: "All types" },
  { value: "spend_spike", label: "Spend spike" },
  { value: "insufficient_tokens", label: "Insufficient hold" },
  { value: "negative_balance", label: "Negative balance" },
  { value: "cap_exceeded", label: "Safety cap exceeded" }
];

const severityOptions: Array<{ value: "" | AdminSystemAlertSeverity; label: string }> = [
  { value: "", label: "All severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const severityBadge = (severity: AdminSystemAlertSeverity) => {
  switch (severity) {
    case "low":
      return "bg-emerald-100 text-emerald-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "high":
    default:
      return "bg-rose-100 text-rose-700";
  }
};

const statusBadge = (status: "new" | "acknowledged") =>
  status === "new"
    ? "bg-blue-100 text-blue-700"
    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";

const formatDateTime = (value: string) => new Date(value).toLocaleString();

type FiltersState = {
  type: "" | AdminSystemAlertType;
  severity: "" | AdminSystemAlertSeverity;
  from: string;
  to: string;
};

type Props = {
  token: string;
  initial: AdminAlertsResponse;
};

export const AdminAlertsTable = ({ token, initial }: Props) => {
  const [alerts, setAlerts] = useState<AdminSystemAlert[]>(initial.alerts);
  const [pagination, setPagination] = useState(initial.pagination);
  const [page, setPage] = useState(initial.pagination.page);
  const [filters, setFilters] = useState<FiltersState>({
    type: "",
    severity: "",
    from: "",
    to: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AdminSystemAlert | null>(null);
  const selectedAlertRef = useRef<AdminSystemAlert | null>(null);
  const [ackLoading, setAckLoading] = useState(false);

  const limit = initial.pagination.limit ?? 20;

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      type: filters.type ? filters.type : undefined,
      severity: filters.severity ? filters.severity : undefined,
      from: filters.from ? filters.from : undefined,
      to: filters.to ? filters.to : undefined
    }),
    [page, limit, filters]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminAlerts(token, queryParams);
      setAlerts(data.alerts);
      setPagination(data.pagination);
      setPage(data.pagination.page);
      const active = selectedAlertRef.current;
      if (active) {
        const updated = data.alerts.find((alert) => alert.id === active.id);
        if (updated) {
          setSelectedAlert(updated);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load alerts");
    } finally {
      setLoading(false);
    }
  }, [token, queryParams]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleFilterChange = <Key extends keyof FiltersState>(key: Key, value: FiltersState[Key]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (page !== 1) {
      setPage(1);
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;
    setPage(nextPage);
  };

  useEffect(() => {
    selectedAlertRef.current = selectedAlert;
  }, [selectedAlert]);

  const acknowledge = async (alert: AdminSystemAlert) => {
    if (alert.status === "acknowledged") return;
    setAckLoading(true);
    try {
      const response = await acknowledgeAdminAlert(token, alert.id);
      setAlerts((prev) =>
        prev.map((item) => (item.id === alert.id ? response.alert : item))
      );
      setSelectedAlert(response.alert);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to acknowledge alert");
    } finally {
      setAckLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
            Type
            <select
              value={filters.type}
              onChange={(event) => handleFilterChange("type", event.target.value as FiltersState["type"])}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700"
            >
              {typeOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
            Severity
            <select
              value={filters.severity}
              onChange={(event) =>
                handleFilterChange("severity", event.target.value as FiltersState["severity"])
              }
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700"
            >
              {severityOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
            From
            <Input
              type="date"
              value={filters.from}
              onChange={(event) => handleFilterChange("from", event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
            To
            <Input
              type="date"
              value={filters.to}
              onChange={(event) => handleFilterChange("to", event.target.value)}
            />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.pages} • {pagination.total} alerts
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1 || loading}
              className="h-9 rounded-full px-4 text-xs font-semibold"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
              disabled={pagination.page >= pagination.pages || loading}
              className="h-9 rounded-full px-4 text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">
                  Time
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Severity
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  User
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Message
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    Loading alerts…
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No alerts match the current filters.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatDateTime(alert.createdAt)}
                    </td>
                    <td className="px-4 py-3 capitalize text-sm text-slate-700 dark:text-slate-200">
                      {alert.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${severityBadge(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                      {alert.userEmail || alert.userId || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {alert.message}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(alert.status)}`}
                      >
                        {alert.status === "new" ? "New" : "Acknowledged"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAlert ? (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Alert details
                </h3>
                <p className="text-xs text-slate-500">
                  {formatDateTime(selectedAlert.createdAt)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-8 rounded-full px-3 text-xs font-medium"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-4 px-5 py-6 text-sm text-slate-700 dark:text-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Type</p>
                <p className="mt-1 capitalize">{selectedAlert.type.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Severity</p>
                <p className="mt-1">{selectedAlert.severity}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                <p className="mt-1">{selectedAlert.status === "new" ? "New" : "Acknowledged"}</p>
                {selectedAlert.acknowledgedAt ? (
                  <p className="text-xs text-slate-500">Acknowledged {formatDateTime(selectedAlert.acknowledgedAt)}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">User</p>
                <p className="mt-1">
                  {selectedAlert.userEmail || selectedAlert.userId || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Message</p>
                <p className="mt-1 text-sm">{selectedAlert.message}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Metadata</p>
                <div className="mt-2 space-y-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {Object.keys(selectedAlert.meta ?? {}).length === 0 ? (
                    <p>No additional metadata.</p>
                  ) : (
                    Object.entries(selectedAlert.meta ?? {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-3">
                        <span className="font-medium">{key}</span>
                        <span className="truncate text-right">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="mt-auto border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedAlert(null)}
                  className="h-9 rounded-full px-4 text-xs font-semibold"
                >
                  Dismiss
                </Button>
                <Button
                  type="button"
                  onClick={() => void acknowledge(selectedAlert)}
                  disabled={selectedAlert.status === "acknowledged" || ackLoading}
                  className="h-9 rounded-full px-4 text-xs font-semibold"
                >
                  {selectedAlert.status === "acknowledged"
                    ? "Acknowledged"
                    : ackLoading
                      ? "Acknowledging…"
                      : "Acknowledge"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
