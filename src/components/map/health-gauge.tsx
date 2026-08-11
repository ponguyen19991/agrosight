"use client";

interface HealthGaugeProps {
  score: number;
  size?: number;
}

const DOT_COUNT = 34;
const RING_OFFSETS = [-1, 0, 1];

// [dark end, light end] per score tier — the filled dots sweep from the
// first color to the second along the arc, instead of a single flat color.
const GRADIENT_BY_TIER: [string, string][] = [
  ["#14532d", "#86efac"], // healthy — dark to light green
  ["#92400e", "#fcd34d"], // stable/warning — dark to light amber
  ["#7f1d1d", "#fca5a5"], // critical — dark to light red
];

function hexToRgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function lerpColor(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bChannel = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bChannel})`;
}

export function HealthGauge({ score, size = 220 }: HealthGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const height = size * 0.6;
  const cx = size / 2;
  const cy = height * 0.92;
  const baseRadius = size * 0.42;
  const ringGap = size * 0.045;
  const dotRadius = size * 0.014;

  const [darkColor, lightColor] =
    GRADIENT_BY_TIER[clamped >= 70 ? 0 : clamped >= 40 ? 1 : 2];
  const filledCount = Math.round((clamped / 100) * DOT_COUNT);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height }}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Field health score"
    >
      <svg width={size} height={height}>
        {RING_OFFSETS.map((ringOffset) => {
          const radius = baseRadius + ringOffset * ringGap;
          return Array.from({ length: DOT_COUNT }, (_, i) => {
            const angleDeg = 180 - (180 * i) / (DOT_COUNT - 1);
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = cx + radius * Math.cos(angleRad);
            const y = cy - radius * Math.sin(angleRad);
            const isFilled = i < filledCount;
            const dotColor = isFilled
              ? lerpColor(darkColor, lightColor, i / Math.max(1, filledCount - 1))
              : "none";
            return (
              <circle
                key={`${ringOffset}-${i}`}
                cx={x}
                cy={y}
                r={dotRadius}
                fill={dotColor}
                stroke={isFilled ? "none" : "currentColor"}
                strokeOpacity={isFilled ? 1 : 0.3}
              />
            );
          });
        })}
      </svg>
      <div
        className="absolute left-1/2 flex flex-col items-center text-center"
        style={{ top: "56%", transform: "translate(-50%, -50%)" }}
      >
        <span className="text-2xl font-semibold tabular-nums">{clamped}%</span>
        <span className="text-[11px] text-muted-foreground">Health Score</span>
      </div>
    </div>
  );
}
