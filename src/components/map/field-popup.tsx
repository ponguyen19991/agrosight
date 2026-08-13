"use client";

import { X } from "lucide-react";
import { HealthGauge } from "@/components/map/health-gauge";
import { cn } from "@/lib/utils";
import { EQUIPMENT_STATUS_DOT_CLASS, EQUIPMENT_STATUS_LABEL } from "@/lib/field-status";
import type { FieldSummary } from "@/types";

interface FieldPopupProps {
  field: FieldSummary;
  onClose: () => void;
}

export function FieldPopup({ field, onClose }: FieldPopupProps) {
  return (
    <div className="glass-panel-strong w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl p-4 text-sm shadow-2xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold leading-tight">{field.name}</p>
          <p className="text-xs text-muted-foreground">{field.cropType} Plantation</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close field details"
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <HealthGauge score={field.healthScore} size={248} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Stat value={`${field.humidityPct}%`} label="Humidity" />
        <Stat value={field.phLevel.toFixed(1)} label="Ph Level" />
        <Stat value={field.areaHectares.toFixed(1)} label="Hectare" />
      </div>

      <div className="mt-3 space-y-2 border-t border-border pt-3">
        <Row label="Water Consumption" value={`${field.waterConsumptionL.toLocaleString()}L`} />
        <Row label="Fertilizer Efficiency" value={`${field.fertilizerEfficiencyPct}%`} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Equipment Status</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                EQUIPMENT_STATUS_DOT_CLASS[field.equipmentStatus]
              )}
            />
            {EQUIPMENT_STATUS_LABEL[field.equipmentStatus]}
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-semibold">{value}</span>{" "}
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
