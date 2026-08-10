"use client";

import { Droplets, FlaskConical, LandPlot, Sprout, X } from "lucide-react";
import { HealthGauge } from "@/components/map/health-gauge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EQUIPMENT_STATUS_DOT_CLASS,
  EQUIPMENT_STATUS_LABEL,
  FIELD_STATUS_BADGE_CLASS,
  FIELD_STATUS_LABEL,
} from "@/lib/field-status";
import type { FieldSummary } from "@/types";

interface FieldPopupProps {
  field: FieldSummary;
  onClose: () => void;
}

export function FieldPopup({ field, onClose }: FieldPopupProps) {
  return (
    <div className="glass-panel-strong w-[280px] rounded-2xl p-4 text-sm shadow-2xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sprout className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium leading-tight">{field.name}</p>
            <p className="text-xs text-muted-foreground">{field.cropType} Plantation</p>
          </div>
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

      <div className="mt-3 flex items-center justify-center">
        <HealthGauge score={field.healthScore} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <MiniStat icon={Droplets} label="Humidity" value={`${field.humidityPct}%`} />
        <MiniStat icon={FlaskConical} label="pH Level" value={field.phLevel.toFixed(1)} />
        <MiniStat icon={LandPlot} label="Hectare" value={field.areaHectares.toString()} />
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
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Field Status</span>
          <Badge
            variant="outline"
            className={cn("font-medium", FIELD_STATUS_BADGE_CLASS[field.status])}
          >
            {FIELD_STATUS_LABEL[field.status]}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-foreground/5 px-2 py-2">
      <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
      <p className="mt-1 text-sm font-medium">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
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
