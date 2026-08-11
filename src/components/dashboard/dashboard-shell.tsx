"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { MobileSidebar, Sidebar } from "@/components/layout/sidebar";
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
  lat: 11.906,
  lng: 108.351,
  label: "Tà Nung, Đà Lạt, Lâm Đồng, Vietnam",
};

export function DashboardShell() {
  const { data: farms, isLoading: isFarmsLoading } = useFarms();
  const farm = farms?.[0];

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
      <div className="relative z-10 flex min-h-screen gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 lg:block">
          <Sidebar onOpenChat={() => setIsChatOpen(true)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <div className="glass-panel-strong flex items-center justify-between rounded-2xl px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/images/logo-farm.png"
                  alt="AgroSight logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="font-semibold">AgroSight</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>

          <main className="grid min-w-0 grid-cols-1 items-start gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
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
          </main>
        </div>
      </div>

      <MobileSidebar
        open={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <AiChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
