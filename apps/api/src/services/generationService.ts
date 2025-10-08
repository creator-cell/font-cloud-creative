import { Types } from "mongoose";
import { callProvider, chooseModelForRequest } from "../providers/registry";
import type { ProviderId, ProviderSelection } from "../providers/types";
import { BrandVoiceModel, GenerationModel, ProjectModel } from "../models";
import type { GenerationType } from "../models/Generation";
import type { StyleCard } from "../models/BrandVoice";
import { buildPrompt } from "./promptBuilder";
import { getResponseSchema } from "../schemas/generationSchemas";
import { runSafetyChecks } from "../utils/safety";
import { createWatermark } from "../utils/watermark";
import { estimateTokens } from "../utils/tokenizer";
import { bumpUsage } from "./usageService";
import type { AuthClaims } from "../types/express";
import type { PlanTier } from "../constants/plans";

interface GenerateParams {
  user: AuthClaims;
  type: GenerationType;
  inputs: Record<string, unknown>;
  projectId?: string;
  styleCardId?: string;
  provider?: ProviderId;
  model?: string;
  claimsMode?: boolean;
}

const fetchStyleCard = async (
  userId: string,
  projectId?: string,
  styleCardId?: string
): Promise<StyleCard | undefined> => {
  if (styleCardId) {
    const voice = await BrandVoiceModel.findOne({
      _id: new Types.ObjectId(styleCardId),
      userId: new Types.ObjectId(userId)
    });
    return voice?.styleCard;
  }

  if (!projectId) return undefined;
  const project = await ProjectModel.findOne({
    _id: new Types.ObjectId(projectId),
    userId: new Types.ObjectId(userId)
  });
  if (!project || project.brandVoiceIds.length === 0) return undefined;
  const voice = await BrandVoiceModel.findById(project.brandVoiceIds[0]);
  return voice?.styleCard;
};

const getProjectOverride = async (userId: string, projectId?: string): Promise<ProviderSelection | null> => {
  if (!projectId) return null;
  const project = await ProjectModel.findOne({
    _id: new Types.ObjectId(projectId),
    userId: new Types.ObjectId(userId)
  });
  if (!project?.modelOverride) return null;
  return project.modelOverride;
};

export const generateContent = async ({
  user,
  type,
  inputs,
  projectId,
  styleCardId,
  provider,
  model,
  claimsMode
}: GenerateParams): Promise<{
  output: Record<string, unknown>;
  warnings: string[];
  claims?: unknown;
  provider: string;
  model: string;
  watermark?: string;
}> => {
  const styleCard = await fetchStyleCard(user.sub, projectId, styleCardId);
  const projectOverride = await getProjectOverride(user.sub, projectId);

  const selection = chooseModelForRequest(user.plan, {
    request: provider && model ? { provider, model } : null,
    projectOverride,
    userDefault:
      user.preferredProvider && user.preferredModel
        ? { provider: user.preferredProvider, model: user.preferredModel }
        : null
  });

  const prompt = buildPrompt({ type, inputs, styleCard, claimsMode });

  const responseText = await callProvider(selection.provider, selection.model, {
    system: prompt.system,
    user: prompt.user,
    json: true
  });

  const schema = getResponseSchema(type);
  let parsed;
  try {
    parsed = schema.parse(JSON.parse(responseText));
  } catch (err) {
    const error = new Error("Provider returned invalid JSON");
    (error as Error & { details?: unknown }).details = err;
    throw error;
  }

  const safety = runSafetyChecks(parsed.data as Record<string, unknown>, styleCard?.taboo ?? [], user.plan);
  if (safety.blocked) {
    const error = new Error("Content blocked by safety filter");
    (error as Error & { status?: number; details?: unknown }).status = 403;
    error.details = safety.warnings;
    throw error;
  }

  const warnings = Array.from(new Set([...(parsed.warnings ?? []), ...safety.warnings]));
  const watermark = user.plan === "free" ? createWatermark(user.sub) : undefined;

  const tokensIn = estimateTokens(`${prompt.system}\n${prompt.user}`);
  const tokensOut = estimateTokens(JSON.stringify(parsed));

  await GenerationModel.create({
    userId: new Types.ObjectId(user.sub),
    projectId: projectId ? new Types.ObjectId(projectId) : undefined,
    type,
    inputs,
    provider: selection.provider,
    model: selection.model,
    output: parsed.data,
    warnings,
    watermark,
    tokensIn,
    tokensOut
  });

  await bumpUsage(user.sub, user.plan as PlanTier, tokensIn, tokensOut);

  return {
    output: parsed.data as Record<string, unknown>,
    warnings,
    claims: parsed.claims,
    provider: selection.provider,
    model: selection.model,
    watermark
  };
};
