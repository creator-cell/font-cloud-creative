import { requireServerRole } from "@/lib/roles";
import { fetchSupportTickets } from "@/lib/api/admin";
import { SupportTable } from "@/components/admin/support-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSupportPage() {
  const session = await requireServerRole(["owner", "admin", "support"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const { tickets } = await fetchSupportTickets(session.apiToken);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support desk</CardTitle>
        <p className="text-sm text-slate-400">Assign and reply to customer tickets.</p>
      </CardHeader>
      <CardContent>
        <SupportTable token={session.apiToken} tickets={tickets} />
      </CardContent>
    </Card>
  );
}
