"use client";

import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FIELD_STATUS_DOT_CLASS, FIELD_STATUS_LABEL } from "@/lib/field-status";
import { fieldDetailRoute } from "@/lib/routes";
import type { FieldSummary } from "@/types";

export function FieldListPanel({
  fields,
  selectedFieldId,
  onSelectField,
  compareIds,
  onToggleCompare,
}: {
  fields: FieldSummary[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  compareIds: Set<string>;
  onToggleCompare: (id: string) => void;
}) {
  const router = useRouter();

  if (fields.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
        No fields match your filters.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col divide-y divide-border overflow-y-auto">
      {fields.map((field) => {
        const isSelected = field.id === selectedFieldId;
        return (
          <div
            key={field.id}
            onClick={() => onSelectField(isSelected ? null : field.id)}
            onDoubleClick={() => router.push(fieldDetailRoute(field.id))}
            className={cn(
              "flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-accent/50",
              isSelected && "bg-accent"
            )}
          >
            <Checkbox
              checked={compareIds.has(field.id)}
              onCheckedChange={() => onToggleCompare(field.id)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(fieldDetailRoute(field.id));
                }}
                className="truncate text-left text-sm font-medium hover:text-primary hover:underline"
              >
                {field.name}
              </button>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {field.cropType} · {field.areaHectares.toFixed(1)} ha
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs">
                <span className={cn("h-1.5 w-1.5 rounded-full", FIELD_STATUS_DOT_CLASS[field.status])} />
                <span className="text-muted-foreground">{FIELD_STATUS_LABEL[field.status]}</span>
                <span className="text-muted-foreground">· {field.healthScore}%</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
