"use client";

import { format, parse } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { YieldTrendPoint } from "@/types";

const SKELETON_BAR_HEIGHTS = [35, 55, 40, 70, 50, 85];

interface YieldTrendCardProps {
  points: YieldTrendPoint[];
  isLoading?: boolean;
}

export function YieldTrendCard({ points, isLoading }: YieldTrendCardProps) {
  const data = points.map((point) => ({
    ...point,
    label: format(parse(point.month, "yyyy-MM", new Date()), "MMM"),
  }));

  return (
    <Card className="glass-panel border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Yield Trend</CardTitle>
        <p className="text-xs text-muted-foreground">Total harvest across all fields, by month</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[160px] items-end gap-3 px-1 pb-1">
            {SKELETON_BAR_HEIGHTS.map((height, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            No yield data yet.
          </div>
        ) : (
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(var(--foreground) / 8%)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(var(--popover))",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "oklch(var(--popover-foreground))",
                  }}
                  labelStyle={{ color: "oklch(var(--popover-foreground))" }}
                  itemStyle={{ color: "oklch(var(--popover-foreground))" }}
                  formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Yield"]}
                />
                <Area
                  type="monotone"
                  dataKey="valueKg"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#yieldFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
