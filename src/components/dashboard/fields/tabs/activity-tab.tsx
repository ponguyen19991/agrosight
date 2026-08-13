import type { FieldSummary } from "@/types";
import { ChartCard } from "../../analytics/analytics-shared";
import { computeFieldActivity, type FieldActivityItem } from "../field-detail-data";

function groupByDay(items: FieldActivityItem[]) {
  const groups: Record<string, FieldActivityItem[]> = {};
  for (const item of items) {
    (groups[item.group] ??= []).push(item);
  }
  return groups;
}

export function ActivityTab({ field }: { field: FieldSummary }) {
  const activity = computeFieldActivity(field);
  const groups = groupByDay(activity);

  return (
    <ChartCard title="Activity">
      <div className="space-y-5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {group}
            </p>
            <div className="mt-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">{item.time}</span>{" "}
                      <span className="font-medium">{item.title}</span>
                    </p>
                    {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
