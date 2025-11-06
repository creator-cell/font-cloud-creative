import OpenAI from "openai";
import { toFile } from "openai/uploads";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { env } from "../config/env.js";
import { estimateTokens } from "../utils/tokenizer.js";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types.js";

type UploadedAttachment = {
  id: string;
  type: "file_reference";
  file_id: string;
  media_type: string;
};

const SUPPORTED_IMAGE_EXTENSIONS = new Set([".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const SUPPORTED_IMAGE_MIME_TYPES = new Set(["image/gif", "image/jpeg", "image/png", "image/webp"]);
const SUPPORTED_DOCUMENT_EXTENSIONS = new Set([
  ".csv",
  ".doc",
  ".docx",
  ".pdf",
  ".xls",
  ".xlsx"
]);
const SUPPORTED_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "text/csv"
]);
const FILE_SEARCH_ELIGIBLE_EXTENSIONS = new Set([
  ".c",
  ".cpp",
  ".cs",
  ".docx",
  ".html",
  ".java",
  ".js",
  ".json",
  ".md",
  ".pdf",
  ".php",
  ".pptx",
  ".py",
  ".rb",
  ".tex",
  ".ts",
  ".txt"
]);
const DOCUMENT_ASSISTANT_MODEL = "gpt-4o";
const ASSISTANT_POLL_INTERVAL_MS = 1500;
const ASSISTANT_TIMEOUT_MS = 120000;
const ASSISTANT_TOOLS = [{ type: "code_interpreter" as const }, { type: "file_search" as const }];
const UNSUPPORTED_FORMAT_MESSAGE =
  'Unsupported file type. Supported uploads include images (gif, jpeg, jpg, png, webp) and documents (pdf, docx, doc, csv, xls, xlsx). ' +
  "Please convert the file to a supported format before uploading.";

export class OpenAIProvider implements LLMProvider {
  public readonly id = "openai" as const;
  private readonly client: OpenAI;
  private assistantIdPromise: Promise<string> | null = null;

  constructor() {
    if (!env.openaiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAI provider");
    }
    this.client = new OpenAI({ apiKey: env.openaiKey });
  }

  async generate(model: string, payload: GenerationPayload): Promise<string> {
    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system" as const, content: payload.system },
        { role: "user" as const, content: payload.user }
      ],
      temperature: 0.7,
      response_format: payload.json ? { type: "json_object" } : undefined
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }
    return content;
  }

  private parseDataUrl(dataUrl: string): { buffer: Buffer; mime?: string } | null {
    const match = /^data:(?<mime>[^;]+)?;base64,(?<data>.+)$/i.exec(dataUrl ?? "");
    if (!match?.groups?.data) {
      return null;
    }
    const { data, mime } = match.groups;
    const buffer = Buffer.from(data, "base64");
    return { buffer, mime };
  }

  private async uploadAttachment(attachment: { dataUrl?: string; type?: string; name: string }): Promise<UploadedAttachment> {
    if (!attachment.dataUrl) {
      throw new Error(`Attachment ${attachment.name} does not include data`);
    }

    const parsed = this.parseDataUrl(attachment.dataUrl);
    if (!parsed) {
      throw new Error(`Attachment ${attachment.name} is not a valid base64 data URL`);
    }

    const mimeType = attachment.type || parsed.mime || "application/octet-stream";
    const file = await toFile(parsed.buffer, attachment.name, { type: mimeType });

    const uploaded = await this.client.files.create({ file, purpose: "vision" });

    return {
      id: attachment.id ?? uploaded.id,
      type: "file_reference",
      file_id: uploaded.id,
      media_type: mimeType
    };
  }

  private async ensureDocumentAssistant(): Promise<string> {
    if (!this.assistantIdPromise) {
      this.assistantIdPromise = this.client.beta.assistants
        .create({
          name: "Front Cloud Document Analyst",
          model: DOCUMENT_ASSISTANT_MODEL,
          tools: ASSISTANT_TOOLS.map((tool) => ({ ...tool }))
        })
        .then((assistant) => assistant.id)
        .catch((error) => {
          this.assistantIdPromise = null;
          throw error;
        });
    }
    return this.assistantIdPromise;
  }

  private async waitForRunCompletion(
    threadId: string,
    runId: string,
    options?: { signal?: AbortSignal; onProgress?: (status: string) => void }
  ) {
    const startedAt = Date.now();
    let run = await this.client.beta.threads.runs.retrieve(threadId, runId);
    let lastProgressAt = Date.now();
    const progressInterval = 5000;

    while (true) {
      if (options?.signal?.aborted) {
        throw new Error("client_closed");
      }

      if (run.status === "completed") {
        return run;
      }

      if (run.status === "failed" || run.status === "cancelled" || run.status === "expired") {
        throw new Error(`Assistant run ended with status: ${run.status}`);
      }

      if (run.status === "requires_action") {
        throw new Error("Assistant run requires action that is not implemented");
      }

      if (Date.now() - startedAt > ASSISTANT_TIMEOUT_MS) {
        throw new Error("Assistant run timed out");
      }

      if (options?.onProgress && Date.now() - lastProgressAt >= progressInterval) {
        lastProgressAt = Date.now();
        options.onProgress(`Assistant is still analyzing (status: ${run.status}).`);
      }

      await new Promise((resolve) => setTimeout(resolve, ASSISTANT_POLL_INTERVAL_MS));
      run = await this.client.beta.threads.runs.retrieve(threadId, runId);
    }
  }

  private async waitForVectorStoreIndex(
    vectorStoreId: string,
    fileId: string,
    options?: { signal?: AbortSignal; onProgress?: (status: string) => void }
  ) {
    const startedAt = Date.now();
    let lastProgressAt = Date.now();
    const progressInterval = 5000;

    while (true) {
      if (options?.signal?.aborted) {
        throw new Error("client_closed");
      }

      const vectorFile = await this.client.vectorStores.files.retrieve(vectorStoreId, fileId);

      if (vectorFile.status === "completed") {
        return;
      }

      if (vectorFile.status === "cancelled" || vectorFile.status === "failed") {
        throw new Error(`Vector store indexing failed with status: ${vectorFile.status}`);
      }

      if (Date.now() - startedAt > ASSISTANT_TIMEOUT_MS) {
        throw new Error("Vector store indexing timed out");
      }

      if (options?.onProgress && Date.now() - lastProgressAt >= progressInterval) {
        lastProgressAt = Date.now();
        options.onProgress(`Indexing in progress (status: ${vectorFile.status}).`);
      }

      await new Promise((resolve) => setTimeout(resolve, ASSISTANT_POLL_INTERVAL_MS));
    }
  }

  private sanitizeFileName(fileName: string) {
    return path.basename(fileName).replace(/[^a-z0-9_.-]/gi, "_");
  }

  private async writeTempFile(buffer: Buffer, fileName: string): Promise<string> {
    const safeName = this.sanitizeFileName(fileName || "document.bin");
    const tempFilePath = path.join(os.tmpdir(), `${randomUUID()}-${safeName}`);
    await fs.writeFile(tempFilePath, buffer);
    return tempFilePath;
  }

  private async removeTempFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore cleanup errors
    }
  }

  private async analyzeDocumentWithAssistant(
    prompt: string,
    filePath: string,
    options?: {
      mimeType?: string;
      signal?: AbortSignal;
      displayName?: string;
      enableFileSearch?: boolean;
      onProgress?: (message: string) => void;
    }
  ): Promise<string> {
    if (options?.signal?.aborted) {
      throw new Error("client_closed");
    }

    const emitProgress = (message: string) => {
      if (!options?.onProgress) {
        return;
      }
      try {
        options.onProgress(message);
      } catch (error) {
        console.error("[openai] failed to emit progress update", error);
      }
    };

    const fileBuffer = await fs.readFile(filePath);
    const file = await toFile(
      fileBuffer,
      path.basename(filePath),
      options?.mimeType ? { type: options.mimeType } : undefined
    );

    const uploaded = await this.client.files.create({ file, purpose: "assistants" });
    emitProgress("Document uploaded. Preparing analysis...");

    const enableFileSearch = Boolean(options?.enableFileSearch);
    const vectorStore = enableFileSearch
      ? await this.client.vectorStores.create({
          name: `front-cloud-doc-analysis-${Date.now()}`
        })
      : null;
    let threadId: string | null = null;

    try {
      if (enableFileSearch && vectorStore) {
        await this.client.vectorStores.files.create(vectorStore.id, {
          file_id: uploaded.id
        });

        emitProgress("Indexing document for search...");
        await this.waitForVectorStoreIndex(vectorStore.id, uploaded.id, {
          signal: options?.signal,
          onProgress: emitProgress
        });
      }

      const assistantId = await this.ensureDocumentAssistant();
      const thread = await this.client.beta.threads.create();
      threadId = thread.id;

      const attachmentTools: Array<{ type: "code_interpreter" | "file_search" }> = [{ type: "code_interpreter" }];
      if (enableFileSearch) {
        attachmentTools.push({ type: "file_search" });
      }

      await this.client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: [
          {
            type: "text",
            text:
              prompt.trim() ||
              `Please analyze the attached document${options?.displayName ? ` "${options.displayName}"` : ""}.`
          }
        ],
        attachments: [
          {
            file_id: uploaded.id,
            tools: attachmentTools
          }
        ]
      });

      const runParams: any = {
        assistant_id: assistantId,
        tool_resources: {
          code_interpreter: {
            file_ids: [uploaded.id]
          }
        }
      };

      if (enableFileSearch && vectorStore) {
        runParams.tool_resources.file_search = {
          vector_store_ids: [vectorStore.id]
        };
      }

      const run = await this.client.beta.threads.runs.create(thread.id, runParams);
      emitProgress("Assistant is processing the document...");

      await this.waitForRunCompletion(thread.id, run.id, {
        signal: options?.signal,
        onProgress: emitProgress
      });

      const messages = await this.client.beta.threads.messages.list(thread.id, {
        order: "desc",
        limit: 10
      });

      for (const message of messages.data) {
        if (message.role !== "assistant") {
          continue;
        }

        const textParts: string[] = [];
        for (const item of message.content ?? []) {
          if (item.type === "text") {
            textParts.push(item.text.value);
          } else if ((item.type as string) === "output_text" && (item as any).output_text?.value) {
            textParts.push((item as any).output_text.value);
          }
        }

        const response = textParts.join("\n\n").trim();
        if (response) {
          return response;
        }
      }

      throw new Error("Assistant returned an empty response");
    } finally {
      if (vectorStore && typeof this.client.vectorStores.del === "function") {
        await this.client.vectorStores.del(vectorStore.id).catch(() => undefined);
      }
      if (typeof this.client.files.del === "function") {
        await this.client.files.del(uploaded.id).catch(() => undefined);
      }
      if (threadId && typeof this.client.beta.threads.del === "function") {
        await this.client.beta.threads.del(threadId).catch(() => undefined);
      }
    }
  }

  async streamChat(
    model: string,
    params: ChatStreamParams,
    handlers: ChatStreamHandlers
  ): Promise<ChatStreamResult> {
    const startedAt = Date.now();

    const messages: Array<
      | { role: "system"; content: string }
      | {
          role: "user";
          content:
            | string
            | Array<{ type: "text" | "file"; text?: string; file?: { file_id: string } }>;
        }
    > = [];

    if (params.system?.trim()) {
      messages.push({ role: "system", content: params.system });
    }

    const userContent: Array<{ type: "text" | "file"; text?: string; file?: { file_id: string; media_type?: string } }> = [];
    const warnings: string[] = [];
    let documentResponseText = "";
    let documentResponses = 0;
    let clientAborted = false;
    const threadId = params.threadId?.trim();
    const assistantId = params.assistantId?.trim() || env.openaiAssistantId?.trim();

    const streamDocumentChunk = (chunk: string, options?: { persist?: boolean }) => {
      if (clientAborted) {
        return;
      }

      const normalized = chunk.trim();
      if (!normalized) {
        return;
      }

      if (params.signal?.aborted) {
        clientAborted = true;
        return;
      }

      try {
        handlers.onDelta?.(`${normalized}\n\n`);
      } catch (error) {
        console.error("[openai] failed to emit document delta", error);
        clientAborted = true;
        return;
      }

      if (options?.persist === false) {
        return;
      }

      documentResponseText = documentResponseText
        ? `${documentResponseText}\n\n${normalized}`
        : normalized;
      documentResponses += 1;
    };

    let unsupportedNotified = false;
    if (params.attachments?.length) {
      for (const attachment of params.attachments) {
        if (clientAborted) {
          break;
        }
        if (params.signal?.aborted) {
          clientAborted = true;
          break;
        }
        try {
          const ext = attachment.name ? path.extname(attachment.name).toLowerCase() : "";
          const mimeType = attachment.type?.toLowerCase();
          const isImage =
            (ext && SUPPORTED_IMAGE_EXTENSIONS.has(ext)) ||
            (mimeType && SUPPORTED_IMAGE_MIME_TYPES.has(mimeType ?? ""));
          const isDocument =
            (!isImage && ext && SUPPORTED_DOCUMENT_EXTENSIONS.has(ext)) ||
            (!isImage && mimeType && SUPPORTED_DOCUMENT_MIME_TYPES.has(mimeType));

          if (isDocument) {
            const enableFileSearch = Boolean(ext && FILE_SEARCH_ELIGIBLE_EXTENSIONS.has(ext));
            if (!attachment.dataUrl) {
              warnings.push(`Attachment ${attachment.name ?? "document"} is missing data and cannot be analyzed.`);
              continue;
            }

            const parsed = this.parseDataUrl(attachment.dataUrl);
            if (!parsed) {
              warnings.push(`Attachment ${attachment.name ?? "document"} could not be parsed.`);
              continue;
            }

            const tempFilePath = await this.writeTempFile(parsed.buffer, attachment.name ?? "document.bin");
            const documentPrompt = params.message?.trim()
              ? params.message
              : `Analyze the attached document${attachment.name ? ` "${attachment.name}"` : ""} and summarize the key insights.`;

            try {
              const statusLabel = attachment.name ?? "document";
              streamDocumentChunk(`Analyzing ${statusLabel} ...`, { persist: false });
              const analysis = await this.analyzeDocumentWithAssistant(documentPrompt, tempFilePath, {
                mimeType: attachment.type ?? parsed.mime,
                signal: params.signal,
                displayName: attachment.name,
                enableFileSearch,
                onProgress: (message) => streamDocumentChunk(message, { persist: false })
              });
              const label = attachment.name ?? "document";
              streamDocumentChunk(`Analysis for ${label}:\n${analysis}`);
            } catch (error) {
              const message = error instanceof Error ? error.message : "Unknown error";
              const errorName = (error as any)?.name;
              if (
                message === "client_closed" ||
                errorName === "AbortError" ||
                errorName === "APIUserAbortError" ||
                (error as any)?.code === "ABORT_ERR"
              ) {
                clientAborted = true;
                break;
              }
              warnings.push(`Assistant analysis failed for ${attachment.name ?? "document"}: ${message}`);
              console.error("[openai] assistant document analysis failed", {
                attachment: attachment.name,
                error
              });
            } finally {
              await this.removeTempFile(tempFilePath);
            }

            continue;
          }

          if (!isImage) {
            if (!unsupportedNotified) {
              warnings.push(UNSUPPORTED_FORMAT_MESSAGE);
              unsupportedNotified = true;
            }
            continue;
          }

          const uploaded = await this.uploadAttachment(attachment);
          userContent.push({
            type: "file",
            file: { file_id: uploaded.file_id, media_type: uploaded.media_type }
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          warnings.push(`Unable to upload ${attachment.name ?? "attachment"}: ${message}`);
          console.error("[openai] attachment upload failed", {
            attachment: attachment.name,
            error
          });
        }
      }
    }

    if (clientAborted) {
      throw new Error("client_closed");
    }

    const baseUserText = [params.message, ...warnings.map((warning) => `Note: ${warning}`)]
      .filter(Boolean)
      .join("\n\n");

    if (documentResponses > 0) {
      if (warnings.length) {
        const warningText = warnings.map((warning) => `Note: ${warning}`).join("\n\n");
        if (warningText) {
          streamDocumentChunk(warningText);
        }
      }

      const finalResponse = documentResponseText.trim();
      const latencyMs = Date.now() - startedAt;
      const tokensIn = estimateTokens(params.message ?? "");
      const tokensOut = estimateTokens(finalResponse);

      return {
        tokensIn,
        tokensOut,
        latencyMs,
        finishReason: "completed",
        text: finalResponse
      };
    }

    const canUseAssistantThread = Boolean(threadId && assistantId && documentResponses === 0 && userContent.length === 0);

    if (canUseAssistantThread) {
      const userText = baseUserText.trim();

      if (userText) {
        if (params.signal?.aborted) {
          throw new Error("client_closed");
        }

        await this.client.beta.threads.messages.create(threadId!, {
          role: "user",
          content: [
            {
              type: "text",
              text: userText
            }
          ]
        });

        const run = await this.client.beta.threads.runs.create(threadId!, {
          assistant_id: assistantId!
        });

        const completedRun = await this.waitForRunCompletion(threadId!, run.id, {
          signal: params.signal
        });

        const messages = await this.client.beta.threads.messages.list(threadId!, {
          order: "desc",
          limit: 10
        });

        const responseMessage =
          messages.data.find((message) => message.role === "assistant" && message.run_id === completedRun.id) ??
          messages.data.find((message) => message.role === "assistant");

        if (!responseMessage) {
          throw new Error("Assistant returned no messages");
        }

        const textParts: string[] = [];
        for (const item of responseMessage.content ?? []) {
          if (item.type === "text") {
            textParts.push(item.text.value);
          } else if ((item.type as string) === "output_text" && (item as any).output_text?.value) {
            textParts.push((item as any).output_text.value);
          }
        }

        const assistantResponse = textParts.join("\n\n").trim();
        if (!assistantResponse) {
          throw new Error("Assistant returned an empty response");
        }

        if (params.signal?.aborted) {
          throw new Error("client_closed");
        }

        handlers.onDelta?.(assistantResponse);

        const tokensIn = completedRun.usage?.input_tokens ?? estimateTokens(userText);
        const tokensOut = completedRun.usage?.output_tokens ?? estimateTokens(assistantResponse);
        const latencyMs = Date.now() - startedAt;

        return {
          tokensIn,
          tokensOut,
          latencyMs,
          finishReason: completedRun.status ?? "completed",
          text: assistantResponse
        };
      }
    }

    if (userContent.length > 0) {
      userContent.unshift({ type: "text", text: baseUserText });
      messages.push({
        role: "user",
        content: userContent
      });
    } else {
      messages.push({ role: "user", content: baseUserText });
    }

    const stream = await this.client.chat.completions.create(
      {
        model,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: params.maxOutputTokens,
        stream: true,
        stream_options: { include_usage: true }
      },
      { signal: params.signal }
    );

    let aggregatedText = "";
    let finishReason: string | undefined;
    let tokensIn = 0;
    let tokensOut = 0;

    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          handlers.onDelta?.(content);
          aggregatedText += content;
        }
        if (chunk.choices[0]?.finish_reason) {
          finishReason = chunk.choices[0].finish_reason;
        }
        if (chunk.usage) {
          tokensIn = chunk.usage.prompt_tokens ?? tokensIn;
          tokensOut = chunk.usage.completion_tokens ?? tokensOut;
        }
        if (params.signal?.aborted) {
          if ("controller" in stream && typeof stream.controller?.abort === "function") {
            stream.controller.abort();
          }
          break;
        }
      }
    } catch (error) {
      if (params.signal?.aborted) {
        throw new Error("client_closed");
      }
      throw error;
    }

    if (!tokensIn) {
      tokensIn = estimateTokens(`${params.system ?? ""}\n${params.message}`);
    }
    if (!tokensOut) {
      tokensOut = estimateTokens(aggregatedText);
    }

    const latencyMs = Date.now() - startedAt;

    return {
      tokensIn,
      tokensOut,
      latencyMs,
      finishReason: finishReason ?? "completed",
      text: aggregatedText
    };
  }
}
