"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
      <CardHeader className="flex-col items-start gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Field Monitoring Overview</p>
          <p className="text-xs text-muted-foreground">
            {visibleFields.length} of {fields.length} fields shown
            {checkedIds.size > 0 ? ` · ${checkedIds.size} selected` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <CalendarIcon className="h-3.5 w-3.5" />
                {format(selectedDate, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="end"
              side="top"
              avoidCollisions={false}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                captionLayout="dropdown"
                startMonth={new Date(2023, 0)}
                endMonth={new Date(2030, 11)}
              />
            </PopoverContent>
          </Popover>

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
              {ALL_STATUSES.map((status) => {
                const active = statusFilter.has(status);
                return (
                  <DropdownMenuItem
                    key={status}
                    className="justify-between gap-4"
                    onSelect={(event) => event.preventDefault()}
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {FIELD_STATUS_LABEL[status]}
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                );
              })}
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
      <CardContent className="min-h-[280px] pt-0">
        {isLoading ? (
          <FieldTableSkeleton />
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
                <TableHead className="text-center">Status</TableHead>
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
                  <TableCell className="text-center">
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

function FieldTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-8">
            <Skeleton className="h-4 w-4 rounded-[4px]" />
          </TableHead>
          <TableHead>Field Zone</TableHead>
          <TableHead>Crop Type</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Soil Moisture</TableHead>
          <TableHead>Temp.</TableHead>
          <TableHead>Growth Stage</TableHead>
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {[0, 1, 2, 3, 4].map((i) => (
          <TableRow key={i} className="hover:bg-transparent">
            <TableCell>
              <Skeleton className="h-4 w-4 rounded-[4px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="mx-auto h-6 w-[76px] rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
