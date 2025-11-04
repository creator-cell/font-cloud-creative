import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  FileText,
  Layers3,
  LibraryBig,
  Sparkles,
  Wand2
} from "lucide-react";
import type { BrandVoiceSummary, ProjectSummary } from "@/lib/api/endpoints";

type UsageResponse = {
  monthKey: string;
  tokensIn: number;
  tokensOut: number;
  generations: number;
  quota: number;
  softWarned: boolean;
  availableTokens: number;
  holdTokens: number;
  totalAllocatedTokens: number;
  rechargeCount: number;
  rechargeTokens: number;
  tokenBalance: number;
  walletCurrency: string;
};

const quickActions = [
  {
    title: "Create Ad Copy",
    description: "Generate engaging advertisements",
    href: "/generate?template=ad-copy",
    Icon: Sparkles
  },
  {
    title: "Manage Projects",
    description: "Organize your content campaigns",
    href: "/projects",
    Icon: Layers3
  },
  {
    title: "Brand Voice",
    description: "Define your brand personality",
    href: "/brand-voice",
    Icon: LibraryBig
  }
] as const;

type WalletTransaction = {
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
};

type WalletTransactionsResponse = {
  items: WalletTransaction[];
  nextCursor: string | null;
};

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  let usage: UsageResponse;
  let walletActivity: WalletTransactionsResponse;
  let projects: { projects: ProjectSummary[] };
  let brandVoices: { brandVoices: BrandVoiceSummary[] };
  try {
    [usage, walletActivity, projects, brandVoices] = await Promise.all([
      serverApiFetch<UsageResponse>("/usage/me", session.apiToken),
      serverApiFetch<WalletTransactionsResponse>("/wallet/transactions?limit=3", session.apiToken),
      serverApiFetch<{ projects: ProjectSummary[] }>("/projects", session.apiToken),
      serverApiFetch<{ brandVoices: BrandVoiceSummary[] }>("/brand-voice", session.apiToken)
    ]);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401) {
      redirect("/api/auth/signin");
    }
    throw err;
  }

  const tokensUsed = usage.tokensIn + usage.tokensOut;
  const totalAllocated = usage.totalAllocatedTokens || usage.quota || 1;
  const availableTokens = usage.availableTokens ?? Math.max(totalAllocated - tokensUsed, 0);
  const usagePercent = totalAllocated > 0 ? Math.min(tokensUsed / totalAllocated, 1) : 0;
  const activeProjects = projects.projects.length;
  const brandVoiceCount = brandVoices.brandVoices.length;
  const walletItems = walletActivity.items.slice(0, 3);

  const statCards = [
    {
      title: "Generations This Month",
      value: usage.generations.toLocaleString(),
      meta:
        usage.generations === 1
          ? "1 generation completed"
          : `${usage.generations.toLocaleString()} generations completed`,
      Icon: Wand2
    },
    {
      title: "Tokens Used",
      value: compactNumber.format(tokensUsed),
      meta: `${compactNumber.format(availableTokens)} tokens available`,
      Icon: BarChart3
    },
    {
      title: "Active Projects",
      value: activeProjects.toLocaleString(),
      meta:
        activeProjects === 1 ? "1 project currently active" : `${activeProjects.toLocaleString()} projects active`,
      Icon: FileText
    },
    {
      title: "Brand Voices",
      value: brandVoiceCount.toLocaleString(),
      meta:
        brandVoiceCount === 1
          ? "1 brand voice available"
          : `${brandVoiceCount.toLocaleString()} brand voices available`,
      Icon: Layers3
    }
  ] as const;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ title, value, meta, Icon }) => (
          <Card key={title} className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">{meta}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
          <CardHeader className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BarChart3 className="h-4 w-4 text-sky-500" />
              Usage Overview
            </div>
            <CardTitle className="text-sm font-medium text-slate-500">Monthly Token Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-600">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Usage</span>
                <span>
                  {availableTokens.toLocaleString()} / {totalAllocated.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${usagePercent * 100}%` }} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Input Tokens</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{usage.tokensIn.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Output Tokens</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{usage.tokensOut.toLocaleString()}</p>
              </div>
            </div>
            {usage.softWarned && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                You are approaching your token limit. Consider upgrading your plan.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
          <CardHeader className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Recent Wallet Activity
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {walletItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                  No wallet transactions yet.
                </div>
              ) : (
                walletItems.map((item) => {
                  const amountPrefix = item.direction === "debit" ? "-" : item.direction === "credit" ? "+" : "";
                  const amountDisplay = `${amountPrefix}${item.amountTokens.toLocaleString()} tokens`;
                  const timestamp = new Date(item.createdAt);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-slate-500">
                            {amountDisplay}
                            {item.source ? ` • ${item.source}` : ""}
                          </p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <ArrowUpRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Button
              asChild
              variant="secondary"
              className="w-full justify-center border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-slate-700"
            >
              <Link href="/wallet">View All Wallet Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map(({ title, description, href, Icon }) => (
          <Card key={title} className="rounded-2xl border-slate-200 p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <Link
              href={href}
              className="mt-6 inline-flex w-fit items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
            >
              Open
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
