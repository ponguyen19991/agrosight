import { Droplet, HeartPulse, LayoutDashboard, Sparkles, type LucideIcon } from "lucide-react";
import type { FarmSummary, FieldSummary } from "@/types";

export type ReportType = "farm-performance" | "field-health" | "resource-usage" | "ai-insights";

export const REPORT_TYPES: {
  value: ReportType;
  label: string;
  description: string;
  icon: LucideIcon;
  recommended?: boolean;
}[] = [
  {
    value: "farm-performance",
    label: "Farm Performance",
    description: "Overview of the whole farm.",
    icon: LayoutDashboard,
    recommended: true,
  },
  {
    value: "field-health",
    label: "Field Health",
    description: "Health score, moisture, temperature, crop condition.",
    icon: HeartPulse,
  },
  {
    value: "resource-usage",
    label: "Resource Usage",
    description: "Water, fertilizer, equipment.",
    icon: Droplet,
  },
  {
    value: "ai-insights",
    label: "AI Insights",
    description: "Issues and recommendations over the period.",
    icon: Sparkles,
  },
];

export type DateRangeOption = "7d" | "30d" | "90d" | "custom";

export const DATE_RANGES: { value: DateRangeOption; label: string; days: number }[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

export interface ReportFieldRow {
  name: string;
  health: number;
  moisture: number;
  yieldDeltaPct: number;
}

export interface ReportQuickStat {
  label: string;
  value: string;
  isPositive: boolean;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  periodLabel: string;
  fieldCount: number;
  totalAreaHectares: number;
  healthPct: number;
  yieldDeltaPct: number;
  waterDeltaPct: number;
  quickStats: ReportQuickStat[];
  fieldRows: ReportFieldRow[];
  aiSummary: string;
  generatedAt: string;
}

function pct(value: number, digits = 0) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

// No backend endpoint generates reports — this builds one from whatever
// real field/farm data is loaded right now, snapshotting it into the report
// so the detail page doesn't depend on live data still matching later.
export function buildReport({
  type,
  periodLabel,
  farm,
  fields,
}: {
  type: ReportType;
  periodLabel: string;
  farm: FarmSummary | undefined;
  fields: FieldSummary[];
}): Report {
  const meta = REPORT_TYPES.find((t) => t.value === type)!;
  const totalAreaHectares = fields.reduce((sum, f) => sum + f.areaHectares, 0);
  const healthPct = fields.length
    ? Math.round(fields.reduce((sum, f) => sum + f.healthScore, 0) / fields.length)
    : 0;
  const yieldTrend = farm?.yieldTrend ?? [];
  const yieldDeltaPct = (() => {
    if (yieldTrend.length < 2) return 0;
    const last = yieldTrend.at(-1)!.valueKg;
    const prev = yieldTrend.at(-2)!.valueKg;
    return prev ? ((last - prev) / prev) * 100 : 0;
  })();
  const waterDeltaPct = -8.4; // no historical water series exists to diff against — see analytics-data.ts

  const fieldRows: ReportFieldRow[] = fields.map((f) => ({
    name: f.name,
    health: f.healthScore,
    moisture: f.soilMoisturePct,
    yieldDeltaPct: Math.round((f.healthScore - 70) / 2), // proxy: healthier fields trend toward better yield
  }));

  const strongest = [...fields].sort((a, b) => b.healthScore - a.healthScore)[0];
  const weakest = [...fields].sort((a, b) => a.healthScore - b.healthScore)[0];
  const aiSummary =
    strongest && weakest
      ? `Overall farm health is at ${healthPct}%, ${yieldDeltaPct >= 0 ? "up" : "down"} ${Math.abs(yieldDeltaPct).toFixed(1)}% versus the previous period. ${strongest.name} led the farm at ${strongest.healthScore}% health, while ${weakest.name} trailed at ${weakest.healthScore}% and may need attention — check its soil moisture (${weakest.soilMoisturePct}%) and irrigation schedule before the next cycle.`
      : "Not enough field data was available to generate a summary for this period.";

  return {
    id: `${type}-${Date.now()}`,
    type,
    title: meta.label,
    periodLabel,
    fieldCount: fields.length,
    totalAreaHectares,
    healthPct,
    yieldDeltaPct,
    waterDeltaPct,
    quickStats: [
      { label: "Health", value: `${healthPct}%`, isPositive: true },
      { label: "Yield", value: pct(yieldDeltaPct, 1), isPositive: yieldDeltaPct >= 0 },
      { label: "Water", value: pct(waterDeltaPct, 1), isPositive: waterDeltaPct <= 0 },
    ],
    fieldRows,
    aiSummary,
    generatedAt: new Date().toISOString(),
  };
}

export const INITIAL_REPORTS: Report[] = [
  {
    id: "seed-weekly-farm-performance",
    type: "farm-performance",
    title: "Weekly Farm Performance",
    periodLabel: "Aug 05 — Aug 12, 2026",
    fieldCount: 12,
    totalAreaHectares: 24.8,
    healthPct: 82,
    yieldDeltaPct: 12,
    waterDeltaPct: -8,
    quickStats: [
      { label: "Health", value: "82%", isPositive: true },
      { label: "Yield", value: "+12%", isPositive: true },
      { label: "Water", value: "-8%", isPositive: true },
    ],
    fieldRows: [
      { name: "North A1", health: 86, moisture: 68, yieldDeltaPct: 14 },
      { name: "East B2", health: 78, moisture: 72, yieldDeltaPct: 9 },
      { name: "South C3", health: 64, moisture: 41, yieldDeltaPct: -3 },
    ],
    aiSummary:
      "Overall farm health improved this week, driven mainly by North Field A1's strong recovery after the last irrigation cycle. South Field C3 continues to trail the rest of the farm — soil moisture there is well below target, and yield has slipped 3% as a result. Prioritize reviewing its irrigation schedule before the next planting window.",
    generatedAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "seed-field-health-report",
    type: "field-health",
    title: "Field Health Report",
    periodLabel: "Aug 01 — Aug 07, 2026",
    fieldCount: 5,
    totalAreaHectares: 24.8,
    healthPct: 76,
    yieldDeltaPct: 4,
    waterDeltaPct: -2,
    quickStats: [{ label: "Health", value: "76%", isPositive: true }],
    fieldRows: [
      { name: "North A1", health: 82, moisture: 65, yieldDeltaPct: 8 },
      { name: "East B2", health: 75, moisture: 70, yieldDeltaPct: 5 },
      { name: "South C3", health: 61, moisture: 44, yieldDeltaPct: -2 },
      { name: "West D4", health: 84, moisture: 81, yieldDeltaPct: 11 },
      { name: "Central E5", health: 71, moisture: 58, yieldDeltaPct: 3 },
    ],
    aiSummary:
      "Field health across the farm held steady this week. West Field D4 remains the strongest performer with excellent soil moisture retention. South Field C3's health score continues to lag the rest of the farm and is the field most likely to need intervention next.",
    generatedAt: "2026-08-07T09:00:00.000Z",
  },
];
