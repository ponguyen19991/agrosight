"use client";

import { useEffect, useState } from "react";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { TopBar } from "@/components/layout/top-bar";
import { FarmMap } from "@/components/map/farm-map";
import { FieldTable } from "@/components/dashboard/field-table";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { ResourceMonitoringCard } from "@/components/dashboard/resource-monitoring-card";
import { WeeklyPerformanceCard } from "@/components/dashboard/weekly-performance-card";
import { YieldTrendCard } from "@/components/dashboard/yield-trend-card";
import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import type { GeocodeResult } from "@/lib/geocode";

const DEFAULT_LOCATION = {
  lat: 11.906,
  lng: 108.351,
  label: "Tà Nung, Đà Lạt, Lâm Đồng, Vietnam",
};

export function DashboardShell() {
  const { data: farms, isLoading: isFarmsLoading } = useFarms();
  const farm = farms?.[0];

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [hasManualLocation, setHasManualLocation] = useState(false);

  const { data: fields, isLoading: isFieldsLoading } = useFields(farm?.id);

  useEffect(() => {
    if (farm && !hasManualLocation) {
      setLocation({ lat: farm.lat, lng: farm.lng, label: farm.address });
    }
  }, [farm, hasManualLocation]);

  const handleSelectLocation = (result: GeocodeResult) => {
    setHasManualLocation(true);
    setLocation({
      lat: result.lat,
      lng: result.lng,
      label: `${result.name}, ${result.country}`,
    });
  };

  return (
    <DashboardPageShell>
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <FarmMap
            center={location}
            fields={fields ?? []}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
          <FieldTable
            fields={fields ?? []}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            isLoading={isFarmsLoading || isFieldsLoading}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <TopBar onSelectLocation={handleSelectLocation} />
          <WeatherCard />
          <ResourceMonitoringCard
            allocations={farm?.resourceAllocations ?? []}
            isLoading={isFarmsLoading}
          />
          <WeeklyPerformanceCard
            cells={farm?.weeklyPerformance ?? []}
            isLoading={isFarmsLoading}
          />
          <YieldTrendCard points={farm?.yieldTrend ?? []} isLoading={isFarmsLoading} />
        </div>
      </div>
    </DashboardPageShell>
  );
}
