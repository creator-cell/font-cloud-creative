import { NextResponse } from "next/server";
import { auth } from "@/lib/session";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.apiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();
  const upstreamResponse = await fetch(`${apiBaseUrl}/v1/wallet/recharge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.apiToken}`,
    },
    body,
  });

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    return NextResponse.json(
      { error: errorBody || "Unable to recharge wallet" },
      { status: upstreamResponse.status }
    );
  }

  const result = await upstreamResponse.json();
  return NextResponse.json(result);
}
