import { format } from "date-fns";
import type { FieldSummary } from "@/types";
import { ChartCard } from "../../analytics/analytics-shared";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function OverviewTab({ field }: { field: FieldSummary }) {
  return (
    <ChartCard title="Field Overview">
      <div>
        <Row label="Crop" value={field.cropType} />
        <Row label="Growth stage" value={field.growthStage} />
        <Row label="Area" value={`${field.areaHectares.toFixed(1)} ha`} />
        <Row
          label="Planting date"
          value={field.plantingDate ? format(new Date(field.plantingDate), "MMM d, yyyy") : "Not set"}
        />
        <Row label="Soil moisture" value={`${field.soilMoisturePct}%`} />
        <Row label="Soil pH" value={field.phLevel.toFixed(1)} />
        <Row label="Irrigation" value={field.irrigationType ?? "Not set"} />
        <Row label="Manager" value={field.assignedManagerName ?? "Unassigned"} />
      </div>

      {field.notes && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Notes
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{field.notes}</p>
        </div>
      )}
    </ChartCard>
  );
}
