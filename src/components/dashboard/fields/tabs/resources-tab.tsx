"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Droplet, Sprout, Zap } from "lucide-react";
import type { FieldSummary } from "@/types";
import { ChartCard, PillGroup } from "../../analytics/analytics-shared";
import {
  CHART_ACTIVE_DOT,
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "../../analytics/chart-theme";
import { computeFieldResourceSeries } from "../field-detail-data";

type Metric = "water" | "fertilizer" | "energy";

const METRICS: { value: Metric; label: string; unit: string; color: string; icon: typeof Droplet }[] = [
  { value: "water", label: "Water", unit: "L", color: "var(--chart-1)", icon: Droplet },
  { value: "fertilizer", label: "Fertilizer", unit: "kg", color: "var(--chart-2)", icon: Sprout },
  { value: "energy", label: "Energy", unit: "kWh", color: "var(--chart-4)", icon: Zap },
];

export function ResourcesTab({ field }: { field: FieldSummary }) {
  const [metric, setMetric] = useState<Metric>("water");
  const series = useMemo(() => computeFieldResourceSeries(field), [field]);
  const active = METRICS.find((m) => m.value === metric)!;

  const totals = {
    water: field.waterConsumptionL,
    fertilizer: field.fertilizerEfficiencyPct,
    energy: Math.round(field.waterConsumptionL * 0.015),
  };

  return (
    <div className="space-y-4">
      <ChartCard title="Resource Usage" description="Current totals for this field">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.value} className="rounded-xl bg-muted/60 p-4">
              <m.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <p className="mt-2 text-lg font-semibold">
                {totals[m.value].toLocaleString()} {m.unit}
              </p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard
        title="Weekly Trend"
        action={
          <PillGroup
            value={metric}
            onChange={setMetric}
            options={METRICS.map((m) => ({ value: m.value, label: m.label }))}
          />
        }
      >
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`fieldResourceFill-${metric}`} x1="0" y1="0" x2="0" y2="1">
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
                fill={`url(#fieldResourceFill-${metric})`}
                dot={false}
                activeDot={{ ...CHART_ACTIVE_DOT, fill: active.color }}
                {...CHART_ANIMATION}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
