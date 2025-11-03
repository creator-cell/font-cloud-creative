import { redirect } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { SingleProviderChat } from "@/components/chat/single-provider-chat";
import type { ProjectSummary } from "@/lib/api/endpoints";
import { serverApiFetch } from "@/lib/server-api";

const ALLOWED_ROLES = ["owner", "admin", "developer", "user", "analyst", "support", "billing"];

export default async function SingleChatPage() {
  const session = await requireServerRole(ALLOWED_ROLES);

  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  let projects: ProjectSummary[] = [];
  try {
    const { projects: fetchedProjects } = await serverApiFetch<{ projects: ProjectSummary[] }>(
      "/projects",
      session.apiToken
    );
    projects = fetchedProjects;
  } catch (error) {
    console.error("Failed to load projects", error);
  }

  return (
    <SingleProviderChat
      projects={projects}
      defaultModelId={session.user?.preferredModel ?? undefined}
    />
  );
}
