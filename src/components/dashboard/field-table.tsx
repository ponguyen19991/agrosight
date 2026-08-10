"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Filter,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FIELD_STATUS_BADGE_CLASS, FIELD_STATUS_LABEL } from "@/lib/field-status";
import type { FieldSummary } from "@/types";
import type { FieldStatus } from "@prisma/client";

const ALL_STATUSES = Object.keys(FIELD_STATUS_LABEL) as FieldStatus[];

interface FieldTableProps {
  fields: FieldSummary[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  isLoading?: boolean;
}

function toCsv(fields: FieldSummary[]) {
  const header = [
    "Field Zone",
    "Crop Type",
    "Status",
    "Soil Moisture (%)",
    "Temp (C)",
    "Growth Stage",
  ];
  const rows = fields.map((f) => [
    f.name,
    f.cropType,
    FIELD_STATUS_LABEL[f.status],
    f.soilMoisturePct,
    f.temperatureC,
    f.growthStage,
  ]);
  return [header, ...rows].map((row) => row.join(",")).join("\n");
}

export function FieldTable({
  fields,
  selectedFieldId,
  onSelectField,
  isLoading,
}: FieldTableProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<Set<FieldStatus>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const visibleFields = useMemo(
    () =>
      statusFilter.size === 0
        ? fields
        : fields.filter((field) => statusFilter.has(field.status)),
    [fields, statusFilter]
  );

  const allChecked = visibleFields.length > 0 && checkedIds.size === visibleFields.length;
  const someChecked = checkedIds.size > 0 && !allChecked;

  const toggleAll = () => {
    setCheckedIds(allChecked ? new Set() : new Set(visibleFields.map((f) => f.id)));
  };

  const toggleRow = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStatusFilter = (status: FieldStatus) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const handleExportCsv = () => {
    const rows = checkedIds.size > 0 ? visibleFields.filter((f) => checkedIds.has(f.id)) : visibleFields;
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrosight-fields.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <Card className="glass-panel border-0">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <p className="font-medium">Field Monitoring Overview</p>
          <p className="text-xs text-muted-foreground">
            {visibleFields.length} of {fields.length} fields shown
            {checkedIds.size > 0 ? ` · ${checkedIds.size} selected` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="text-xs">
            {monthLabel}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className={cn("gap-1.5 text-xs", statusFilter.size > 0 && "text-primary")}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter{statusFilter.size > 0 ? ` (${statusFilter.size})` : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.has(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {FIELD_STATUS_LABEL[status]}
                </DropdownMenuCheckboxItem>
              ))}
              {statusFilter.size > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(new Set())}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleAll} disabled={visibleFields.length === 0}>
                {allChecked ? (
                  <CheckSquare className="h-3.5 w-3.5" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
                {allChecked ? "Clear selection" : "Select all"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCsv} disabled={visibleFields.length === 0}>
                <Download className="h-3.5 w-3.5" />
                Export {checkedIds.size > 0 ? "selected" : "all"} to CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => queryClient.invalidateQueries({ queryKey: ["fields"] })}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading fields...</p>
        ) : fields.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No fields yet — run the seed script to populate demo data.
          </p>
        ) : visibleFields.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No fields match the selected filter.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8">
                  <Checkbox
                    checked={someChecked ? "indeterminate" : allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all fields"
                  />
                </TableHead>
                <TableHead>Field Zone</TableHead>
                <TableHead>Crop Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Soil Moisture</TableHead>
                <TableHead>Temp.</TableHead>
                <TableHead>Growth Stage</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleFields.map((field) => (
                <TableRow
                  key={field.id}
                  onClick={() => onSelectField(field.id)}
                  className={cn(
                    "cursor-pointer",
                    selectedFieldId === field.id && "bg-accent/60"
                  )}
                >
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={checkedIds.has(field.id)}
                      onCheckedChange={() => toggleRow(field.id)}
                      aria-label={`Select ${field.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell className="text-muted-foreground">{field.cropType}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "min-w-[76px] justify-center rounded-full border-transparent text-center font-medium",
                        FIELD_STATUS_BADGE_CLASS[field.status]
                      )}
                    >
                      {FIELD_STATUS_LABEL[field.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {field.soilMoisturePct}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">{field.temperatureC}°C</TableCell>
                  <TableCell className="text-muted-foreground">{field.growthStage}</TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectField(field.id)}>
                          <MapPin className="h-3.5 w-3.5" />
                          View on map
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyId(field.id)}>
                          <Copy className="h-3.5 w-3.5" />
                          Copy field ID
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
