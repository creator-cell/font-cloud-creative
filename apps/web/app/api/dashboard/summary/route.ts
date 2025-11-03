import { NextResponse } from "next/server";
import { auth } from "@/lib/session";
import { apiBase } from "@/lib/server-api";

type DashboardSummary = {
  tokensIn: number;
  tokensOut: number;
  quota: number;
  monthKey: string;
  generations: number;
  softWarned: boolean;
  projectsCount: number;
  brandVoicesCount: number;
  availableTokens: number;
  usagePercent: number;
};

export async function GET() {
  const session = await auth();
  if (!session?.apiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${apiBase}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${session.apiToken}`
      }
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!response.ok) {
      console.error("[api] dashboard summary unexpected status", response.status);
      return NextResponse.json({ error: "Failed to load dashboard summary" }, { status: 500 });
    }

    const summary = (await response.json()) as DashboardSummary;
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[api] dashboard summary failed", error);
    return NextResponse.json({ error: "Failed to load dashboard summary" }, { status: 500 });
  }
}
