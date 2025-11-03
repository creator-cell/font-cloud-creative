import type { Response } from "express";
import { Router } from "express";
import { randomUUID } from "crypto";
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

const CHAT_USE_HOLDS = process.env.CHAT_USE_HOLDS !== "false";
const DEFAULT_MAX_OUTPUT_TOKENS = Number(process.env.CHAT_MAX_OUTPUT_TOKENS ?? 800);

const estimatePromptTokens = (system?: string, user?: string): number => {
  const combined = `${system ?? ""}\n${user ?? ""}`.trim();
  if (!combined) return 0;
  return Math.max(1, Math.ceil(combined.length / 4));
};

const router = Router();

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

    await ChatTurnModel.create({
      userId: userObjectId,
      conversationId,
      turnId,
      provider: selection.provider,
      model: selection.model,
      system: payload.system,
      userMessage: payload.message,
      promptTokens,
      maxOutputTokens,
      status: "running",
      startedAt: new Date()
    });

    console.info("[chat][turn] created", {
      turnId,
      userId: userObjectId.toHexString(),
      provider: selection.provider,
      model: selection.model
    });

    const baseUrl = process.env.API_BASE_URL ?? `${req.protocol}://${req.get("host")}`;
    res.status(200).json({
      turnId,
      streamUrl: `${baseUrl}/v1/chat/stream?turnId=${turnId}`
    });
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

  safeSendEvent("provider_start", {
    provider: selection.provider,
    model: selection.composite
  });

  const providerId = selection.provider as ProviderId;
  const modelId = selection.model;
  const maxOutputTokens = chatTurn.maxOutputTokens || DEFAULT_MAX_OUTPUT_TOKENS;

  const runMockStream = async (): Promise<{
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    finishReason: string;
  }> => {
    const promptTokens = chatTurn.promptTokens || estimatePromptTokens(chatTurn.system, chatTurn.userMessage);
    const chunks = createMockResponseChunks(chatTurn.userMessage ?? "", selection.composite);
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
      finishReason: "mock"
    };
  };

  try {
    let result: Awaited<ReturnType<typeof streamProviderChat>>;
    try {
      result = await streamProviderChat(
        providerId,
        modelId,
        {
          system: chatTurn.system ?? "",
          message: chatTurn.userMessage,
          maxOutputTokens,
          signal: abortController.signal
        },
        {
          onDelta: (text) => {
            if (clientClosed) return;
            safeSendEvent("delta", { text_delta: text });
          }
        }
      );
    } catch (providerError) {
      console.warn("[chat][stream] provider error, falling back to mock", {
        turnId: chatTurn.turnId,
        provider: selection.provider,
        error: providerError
      });
      result = await runMockStream();
    }

    if (clientClosed) {
      throw new Error("client_closed");
    }

    const latencyMs = result.latencyMs ?? Date.now() - startTime;

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
