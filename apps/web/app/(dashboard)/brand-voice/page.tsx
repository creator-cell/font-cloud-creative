import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { BrandVoiceManager } from "@/components/brand-voice/brand-voice-manager";
import type { BrandVoiceSummary, ProjectSummary } from "@/lib/api/endpoints";

export default async function BrandVoicePage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  const [projectsResponse, voicesResponse] = await Promise.all([
    serverApiFetch<{ projects: ProjectSummary[] }>("/projects", session.apiToken),
    serverApiFetch<{ brandVoices: BrandVoiceSummary[] }>("/brand-voice", session.apiToken)
  ]);

  return (
    <BrandVoiceManager
      token={session.apiToken}
      projects={projectsResponse.projects}
      initialVoices={voicesResponse.brandVoices}
    />
  );
}
