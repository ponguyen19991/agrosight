"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { AlertTriangle, Download, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldLabel } from "@/components/map/field-label";
import { FieldPopup } from "@/components/map/field-popup";
import { buildHeatmapPoints, EMPTY_HEATMAP } from "@/components/map/field-heatmap";
import { MapControls } from "@/components/map/map-controls";
import { getMapTilerStyleUrl } from "@/components/map/map-style";
import { MOCK_FIELDS } from "@/components/map/mock-fields";
import type { FieldSummary } from "@/types";

const FIELDS_SOURCE = "fields";
const HEATMAP_SOURCE = "field-heatmap";

const STATUS_LINE_COLOR: Record<string, string> = {
  HEALTHY: "#4ade80",
  STABLE: "#fbbf24",
  WARNING: "#fb923c",
  CRITICAL: "#f87171",
};

type ScreenPos = { x: number; y: number };

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
      id: field.id,
      properties: { id: field.id, name: field.name, status: field.status },
      geometry: field.boundary as unknown as GeoJSON.Geometry,
    })),
  };
}

interface FarmMapProps {
  center: { lat: number; lng: number };
  fields?: FieldSummary[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
}

export function FarmMap({
  center,
  fields = MOCK_FIELDS,
  selectedFieldId,
  onSelectField,
}: FarmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const previousSelectedId = useRef<string | null>(null);
  const hoveredFieldRef = useRef<string | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [screenPositions, setScreenPositions] = useState<Record<string, ScreenPos>>({});

  const styleUrl = getMapTilerStyleUrl();
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;

  // Recompute every field's screen position (drives labels + the popup).
  const updateScreenPositions = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const next: Record<string, ScreenPos> = {};
    for (const field of fields) {
      const [lng, lat] = centroidOf(field.boundary);
      const point = map.project([lng, lat]);
      next[field.id] = { x: point.x, y: point.y };
    }
    setScreenPositions(next);
  }, [fields]);

  // Mount the map once we have a style URL.
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !styleUrl) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [center.lng, center.lat],
      zoom: 15,
      pitch: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    map.on("load", () => setIsMapLoaded(true));
    map.on("error", (event) => {
      setMapError(event.error?.message ?? "Failed to load the map.");
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  // Recenter when the search-selected location changes.
  useEffect(() => {
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: 15, duration: 1200 });
  }, [center.lat, center.lng]);

  // Add the field source/layers once the style is ready; keep the source's
  // data in sync whenever the field list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const data = fieldsToFeatureCollection(fields);
    const existingSource = map.getSource(FIELDS_SOURCE) as maplibregl.GeoJSONSource | undefined;

    if (existingSource) {
      existingSource.setData(data);
      updateScreenPositions();
      return;
    }

    map.addSource(FIELDS_SOURCE, { type: "geojson", data });
    map.addSource(HEATMAP_SOURCE, { type: "geojson", data: EMPTY_HEATMAP });

    // Invisible fill — kept only so clicks/hovers register over the whole
    // polygon, not just the outline. No colored overlay on the imagery.
    map.addLayer({
      id: "fields-fill",
      type: "fill",
      source: FIELDS_SOURCE,
      paint: { "fill-color": "#000000", "fill-opacity": 0 },
    });

    map.addLayer({
      id: "field-heatmap-layer",
      type: "heatmap",
      source: HEATMAP_SOURCE,
      paint: {
        "heatmap-weight": ["get", "weight"],
        "heatmap-intensity": 1.1,
        "heatmap-radius": 34,
        "heatmap-opacity": 0.75,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(0,0,0,0)",
          0.3,
          "rgba(250,204,21,0.35)",
          0.6,
          "rgba(251,146,60,0.55)",
          1,
          "rgba(239,68,68,0.75)",
        ],
      },
    });

    map.addLayer({
      id: "fields-outline",
      type: "line",
      source: FIELDS_SOURCE,
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          "#ffffff",
          [
            "match",
            ["get", "status"],
            "HEALTHY",
            STATUS_LINE_COLOR.HEALTHY,
            "STABLE",
            STATUS_LINE_COLOR.STABLE,
            "WARNING",
            STATUS_LINE_COLOR.WARNING,
            "CRITICAL",
            STATUS_LINE_COLOR.CRITICAL,
            "#ffffff",
          ],
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          3.5,
          ["boolean", ["feature-state", "hover"], false],
          3,
          1.75,
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          ["boolean", ["feature-state", "selected"], false],
          1,
          0.85,
        ],
        "line-dasharray": [2, 1.5],
      },
    });

    map.on("mousemove", "fields-fill", (event) => {
      const id = event.features?.[0]?.properties?.id as string | undefined;
      if (!id || id === hoveredFieldRef.current) return;

      if (hoveredFieldRef.current) {
        map.setFeatureState({ source: FIELDS_SOURCE, id: hoveredFieldRef.current }, { hover: false });
      }
      map.setFeatureState({ source: FIELDS_SOURCE, id }, { hover: true });
      hoveredFieldRef.current = id;
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "fields-fill", () => {
      if (hoveredFieldRef.current) {
        map.setFeatureState({ source: FIELDS_SOURCE, id: hoveredFieldRef.current }, { hover: false });
        hoveredFieldRef.current = null;
      }
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "fields-fill", (event) => {
      const id = event.features?.[0]?.properties?.id as string | undefined;
      if (id) onSelectField(id);
    });

    map.on("move", updateScreenPositions);
    updateScreenPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, fields]);

  // Mirror selectedFieldId into feature-state and refresh the heatmap layer.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    if (previousSelectedId.current) {
      map.setFeatureState({ source: FIELDS_SOURCE, id: previousSelectedId.current }, { selected: false });
    }
    if (selectedFieldId) {
      map.setFeatureState({ source: FIELDS_SOURCE, id: selectedFieldId }, { selected: true });
    }
    previousSelectedId.current = selectedFieldId;

    const heatmapSource = map.getSource(HEATMAP_SOURCE) as maplibregl.GeoJSONSource | undefined;
    heatmapSource?.setData(selectedField ? buildHeatmapPoints(selectedField) : EMPTY_HEATMAP);
  }, [selectedFieldId, selectedField, isMapLoaded]);

  const handleExport = () => {
    const map = mapRef.current;
    if (!map) return;
    const url = map.getCanvas().toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrosight-field-map.png";
    link.click();
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: 15 });
  };

  if (!styleUrl) {
    return (
      <div className="glass-panel-strong relative flex h-[780px] w-full flex-col items-center justify-center gap-2 rounded-2xl px-8 text-center">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">Satellite map unavailable</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Set <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_MAPTILER_KEY</code> in
          your <code className="rounded bg-muted px-1 py-0.5">.env</code> file with a free key
          from{" "}
          <a
            href="https://cloud.maptiler.com/account/keys/"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            maptiler.com
          </a>{" "}
          to enable the live map.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="glass-panel-strong relative h-[780px] w-full overflow-hidden rounded-2xl [&:fullscreen]:h-screen [&:fullscreen]:rounded-none"
    >
      <div ref={containerRef} className="h-full w-full" />

      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-card/60 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading map...
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card/90 px-8 text-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <p className="text-sm font-medium">Couldn&apos;t load the map</p>
          <p className="max-w-sm text-xs text-muted-foreground">{mapError}</p>
        </div>
      )}

      {isMapLoaded &&
        !mapError &&
        fields.map((field) => {
          const pos = screenPositions[field.id];
          if (!pos) return null;
          return (
            <div
              key={field.id}
              className="pointer-events-none absolute z-10"
              style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
            >
              <FieldLabel
                name={field.name}
                cropType={field.cropType}
                isActive={field.id === selectedFieldId}
                onClick={() => onSelectField(field.id)}
              />
            </div>
          );
        })}

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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMapLoaded && !mapError && (
        <MapControls mapRef={mapRef} containerRef={wrapperRef} onRecenter={handleRecenter} />
      )}

      {selectedField && screenPositions[selectedField.id] && (
        <div
          className="pointer-events-auto absolute z-20"
          style={{
            left: screenPositions[selectedField.id].x,
            top: screenPositions[selectedField.id].y,
            transform: "translate(-50%, -112%)",
          }}
        >
          <FieldPopup field={selectedField} onClose={() => onSelectField(null)} />
        </div>
      )}
    </div>
  );
}
