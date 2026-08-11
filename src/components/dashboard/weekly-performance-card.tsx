"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeeklyPerformanceCell } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [13, 14, 15, 16, 17, 18];
const HEAT_COLORS = [
  "var(--heat-1)",
  "var(--heat-2)",
  "var(--heat-3)",
  "var(--heat-4)",
  "var(--heat-5)",
];

function formatHour(hour: number) {
  const period = hour >= 12 ? "pm" : "am";
  const h = hour > 12 ? hour - 12 : hour;
  return `${h}${period}`;
}

// Buckets scores into 5 tiers by quantile (relative rank) rather than fixed
// thresholds, so the heatmap always shows a full Less→More spread even when
// the underlying scores are averaged/compressed into a narrow range.
function useScoreTiers(cells: WeeklyPerformanceCell[]) {
  return useMemo(() => {
    const sorted = [...cells.map((c) => c.score)].sort((a, b) => a - b);
    const quantile = (p: number) =>
      sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
    const thresholds = [0.2, 0.4, 0.6, 0.8].map(quantile);

    const tierOf = (score: number) => {
      let tier = 0;
      for (const t of thresholds) {
        if (score > t) tier++;
      }
      return Math.min(4, tier);
    };

    const byKey = new Map(cells.map((c) => [`${c.dayOfWeek}-${c.hour}`, c.score]));
    return { byKey, tierOf };
  }, [cells]);
}

interface WeeklyPerformanceCardProps {
  cells: WeeklyPerformanceCell[];
  isLoading?: boolean;
}

export function WeeklyPerformanceCard({ cells, isLoading }: WeeklyPerformanceCardProps) {
  const { byKey, tierOf } = useScoreTiers(cells);

  return (
    <Card className="glass-panel border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WeeklyPerformanceSkeleton />
        ) : cells.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            No performance data yet.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[420px] grid grid-cols-[2.5rem_repeat(7,1fr)] gap-1 text-[10px] text-muted-foreground">
                <div />
                {DAYS.map((day) => (
                  <div key={day} className="text-center">
                    {day}
                  </div>
                ))}
                {HOURS.map((hour) => (
                  <div key={hour} className="contents">
                    <div className="flex items-center">{formatHour(hour)}</div>
                    {DAYS.map((_, dayIndex) => {
                      const score = byKey.get(`${dayIndex}-${hour}`) ?? 0;
                      const color = HEAT_COLORS[tierOf(score)];
                      return (
                        <Tooltip key={`${dayIndex}-${hour}`}>
                          <TooltipTrigger asChild>
                            <div
                              className="h-6 w-full rounded-sm"
                              style={{ backgroundColor: color }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {DAYS[dayIndex]} {formatHour(hour)}: {score}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
              <span>Less</span>
              {HEAT_COLORS.map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function WeeklyPerformanceSkeleton() {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[420px] grid grid-cols-[2.5rem_repeat(7,1fr)] gap-1.5">
          <div />
          {DAYS.map((day) => (
            <Skeleton key={day} className="mx-auto h-2.5 w-6" />
          ))}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <Skeleton className="my-auto h-2.5 w-6" />
              {DAYS.map((_, dayIndex) => (
                <Skeleton key={`${dayIndex}-${hour}`} className="h-7 w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <Skeleton className="h-2.5 w-8" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-2.5 w-2.5 rounded-[3px]" />
        ))}
        <Skeleton className="h-2.5 w-8" />
      </div>
    </>
  );
}
