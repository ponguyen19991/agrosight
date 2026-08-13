"use client";

import { useState } from "react";
import { Bot, CalendarDays, Clock3, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SettingRow, SettingsCard } from "./settings-shared";

type Frequency = "realtime" | "daily" | "weekly";
type Style = "concise" | "detailed";

const FREQUENCIES: { value: Frequency; label: string; icon: React.ElementType }[] = [
  { value: "realtime", label: "Real-time", icon: Zap },
  { value: "daily", label: "Daily", icon: Clock3 },
  { value: "weekly", label: "Weekly", icon: CalendarDays },
];

const STYLES: { value: Style; label: string; description: string }[] = [
  { value: "concise", label: "Concise", description: "Short, actionable one-liners." },
  { value: "detailed", label: "Detailed", description: "Full reasoning and supporting data." },
];

export function AiPreferencesSection() {
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [style, setStyle] = useState<Style>("concise");
  const [autoInsights, setAutoInsights] = useState(true);
  const [askBeforeApplying, setAskBeforeApplying] = useState(true);

  return (
    <SettingsCard title="AI Preferences" description="How the AI assistant analyzes and speaks up.">
      <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Bot className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            AI Provider
          </p>
          <p className="text-sm font-semibold">Claude</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Insight frequency
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {FREQUENCIES.map((f) => {
            const isActive = f.value === frequency;
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFrequency(f.value)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
                  isActive
                    ? "border-primary/60 bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Recommendation style
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {STYLES.map((s) => {
            const isActive = s.value === style;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  isActive
                    ? "border-primary/60 bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        <SettingRow
          icon={Sparkles}
          label="Automatically generate field insights"
          description="AI reviews field data in the background"
          control={<Switch checked={autoInsights} onCheckedChange={setAutoInsights} />}
        />
        <SettingRow
          icon={ShieldCheck}
          label="Ask before applying recommendations"
          description="Require confirmation before AI actions take effect"
          control={<Switch checked={askBeforeApplying} onCheckedChange={setAskBeforeApplying} />}
        />
      </div>
    </SettingsCard>
  );
}
