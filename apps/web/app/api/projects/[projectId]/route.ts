import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteProject, updateProject } from "@/src/lib/projects/mock-store";

const updateSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const payload = updateSchema.parse(await request.json());
    const updated = updateProject(params.projectId, { name: payload.name });
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    console.error("Failed to update project", error);
    return NextResponse.json({ error: "Unable to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { projectId: string } }
) {
  const deleted = deleteProject(params.projectId);
  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

