import clsx from "clsx";
import type { ReactNode } from "react";

import { auth } from "@/lib/session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Toggle = ({ enabled }: { enabled: boolean }) => (
  <span
    role="switch"
    aria-checked={enabled}
    className={clsx(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      enabled ? "bg-sky-500" : "bg-slate-200"
    )}
  >
    <span
      className={clsx(
        "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
        enabled ? "translate-x-5" : "translate-x-1"
      )}
    />
  </span>
);

const SectionLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
    {icon}
    {label}
  </div>
);

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  const plan = (user?.plan ?? "starter").toLowerCase();
  const planLabel = plan.includes("plan") ? plan : `${plan} plan`;
  const preferredProvider = user?.preferredProvider ?? "openai";
  const preferredModel = user?.preferredModel ?? "gpt-4o";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account preferences and application settings.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">👤</span>}
                label="Profile"
              />
              <p className="text-xs font-medium text-slate-500">Update your personal information and plan.</p>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-slate-600">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{user?.name ?? "John Doe"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email Address</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{user?.email ?? "john@example.com"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Plan</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">You're on the {planLabel}</p>
                </div>
                <Badge className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600">
                  {plan}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-500">🧠</span>}
                label="AI Preferences"
              />
              <p className="text-xs font-medium text-slate-500">Default settings for content generation.</p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Default AI Model</p>
                <p className="mt-1 text-sm text-slate-500">
                  This model will be pre-selected when generating content.
                </p>
                <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {preferredProvider === "openai" ? "OpenAI" : preferredProvider.toUpperCase()} · {preferredModel.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">($0.03 / 1K tokens)</p>
                  </div>
                  <Button className="rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:border-sky-200 hover:text-sky-600">
                    Change Model
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capabilities</p>
                  <p className="mt-2 text-sm text-slate-700">Text, JSON, creative</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required Plan</p>
                  <p className="mt-2 text-sm text-slate-700">Free</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">🎨</span>}
                label="Appearance"
              />
              <p className="text-xs font-medium text-slate-500">Choose how Front Cloud Creative looks for you.</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme</p>
              <div className="flex flex-wrap gap-3">
                {["Light", "Dark", "System"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                      option === "System"
                        ? "border-sky-200 bg-sky-50 text-sky-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"
                    )}
                    aria-pressed={option === "System"}
                  >
                    <span
                      className={clsx(
                        "h-2.5 w-2.5 rounded-full",
                        option === "Light"
                          ? "bg-slate-200"
                          : option === "Dark"
                            ? "bg-slate-700"
                            : "bg-sky-500"
                      )}
                    />
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-500">🔔</span>}
                label="Notifications"
              />
              <p className="text-xs font-medium text-slate-500">Select which updates you want to receive.</p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600">
              {[
                { label: "Email Notifications", description: "Receive updates via email", enabled: true },
                { label: "Usage Alerts", description: "Notify when approaching token limits", enabled: true },
                { label: "Billing Updates", description: "Payment and subscription changes", enabled: true },
                { label: "Product Updates", description: "New features and improvements", enabled: false }
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <Toggle enabled={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">🔐</span>}
                label="API Access"
              />
              <p className="text-xs font-medium text-slate-500">API access is available on Pro plans and above.</p>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-full bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-400">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">🛡️</span>}
                label="Privacy & Security"
              />
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Usage Analytics</p>
                  <p className="text-xs text-slate-500">Help improve our service</p>
                </div>
                <Toggle enabled />
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Data Retention</p>
                <select
                  defaultValue="90 days"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-1 focus:ring-sky-200"
                >
                  {["30 days", "60 days", "90 days", "120 days"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Share Usage Data</p>
                  <p className="text-xs text-slate-500">Anonymous usage statistics</p>
                </div>
                <Toggle enabled={false} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500">⬇️</span>}
                label="Data Export"
              />
              <p className="text-xs font-medium text-slate-500">Download your data and generated content.</p>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-full border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 hover:border-sky-200 hover:text-sky-600">
                Export Data
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <CardHeader className="mb-4 space-y-1">
              <SectionLabel
                icon={<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600">⚠️</span>}
                label="Danger Zone"
              />
              <p className="text-xs font-medium text-rose-500">
                Permanently delete your account and all associated data.
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-full bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-400">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700">
          Cancel
        </Button>
        <Button className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
