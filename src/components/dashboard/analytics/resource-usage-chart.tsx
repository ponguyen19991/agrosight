"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldSummary } from "@/types";
import { ChartCard, PillGroup } from "./analytics-shared";
import { computeResourceUsageSeries } from "./analytics-data";
import {
  CHART_ACTIVE_DOT,
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "./chart-theme";

type Metric = "water" | "fertilizer" | "energy";

const METRICS: { value: Metric; label: string; unit: string; color: string }[] = [
  { value: "water", label: "Water", unit: "L", color: "var(--chart-1)" },
  { value: "fertilizer", label: "Fertilizer", unit: "kg", color: "var(--chart-2)" },
  { value: "energy", label: "Energy", unit: "kWh", color: "var(--chart-4)" },
];

export function ResourceUsageChart({
  fields,
  isLoading,
}: {
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const [metric, setMetric] = useState<Metric>("water");
  const data = useMemo(() => computeResourceUsageSeries(fields), [fields]);
  const active = METRICS.find((m) => m.value === metric)!;

  return (
    <ChartCard
      title="Resource Usage"
      description="This week, by day"
      action={
        <PillGroup
          value={metric}
          onChange={setMetric}
          options={METRICS.map((m) => ({ value: m.value, label: m.label }))}
        />
      }
    >
      {isLoading ? (
        <Skeleton className="h-[180px] w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
          No resource data yet.
        </div>
      ) : (
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`resourceFill-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={active.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={active.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />
              <YAxis tickLine={false} axisLine={false} width={40} tick={CHART_AXIS_TICK} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(value) => [`${Number(value).toLocaleString()} ${active.unit}`, active.label]}
              />
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={active.color}
                strokeWidth={2}
                fill={`url(#resourceFill-${metric})`}
                dot={false}
                activeDot={{ ...CHART_ACTIVE_DOT, fill: active.color }}
                {...CHART_ANIMATION}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
