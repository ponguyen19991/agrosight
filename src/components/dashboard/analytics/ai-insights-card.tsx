"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import type { FieldSummary } from "@/types";
import { ChartCard } from "./analytics-shared";
import { CHART_POSITIVE, CHART_WARNING } from "./chart-theme";

function Insight({
  icon: Icon,
  color,
  title,
  description,
  onViewField,
}: {
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  onViewField?: () => void;
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {onViewField && (
            <button
              type="button"
              onClick={onViewField}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View field
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AiInsightsCard({
  fields,
  isLoading,
}: {
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const router = useRouter();

  const healthiest = [...fields].sort((a, b) => b.healthScore - a.healthScore)[0];
  const thirstiest = [...fields].sort((a, b) => b.waterConsumptionL - a.waterConsumptionL)[0];

  return (
    <ChartCard title="AI Performance Insights" description="Generated from this week's field data">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">No field data yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {healthiest && (
            <Insight
              icon={TrendingUp}
              color={CHART_POSITIVE}
              title="Yield improvement"
              description={`${healthiest.name} is at ${healthiest.healthScore}% health, the strongest field this week. Soil moisture and pH have stayed within the optimal range.`}
              onViewField={() => router.push(ROUTES.dashboard.root)}
            />
          )}
          {thirstiest && (
            <Insight
              icon={TriangleAlert}
              color={CHART_WARNING}
              title="Resource efficiency"
              description={`${thirstiest.name} used ${thirstiest.waterConsumptionL.toLocaleString()}L of water this week, the most of any field. Consider reviewing its irrigation schedule.`}
              onViewField={() => router.push(ROUTES.dashboard.root)}
            />
          )}
          <Insight
            icon={Sparkles}
            color="oklch(var(--muted-foreground))"
            title="Keep an eye on the rest"
            description="Every other field is tracking within its normal range — no action needed right now."
          />
        </div>
      )}
    </ChartCard>
  );
}
