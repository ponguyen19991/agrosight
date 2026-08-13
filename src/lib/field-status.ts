import type { EquipmentStatus, FieldStatus } from "@prisma/client";

export const FIELD_STATUS_LABEL: Record<FieldStatus, string> = {
  HEALTHY: "Healthy",
  STABLE: "Stable",
  WARNING: "Warning",
  CRITICAL: "Critical",
};

export const FIELD_STATUS_BADGE_CLASS: Record<FieldStatus, string> = {
  HEALTHY: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  STABLE: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  WARNING: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  CRITICAL: "bg-red-500/20 text-red-600 dark:text-red-400",
};

export const FIELD_STATUS_DOT_CLASS: Record<FieldStatus, string> = {
  HEALTHY: "bg-emerald-400",
  STABLE: "bg-amber-400",
  WARNING: "bg-orange-400",
  CRITICAL: "bg-red-400",
};

export const EQUIPMENT_STATUS_LABEL: Record<EquipmentStatus, string> = {
  ACTIVE: "Active",
  MAINTENANCE: "Maintenance",
  OFFLINE: "Offline",
};

export const EQUIPMENT_STATUS_DOT_CLASS: Record<EquipmentStatus, string> = {
  ACTIVE: "bg-emerald-400",
  MAINTENANCE: "bg-amber-400",
  OFFLINE: "bg-red-400",
};

export const RESOURCE_CATEGORY_LABEL: Record<string, string> = {
  IRRIGATION_SYSTEMS: "Irrigation Systems",
  EQUIPMENT_MAINTENANCE: "Equipment Maintenance",
  CROP_NUTRITION: "Crop Nutrition",
  PEST_CONTROL: "Pest Control",
  LOGISTICS_DISTRIBUTION: "Logistics & Distribution",
};

// Ring/legend order, matching the reference mockup.
export const RESOURCE_CATEGORY_ORDER = [
  "IRRIGATION_SYSTEMS",
  "CROP_NUTRITION",
  "EQUIPMENT_MAINTENANCE",
  "PEST_CONTROL",
  "LOGISTICS_DISTRIBUTION",
] as const;

export const RESOURCE_CATEGORY_COLOR_VAR: Record<string, string> = {
  IRRIGATION_SYSTEMS: "var(--chart-1)",
  CROP_NUTRITION: "var(--chart-2)",
  EQUIPMENT_MAINTENANCE: "var(--chart-3)",
  PEST_CONTROL: "var(--chart-4)",
  LOGISTICS_DISTRIBUTION: "var(--chart-5)",
};

// Status is derived from the health score, not set directly (and never by
// AI) — thresholds chosen so 86→Healthy, 68→Stable, 52→Warning, 31→Critical.
export function deriveFieldStatus(healthScore: number): FieldStatus {
  if (healthScore >= 80) return "HEALTHY";
  if (healthScore >= 60) return "STABLE";
  if (healthScore >= 40) return "WARNING";
  return "CRITICAL";
}
