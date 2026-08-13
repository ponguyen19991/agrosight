"use client";

import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import { AiInsightsCard } from "./ai-insights-card";
import { AnalyticsHeader } from "./analytics-header";
import { CropDistributionChart } from "./crop-distribution-chart";
import { FieldHealthChart } from "./field-health-chart";
import { ResourceUsageChart } from "./resource-usage-chart";
import { YieldPerformanceChart } from "./yield-performance-chart";

export function AnalyticsView() {
  const { data: farms, isLoading: isFarmsLoading } = useFarms();
  const farm = farms?.[0];
  const { data: fields, isLoading: isFieldsLoading } = useFields(farm?.id);

  const isLoading = isFarmsLoading || isFieldsLoading;
  const fieldList = fields ?? [];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl min-w-0 flex-col gap-4">
      <AnalyticsHeader farm={farm} fields={fieldList} isLoading={isLoading} />

      <YieldPerformanceChart farm={farm} fields={fieldList} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <FieldHealthChart fields={fieldList} isLoading={isLoading} />
        <ResourceUsageChart fields={fieldList} isLoading={isLoading} />
        <div className="lg:col-span-2 xl:col-span-1">
          <CropDistributionChart fields={fieldList} isLoading={isLoading} />
        </div>
      </div>

      <AiInsightsCard fields={fieldList} isLoading={isLoading} />
    </div>
  );
}
