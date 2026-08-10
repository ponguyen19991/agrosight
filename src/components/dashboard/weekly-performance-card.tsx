"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeeklyPerformanceCell } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [13, 14, 15, 16, 17, 18];

function formatHour(hour: number) {
  const period = hour >= 12 ? "pm" : "am";
  const h = hour > 12 ? hour - 12 : hour;
  return `${h}${period}`;
}

function scoreOpacity(score: number) {
  return 0.1 + (Math.max(0, Math.min(100, score)) / 100) * 0.85;
}

interface WeeklyPerformanceCardProps {
  cells: WeeklyPerformanceCell[];
  isLoading?: boolean;
}

export function WeeklyPerformanceCard({ cells, isLoading }: WeeklyPerformanceCardProps) {
  const byKey = new Map(cells.map((c) => [`${c.dayOfWeek}-${c.hour}`, c.score]));

  return (
    <Card className="glass-panel border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || cells.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            {isLoading ? "Loading..." : "No performance data yet."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2.5rem_repeat(7,1fr)] gap-1 text-[10px] text-muted-foreground">
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
                    return (
                      <Tooltip key={`${dayIndex}-${hour}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="aspect-square w-full rounded-[4px]"
                            style={{
                              backgroundColor: `oklch(0.75 0.17 145 / ${scoreOpacity(score)})`,
                            }}
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

            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
              <span>Less</span>
              {[0.15, 0.35, 0.55, 0.75, 0.95].map((opacity) => (
                <span
                  key={opacity}
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ backgroundColor: `oklch(0.75 0.17 145 / ${opacity})` }}
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
