"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { AlertTriangle } from "lucide-react";
import { getMapTilerStyleUrl } from "@/components/map/map-style";

const DRAW_SOURCE = "field-boundary-draw";

function emptyFeatureCollection(): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

function buildDrawFeatureCollection(points: [number, number][]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = points.map((point) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: point },
    properties: {},
  }));

  if (points.length >= 3) {
    features.push({
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[...points, points[0]]] },
      properties: {},
    });
  } else if (points.length === 2) {
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: points },
      properties: {},
    });
  }

  return { type: "FeatureCollection", features };
}

export function FieldBoundaryDrawer({
  center,
  points,
  onPointsChange,
  isDrawing,
}: {
  center: { lat: number; lng: number };
  points: [number, number][];
  onPointsChange: (points: [number, number][]) => void;
  isDrawing: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const pointsRef = useRef(points);
  const isDrawingRef = useRef(isDrawing);
  const [isLoaded, setIsLoaded] = useState(false);

  pointsRef.current = points;
  isDrawingRef.current = isDrawing;

  const styleUrl = getMapTilerStyleUrl();

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !styleUrl) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [center.lng, center.lat],
      zoom: 16,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on("load", () => {
      map.addSource(DRAW_SOURCE, { type: "geojson", data: emptyFeatureCollection() });
      map.addLayer({
        id: "field-draw-fill",
        type: "fill",
        source: DRAW_SOURCE,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "fill-color": "#22c55e", "fill-opacity": 0.25 },
      });
      map.addLayer({
        id: "field-draw-line",
        type: "line",
        source: DRAW_SOURCE,
        filter: ["!=", ["geometry-type"], "Point"],
        paint: { "line-color": "#22c55e", "line-width": 2 },
      });
      map.addLayer({
        id: "field-draw-points",
        type: "circle",
        source: DRAW_SOURCE,
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 5,
          "circle-color": "#ffffff",
          "circle-stroke-color": "#22c55e",
          "circle-stroke-width": 2,
        },
      });
      setIsLoaded(true);
    });

    map.on("click", (event) => {
      if (!isDrawingRef.current) return;
      const next: [number, number][] = [
        ...pointsRef.current,
        [event.lngLat.lng, event.lngLat.lat],
      ];
      onPointsChange(next);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;
    const source = map.getSource(DRAW_SOURCE) as maplibregl.GeoJSONSource | undefined;
    source?.setData(buildDrawFeatureCollection(points));
  }, [points, isLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;
    map.getCanvas().style.cursor = isDrawing ? "crosshair" : "";
  }, [isDrawing, isLoaded]);

  if (!styleUrl) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl bg-muted px-6 text-center">
        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Map unavailable — set NEXT_PUBLIC_MAPTILER_KEY to draw a boundary.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-64 w-full overflow-hidden rounded-xl" />;
}
