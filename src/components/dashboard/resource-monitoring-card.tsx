"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RESOURCE_CATEGORY_COLOR_VAR,
  RESOURCE_CATEGORY_LABEL,
  RESOURCE_CATEGORY_ORDER,
} from "@/lib/field-status";
import type { ResourceAllocationSummary } from "@/types";

interface ResourceMonitoringCardProps {
  allocations: ResourceAllocationSummary[];
  isLoading?: boolean;
}

const PERIODS = [
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
  { value: "YEAR", label: "Year" },
] as const;

export function ResourceMonitoringCard({ allocations, isLoading }: ResourceMonitoringCardProps) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["value"]>("WEEK");

  const data = useMemo(() => {
    const byCategory = new Map(
      allocations.filter((a) => a.period === period).map((a) => [a.category, a.percentage])
    );
    return RESOURCE_CATEGORY_ORDER.filter((category) => byCategory.has(category)).map(
      (category) => ({
        category,
        name: RESOURCE_CATEGORY_LABEL[category],
        value: byCategory.get(category) ?? 0,
        color: RESOURCE_CATEGORY_COLOR_VAR[category],
      })
    );
  }, [allocations, period]);

  return (
    <Card className="glass-panel border-0">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Resource Monitoring</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="h-7 bg-foreground/5 p-0.5">
            {PERIODS.map((p) => (
              <TabsTrigger key={p.value} value={p.value} className="h-6 px-2 text-xs">
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading || data.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
            {isLoading ? "Loading..." : "No resource data yet."}
          </div>
        ) : (
          <>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.15 0.02 155)",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-1 space-y-1.5">
              {data.map((entry) => (
                <li key={entry.category} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}
                  </span>
                  <span className="font-medium text-foreground">{entry.value}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
