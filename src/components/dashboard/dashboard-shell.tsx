"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { FarmMap } from "@/components/map/farm-map";
import { FieldTable } from "@/components/dashboard/field-table";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { ResourceMonitoringCard } from "@/components/dashboard/resource-monitoring-card";
import { WeeklyPerformanceCard } from "@/components/dashboard/weekly-performance-card";
import { YieldTrendCard } from "@/components/dashboard/yield-trend-card";
import { AiChatPanel } from "@/components/dashboard/ai-chat-panel";
import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import type { GeocodeResult } from "@/lib/geocode";

const DEFAULT_LOCATION = {
  lat: -7.4298,
  lng: 109.234,
  label: "Purwokerto, Central Java, Indonesia",
};

export function DashboardShell() {
  const { data: farms, isLoading: isFarmsLoading } = useFarms();
  const farm = farms?.[0];

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    <div className="farm-backdrop relative min-h-screen w-full">
      <div className="relative z-10 flex h-screen gap-4 p-4">
        <Sidebar onOpenChat={() => setIsChatOpen(true)} />

        <main className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_400px] gap-4">
          <div className="flex min-w-0 flex-col gap-4 overflow-y-auto pr-1">
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
              isLoading={isFieldsLoading}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-4 overflow-y-auto pb-1 pl-1 pr-1">
            <TopBar onSelectLocation={handleSelectLocation} />
            <WeatherCard locationLabel={location.label} lat={location.lat} lng={location.lng} />
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
        </main>
      </div>

      <AiChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
