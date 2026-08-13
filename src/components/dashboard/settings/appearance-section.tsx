"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, PanelLeft, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SettingRow, SettingsCard } from "./settings-shared";

const ACCENTS = [
  { value: "green", label: "Green", swatch: "bg-[oklch(0.6_0.15_145)]" },
  { value: "blue", label: "Blue", swatch: "bg-[oklch(0.6_0.15_255)]" },
  { value: "amber", label: "Amber", swatch: "bg-[#e0940a]" },
] as const;

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accent, setAccent] = useState<(typeof ACCENTS)[number]["value"]>("green");
  const [compactSidebar, setCompactSidebar] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeOptions = [
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <SettingsCard title="Appearance" description="Theme and layout preferences.">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Theme
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {themeOptions.map((option) => {
          const isActive = mounted && theme === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                isActive ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")}
                strokeWidth={1.75}
              />
              <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Accent
      </p>
      <div className="mt-3 flex items-center gap-3">
        {ACCENTS.map((a) => {
          const isActive = a.value === accent;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => setAccent(a.value)}
              aria-label={a.label}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card transition-shadow",
                  a.swatch,
                  isActive ? "ring-primary" : "ring-transparent"
                )}
              >
                {isActive && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
              </span>
              <span className="text-[11px] text-muted-foreground">{a.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-border">
        <SettingRow
          icon={PanelLeft}
          label="Compact sidebar"
          description="Shrink the sidebar icon rail"
          control={<Switch checked={compactSidebar} onCheckedChange={setCompactSidebar} />}
        />
      </div>
    </SettingsCard>
  );
}
