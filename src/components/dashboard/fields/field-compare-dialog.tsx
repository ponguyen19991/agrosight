"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FIELD_STATUS_LABEL } from "@/lib/field-status";
import type { FieldSummary } from "@/types";

const ROWS: { key: keyof FieldSummary; label: string; format: (f: FieldSummary) => string }[] = [
  { key: "status", label: "Status", format: (f) => FIELD_STATUS_LABEL[f.status] },
  { key: "healthScore", label: "Health", format: (f) => `${f.healthScore}%` },
  { key: "soilMoisturePct", label: "Moisture", format: (f) => `${f.soilMoisturePct}%` },
  { key: "temperatureC", label: "Temperature", format: (f) => `${f.temperatureC}°C` },
  { key: "phLevel", label: "pH", format: (f) => f.phLevel.toFixed(1) },
  { key: "areaHectares", label: "Area", format: (f) => `${f.areaHectares.toFixed(1)} ha` },
  { key: "waterConsumptionL", label: "Water", format: (f) => `${f.waterConsumptionL.toLocaleString()} L` },
  { key: "growthStage", label: "Growth Stage", format: (f) => f.growthStage },
];

export function FieldCompareDialog({
  fields,
  open,
  onOpenChange,
}: {
  fields: FieldSummary[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Field Comparison</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 font-medium"> </th>
                {fields.map((field) => (
                  <th key={field.id} className="pb-2 pl-4 font-medium text-foreground">
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.label}</td>
                  {fields.map((field) => (
                    <td key={field.id} className="py-2.5 pl-4 font-medium">
                      {row.format(field)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
