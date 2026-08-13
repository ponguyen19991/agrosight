"use client";

import { useState } from "react";
import { FarmMap } from "@/components/map/farm-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useField } from "@/hooks/use-fields";
import { fieldCentroid } from "@/lib/fields-geo";
import { EditFieldDialog } from "./edit-field-dialog";
import { FieldDetailHeader } from "./field-detail-header";
import { ActivityTab } from "./tabs/activity-tab";
import { EnvironmentTab } from "./tabs/environment-tab";
import { HealthTab } from "./tabs/health-tab";
import { OverviewTab } from "./tabs/overview-tab";
import { ResourcesTab } from "./tabs/resources-tab";
import { TeamTab } from "./tabs/team-tab";

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-panel flex-1 rounded-2xl px-4 py-3 text-center">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function FieldDetailView({ id }: { id: string }) {
  const { data: field, isLoading } = useField(id);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl min-w-0 flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!field) {
    return (
      <div className="mx-auto flex max-w-4xl min-w-0 flex-col items-center gap-3 py-16 text-center">
        <p className="font-medium">Field not found</p>
      </div>
    );
  }

  const [lng, lat] = fieldCentroid(field.boundary);

  return (
    <div className="mx-auto flex max-w-4xl min-w-0 flex-col gap-5">
      <FieldDetailHeader field={field} onEdit={() => setIsEditOpen(true)} />

      <FarmMap center={{ lat, lng }} fields={[field]} selectedFieldId={field.id} onSelectField={() => {}} />

      <div className="grid grid-cols-3 gap-3">
        <StatTile value={`${field.healthScore}%`} label="Health" />
        <StatTile value={`${field.soilMoisturePct}%`} label="Moisture" />
        <StatTile value={`${field.temperatureC}°C`} label="Temperature" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-10 w-full flex-wrap rounded-full bg-muted p-1 sm:w-auto">
          <TabsTrigger value="overview" className="rounded-full">
            Overview
          </TabsTrigger>
          <TabsTrigger value="health" className="rounded-full">
            Health
          </TabsTrigger>
          <TabsTrigger value="environment" className="rounded-full">
            Environment
          </TabsTrigger>
          <TabsTrigger value="resources" className="rounded-full">
            Resources
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-full">
            Activity
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-full">
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab field={field} />
        </TabsContent>
        <TabsContent value="health" className="mt-4">
          <HealthTab field={field} />
        </TabsContent>
        <TabsContent value="environment" className="mt-4">
          <EnvironmentTab field={field} />
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <ResourcesTab field={field} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityTab field={field} />
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <TeamTab field={field} />
        </TabsContent>
      </Tabs>

      <EditFieldDialog field={field} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </div>
  );
}
