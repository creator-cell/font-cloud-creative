import type { Response } from "express";
import { Router } from "express";
import { randomUUID } from "crypto";
import { Buffer } from "node:buffer";
import { z } from "zod";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import ChatTurnModel from "../models/ChatTurn";
import { startChatHold, isInsufficientHoldError } from "../services/token/startChatHold";
import { cancelChatHold } from "../services/token/cancelChatHold";
import { settleChatTurn } from "../services/token/settleChatTurn";
import { requireAuth } from "../middleware/requireAuth";
import type { AuthenticatedRequest } from "../types/express";
import { streamProviderChat } from "../providers/registry";
import type { ProviderId } from "../providers/types";
import { ProjectModel } from "../models";
import { createAssistantThread } from "../services/openai/assistantThreads.js";
import { env } from "../config/env.js";

const CHAT_USE_HOLDS = process.env.CHAT_USE_HOLDS !== "false";
const DEFAULT_MAX_OUTPUT_TOKENS = Number(process.env.CHAT_MAX_OUTPUT_TOKENS ?? 800);

const estimatePromptTokens = (system?: string, user?: string): number => {
  const combined = `${system ?? ""}\n${user ?? ""}`.trim();
  if (!combined) return 0;
  return Math.max(1, Math.ceil(combined.length / 4));
};

const router = Router();

const encodeText = (value?: string | null): string | undefined => {
  if (typeof value !== "string") return value ?? undefined;
  return Buffer.from(value, "utf8").toString("base64");
};

const decodeText = (value?: string | null): string | undefined => {
  if (typeof value !== "string") return value ?? undefined;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    if (Buffer.from(decoded, "utf8").toString("base64") === value.replace(/\s+/g, "")) {
      return decoded;
    }
  } catch {
    return value;
  }
  return value;
};

const normalizeModelSelection = (provider: string, model: string) => {
  let normalizedProvider = provider;
  let normalizedModel = model;

  const colonIndex = model.indexOf(":");
  if (colonIndex !== -1) {
    const inferredProvider = model.slice(0, colonIndex);
    const remainder = model.slice(colonIndex + 1);
    if (remainder) {
      normalizedModel = remainder;
      normalizedProvider = inferredProvider || provider;
    }
  }

  return {
    provider: normalizedProvider,
    model: normalizedModel,
    composite: `${normalizedProvider}:${normalizedModel}`
  };
};

router.use(requireAuth);

const createTurnSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
  model: z.string().min(1),
  provider: z.string().min(1),
  projectId: z.string().min(1).optional(),
  system: z.string().optional(),
  caps: z
    .object({
      maxTokens: z.number().int().positive().optional()
    })
    .optional(),
  attachments: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        size: z.number().int().nonnegative(),
        type: z.string().optional(),
        dataUrl: z.string().optional()
      })
    )
    .optional()
});

const sendEvent = (res: Response, event: string, data: unknown): void => {
  if (res.writableEnded) return;
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

router.post(
  "/turns",
  asyncHandler(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const userSub = authReq.user?.sub;
    if (!userSub || !Types.ObjectId.isValid(userSub)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const payload = createTurnSchema.parse(req.body);
    const userObjectId = new Types.ObjectId(userSub);
    const selection = normalizeModelSelection(payload.provider, payload.model);
    const projectObjectId =
      payload.projectId && Types.ObjectId.isValid(payload.projectId)
        ? new Types.ObjectId(payload.projectId)
        : undefined;

    const conversationId =
      payload.conversationId && Types.ObjectId.isValid(payload.conversationId)
        ? new Types.ObjectId(payload.conversationId)
        : undefined;

    const turnId = randomUUID();
    const promptTokens = estimatePromptTokens(payload.system, payload.message);
    const maxOutputTokens = Math.max(1, payload.caps?.maxTokens ?? DEFAULT_MAX_OUTPUT_TOKENS);

    if (CHAT_USE_HOLDS) {
      try {
        await startChatHold({
          userId: userObjectId,
          turnId,
          provider: selection.provider,
          model: selection.model,
          promptTokens,
          maxOutputTokens
        });
      } catch (error) {
        if (isInsufficientHoldError(error)) {
          res.status(402).json({
            code: "INSUFFICIENT_FUNDS",
            message: "Not enough tokens to start this request."
          });
          return;
        }
        console.error("[chat][hold] startChatHold failed", { turnId, error });
        throw error;
      }
    }

    const encodedUserMessage = encodeText(payload.message) ?? "";
    const encodedSystemMessage = encodeText(payload.system) ?? undefined;

    await ChatTurnModel.create({
      userId: userObjectId,
      conversationId,
      turnId,
      provider: selection.provider,
      model: selection.model,
      system: encodedSystemMessage,
      userMessage: encodedUserMessage,
      promptTokens,
      maxOutputTokens,
      projectId: projectObjectId,
      attachments: payload.attachments?.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        type: item.type,
        dataUrl: item.dataUrl
      })) ?? [],
      status: "running",
      startedAt: new Date()
    });

    console.info("[chat][turn] created", {
      turnId,
      userId: userObjectId.toHexString(),
      provider: selection.provider,
      model: selection.model,
      projectId: projectObjectId?.toHexString()
    });

    const baseUrl = process.env.API_BASE_URL ?? `${req.protocol}://${req.get("host")}`;
    res.status(200).json({
      turnId,
      streamUrl: `${baseUrl}/v1/chat/stream?turnId=${turnId}`
    });
  })
);

router.get(
  "/turns",
  asyncHandler(async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const userSub = authReq.user?.sub;
    if (!userSub || !Types.ObjectId.isValid(userSub)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userObjectId = new Types.ObjectId(userSub);
    const projectIdParam = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
    const cursorParam = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const limitParam = Number.parseInt(typeof req.query.limit === "string" ? req.query.limit : "", 10);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 20;

    const filter: Record<string, unknown> = { userId: userObjectId };
    if (projectIdParam && Types.ObjectId.isValid(projectIdParam)) {
      filter.projectId = new Types.ObjectId(projectIdParam);
    }

    if (cursorParam) {
      const cursorDate = new Date(cursorParam);
      if (!Number.isNaN(cursorDate.getTime())) {
        filter.createdAt = { $lt: cursorDate };
      }
    }

    const records = await ChatTurnModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    const hasMore = records.length === limit;
    const nextCursor = hasMore ? records[records.length - 1]?.createdAt?.toISOString?.() ?? null : null;

    const turns = records
      .reverse()
      .map((record) => {
        const projectId =
          record.projectId instanceof Types.ObjectId
            ? record.projectId.toHexString()
            : typeof record.projectId === "string"
              ? record.projectId
              : null;

        const modelSlug = typeof record.model === "string" ? record.model : "";
        const modelFull = modelSlug.includes(":") ? modelSlug : `${record.provider}:${modelSlug}`;
        const decodedMessage = decodeText(record.userMessage) ?? "";
        const decodedResponse = decodeText(record.response?.content) ?? "";

        return {
          turnId: record.turnId,
          userMessage: decodedMessage,
          provider: record.provider,
          model: modelFull,
          modelSlug,
          projectId,
          status: record.status,
          response: {
            content: decodedResponse,
            finishReason: record.response?.finishReason ?? null
          },
          usage: record.usage ?? { tokensIn: 0, tokensOut: 0, latencyMs: 0 },
          attachments: Array.isArray(record.attachments)
            ? record.attachments.map((attachment) => ({
                id: attachment.id,
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
                dataUrl: attachment.dataUrl
              }))
            : [],
        createdAt: record.createdAt?.toISOString?.() ?? new Date().toISOString(),
        startedAt: record.startedAt?.toISOString?.() ?? record.createdAt?.toISOString?.(),
        finishedAt: record.finishedAt?.toISOString?.() ?? null,
        error: record.usage?.error ?? null
        };
      });

    res.json({ turns, nextCursor, hasMore });
  })
);

router.get("/stream", async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.user?.sub;
  if (!userSub || !Types.ObjectId.isValid(userSub)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const turnId = typeof req.query.turnId === "string" ? req.query.turnId : undefined;
  if (!turnId) {
    res.status(400).json({ error: "turnId is required" });
    return;
  }

  const userObjectId = new Types.ObjectId(userSub);
  const chatTurn = await ChatTurnModel.findOne({ turnId, userId: userObjectId }).exec();
  if (!chatTurn) {
    res.status(404).json({ error: "Turn not found" });
    return;
  }

  const decodedUserMessage = decodeText(chatTurn.userMessage) ?? "";
  const decodedSystemMessage = decodeText(chatTurn.system) ?? undefined;
  const attachments = chatTurn.attachments ?? [];
  let assistantThreadId: string | undefined;

  if (chatTurn.projectId) {
    try {
      const projectId =
        chatTurn.projectId instanceof Types.ObjectId
          ? chatTurn.projectId
          : Types.ObjectId.isValid(chatTurn.projectId)
            ? new Types.ObjectId(chatTurn.projectId)
            : null;

      if (projectId) {
        const project = await ProjectModel.findOne({ _id: projectId, userId: chatTurn.userId }).exec();
        if (project) {
          if (!project.assistantThreadId) {
            const newThreadId = await createAssistantThread();
            project.assistantThreadId = newThreadId;
            await project.save();
          }
          assistantThreadId = project.assistantThreadId ?? undefined;
        }
      }
    } catch (error) {
      console.error("[chat][stream] failed to ensure assistant thread", {
        projectId: chatTurn.projectId,
        turnId: chatTurn.turnId,
        error
      });
    }
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  let clientClosed = false;
  const startTime = Date.now();
  const abortController = new AbortController();

  req.on("close", () => {
    clientClosed = true;
    abortController.abort();
  });

  const safeSendEvent = (event: string, data: unknown) => {
    if (clientClosed) return;
    sendEvent(res, event, data);
  };

  const selection = normalizeModelSelection(chatTurn.provider, chatTurn.model);
  const providerId = selection.provider as ProviderId;
  const modelId = selection.model;
  const maxOutputTokens = chatTurn.maxOutputTokens || DEFAULT_MAX_OUTPUT_TOKENS;

  const storedResponse = decodeText(chatTurn.response?.content) ?? "";
  if (chatTurn.status === "completed" && storedResponse) {
    safeSendEvent("provider_start", {
      provider: selection.provider,
      model: selection.composite
    });

    safeSendEvent("delta", { text_delta: storedResponse });

    const usage = chatTurn.usage ?? { tokensIn: 0, tokensOut: 0, latencyMs: 0 };
    safeSendEvent("provider_end", {
      tokens_in: usage.tokensIn ?? 0,
      tokens_out: usage.tokensOut ?? 0,
      latency_ms: usage.latencyMs ?? 0,
      finish_reason: chatTurn.response?.finishReason ?? "stop"
    });
    safeSendEvent("complete", { turnId: chatTurn.turnId });
    res.end();
    return;
  }

  if (chatTurn.status === "failed") {
    safeSendEvent("provider_start", {
      provider: selection.provider,
      model: selection.composite
    });

    const usage = chatTurn.usage ?? {};
    safeSendEvent("provider_end", {
      tokens_in: usage.tokensIn ?? 0,
      tokens_out: usage.tokensOut ?? 0,
      latency_ms: usage.latencyMs ?? 0,
      finish_reason: "error"
    });
    safeSendEvent("complete", { turnId: chatTurn.turnId, status: "failed" });
    res.end();
    return;
  }

  safeSendEvent("provider_start", {
    provider: selection.provider,
    model: selection.composite
  });

  const runMockStream = async (): Promise<{
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    finishReason: string;
    text: string;
  }> => {
    const promptTokens = chatTurn.promptTokens || estimatePromptTokens(decodedSystemMessage, decodedUserMessage);
    const chunks = createMockResponseChunks(decodedUserMessage ?? "", selection.composite);
    for (const chunk of chunks) {
      if (clientClosed) {
        throw new Error("client_closed");
      }
      safeSendEvent("delta", { text_delta: chunk });
    }
    const text = chunks.join("");
    const tokensOut = Math.max(1, Math.ceil(text.length / 4));
    const latencyMs = Date.now() - startTime;
    return {
      tokensIn: promptTokens,
      tokensOut,
      latencyMs,
      finishReason: "mock",
      text
    };
  };

  try {
    let result: Awaited<ReturnType<typeof streamProviderChat>>;
    try {
      const streamParams: Parameters<typeof streamProviderChat>[2] = {
        system: decodedSystemMessage ?? "",
        message: decodedUserMessage,
        maxOutputTokens,
        signal: abortController.signal,
        attachments: attachments
      };

      if (providerId === "openai") {
        if (assistantThreadId) {
          streamParams.threadId = assistantThreadId;
        }
        if (env.openaiAssistantId) {
          streamParams.assistantId = env.openaiAssistantId;
        }
      }

      result = await streamProviderChat(
        providerId,
        modelId,
        streamParams,
        {
          onDelta: (text: string) => {
            if (clientClosed) return;
            safeSendEvent("delta", { text_delta: text });
          }
        }
      );
    } catch (providerError) {
      console.error("[chat][stream] provider error", {
        turnId: chatTurn.turnId,
        provider: selection.provider,
        error: providerError
      });
      throw providerError;
    }

    if (clientClosed) {
      throw new Error("client_closed");
    }

    const latencyMs = result.latencyMs ?? Date.now() - startTime;
    const encodedResponseContent = encodeText(result.text ?? "") ?? "";

    await settleChatTurn({
      userId: chatTurn.userId,
      turnId: chatTurn.turnId,
      provider: selection.provider,
      model: modelId,
      conversationId: chatTurn.conversationId ?? undefined,
      chatTurnMongoId: chatTurn._id,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      latencyMs
    });

    await ChatTurnModel.updateOne(
      { _id: chatTurn._id },
      {
        status: "completed",
        finishedAt: new Date(),
        response: {
          content: encodedResponseContent,
          finishReason: result.finishReason ?? "stop"
        },
        usage: {
          tokensIn: result.tokensIn,
          tokensOut: result.tokensOut,
          latencyMs
        }
      }
    ).exec();

    safeSendEvent("provider_end", {
      tokens_in: result.tokensIn,
      tokens_out: result.tokensOut,
      latency_ms: latencyMs,
      finish_reason: result.finishReason ?? "stop"
    });
    safeSendEvent("complete", { turnId: chatTurn.turnId });
    console.info("[chat][stream] turn completed", {
      turnId: chatTurn.turnId,
      provider: selection.provider,
      model: modelId,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      latencyMs
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const reason = error instanceof Error ? error.message : "provider_error";

    if (CHAT_USE_HOLDS) {
      try {
        await cancelChatHold(chatTurn.userId, chatTurn.turnId);
      } catch (holdErr) {
        console.error("[chat][stream] cancelChatHold failed", { turnId: chatTurn.turnId, error: holdErr });
      }
    }

    await ChatTurnModel.updateOne(
      { _id: chatTurn._id },
      {
        status: "failed",
        finishedAt: new Date(),
        response: {
          content: "",
          finishReason: "error"
        },
        usage: {
          tokensIn: 0,
          tokensOut: 0,
          latencyMs,
          error: reason
        }
      }
    ).exec();

    if (!clientClosed) {
      safeSendEvent("error", { message: "Failed to complete chat turn." });
    }
    console.error("[chat][stream] turn failed", {
      turnId: chatTurn.turnId,
      provider: selection.provider,
      model: modelId,
      error
    });
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
});

const createMockResponseChunks = (message: string, model: string) => {
  const providerName = model.split(":")[0] ?? "provider";
  const paragraphs = [
    `### Mock response from ${providerName.toUpperCase()}`,
    "",
    `You said: "${message}".`,
    "",
    "This is a placeholder streaming response coming from the Express API.",
    "Replace this SSE endpoint with real provider integration to stream actual completions."
  ];

  const fullText = paragraphs.join("\n");
  const words = fullText.split(" ");
  const chunks: string[] = [];
  let buffer: string[] = [];

  for (const word of words) {
    buffer.push(word);
    if (buffer.join(" ").length > 60) {
      chunks.push(`${buffer.join(" ")} `);
      buffer = [];
    }
  }
  if (buffer.length > 0) {
    chunks.push(`${buffer.join(" ")} `);
  }

  return chunks.length > 0 ? chunks : [fullText];
};

export default router;
