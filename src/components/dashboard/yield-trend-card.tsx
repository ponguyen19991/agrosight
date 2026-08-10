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
import type { YieldTrendPoint } from "@/types";

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
        {isLoading || data.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            {isLoading ? "Loading..." : "No yield data yet."}
          </div>
        ) : (
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(1 0 0 / 8%)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.7 0.02 130)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tick={{ fill: "oklch(0.7 0.02 130)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.02 155)",
                    border: "1px solid oklch(1 0 0 / 12%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Yield"]}
                />
                <Area
                  type="monotone"
                  dataKey="valueKg"
                  stroke="var(--chart-3)"
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
