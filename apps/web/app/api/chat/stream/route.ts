import { NextRequest } from "next/server";
import { auth } from "@/lib/session";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.apiToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const turnId = request.nextUrl.searchParams.get("turnId");
  if (!turnId) {
    return new Response(JSON.stringify({ error: "turnId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstreamResponse = await fetch(`${apiBaseUrl}/v1/chat/stream?turnId=${encodeURIComponent(turnId)}`, {
    headers: {
      Authorization: `Bearer ${session.apiToken}`,
    },
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    const errorBody = upstreamResponse.body ? await upstreamResponse.text() : "";
    return new Response(errorBody || JSON.stringify({ error: "Unable to open chat stream" }), {
      status: upstreamResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { readable, writable } = new TransformStream();
  upstreamResponse.body.pipeTo(writable).catch(() => {
    // Suppress downstream pipe errors to avoid unhandled rejections.
  });

  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");

  return new Response(readable, {
    status: 200,
    headers,
  });
}
