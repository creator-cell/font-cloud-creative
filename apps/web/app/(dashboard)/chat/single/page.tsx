import { requireServerRole } from "@/lib/roles";
import { SingleProviderChat } from "@/components/chat/single-provider-chat";
import type { ProjectSummary } from "@/lib/api/endpoints";
import { listProjects } from "@/src/lib/projects/mock-store";

const ALLOWED_ROLES = ["owner", "admin", "developer"];

export default async function SingleChatPage() {
  const session = await requireServerRole(ALLOWED_ROLES);

  let projects: ProjectSummary[] = [];
  try {
    projects = listProjects();
  } catch (error) {
    console.error("Failed to load projects", error);
  }

  return <SingleProviderChat projects={projects} />;
}
