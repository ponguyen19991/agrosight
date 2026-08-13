"use client";

import { useMemo, useState } from "react";
import { format, parse } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { FarmSummary, FieldSummary } from "@/types";
import { ChartCard, PillGroup } from "./analytics-shared";
import {
  computeTrendDeltaPct,
  filterYieldTrend,
  scaleYieldTrendForField,
  type YieldPeriod,
} from "./analytics-data";
import {
  CHART_ACTIVE_DOT,
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_GRID_STROKE,
  CHART_POSITIVE,
  CHART_WARNING,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "./chart-theme";

const PERIODS: { value: YieldPeriod; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];

export function YieldPerformanceChart({
  farm,
  fields,
  isLoading,
}: {
  farm: FarmSummary | undefined;
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const [period, setPeriod] = useState<YieldPeriod>("6m");
  const [fieldId, setFieldId] = useState<string>("all");

  const totalArea = useMemo(
    () => fields.reduce((sum, f) => sum + f.areaHectares, 0),
    [fields]
  );

  const scopedPoints = useMemo(() => {
    const rawPoints = farm?.yieldTrend ?? [];
    if (fieldId === "all") return rawPoints;
    const field = fields.find((f) => f.id === fieldId);
    return field ? scaleYieldTrendForField(rawPoints, field, totalArea) : rawPoints;
  }, [farm?.yieldTrend, fieldId, fields, totalArea]);

  const filteredPoints = filterYieldTrend(scopedPoints, period);
  const data = filteredPoints.map((point) => ({
    ...point,
    label: format(parse(point.month, "yyyy-MM", new Date()), "MMM yyyy"),
  }));

  const latest = filteredPoints.at(-1)?.valueKg ?? 0;
  const deltaPct = computeTrendDeltaPct(filteredPoints.map((p) => p.valueKg));
  const latestTonnesPerHa = totalArea ? latest / 1000 / totalArea : 0;

  return (
    <ChartCard
      title="Yield Performance"
      description="Total harvest across the selected scope, by month"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Select value={fieldId} onValueChange={setFieldId}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PillGroup value={period} onChange={setPeriod} options={PERIODS} />
        </div>
      }
    >
      {isLoading ? (
        <Skeleton className="h-[220px] w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
          No yield data yet.
        </div>
      ) : (
        <>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldPerformanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />
                <YAxis tickLine={false} axisLine={false} width={44} tick={CHART_AXIS_TICK} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                  formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Yield"]}
                />
                <Area
                  type="monotone"
                  dataKey="valueKg"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#yieldPerformanceFill)"
                  dot={false}
                  activeDot={{ ...CHART_ACTIVE_DOT, fill: "var(--chart-1)" }}
                  {...CHART_ANIMATION}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Yield</p>
              <p className="text-lg font-semibold">{latestTonnesPerHa.toFixed(1)} t/ha</p>
            </div>
            {deltaPct !== null && (
              <p
                className="text-xs font-medium"
                style={{ color: deltaPct >= 0 ? CHART_POSITIVE : CHART_WARNING }}
              >
                {deltaPct >= 0 ? "+" : ""}
                {deltaPct.toFixed(1)}% vs previous period
              </p>
            )}
          </div>
        </>
      )}
    </ChartCard>
  );
}
