import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { ProjectBoard } from "@/components/projects/project-board";
import type { ProjectSummary } from "@/lib/api/endpoints";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!session.apiToken) {
    return <ProjectBoard token={""} initialProjects={[]} />;
  }

  let projects: ProjectSummary[] = [];
  try {
    const result = await serverApiFetch<{ projects: ProjectSummary[] }>(
      "/projects",
      session.apiToken,
      { redirectOn401: false }
    );
    projects = result.projects;
  } catch (error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 401) {
      console.warn("Projects request returned 401; showing empty state instead of redirecting.");
    } else {
      console.error("Failed to load projects", error);
    }
  }

  return <ProjectBoard token={session.apiToken} initialProjects={projects} />;
}
