"use client";

import { Bell, Bot, Map, Palette, Sprout, TriangleAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSectionId =
  | "profile"
  | "farm"
  | "notifications"
  | "map"
  | "ai"
  | "appearance"
  | "danger";

const NAV_ITEMS: { id: SettingsSectionId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "farm", label: "Farm", icon: Sprout },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "map", label: "Map & Display", icon: Map },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export function SettingsNav({
  active,
  onSelect,
}: {
  active: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
}) {
  return (
    <nav className="glass-panel flex flex-row gap-1 overflow-x-auto rounded-2xl p-2 lg:sticky lg:top-4 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full",
              isActive
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </button>
        );
      })}

      <div className="my-1 hidden h-px bg-border lg:block" />

      <button
        type="button"
        onClick={() => onSelect("danger")}
        className={cn(
          "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full",
          active === "danger"
            ? "bg-destructive/10 text-destructive"
            : "text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
        )}
      >
        <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        Danger Zone
      </button>
    </nav>
  );
}
