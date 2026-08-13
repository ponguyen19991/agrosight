"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FIELD_STATUS_LABEL } from "@/lib/field-status";
import type { FieldStatus } from "@prisma/client";

export type SortOption = "health" | "name" | "area";

const STATUS_PILLS: { value: "all" | FieldStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "HEALTHY", label: FIELD_STATUS_LABEL.HEALTHY },
  { value: "STABLE", label: FIELD_STATUS_LABEL.STABLE },
  { value: "WARNING", label: FIELD_STATUS_LABEL.WARNING },
  { value: "CRITICAL", label: FIELD_STATUS_LABEL.CRITICAL },
];

export function FieldsFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  crop,
  onCropChange,
  crops,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  status: "all" | FieldStatus;
  onStatusChange: (v: "all" | FieldStatus) => void;
  crop: string;
  onCropChange: (v: string) => void;
  crops: string[];
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search fields..."
          className="h-10 rounded-full pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {STATUS_PILLS.map((pill) => {
            const isActive = pill.value === status;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => onStatusChange(pill.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={crop} onValueChange={onCropChange}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {crops.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Sort: Health</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="area">Sort: Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
