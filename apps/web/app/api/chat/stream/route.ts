import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Streaming is handled by the API service. Connect directly to the streamUrl returned when creating a chat turn."
    },
    { status: 410 }
  );
}
