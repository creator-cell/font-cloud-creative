import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/session";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";

const createTurnSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  message: z.string().min(1, "message is required"),
  model: z.string().min(1, "model is required"),
  projectId: z.string().min(1).optional(),
  attachments: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        size: z.number().int().nonnegative(),
        type: z.string().optional().default("application/octet-stream"),
        dataUrl: z.string().optional(),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const payload = createTurnSchema.parse(data);
    const session = await auth();
    if (!session?.user?.id || !session.apiToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const colonIndex = payload.model.indexOf(":");
    const inferredProvider = colonIndex !== -1 ? payload.model.slice(0, colonIndex) : undefined;
    const normalizedModel = colonIndex !== -1 ? payload.model.slice(colonIndex + 1) : payload.model;
    const provider = inferredProvider || "openai";
    const upstreamPayload = {
      userId: session.user.id,
      conversationId: payload.sessionId,
      message: payload.message,
      model: normalizedModel,
      provider,
      system: undefined,
      caps: undefined,
      projectId: payload.projectId ?? undefined,
      attachments: payload.attachments,
    };

    const upstreamResponse = await fetch(`${apiBaseUrl}/v1/chat/turns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.apiToken}`,
      },
      body: JSON.stringify(upstreamPayload),
    });

    if (!upstreamResponse.ok) {
      const errorBody = await upstreamResponse.text();
      return NextResponse.json(
        { error: errorBody || "Unable to create chat turn" },
        { status: upstreamResponse.status }
      );
    }

    const result = await upstreamResponse.json();
    const nextStreamUrl = `/api/chat/stream?turnId=${encodeURIComponent(result.turnId)}`;
    return NextResponse.json({ ...result, streamUrl: nextStreamUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to create chat turn" }, { status: 500 });
  }
}
