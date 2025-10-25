import type { z } from "zod";
import { apiFetch } from "./client";
import type { generateRequestSchema } from "@/lib/validation";

export interface ProviderModelSummary {
  provider: string;
  models: Array<{
    id: string;
    label: string;
    capabilities: string[];
    minPlan: string;
    estCostPer1K: number;
    available: boolean;
  }>;
}

export interface ProjectSummary {
  _id: string;
  name: string;
  modelOverride?: {
    provider: string;
    model: string;
  };
  brandVoiceIds: string[];
}

export interface BrandVoiceSummary {
  _id: string;
  projectId: string;
  styleCard: {
    tone: string[];
    cadence: string;
    readingLevel: string;
    powerWords: string[];
    taboo: string[];
    dos: string[];
    donts: string[];
    language: string;
  };
}

export const fetchModels = (token: string) =>
  apiFetch<{ models: ProviderModelSummary[] }>("/models", { token });

export const fetchUsage = (token: string) => apiFetch("/usage/me", { token });

export type GeneratePayload = z.infer<typeof generateRequestSchema>;

export const postGenerate = (token: string, payload: GeneratePayload) =>
  apiFetch("/generate", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const buildBrandVoice = (
  token: string,
  payload: { projectId: string; samples: string[]; language?: string }
) =>
  apiFetch<{ brandVoice: BrandVoiceSummary }>("/brand-voice/build", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const createCheckoutSession = (token: string, plan: "starter" | "pro" | "team") =>
  apiFetch<{ url: string }>("/subscriptions/checkout", {
    token,
    method: "POST",
    body: JSON.stringify({ plan })
  });

export const createPortalSession = (token: string) =>
  apiFetch<{ url: string }>("/subscriptions/portal", { token });

export const completePlanSelection = (token: string, plan: "starter" | "pro" | "team") =>
  apiFetch<{
    payment: { status: string; reference: string; gateway: string };
    token: string;
    user: { id: string; email: string; plan: string; roles: string[] };
  }>("/auth/complete-plan", {
    token,
    method: "POST",
    body: JSON.stringify({ plan })
  });

export const fetchProjects = (token: string) =>
  apiFetch<{ projects: ProjectSummary[] }>("/projects", { token });

export const createProject = (token: string, payload: { name: string }) =>
  apiFetch<{ project: ProjectSummary }>("/projects", {
    token,
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateProject = (token: string, projectId: string, payload: { name: string }) =>
  apiFetch<{ project: ProjectSummary }>(`/projects/${projectId}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteProject = (token: string, projectId: string) =>
  apiFetch<{ success: boolean }>(`/projects/${projectId}`, {
    token,
    method: "DELETE"
  });

export const fetchBrandVoices = (token: string) =>
  apiFetch<{ brandVoices: BrandVoiceSummary[] }>("/brand-voice", { token });
