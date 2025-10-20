import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { storeTurn } from "@/src/lib/chat/mock-store";

const createTurnSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  message: z.string().min(1, "message is required"),
  model: z.string().min(1, "model is required"),
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

    const turnId = randomUUID();
    storeTurn({
      id: turnId,
      sessionId: payload.sessionId,
      message: payload.message,
      model: payload.model,
      attachments: payload.attachments,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      turnId,
      streamUrl: `/api/chat/stream?turnId=${turnId}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Unable to create chat turn" }, { status: 500 });
  }
}
