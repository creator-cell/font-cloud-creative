import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { ProjectBoard } from "@/components/projects/project-board";
import type { ProjectSummary } from "@/lib/api/endpoints";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  const { projects } = await serverApiFetch<{ projects: ProjectSummary[] }>(
    "/projects",
    session.apiToken
  );

  return <ProjectBoard token={session.apiToken} initialProjects={projects} />;
}
