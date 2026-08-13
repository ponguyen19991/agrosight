"use client";

import { useMemo, useState } from "react";
import type { FieldStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import { FarmMap } from "@/components/map/farm-map";
import { AddFieldDialog, type BoundarySeed } from "./add-field-dialog";
import { FieldCompareDialog } from "./field-compare-dialog";
import { FieldListPanel } from "./field-list-panel";
import { FieldsFilters, type SortOption } from "./fields-filters";
import { FieldsHeader } from "./fields-header";
import { FieldsStats } from "./fields-stats";

export function FieldsView() {
  const { data: farms, isLoading: isFarmsLoading } = useFarms();
  const farm = farms?.[0];
  const { data: fields, isLoading: isFieldsLoading } = useFields(farm?.id);
  const fieldList = useMemo(() => fields ?? [], [fields]);
  const isLoading = isFarmsLoading || isFieldsLoading;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | FieldStatus>("all");
  const [crop, setCrop] = useState("all");
  const [sort, setSort] = useState<SortOption>("health");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [boundarySeed, setBoundarySeed] = useState<BoundarySeed | null>(null);

  const crops = useMemo(
    () => Array.from(new Set(fieldList.map((f) => f.cropType))).sort(),
    [fieldList]
  );

  const filteredFields = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = fieldList.filter((f) => {
      const matchesQuery = !q || f.name.toLowerCase().includes(q);
      const matchesStatus = status === "all" || f.status === status;
      const matchesCrop = crop === "all" || f.cropType === crop;
      return matchesQuery && matchesStatus && matchesCrop;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "area") return b.areaHectares - a.areaHectares;
      return b.healthScore - a.healthScore;
    });
  }, [fieldList, query, status, crop, sort]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const compareFields = fieldList.filter((f) => compareIds.has(f.id));

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl min-w-0 flex-col gap-5">
      <FieldsHeader
        fields={fieldList}
        onAddField={() => {
          setBoundarySeed(null);
          setIsAddOpen(true);
        }}
        onImportBoundary={(result) => {
          setBoundarySeed(result);
          setIsAddOpen(true);
        }}
      />

      <FieldsStats fields={fieldList} isLoading={isLoading} />

      <FieldsFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        crop={crop}
        onCropChange={setCrop}
        crops={crops}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
          {farm && (
            <FarmMap
              center={{ lat: farm.lat, lng: farm.lng }}
              fields={filteredFields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
            />
          )}
          <div className="glass-panel h-[420px] overflow-hidden rounded-2xl sm:h-[520px] lg:h-[650px] xl:h-[780px]">
            <FieldListPanel
              fields={filteredFields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
            />
          </div>
        </div>
      )}

      {compareIds.size > 0 && (
        <div className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
          <p className="text-sm text-muted-foreground">{compareIds.size} selected</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCompareIds(new Set())}>
              Clear
            </Button>
            <Button size="sm" disabled={compareIds.size < 2} onClick={() => setIsCompareOpen(true)}>
              Compare fields
            </Button>
          </div>
        </div>
      )}

      <FieldCompareDialog fields={compareFields} open={isCompareOpen} onOpenChange={setIsCompareOpen} />

      {farm && (
        <AddFieldDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          farmId={farm.id}
          center={{ lat: farm.lat, lng: farm.lng }}
          boundarySeed={boundarySeed}
        />
      )}
    </div>
  );
}
