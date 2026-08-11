"use client";

import { useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Loader2,
  LocateFixed,
  MapPin,
  Moon,
  Sun,
  Wind,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWeather } from "@/hooks/use-weather";
import type { WeatherCondition } from "@/lib/weather";

const CONDITION_ICON: Record<WeatherCondition, React.ElementType> = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

// Fixed fallback — used on first load and whenever geolocation is denied/fails.
const HO_CHI_MINH = { lat: 10.7626, lng: 106.6602, label: "Ho Chi Minh City, Vietnam" };

export function WeatherCard() {
  const [location, setLocation] = useState(HO_CHI_MINH);
  const [isLocating, setIsLocating] = useState(false);

  const { data, isLoading, isError } = useWeather(location.lat, location.lng);

  const Icon = data
    ? data.current.condition === "clear" && !data.current.isDay
      ? Moon
      : CONDITION_ICON[data.current.condition]
    : Sun;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(HO_CHI_MINH);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your Location",
        });
        setIsLocating(false);
      },
      () => {
        // Denied or failed — fall back to the fixed default.
        setLocation(HO_CHI_MINH);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <Card className="glass-panel border-0">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{location.label}</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                aria-label="Use my current location"
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
              >
                {isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="h-3.5 w-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Use my current location</TooltipContent>
          </Tooltip>
        </div>

        {isLoading && <WeatherSkeleton />}
        {isError && (
          <p className="mt-4 text-sm text-muted-foreground">Weather unavailable right now.</p>
        )}

        {data && (
          <>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-5xl font-semibold tabular-nums">
                {data.current.temperatureC}°C
              </span>
              <div className="flex flex-col items-end gap-0.5 text-right">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Icon className="h-4 w-4 text-primary" />
                  {data.current.label}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(data.current.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" | "}
                  {new Date(data.current.time).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <Stat icon={Droplets} label="Humidity" value={`${data.current.humidityPct}%`} />
              <Stat
                icon={CloudRain}
                label="Rain Forecast"
                value={`${data.today.precipitationProbabilityPct}%`}
              />
              <Stat icon={Wind} label="Wind" value={`${data.current.windSpeedKmh}km/h`} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function WeatherSkeleton() {
  return (
    <>
      <div className="mt-2 flex items-end justify-between">
        <Skeleton className="h-12 w-24" />
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl bg-muted/60 px-2 py-3">
            <Skeleton className="mx-auto h-5 w-5 rounded-full" />
            <Skeleton className="mx-auto mt-2 h-3 w-14" />
            <Skeleton className="mx-auto mt-1.5 h-4 w-10" />
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 px-2 py-3">
      <Icon className="mx-auto h-5 w-5 text-muted-foreground" />
      <p className="mt-1.5 text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
