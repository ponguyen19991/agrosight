"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthGauge } from "@/components/map/health-gauge";
import type { FieldSummary } from "@/types";
import { ChartCard } from "../../analytics/analytics-shared";
import {
  CHART_ACTIVE_DOT,
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "../../analytics/chart-theme";
import { computeAiAssessment, computeHealthTrend } from "../field-detail-data";

function Indicator({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </span>
    </div>
  );
}

export function HealthTab({ field }: { field: FieldSummary }) {
  const trend = computeHealthTrend(field);
  const assessment = computeAiAssessment(field);

  return (
    <div className="space-y-4">
      <ChartCard title="Field Health">
        <div className="flex justify-center">
          <HealthGauge score={field.healthScore} size={200} />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Health Trend
          </p>
          <div className="mt-3 h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                  formatter={(value) => [`${value}%`, "Health"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#healthTrendFill)"
                  dot={false}
                  activeDot={{ ...CHART_ACTIVE_DOT, fill: "var(--chart-1)" }}
                  {...CHART_ANIMATION}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-2">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Indicators
          </p>
          <Indicator
            label="Soil moisture"
            value={`${field.soilMoisturePct}%`}
            status={field.soilMoisturePct >= 40 ? "Optimal" : "Low"}
          />
          <Indicator
            label="Temperature"
            value={`${field.temperatureC}°C`}
            status={field.temperatureC <= 32 ? "Normal" : "High"}
          />
          <Indicator label="pH" value={field.phLevel.toFixed(1)} status="Optimal" />
          <Indicator
            label="Crop stress"
            value={field.healthScore >= 60 ? "Low" : "Elevated"}
            status=""
          />
        </div>
      </ChartCard>

      <ChartCard title="AI Assessment">
        <div className="flex items-start gap-3">
          <span
            className={
              assessment.isHealthy
                ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500"
                : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500"
            }
          >
            {assessment.isHealthy ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <TriangleAlert className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="text-sm font-medium">{assessment.headline}</p>
            <ul className="mt-2 space-y-1">
              {assessment.points.map((point) => (
                <li key={point} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4">
          View AI recommendation
        </Button>
      </ChartCard>
    </div>
  );
}
