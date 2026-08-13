"use client";

import { useState } from "react";
import { Check, CloudRain, Flame, LandPlot, Thermometer } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SegmentedControl, SettingRow, SettingsCard } from "./settings-shared";

type MapStyle = "satellite" | "satellite-labels" | "streets";

const MAP_STYLES: { value: MapStyle; label: string; preview: string }[] = [
  {
    value: "satellite",
    label: "Satellite",
    preview: "bg-[linear-gradient(155deg,#3a4a2c_0%,#5b7238_45%,#2f3b22_100%)]",
  },
  {
    value: "satellite-labels",
    label: "Satellite + Labels",
    preview: "bg-[linear-gradient(155deg,#3a4a2c_0%,#5b7238_45%,#2f3b22_100%)]",
  },
  {
    value: "streets",
    label: "Streets",
    preview: "bg-[linear-gradient(155deg,#e7ebe3_0%,#cfd9c8_50%,#b9c7ae_100%)]",
  },
];

export function MapDisplaySection() {
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite-labels");
  const [zoom, setZoom] = useState([12]);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [tempUnit, setTempUnit] = useState<"c" | "f">("c");

  return (
    <SettingsCard title="Map & Display" description="How the farm map renders by default.">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Map style
      </p>
      <RadioGroup
        value={mapStyle}
        onValueChange={(v) => setMapStyle(v as MapStyle)}
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {MAP_STYLES.map((style) => {
          const isActive = style.value === mapStyle;
          return (
            <label
              key={style.value}
              htmlFor={`map-style-${style.value}`}
              className={cn(
                "relative flex cursor-pointer flex-col gap-3 rounded-xl border p-2.5 transition-colors",
                isActive ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn("relative aspect-[4/3] w-full overflow-hidden rounded-lg", style.preview)}>
                {style.value === "satellite-labels" && (
                  <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[8px] font-medium text-white">
                    Field A1
                  </span>
                )}
                {style.value === "streets" && (
                  <>
                    <span className="absolute inset-x-0 top-1/3 h-px bg-white/60" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-white/60" />
                  </>
                )}
                {isActive && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between px-0.5 pb-0.5">
                <span className="text-xs font-medium">{style.label}</span>
                <RadioGroupItem
                  value={style.value}
                  id={`map-style-${style.value}`}
                  className="sr-only"
                />
              </div>
            </label>
          );
        })}
      </RadioGroup>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium">Default zoom</p>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums">
          {zoom[0]}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Wide
        </span>
        <Slider value={zoom} onValueChange={setZoom} min={1} max={20} step={1} />
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Close
        </span>
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        <SettingRow
          icon={LandPlot}
          label="Show field boundaries"
          description="Outline every field polygon on the map"
          control={<Switch checked={showBoundaries} onCheckedChange={setShowBoundaries} />}
        />
        <SettingRow
          icon={CloudRain}
          label="Show weather overlay"
          description="Precipitation and cloud layer over the map"
          control={<Switch checked={showWeatherOverlay} onCheckedChange={setShowWeatherOverlay} />}
        />
        <SettingRow
          icon={Flame}
          label="Show health heatmap"
          description="Highlight stressed zones on the selected field"
          control={<Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Temperature unit</span>
        </div>
        <SegmentedControl
          value={tempUnit}
          onChange={setTempUnit}
          options={[
            { value: "c", label: "°C" },
            { value: "f", label: "°F" },
          ]}
        />
      </div>
    </SettingsCard>
  );
}
