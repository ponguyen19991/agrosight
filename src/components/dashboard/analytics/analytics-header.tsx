import { Droplet, HeartPulse, LandPlot, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FarmSummary, FieldSummary } from "@/types";
import { computeHeaderStats } from "./analytics-data";
import { CHART_POSITIVE, CHART_WARNING } from "./chart-theme";

function StatChip({
  icon: Icon,
  value,
  label,
  deltaPct,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  deltaPct?: number | null;
}) {
  const isPositive = (deltaPct ?? 0) >= 0;
  return (
    <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold leading-tight">{value}</p>
          {deltaPct !== undefined && deltaPct !== null && (
            <span
              className="text-[11px] font-medium"
              style={{ color: isPositive ? CHART_POSITIVE : CHART_WARNING }}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(deltaPct).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function AnalyticsHeader({
  farm,
  fields,
  isLoading,
}: {
  farm: FarmSummary | undefined;
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const stats = computeHeaderStats(farm, fields);

  return (
    <div>
      <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Farm performance and field intelligence.
      </p>

      <div
        className={cn(
          "mt-5 grid grid-cols-2 gap-3",
          "sm:grid-cols-4"
        )}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-2xl" />
          ))
        ) : (
          <>
            <StatChip icon={LandPlot} value={`${stats.totalArea.toFixed(1)} ha`} label="Farm Area" />
            <StatChip icon={HeartPulse} value={`${stats.avgHealth}%`} label="Avg. Health" />
            <StatChip
              icon={Droplet}
              value={`${stats.totalWater.toLocaleString()}L`}
              label="Water Used"
            />
            <StatChip
              icon={TrendingUp}
              value={
                stats.yieldDeltaPct !== null
                  ? `${stats.yieldDeltaPct >= 0 ? "+" : ""}${stats.yieldDeltaPct.toFixed(1)}%`
                  : "—"
              }
              label="Yield Trend"
            />
          </>
        )}
      </div>
    </div>
  );
}
