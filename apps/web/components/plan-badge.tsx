import { Badge } from "@/components/ui/badge";

export const PlanBadge = ({ plan }: { plan: string }) => (
  <Badge tone={plan === "free" ? "warning" : "success"} className="capitalize">Plan: {plan}</Badge>
);
