"use client";

import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityItem } from "./team-data";

export function RecentActivity({
  activity,
  isLoading,
}: {
  activity: ActivityItem[];
  isLoading?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Recent Team Activity
      </p>
      <div className="glass-panel mt-3 divide-y divide-border rounded-2xl px-5">
        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : activity.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-3.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{item.actorName}</span> {item.description}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
