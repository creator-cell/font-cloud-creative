import { apiFetch } from "./client";

export const buildQueryString = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

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
  trend?: Array<{ date: string; signups: number }>;
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
  apiFetch<{ providers: Record<string, { id: string; label: string; minPlan: string; estCostPer1K: number; capabilities?: string[] }[]> }>(
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

export const fetchAnalyticsCohort = (
  token: string,
  params: { start?: string; weeks?: number } = {}
) => apiFetch<AnalyticsCohortResponse>(`/admin/analytics/cohort${buildQueryString(params)}`, { token });

export const fetchAnalyticsSummary = (
  token: string,
  params: { range?: "7d" | "30d" | "90d"; start?: string; end?: string; from?: string; to?: string; tz?: string } = {}
) => apiFetch<AnalyticsSummaryResponse>(`/admin/analytics/summary${buildQueryString(params)}`, { token });

export const fetchAnalyticsTimeseries = (
  token: string,
  params: { range?: "7d" | "30d" | "90d"; start?: string; end?: string; from?: string; to?: string; tz?: string; interval?: "day" | "week" | "month" } = {}
) => apiFetch<AnalyticsTimeseriesResponse>(`/admin/analytics/timeseries${buildQueryString(params)}`, { token });

export const fetchAnalyticsDistribution = (
  token: string,
  params: { range?: "7d" | "30d" | "90d"; start?: string; end?: string; from?: string; to?: string; tz?: string; metric?: string } = {}
) => apiFetch<AnalyticsDistributionResponse>(`/admin/analytics/distribution${buildQueryString(params)}`, { token });

export const buildAnalyticsExportUrl = (params: {
  type: "timeseries" | "distribution" | "users" | "models";
  from?: string;
  to?: string;
  tz?: string;
  interval?: string;
  limit?: number;
}) => {
  const qs = buildQueryString(params);
  return `/admin/analytics/export${qs}`;
};

export const fetchAnalyticsTopUsers = (
  token: string,
  params: { from?: string; to?: string; tz?: string; limit?: number } = {}
) => apiFetch<AnalyticsTopUsersResponse>(`/admin/analytics/top-users${buildQueryString(params)}`, { token });

export const fetchAnalyticsTopModels = (
  token: string,
  params: { from?: string; to?: string; tz?: string; limit?: number } = {}
) => apiFetch<AnalyticsTopModelsResponse>(`/admin/analytics/top-models${buildQueryString(params)}`, { token });

export type AnalyticsSummaryResponse = {
  from?: string;
  to?: string;
  totalTokens: number;
  totalCostCents: number;
  activeUsers: number;
  turns: number;
  avgLatencyMs: number;
};

export type AnalyticsTimeseriesResponse = {
  labels: string[];
  tokens: number[];
  costCents: number[];
  turns: number[];
  avgLatencyMs: number[];
};

export type AnalyticsDistributionResponse = {
  byProvider: { provider: string; totalTokens: number; totalCostCents?: number }[];
  byPlan: { plan: string; totalTokens: number; totalCostCents?: number }[];
};

export type AnalyticsCohortResponse = {
  cohorts: Array<{ cohortStartISO: string; weekIndex: number; tokens: number; users: number }>;
  retention: Array<{ cohortStartISO: string; weekIndex: number; activePct: number }>;
  cohortSizes: Array<{ cohortStartISO: string; users: number }>;
  from?: string;
  to?: string;
};

export type AnalyticsTopUsersResponse = {
  from?: string;
  to?: string;
  tz?: string;
  users: Array<{
    userId?: string;
    email: string;
    totalTokens: number;
    totalCostCents: number;
    turns: number;
    avgLatencyMs: number;
    plan?: string;
  }>;
};

export type AnalyticsTopModelsResponse = {
  from?: string;
  to?: string;
  tz?: string;
  models: Array<{
    model: string;
    provider: string;
    totalTokens: number;
    totalCostCents: number;
    turns: number;
    avgLatencyMs: number;
  }>;
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

export const fetchPlanById = (token: string, id: string) =>
  apiFetch<{ plan: any }>(`/admin/plans/${id}`, { token });

export const updatePlanById = (token: string, id: string, payload: any) =>
  apiFetch(`/admin/plans/${id}`, {
    token,
    method: "PATCH",
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

export type AdminWalletSummary = {
  userId: string;
  email: string;
  tokenBalance: number;
  holdAmount: number;
  creditLimit: number;
  updatedAt: string;
};

export type AdminWalletResponse = {
  items: AdminWalletSummary[];
  total: number;
  stats: { totalBalance: number; totalHold: number; users: number };
};

export const fetchAdminWallets = (
  token: string,
  params: Partial<{ q: string; page: number; limit: number; sort: "tokenBalance" | "holdAmount" | "updatedAt"; direction: "asc" | "desc" }>
) => apiFetch<AdminWalletResponse>(`/admin/wallets${buildQueryString(params)}`, { token });

export type AdminLedgerRecord = {
  id: string;
  userId: string;
  userEmail: string;
  type: "grant" | "spend" | "hold" | "hold_release" | "refund" | "adjustment" | "purchase";
  amountTokens: number;
  source: string;
  provider: string;
  model: string;
  refId: string;
  currency: string;
  amountFiatCents: number;
  createdAt: string;
  meta: Record<string, unknown>;
};

export type AdminLedgerResponse = {
  items: AdminLedgerRecord[];
  total: number;
};

export const fetchAdminLedger = (
  token: string,
  params: Partial<{
    userId: string;
    type: string;
    source: string;
    provider: string;
    model: string;
    refId: string;
    from: string;
    to: string;
    page: number;
    limit: number;
    sort: "createdAt";
    direction: "asc" | "desc";
  }>
) => apiFetch<AdminLedgerResponse>(`/admin/ledger${buildQueryString(params)}`, { token });

export type AdminUsageRecord = {
  id: string;
  userId: string;
  userEmail: string;
  provider: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  latencyMs: number;
  status: "completed" | "failed";
  createdAt: string;
  conversationId?: string;
  turnId?: string;
  finalCostCents: number;
  currency: "USD" | "INR" | "SAR";
  displayCostCents: number;
};

export type AdminUsageResponse = {
  items: AdminUsageRecord[];
  total: number;
  aggregates: { totalTokens: number; avgLatencyMs: number; totalCostCents: number; currency: "USD" | "INR" | "SAR" };
};

export const fetchAdminUsage = (
  token: string,
  params: Partial<{
    userId: string;
    provider: string;
    model: string;
    status: "completed" | "failed";
    from: string;
    to: string;
    page: number;
    limit: number;
    sort: "createdAt" | "totalTokens";
    direction: "asc" | "desc";
    displayCurrency: "USD" | "INR" | "SAR";
  }>
) => apiFetch<AdminUsageResponse>(`/admin/usage${buildQueryString(params)}`, { token });

export const buildLedgerExportPath = (params: Parameters<typeof fetchAdminLedger>[1] = {}) =>
  `/admin/export/ledger.csv${buildQueryString(params ?? {})}`;

export const buildUsageExportPath = (params: Parameters<typeof fetchAdminUsage>[1] = {}) =>
  `/admin/export/usage.csv${buildQueryString(params ?? {})}`;

export const adjustWalletBalance = (token: string, payload: { userId: string; amountTokens: number; reason: string }) =>
  apiFetch<{ balance: number }>("/admin/wallets/adjust", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export type AdminSystemAlertType =
  | "spend_spike"
  | "insufficient_tokens"
  | "negative_balance"
  | "cap_exceeded";
export type AdminSystemAlertSeverity = "low" | "medium" | "high";

export type AdminSystemAlert = {
  id: string;
  type: AdminSystemAlertType;
  severity: AdminSystemAlertSeverity;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  acknowledgedAt?: string;
  status: "new" | "acknowledged";
  message: string;
  meta: Record<string, unknown>;
};

export type AdminAlertsResponse = {
  alerts: AdminSystemAlert[];
  pagination: { total: number; page: number; limit: number; pages: number };
};

export const fetchAdminAlerts = (
  token: string,
  params: Partial<{
    type: AdminSystemAlertType;
    severity: AdminSystemAlertSeverity;
    from: string;
    to: string;
    page: number;
    limit: number;
  }> = {}
) => apiFetch<AdminAlertsResponse>(`/admin/alerts${buildQueryString(params)}`, { token });

export const acknowledgeAdminAlert = (token: string, id: string) =>
  apiFetch<{ alert: AdminSystemAlert }>(`/admin/alerts/ack/${id}`, {
    token,
    method: "POST"
  });

export type ProviderPriceEntry = {
  _id: string;
  provider: string;
  model: string;
  currency: "USD" | "INR" | "SAR";
  inputPer1kCents: number;
  outputPer1kCents: number;
  effectiveFrom: string;
  effectiveTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminPricingResponse = {
  items: ProviderPriceEntry[];
  total: number;
  page: number;
  limit: number;
};

export const fetchAdminPricing = (
  token: string,
  params: Partial<{ provider: string; model: string; currency: "USD" | "INR" | "SAR"; page: number; limit: number }>
) => apiFetch<AdminPricingResponse>(`/admin/pricing${buildQueryString(params)}`, { token });

export const createAdminPricing = (
  token: string,
  payload: {
    provider: "openai" | "anthropic" | "google" | "ollama" | "allam";
    model: string;
    currency: "USD" | "INR" | "SAR";
    inputPer1kCents: number;
    outputPer1kCents: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    notes?: string;
  }
) =>
  apiFetch<{ price: ProviderPriceEntry }>("/admin/pricing", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateAdminPricing = (
  token: string,
  id: string,
  payload: {
    inputPer1kCents?: number;
    outputPer1kCents?: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    notes?: string;
  }
) =>
  apiFetch<{ price: ProviderPriceEntry }>(`/admin/pricing/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const retireAdminPricing = (token: string, id: string) =>
  apiFetch<{ price: ProviderPriceEntry }>(`/admin/pricing/${id}/retire`, {
    token,
    method: "POST"
  });
