import type { GeoJsonPolygon } from "@/types";

const EARTH_RADIUS_M = 6371000;

// Field boundaries are small (a few hectares), so projecting to meters via
// a local equirectangular approximation (centered on the polygon's mean
// latitude) before applying the planar shoelace formula is accurate enough
// — no need for full spherical-excess math at this scale.
export function polygonAreaHectares(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const meanLat = points.reduce((sum, [, lat]) => sum + lat, 0) / points.length;
  const meanLatRad = (meanLat * Math.PI) / 180;

  const projected = points.map(([lng, lat]): [number, number] => [
    ((lng * Math.PI) / 180) * EARTH_RADIUS_M * Math.cos(meanLatRad),
    ((lat * Math.PI) / 180) * EARTH_RADIUS_M,
  ]);

  let area = 0;
  for (let i = 0; i < projected.length; i++) {
    const [x1, y1] = projected[i];
    const [x2, y2] = projected[(i + 1) % projected.length];
    area += x1 * y2 - x2 * y1;
  }
  const hectares = Math.abs(area / 2) / 10000; // m² → hectares
  return Math.round(hectares * 100) / 100; // avoid ugly float noise (e.g. 2.7669470703125)
}

export function polygonCentroid(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0];
  const total = points.reduce((acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat], [0, 0]);
  return [total[0] / points.length, total[1] / points.length];
}

export function fieldCentroid(boundary: GeoJsonPolygon): [number, number] {
  const ring = boundary.coordinates[0] ?? [];
  const points = ring.slice(0, -1) as [number, number][];
  return polygonCentroid(points);
}

// Closes the ring (GeoJSON polygons repeat the first point as the last).
export function pointsToPolygon(points: [number, number][]): GeoJsonPolygon {
  const ring = points.length > 0 ? [...points, points[0]] : [];
  return { type: "Polygon", coordinates: [ring] };
}
