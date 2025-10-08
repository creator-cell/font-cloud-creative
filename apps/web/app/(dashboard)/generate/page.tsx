import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { GenerateForm } from "@/components/generate/generate-form";
import type { ProviderModelSummary, ProjectSummary, BrandVoiceSummary } from "@/lib/api/endpoints";

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  const [modelsResponse, projectsResponse, voicesResponse] = await Promise.all([
    serverApiFetch<{ models: ProviderModelSummary[] }>("/models", session.apiToken),
    serverApiFetch<{ projects: ProjectSummary[] }>("/projects", session.apiToken),
    serverApiFetch<{ brandVoices: BrandVoiceSummary[] }>("/brand-voice", session.apiToken)
  ]);

  return (
    <GenerateForm
      token={session.apiToken}
      models={modelsResponse.models}
      projects={projectsResponse.projects}
      brandVoices={voicesResponse.brandVoices}
      defaults={{ provider: session.user.preferredProvider, model: session.user.preferredModel }}
    />
  );
}
