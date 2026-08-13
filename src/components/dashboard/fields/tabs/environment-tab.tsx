"use client";

import { format, parseISO } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudRain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/hooks/use-weather";
import { fieldCentroid } from "@/lib/fields-geo";
import type { FieldSummary } from "@/types";
import { ChartCard, LegendDot } from "../../analytics/analytics-shared";
import {
  CHART_ANIMATION,
  CHART_AXIS_TICK,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from "../../analytics/chart-theme";

export function EnvironmentTab({ field }: { field: FieldSummary }) {
  const [lng, lat] = fieldCentroid(field.boundary);
  const { data: weather, isLoading } = useWeather(lat, lng);

  const chartData = (weather?.forecast ?? []).map((day) => ({
    label: format(parseISO(day.date), "EEE"),
    tempMax: day.temperatureMaxC,
    tempMin: day.temperatureMinC,
    rain: day.precipitationProbabilityPct,
  }));

  return (
    <div className="space-y-4">
      <ChartCard title="Current Conditions">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : weather ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <p className="text-lg font-semibold">{weather.current.temperatureC}°C</p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <p className="text-lg font-semibold">{weather.current.humidityPct}%</p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <p className="text-lg font-semibold">{weather.today.precipitationProbabilityPct}%</p>
              <p className="text-xs text-muted-foreground">Rainfall</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 text-center">
              <p className="text-lg font-semibold">{weather.current.windSpeedKmh} km/h</p>
              <p className="text-xs text-muted-foreground">Wind</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Weather unavailable.</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/60 p-3 text-center">
            <p className="text-lg font-semibold">{field.soilMoisturePct}%</p>
            <p className="text-xs text-muted-foreground">Soil moisture</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-3 text-center">
            <p className="text-lg font-semibold">{field.phLevel.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Soil pH</p>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Temperature & Humidity"
        description="7-day forecast"
        action={
          <div className="flex gap-3">
            <LegendDot color="var(--chart-4)" label="Max °C" />
            <LegendDot color="var(--chart-1)" label="Min °C" />
          </div>
        }
      >
        {isLoading ? (
          <Skeleton className="h-[180px] w-full rounded-xl" />
        ) : chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Forecast unavailable.</p>
        ) : (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />
                <YAxis tickLine={false} axisLine={false} width={40} tick={CHART_AXIS_TICK} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                />
                <Line
                  type="monotone"
                  dataKey="tempMax"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  {...CHART_ANIMATION}
                />
                <Line
                  type="monotone"
                  dataKey="tempMin"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  {...CHART_ANIMATION}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="7-Day Forecast">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="divide-y divide-border">
            {(weather?.forecast ?? []).map((day) => (
              <div key={day.date} className="flex items-center justify-between py-2.5 text-sm">
                <span className="w-20 shrink-0 text-muted-foreground">
                  {format(parseISO(day.date), "EEE, MMM d")}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CloudRain className="h-3.5 w-3.5" />
                  {day.precipitationProbabilityPct}%
                </span>
                <span className="font-medium">
                  {day.temperatureMaxC}° / {day.temperatureMinC}°
                </span>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
