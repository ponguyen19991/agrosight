"use client";

import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  Moon,
  Sun,
  Wind,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

interface WeatherCardProps {
  locationLabel: string;
  lat: number;
  lng: number;
}

export function WeatherCard({ locationLabel, lat, lng }: WeatherCardProps) {
  const { data, isLoading, isError } = useWeather(lat, lng);

  const Icon = data
    ? data.current.condition === "clear" && !data.current.isDay
      ? Moon
      : CONDITION_ICON[data.current.condition]
    : Sun;

  return (
    <Card className="glass-panel border-0">
      <CardContent className="pt-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{locationLabel}</span>
        </div>

        {isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">Loading weather...</p>
        )}
        {isError && (
          <p className="mt-4 text-sm text-muted-foreground">Weather unavailable right now.</p>
        )}

        {data && (
          <>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-4xl font-semibold tabular-nums">
                {data.current.temperatureC}°C
              </span>
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1.5 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  {data.current.label}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(data.current.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <Stat icon={Droplets} label="Humidity" value={`${data.current.humidityPct}%`} />
              <Stat
                icon={CloudRain}
                label="Rain"
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
    <div>
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-1 font-medium">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
