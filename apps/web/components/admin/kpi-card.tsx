import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const KpiCard = ({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-slate-500 dark:text-slate-400">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </CardContent>
  </Card>
);
