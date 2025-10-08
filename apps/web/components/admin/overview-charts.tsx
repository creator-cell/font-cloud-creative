"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface OverviewChartsProps {
  providerData: Array<{ provider: string; tokensIn: number; tokensOut: number }>;
  planMix: Array<{ plan: string; value: number }>;
  signupTrend: Array<{ date: string; value: number }>;
}

const COLORS = ["#6366F1", "#22D3EE", "#F97316", "#10B981", "#EF4444"];

export const OverviewCharts = ({ providerData, planMix, signupTrend }: OverviewChartsProps) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tokens by Provider</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={providerData}>
            <XAxis dataKey="provider" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip cursor={{ fill: "#1e293b" }} />
            <Bar dataKey="tokensIn" stackId="a" fill="#6366F1" name="Tokens In" />
            <Bar dataKey="tokensOut" stackId="a" fill="#22D3EE" name="Tokens Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Users by Plan</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie dataKey="value" data={planMix} innerRadius={50} outerRadius={80}>
              {planMix.map((entry, index) => (
                <Cell key={entry.plan} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Signups</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={signupTrend}>
            <XAxis dataKey="date" stroke="#94a3b8" hide />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
