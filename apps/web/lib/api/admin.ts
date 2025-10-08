import { apiFetch } from "./client";

export interface KPIResponse {
  range: string;
  dau: number;
  wau: number;
  mau: number;
  newSignups: number;
  activePaid: number;
  mrr: number;
  churn: number;
  arpu: number;
  tokenBurnByProvider: Record<string, { in: number; out: number }>;
  planMix: Record<string, number>;
}

export const fetchAdminOverview = (token: string, range: "7d" | "30d" | "90d" = "30d") =>
  apiFetch<KPIResponse>(`/admin/analytics/overview?range=${range}`, { token });

export interface TopUser {
  userId: string;
  email: string;
  plan: string;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  overLimit: boolean;
}

export const fetchTopUsers = (token: string, limit = 50) =>
  apiFetch<{ monthKey: string; users: TopUser[] }>(`/admin/usage/top-users?limit=${limit}`, { token });

export const setUserPlan = (token: string, userId: string, payload: { plan: string; seats?: number }) =>
  apiFetch(`/admin/users/${userId}/set-plan`, {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const grantUserTokens = (
  token: string,
  userId: string,
  payload: { extraTokens: number; monthKey?: string; reason: string }
) =>
  apiFetch(`/admin/users/${userId}/grant-tokens`, {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchProviderRegistry = (token: string) =>
  apiFetch<{ providers: Record<string, { id: string; label: string; minPlan: string; estCostPer1K: number }[]> }>(
    "/admin/models/providers",
    { token }
  );

export const fetchFeatureFlags = (token: string) =>
  apiFetch<{ flags: { key: string; description?: string; enabled: boolean; rolloutPercent: number }[] }>(
    "/admin/flags",
    { token }
  );

export const upsertFeatureFlag = (
  token: string,
  payload: { key: string; description?: string; enabled: boolean; rolloutPercent: number; audienceQuery?: Record<string, unknown> }
) =>
  apiFetch("/admin/flags", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchAuditLog = (
  token: string,
  params: { actorId?: string; action?: string; start?: string; end?: string; limit?: number } = {}
) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  return apiFetch<{ logs: unknown[] }>(`/admin/audit?${query.toString()}`, { token });
};

export const createAnnouncement = (
  token: string,
  payload: { title: string; body: string; audience: "all" | "paid" | "free"; link?: string; publishAt?: string; published?: boolean }
) =>
  apiFetch("/admin/announcement", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchAnnouncements = (token: string) =>
  apiFetch<{ announcements: any[] }>("/admin/announcements", { token });

export const fetchPlans = (token: string) => apiFetch<{ plans: any[] }>("/admin/plans", { token });

export const upsertPlan = (token: string, payload: any) =>
  apiFetch("/admin/plans", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchSupportTickets = (token: string) =>
  apiFetch<{ tickets: any[] }>("/admin/support/tickets", { token });

export const replyToTicket = (token: string, ticketId: string, payload: { message: string; status?: string; assigneeId?: string }) =>
  apiFetch(`/admin/support/tickets/${ticketId}/reply`, {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const throttleFreeTier = (token: string) =>
  apiFetch("/admin/usage/throttle", {
    token,
    method: "POST"
  });

export const fetchMRR = (token: string) => apiFetch<{ mrr: number; arr: number; planMix: Record<string, number> }>("/admin/revenue/mrr", { token });
