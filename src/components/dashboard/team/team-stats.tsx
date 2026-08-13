"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { Member } from "./team-data";

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass-panel flex-1 rounded-2xl px-4 py-3 text-center">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function TeamStats({ members, isLoading }: { members: Member[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] flex-1 rounded-2xl" />
        ))}
      </div>
    );
  }

  const managers = members.filter((m) => m.role === "manager").length;
  const agronomists = members.filter((m) => m.role === "agronomist").length;
  const workers = members.filter((m) => m.role === "worker").length;

  return (
    <div className="flex flex-wrap gap-3">
      <StatTile value={members.length} label="Members" />
      <StatTile value={managers} label="Managers" />
      <StatTile value={agronomists} label="Agronomists" />
      <StatTile value={workers} label="Field Staff" />
    </div>
  );
}
