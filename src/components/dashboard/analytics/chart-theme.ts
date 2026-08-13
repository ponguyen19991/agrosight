// Shared Recharts styling for the Analytics page — deliberately not the
// library defaults: hairline grid, no axis lines, dark-glass tooltip, dots
// only on hover, minimal legends. Every analytics chart imports from here
// so the whole page reads as one system instead of six one-off charts.
import type { CSSProperties } from "react";

export const CHART_GRID_STROKE = "oklch(var(--foreground) / 6%)";

export const CHART_AXIS_TICK = {
  fill: "oklch(var(--muted-foreground))",
  fontSize: 11,
};

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: "oklch(var(--popover) / 90%)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: 12,
  color: "oklch(var(--popover-foreground))",
  boxShadow: "0 8px 24px oklch(0 0 0 / 20%)",
};

export const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "oklch(var(--popover-foreground))",
  fontWeight: 600,
  marginBottom: 2,
};

export const CHART_TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "oklch(var(--muted-foreground))",
  padding: 0,
};

export const CHART_ANIMATION = {
  isAnimationActive: true,
  animationDuration: 400,
  animationEasing: "ease-out" as const,
};

// Semantic 3-tier colors for analytics visualizations (deltas, thresholds).
// `field-status.ts` has 4-tier status colors for badges elsewhere in the
// app — these are the chart-specific equivalents, kept here since nothing
// else needs a generic positive/warning/critical map yet.
export const CHART_POSITIVE = "oklch(var(--primary))";
export const CHART_WARNING = "#f59e0b";
export const CHART_CRITICAL = "oklch(var(--destructive))";

export const CHART_ACTIVE_DOT = {
  r: 4,
  strokeWidth: 2,
  stroke: "oklch(var(--card))",
};
