"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldSummary } from "@/types";
import { ChartCard, LegendDot } from "./analytics-shared";
import { computeCropDistribution } from "./analytics-data";
import { CHART_ANIMATION } from "./chart-theme";

const CROP_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const RADIAN = Math.PI / 180;

function renderPercentLabel(props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {Math.round(percent * 100)}%
    </text>
  );
}

export function CropDistributionChart({
  fields,
  isLoading,
}: {
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const data = computeCropDistribution(fields);

  return (
    <ChartCard title="Crop Distribution" description="Share of farm area by crop">
      {isLoading ? (
        <Skeleton className="h-[180px] w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
          No field data yet.
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="area"
                  nameKey="cropType"
                  innerRadius={50}
                  outerRadius={86}
                  paddingAngle={4}
                  cornerRadius={8}
                  strokeWidth={0}
                  label={renderPercentLabel}
                  labelLine={false}
                  {...CHART_ANIMATION}
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.cropType} fill={CROP_COLORS[i % CROP_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="min-w-0 flex-1 space-y-3">
            {data.map((entry, i) => (
              <li key={entry.cropType} className="flex items-center justify-between gap-2">
                <LegendDot color={CROP_COLORS[i % CROP_COLORS.length]} label={entry.cropType} />
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {Math.round(entry.percentage)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}
