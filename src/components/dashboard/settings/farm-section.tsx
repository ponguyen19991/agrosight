"use client";

import { useState } from "react";
import { Clock3, Coffee, LandPlot, MapPin, Ruler, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { SegmentedControl, SettingsCard } from "./settings-shared";

const CROPS = [
  { value: "coffee", label: "Coffee" },
  { value: "rice", label: "Rice" },
  { value: "corn", label: "Corn" },
  { value: "wheat", label: "Wheat" },
  { value: "grapes", label: "Grapes" },
  { value: "vegetables", label: "Vegetables" },
];

const TIMEZONES = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "UTC",
];

export function FarmSection() {
  const [farmName, setFarmName] = useState("Green Valley Farm");
  const [location, setLocation] = useState("Đà Lạt, Lâm Đồng");
  const [area, setArea] = useState("24.8");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
  const [crop, setCrop] = useState("coffee");
  const [measurement, setMeasurement] = useState<"metric" | "imperial">("metric");

  const handleSave = () => {
    toast({
      variant: "success",
      title: "Saved",
      description: "Farm settings have been updated.",
    });
  };

  return (
    <SettingsCard
      title="Farm Settings"
      description="Identity, location, and defaults for this farm."
    >
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Sprout className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <div className="flex-1 space-y-3">
          <Input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="h-11 border-0 bg-muted/60 px-3 text-lg font-semibold focus-visible:ring-1"
            aria-label="Farm name"
          />
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-9 pl-9 text-sm"
              aria-label="Farm location"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-muted/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <LandPlot className="h-3.5 w-3.5" />
            Farm area
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <Input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-8 w-16 border-0 bg-transparent p-0 text-lg font-semibold focus-visible:ring-0"
              aria-label="Farm area"
            />
            <span className="text-sm text-muted-foreground">ha</span>
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Timezone
          </div>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="mt-2 h-8 border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl bg-muted/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Coffee className="h-3.5 w-3.5" />
            Default crop
          </div>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="mt-2 h-8 border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Measurement</span>
        </div>
        <SegmentedControl
          value={measurement}
          onChange={setMeasurement}
          options={[
            { value: "metric", label: "Metric (°C, ha, L)" },
            { value: "imperial", label: "Imperial (°F, ac, gal)" },
          ]}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </SettingsCard>
  );
}
