"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldSummary } from "@/types";
import { ChartCard } from "./analytics-shared";
import {
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_CRITICAL,
  CHART_POSITIVE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  CHART_WARNING,
} from "./chart-theme";

function healthColor(score: number) {
  if (score >= 70) return CHART_POSITIVE;
  if (score >= 40) return CHART_WARNING;
  return CHART_CRITICAL;
}

export function FieldHealthChart({
  fields,
  isLoading,
}: {
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const data = [...fields]
    .sort((a, b) => b.healthScore - a.healthScore)
    .map((f) => ({ name: f.name, healthScore: f.healthScore }));

  return (
    <ChartCard title="Field Health" description="Current health score by field">
      {isLoading ? (
        <Skeleton className="h-[180px] w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
          No field data yet.
        </div>
      ) : (
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
              barCategoryGap="28%"
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={72}
                tick={CHART_AXIS_TICK}
              />
              <Tooltip
                cursor={{ fill: "oklch(var(--foreground) / 4%)" }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                formatter={(value) => [`${value}%`, "Health"]}
              />
              <Bar dataKey="healthScore" radius={[0, 6, 6, 0]} maxBarSize={16} {...CHART_ANIMATION}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={healthColor(entry.healthScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
