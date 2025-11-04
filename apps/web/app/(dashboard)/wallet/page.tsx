import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageMeter } from "@/components/usage-meter";
import { WalletTransactionsTable } from "@/components/wallet/wallet-transactions-table";

interface UsageSummary {
  monthKey: string;
  tokensIn: number;
  tokensOut: number;
  quota: number;
  softWarned: boolean;
  availableTokens: number;
  totalAllocatedTokens: number;
}

interface WalletTransactionsResponse {
  items: Array<{
    id: string;
    type: string;
    direction: "credit" | "debit" | "hold";
    amountTokens: number;
    currency: string | null;
    amountFiatCents: number | null;
    source: string | null;
    refId: string | null;
    provider: string | null;
    model: string | null;
    meta: Record<string, unknown>;
    createdAt: string;
  }>;
  nextCursor: string | null;
}

export default async function WalletPage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  const [usage, transactions] = await Promise.all([
    serverApiFetch<UsageSummary>("/usage/me", session.apiToken),
    serverApiFetch<WalletTransactionsResponse>("/wallet/transactions?limit=25", session.apiToken)
  ]);

  const totalAllocated = usage.totalAllocatedTokens || usage.quota || 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageMeter
            tokensIn={usage.tokensIn}
            tokensOut={usage.tokensOut}
            quota={totalAllocated}
            warnings={usage.softWarned ? ["Approaching limit"] : []}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Available Tokens</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {usage.availableTokens.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Tokens Used</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {(usage.tokensIn + usage.tokensOut).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Total Allotted</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {totalAllocated.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <WalletTransactionsTable initialItems={transactions.items} initialCursor={transactions.nextCursor} />
    </div>
  );
}
