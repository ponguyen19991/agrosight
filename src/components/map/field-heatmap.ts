import type { FieldSummary } from "@/types";

// Ray-casting point-in-polygon test against the field's outer ring.
function isPointInPolygon(point: [number, number], ring: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

/**
 * Synthetic soil-stress sample points inside a field's boundary, weighted by
 * how far its health score is from 100 — used to drive the heatmap layer for
 * the currently-selected field. Deterministic per field id so it doesn't
 * reshuffle on every re-render.
 */
export function buildHeatmapPoints(field: FieldSummary): GeoJSON.FeatureCollection {
  const ring = field.boundary.coordinates[0];
  const lngs = ring.map((c) => c[0]);
  const lats = ring.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const baseWeight = Math.max(0.15, (100 - field.healthScore) / 100);
  const targetCount = 22;
  const features: GeoJSON.Feature[] = [];

  let seed = 1;
  let attempts = 0;
  const seededRandom = () => {
    seed += 1;
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  while (features.length < targetCount && attempts < targetCount * 25) {
    attempts++;
    const lng = minLng + seededRandom() * (maxLng - minLng);
    const lat = minLat + seededRandom() * (maxLat - minLat);
    if (!isPointInPolygon([lng, lat], ring)) continue;

    features.push({
      type: "Feature",
      properties: { weight: baseWeight * (0.5 + seededRandom() * 0.5) },
      geometry: { type: "Point", coordinates: [lng, lat] },
    });
  }

  return { type: "FeatureCollection", features };
}

export const EMPTY_HEATMAP: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
