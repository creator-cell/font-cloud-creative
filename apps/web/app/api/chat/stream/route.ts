import { NextResponse } from "next/server";
import { getTurn, removeTurn } from "@/src/lib/chat/mock-store";
import { getProviderFromModel } from "@/src/lib/chat/types";

const encoder = new TextEncoder();

const sendEvent = (controller: ReadableStreamDefaultController, event: string, data: unknown) => {
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const turnId = searchParams.get("turnId");

  if (!turnId) {
    return NextResponse.json({ error: "Missing turnId" }, { status: 400 });
  }

  const storedTurn = getTurn(turnId);
  if (!storedTurn) {
    return NextResponse.json({ error: "Turn not found" }, { status: 404 });
  }

  const timers: Array<ReturnType<typeof setTimeout>> = [];

  const stream = new ReadableStream({
    start(controller) {
      const provider = getProviderFromModel(storedTurn.model);
      const responseChunks = createMockResponseChunks(storedTurn.message, storedTurn.model, storedTurn.attachments);
      const latencyMs = 400 + Math.floor(Math.random() * 1200);
      const tokensIn = Math.max(1, Math.round(storedTurn.message.split(/\s+/).filter(Boolean).length * 1.5));
      const approximateOutTokens = Math.max(
        responseChunks.join("").split(/\s+/).filter(Boolean).length,
        tokensIn + 32
      );
      const costCents = Math.max(5, Math.round((tokensIn + approximateOutTokens) * 0.015));

      sendEvent(controller, "provider_start", {
        provider,
        model: storedTurn.model,
      });

      const emitChunk = (index: number) => {
        if (index >= responseChunks.length) {
          sendEvent(controller, "provider_end", {
            tokens_in: tokensIn,
            tokens_out: approximateOutTokens,
            cost_cents: costCents,
            latency_ms: latencyMs,
            finish_reason: "stop",
          });
          sendEvent(controller, "complete", { turnId });
          controller.close();
          removeTurn(turnId);
          timers.forEach(clearTimeout);
          return;
        }

        sendEvent(controller, "delta", { text_delta: responseChunks[index] });
        timers.push(
          setTimeout(() => emitChunk(index + 1), 150 + Math.random() * 250)
        );
      };

      timers.push(
        setTimeout(() => {
          emitChunk(0);
        }, Math.random() * 300)
      );
    },
    cancel() {
      timers.forEach(clearTimeout);
      removeTurn(turnId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

const createMockResponseChunks = (
  message: string,
  model: string,
  attachments?: Array<{ name: string; size: number; type: string }>
) => {
  const providerName = model.split(":")[0] ?? "provider";
  const attachmentLines =
    attachments && attachments.length > 0
      ? [
          "Attachments received:",
          ...attachments.map(
            (file, index) =>
              `- [${index + 1}] ${file.name} (${formatBytes(file.size)}) • ${file.type || "unknown type"}`
          ),
          "",
        ]
      : [];

  const paragraphs = [
    `### Mock response from ${providerName.toUpperCase()}`,
    "",
    `You said: "${message}".`,
    "",
    ...attachmentLines,
    "- This is a simulated answer with placeholder data.",
    "- Replace this handler with a real provider integration.",
    "",
    "Let us know how you'd like this flow to evolve!",
  ];

  const fullText = paragraphs.join("\n");
  const words = fullText.split(" ");
  const chunks: string[] = [];

  let buffer: string[] = [];
  words.forEach((word) => {
    buffer.push(word);
    if (buffer.join(" ").length > 60) {
      chunks.push(`${buffer.join(" ")} `);
      buffer = [];
    }
  });
  if (buffer.length > 0) {
    chunks.push(`${buffer.join(" ")} `);
  }

  return chunks.length > 0 ? chunks : [fullText];
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};
