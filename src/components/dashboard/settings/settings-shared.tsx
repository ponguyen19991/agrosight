import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingsCard({
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
    <Card className={cn("glass-panel border-0", className)}>
      <CardContent className="pt-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// A single label(+description) / control row, meant to be stacked inside a
// `divide-y` wrapper so adjacent rows pick up a separator automatically.
export function SettingRow({
  icon: Icon,
  label,
  description,
  control,
}: {
  icon?: React.ElementType;
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 mt-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
        <div>
          <p className="text-sm font-medium leading-tight">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

// Label-left / control-right row for simple key-value editable fields
// (Profile, Farm identity) — stacks on mobile instead of squeezing.
export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-1.5 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[140px_1fr] sm:gap-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}

// Two/three-way segmented pill control (Metric/Imperial, °C/°F, Dark/Light/System)
// shares the rounded-full/bg-muted styling already used by ResourceMonitoringCard's
// period tabs, so it reads as an established app pattern, not a one-off.
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: React.ElementType }[];
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
