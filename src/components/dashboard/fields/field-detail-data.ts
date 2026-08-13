import type { FieldSummary } from "@/types";

// Deterministic (seeded, not Math.random()) so values are stable across
// re-renders — same spirit as the synthetic series in analytics-data.ts.
// The schema has no per-field historical time series for health/resources,
// only current-snapshot values, so these are anchored to the real current
// value rather than fabricated from nothing.
function seededFactor(seed: string, index: number) {
  let hash = 0;
  const s = `${seed}-${index}`;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000; // 0–1
}

export function computeHealthTrend(field: FieldSummary) {
  const days = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"];
  return days.map((label, i) => {
    if (i === days.length - 1) return { label, score: field.healthScore };
    const drift = (seededFactor(field.id, i) - 0.5) * 16;
    const score = Math.max(0, Math.min(100, Math.round(field.healthScore - (6 - i) * 0.6 + drift)));
    return { label, score };
  });
}

export function computeFieldResourceSeries(field: FieldSummary) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    day,
    water: Math.round((field.waterConsumptionL / 7) * (0.8 + seededFactor(`${field.id}-water`, i) * 0.4)),
    fertilizer: Math.round(
      (field.fertilizerEfficiencyPct / 7) * (0.8 + seededFactor(`${field.id}-fert`, i) * 0.4)
    ),
    energy: Math.round(
      ((field.waterConsumptionL * 0.015) / 7) * (0.8 + seededFactor(`${field.id}-energy`, i) * 0.4)
    ),
  }));
}

export interface FieldActivityItem {
  id: string;
  group: "Today" | "Yesterday" | "Earlier";
  time: string;
  title: string;
  detail?: string;
}

export function computeFieldActivity(field: FieldSummary): FieldActivityItem[] {
  const manager = field.assignedManagerName ?? "the field team";
  return [
    {
      id: "a1",
      group: "Today",
      time: "10:42 AM",
      title: "Irrigation completed",
      detail: `${field.waterConsumptionL.toLocaleString()} L`,
    },
    {
      id: "a2",
      group: "Today",
      time: "09:15 AM",
      title: "Field health updated",
      detail: `${Math.max(0, field.healthScore - 4)}% → ${field.healthScore}%`,
    },
    {
      id: "a3",
      group: "Yesterday",
      time: "04:20 PM",
      title: "AI recommendation reviewed",
      detail: `by ${manager}`,
    },
    {
      id: "a4",
      group: "Yesterday",
      time: "02:10 PM",
      title: "Soil observation added",
      detail: `Moisture ${field.soilMoisturePct}% · pH ${field.phLevel.toFixed(1)}`,
    },
  ];
}

export function computeAiAssessment(field: FieldSummary) {
  const issues: string[] = [];
  if (field.soilMoisturePct < 40) issues.push("Soil moisture is below the optimal range.");
  if (field.phLevel < 5.5 || field.phLevel > 7.5) issues.push("Soil pH is outside the optimal range.");
  if (field.healthScore < 60) issues.push("Crop stress indicators are elevated.");

  if (issues.length === 0) {
    return {
      isHealthy: true,
      headline: "Field is currently healthy.",
      points: [
        "Soil moisture is within the optimal range.",
        "No significant crop stress detected.",
      ],
    };
  }
  return { isHealthy: false, headline: "Field needs attention.", points: issues };
}
