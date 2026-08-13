"use client";

import { useRef } from "react";
import { Download, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import type { FieldSummary } from "@/types";
import { exportFieldsCsv, exportFieldsGeoJson, parseGeoJsonFile } from "./fields-export";

export function FieldsHeader({
  fields,
  onAddField,
  onImportBoundary,
}: {
  fields: FieldSummary[];
  onAddField: () => void;
  onImportBoundary: (result: { points: [number, number][]; name?: string; cropType?: string }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const result = await parseGeoJsonFile(file);
      if (!result) {
        toast({
          variant: "destructive",
          title: "Couldn't read that file",
          description: "Expected a GeoJSON Polygon or Feature.",
        });
        return;
      }
      onImportBoundary(result);
    } catch {
      toast({ variant: "destructive", title: "Invalid GeoJSON file" });
    }
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Fields</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your fields, crops, and field health.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".geojson,application/geo+json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5" disabled={fields.length === 0}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportFieldsCsv(fields)}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportFieldsGeoJson(fields)}>Export as GeoJSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" className="gap-1.5" onClick={onAddField}>
          <Plus className="h-4 w-4" />
          Add field
        </Button>
      </div>
    </div>
  );
}
