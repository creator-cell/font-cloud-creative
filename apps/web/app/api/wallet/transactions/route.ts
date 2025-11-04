import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/session";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.apiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.toString();
  const upstreamResponse = await fetch(`${apiBaseUrl}/v1/wallet/transactions${search ? `?${search}` : ""}`, {
    headers: {
      Authorization: `Bearer ${session.apiToken}`,
    },
    cache: "no-store",
  });

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    return NextResponse.json(
      { error: errorBody || "Unable to load wallet transactions" },
      { status: upstreamResponse.status }
    );
  }

  const result = await upstreamResponse.json();
  return NextResponse.json(result);
}
