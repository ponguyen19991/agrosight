import type { EquipmentStatus, FieldStatus } from "@prisma/client";

export const FIELD_STATUS_LABEL: Record<FieldStatus, string> = {
  HEALTHY: "Healthy",
  STABLE: "Stable",
  WARNING: "Warning",
  CRITICAL: "Critical",
};

// Neutral black/white chip — same treatment for every status so it stays
// consistent with the app's monochrome + single-accent (green) theme;
// the label text is what differentiates status, not a rainbow of hues.
const FIELD_STATUS_CHIP = "bg-foreground/10 text-foreground";

export const FIELD_STATUS_BADGE_CLASS: Record<FieldStatus, string> = {
  HEALTHY: FIELD_STATUS_CHIP,
  STABLE: FIELD_STATUS_CHIP,
  WARNING: FIELD_STATUS_CHIP,
  CRITICAL: FIELD_STATUS_CHIP,
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

// Fixed categorical order — validated CVD-safe adjacency, mirrors the
// --chart-1..5 tokens in globals.css. Never reorder without re-validating.
export const RESOURCE_CATEGORY_ORDER = [
  "IRRIGATION_SYSTEMS",
  "EQUIPMENT_MAINTENANCE",
  "CROP_NUTRITION",
  "PEST_CONTROL",
  "LOGISTICS_DISTRIBUTION",
] as const;

export const RESOURCE_CATEGORY_COLOR_VAR: Record<string, string> = {
  IRRIGATION_SYSTEMS: "var(--chart-1)",
  EQUIPMENT_MAINTENANCE: "var(--chart-2)",
  CROP_NUTRITION: "var(--chart-3)",
  PEST_CONTROL: "var(--chart-4)",
  LOGISTICS_DISTRIBUTION: "var(--chart-5)",
};
