"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldPopup } from "@/components/map/field-popup";
import type { FieldSummary } from "@/types";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const STATUS_FILL_COLOR: Record<string, string> = {
  HEALTHY: "#22c55e",
  STABLE: "#f59e0b",
  WARNING: "#fb923c",
  CRITICAL: "#ef4444",
};

function centroidOf(boundary: FieldSummary["boundary"]): [number, number] {
  const ring = boundary.coordinates[0] ?? [];
  const points = ring.slice(0, -1);
  const total = points.reduce(
    (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
    [0, 0]
  );
  return points.length
    ? [total[0] / points.length, total[1] / points.length]
    : [0, 0];
}

function fieldsToFeatureCollection(fields: FieldSummary[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: fields.map((field) => ({
      type: "Feature",
      properties: { id: field.id, name: field.name, status: field.status },
      geometry: field.boundary as unknown as GeoJSON.Geometry,
    })),
  };
}

interface FarmMapProps {
  center: { lat: number; lng: number };
  fields: FieldSummary[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
}

export function FarmMap({ center, fields, selectedFieldId, onSelectField }: FarmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);

  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [center.lng, center.lat],
      zoom: 14.2,
      pitch: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on("load", () => setIsStyleLoaded(true));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the search-selected location changes.
  useEffect(() => {
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: 14.2, duration: 1200 });
  }, [center.lat, center.lng]);

  // Add/update field boundary source + layers once the style is ready or fields change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleLoaded) return;

    const data = fieldsToFeatureCollection(fields);
    const existing = map.getSource("fields") as maplibregl.GeoJSONSource | undefined;

    if (existing) {
      existing.setData(data);
      return;
    }

    map.addSource("fields", { type: "geojson", data });

    map.addLayer({
      id: "fields-fill",
      type: "fill",
      source: "fields",
      paint: {
        "fill-color": [
          "match",
          ["get", "status"],
          "HEALTHY",
          STATUS_FILL_COLOR.HEALTHY,
          "STABLE",
          STATUS_FILL_COLOR.STABLE,
          "WARNING",
          STATUS_FILL_COLOR.WARNING,
          "CRITICAL",
          STATUS_FILL_COLOR.CRITICAL,
          "#22c55e",
        ],
        "fill-opacity": 0.22,
      },
    });

    map.addLayer({
      id: "fields-outline",
      type: "line",
      source: "fields",
      paint: {
        "line-color": "#f8fafc",
        "line-width": 1.5,
        "line-dasharray": [2, 2],
      },
    });

    map.on("mouseenter", "fields-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "fields-fill", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", "fields-fill", (event) => {
      const id = event.features?.[0]?.properties?.id as string | undefined;
      if (id) onSelectField(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStyleLoaded, fields]);

  // Keep the popup pinned to the selected field's centroid while the map moves.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedField) {
      setScreenPos(null);
      return;
    }

    const update = () => {
      const [lng, lat] = centroidOf(selectedField.boundary);
      const point = map.project([lng, lat]);
      setScreenPos({ x: point.x, y: point.y });
    };

    update();
    map.on("move", update);
    return () => {
      map.off("move", update);
    };
  }, [selectedField]);

  const handleExport = () => {
    const map = mapRef.current;
    if (!map) return;
    const url = map.getCanvas().toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrosight-field-map.png";
    link.click();
  };

  return (
    <div className="glass-panel-strong relative h-[580px] w-full overflow-hidden rounded-2xl">
      <div ref={containerRef} className="h-full w-full" />

      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSelectField(null)}>
              Clear selection
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: 14.2 })
              }
            >
              Recenter map
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedField && screenPos && (
        <div
          className="pointer-events-auto absolute z-20"
          style={{
            left: screenPos.x,
            top: screenPos.y,
            transform: "translate(-50%, -112%)",
          }}
        >
          <FieldPopup field={selectedField} onClose={() => onSelectField(null)} />
        </div>
      )}
    </div>
  );
}
