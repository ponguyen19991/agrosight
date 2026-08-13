"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { FieldSummary } from "@/types";

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-panel flex-1 rounded-2xl px-4 py-3 text-center">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function FieldsStats({ fields, isLoading }: { fields: FieldSummary[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] flex-1 rounded-2xl" />
        ))}
      </div>
    );
  }

  const totalArea = fields.reduce((sum, f) => sum + f.areaHectares, 0);
  const avgHealth = fields.length
    ? Math.round(fields.reduce((sum, f) => sum + f.healthScore, 0) / fields.length)
    : 0;
  const alerts = fields.filter((f) => f.status === "WARNING" || f.status === "CRITICAL").length;

  return (
    <div className="flex flex-wrap gap-3">
      <StatTile value={String(fields.length)} label="Fields" />
      <StatTile value={`${totalArea.toFixed(1)} ha`} label="Total Area" />
      <StatTile value={`${avgHealth}%`} label="Avg Health" />
      <StatTile value={String(alerts)} label="Alerts" />
    </div>
  );
}
