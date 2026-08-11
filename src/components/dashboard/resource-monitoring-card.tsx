"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type PieLabelRenderProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const ACTIVE_CORNER_RADIUS = 8;
const RADIAN = Math.PI / 180;

function renderPercentLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (percent === undefined || percent < 0.06) return null;

  const cxNum = Number(cx);
  const cyNum = Number(cy);
  const inner = Number(innerRadius);
  const outer = Number(outerRadius);
  const radius = inner + (outer - inner) * 0.5;
  const x = cxNum + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cyNum + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize={10}
      fontWeight={700}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

function renderActiveShape(props: unknown) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
  };

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      cornerRadius={ACTIVE_CORNER_RADIUS}
      fill={fill}
      style={{ transition: "d 0.25s ease-out 0.05s" }}
    />
  );
}

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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Resource Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="grid h-10 w-full grid-cols-3 rounded-full bg-muted p-1">
            {PERIODS.map((p) => (
              <TabsTrigger
                key={p.value}
                value={p.value}
                className="h-full w-full rounded-full text-xs"
              >
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <ResourceMonitoringSkeleton />
        ) : data.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            No resource data yet.
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <ul className="min-w-0 flex-1 space-y-3">
              {data.map((entry) => (
                <li key={entry.category} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </li>
              ))}
            </ul>

            <div className="h-[150px] w-[150px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={4}
                    cornerRadius={8}
                    strokeWidth={0}
                    label={renderPercentLabel}
                    labelLine={false}
                    activeShape={renderActiveShape}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={entry.color}
                        style={{ transition: "opacity 0.2s ease-out" }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResourceMonitoringSkeleton() {
  return (
    <div className="mt-4 flex items-center gap-3">
      <ul className="flex-1 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </li>
        ))}
      </ul>

      <div className="relative flex h-[150px] w-[150px] shrink-0 items-center justify-center">
        <Skeleton className="h-full w-full rounded-full" />
        <div className="absolute h-[88px] w-[88px] rounded-full bg-card" />
      </div>
    </div>
  );
}
