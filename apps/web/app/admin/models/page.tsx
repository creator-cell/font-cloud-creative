import { requireServerRole } from "@/lib/roles";
import { fetchProviderRegistry } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminModelsPage() {
  const session = await requireServerRole(["owner", "admin", "analyst"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const { providers } = await fetchProviderRegistry(session.apiToken);

  return (
    <div className="grid gap-4">
      {Object.entries(providers).map(([provider, models]) => (
        <Card key={provider}>
          <CardHeader>
            <CardTitle className="capitalize">{provider}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
              <thead className="bg-gray-100 dark:bg-slate-900/30">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Model</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Min plan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Capabilities</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Est cost / 1K</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{model.label}</td>
                    <td className="px-3 py-2 text-slate-500 capitalize dark:text-slate-400">{model.minPlan}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                      {(model.capabilities ?? []).join(", ")}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">${model.estCostPer1K}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
