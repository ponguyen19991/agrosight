import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("glass-panel flex h-full flex-col border-0", className)}>
      <CardContent className="flex flex-1 flex-col pt-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium">{title}</p>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      </CardContent>
    </Card>
  );
}

// Minimal pill filter — same rounded-full/bg-muted language as the rest of
// the dashboard (ResourceMonitoringCard's period tabs), reused here for
// chart-level time range / metric toggles.
export function PillGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// Small colored-dot legend swatch, matching ResourceMonitoringCard's
// hand-rolled legend instead of Recharts' heavier built-in <Legend>.
export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
