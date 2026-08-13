import type { FarmSummary, FieldSummary } from "@/types";

export function computeTrendDeltaPct(values: number[]): number | null {
  if (values.length < 2) return null;
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (prev === 0) return null;
  return ((last - prev) / prev) * 100;
}

export function computeHeaderStats(farm: FarmSummary | undefined, fields: FieldSummary[]) {
  const totalArea = fields.reduce((sum, f) => sum + f.areaHectares, 0);
  const avgHealth = fields.length
    ? Math.round(fields.reduce((sum, f) => sum + f.healthScore, 0) / fields.length)
    : 0;
  const totalWater = fields.reduce((sum, f) => sum + f.waterConsumptionL, 0);
  const yieldDeltaPct = computeTrendDeltaPct((farm?.yieldTrend ?? []).map((p) => p.valueKg));

  return { totalArea, avgHealth, totalWater, yieldDeltaPct };
}

export function computeCropDistribution(fields: FieldSummary[]) {
  const totals = new Map<string, number>();
  for (const field of fields) {
    totals.set(field.cropType, (totals.get(field.cropType) ?? 0) + field.areaHectares);
  }
  const totalArea = fields.reduce((sum, f) => sum + f.areaHectares, 0);

  return Array.from(totals.entries())
    .map(([cropType, area]) => ({
      cropType,
      area,
      percentage: totalArea ? (area / totalArea) * 100 : 0,
    }))
    .sort((a, b) => b.area - a.area);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Deterministic (not Math.random()) pseudo-fluctuation so values are stable
// across re-renders instead of jumping every time the component updates.
function seededFactor(seed: string, index: number) {
  let hash = 0;
  const s = `${seed}-${index}`;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return 0.8 + ((hash % 1000) / 1000) * 0.4; // 0.8–1.2x fluctuation
}

// The schema only stores current-snapshot water/fertilizer values on Field —
// there's no daily history table for water, fertilizer, or (nonexistent)
// energy usage. This derives a stable weekday series anchored to the real
// current totals, same spirit as the organic field-boundary/heatmap
// synthesis used elsewhere in the app, rather than fabricating numbers with
// no relationship to real data.
export function computeResourceUsageSeries(fields: FieldSummary[]) {
  const totalWaterL = fields.reduce((sum, f) => sum + f.waterConsumptionL, 0);
  const avgFertilizerEfficiencyPct = fields.length
    ? fields.reduce((sum, f) => sum + f.fertilizerEfficiencyPct, 0) / fields.length
    : 0;
  const fertilizerAnchor = totalWaterL * (avgFertilizerEfficiencyPct / 100) * 0.6;
  const energyAnchor = totalWaterL * 0.45;

  return WEEKDAYS.map((day, i) => ({
    day,
    water: Math.round((totalWaterL / 5) * seededFactor("water", i)),
    fertilizer: Math.round((fertilizerAnchor / 5) * seededFactor("fertilizer", i)),
    energy: Math.round((energyAnchor / 5) * seededFactor("energy", i)),
  }));
}

export type YieldPeriod = "7d" | "30d" | "6m" | "1y";

export function filterYieldTrend(
  points: FarmSummary["yieldTrend"],
  period: YieldPeriod
) {
  const trailingMonths: Record<YieldPeriod, number> = {
    "7d": 1,
    "30d": 2,
    "6m": 6,
    "1y": 12,
  };
  const count = trailingMonths[period];
  return points.slice(Math.max(0, points.length - count));
}

// No per-field yield-trend endpoint exists yet (YieldRecord has fieldId in
// the schema, but /api/farms only exposes the farm-level rollup) — scaling
// the farm aggregate by a field's share of total area is a reasonable,
// real-data-anchored approximation rather than a fabricated curve.
export function scaleYieldTrendForField(
  points: FarmSummary["yieldTrend"],
  field: FieldSummary,
  totalAreaHectares: number
) {
  if (!totalAreaHectares) return points;
  const share = field.areaHectares / totalAreaHectares;
  return points.map((p) => ({ ...p, valueKg: Math.round(p.valueKg * share) }));
}
