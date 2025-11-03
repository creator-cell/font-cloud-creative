import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/session";
import { apiBaseUrl } from "@/lib/api/client";

const allowedRoles = new Set(["owner", "admin", "analyst"]);

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.apiToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const roles = session.user?.roles ?? [];
  if (!roles.some((role) => allowedRoles.has(role))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const backendUrl = new URL(`${apiBaseUrl}/v1/admin/analytics/export.csv${request.nextUrl.search}`);
  const response = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${session.apiToken}`
    }
  });

  if (!response.ok || !response.body) {
    const errorBody = await response.text();
    return NextResponse.json({ error: errorBody || "Failed to export analytics" }, { status: response.status });
  }

  const headers = new Headers();
  headers.set("Content-Type", "text/csv");
  const disposition = response.headers.get("content-disposition") ?? `attachment; filename="analytics-export.csv"`;
  headers.set("Content-Disposition", disposition);

  return new NextResponse(response.body, {
    status: 200,
    headers
  });
}

