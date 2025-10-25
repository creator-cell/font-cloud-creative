import { NextResponse } from "next/server";
import { z } from "zod";
import { createProject, listProjects } from "@/src/lib/projects/mock-store";

export async function GET() {
  const projects = listProjects();
  return NextResponse.json({ projects });
}

const createProjectSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

export async function POST(request: Request) {
  try {
    const payload = createProjectSchema.parse(await request.json());
    const project = createProject(payload.name);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    console.error("Failed to create project", error);
    return NextResponse.json({ error: "Unable to create project" }, { status: 500 });
  }
}

