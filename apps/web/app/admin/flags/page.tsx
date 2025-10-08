import { requireServerRole } from "@/lib/roles";
import { fetchFeatureFlags } from "@/lib/api/admin";
import { FlagList } from "@/components/admin/flag-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminFlagsPage() {
  const session = await requireServerRole(["owner", "admin", "support"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const { flags } = await fetchFeatureFlags(session.apiToken);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature toggles</CardTitle>
        <p className="text-sm text-slate-400">Rollout features gradually or enable them for everyone.</p>
      </CardHeader>
      <CardContent>
        <FlagList token={session.apiToken} flags={flags} />
      </CardContent>
    </Card>
  );
}
