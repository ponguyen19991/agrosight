import type { FieldSummary } from "@/types";

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const CSV_COLUMNS: { key: keyof FieldSummary; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "cropType", label: "Crop" },
  { key: "status", label: "Status" },
  { key: "areaHectares", label: "Area (ha)" },
  { key: "healthScore", label: "Health (%)" },
  { key: "soilMoisturePct", label: "Soil Moisture (%)" },
  { key: "growthStage", label: "Growth Stage" },
];

export function exportFieldsCsv(fields: FieldSummary[]) {
  const header = CSV_COLUMNS.map((c) => c.label).join(",");
  const rows = fields.map((field) =>
    CSV_COLUMNS.map((c) => {
      const value = field[c.key];
      const str = String(value ?? "");
      return str.includes(",") ? `"${str}"` : str;
    }).join(",")
  );
  downloadBlob([header, ...rows].join("\n"), "fields.csv", "text/csv;charset=utf-8");
}

export function exportFieldsGeoJson(fields: FieldSummary[]) {
  const featureCollection = {
    type: "FeatureCollection" as const,
    features: fields.map((field) => ({
      type: "Feature" as const,
      properties: {
        name: field.name,
        cropType: field.cropType,
        status: field.status,
        areaHectares: field.areaHectares,
        healthScore: field.healthScore,
      },
      geometry: field.boundary,
    })),
  };
  downloadBlob(JSON.stringify(featureCollection, null, 2), "fields.geojson", "application/geo+json");
}

// Reads a .geojson file and returns the first Polygon feature's ring
// (as [lng, lat] points) plus a suggested name — used by the Import button
// to prefill the Add Field wizard instead of drawing from scratch.
export async function parseGeoJsonFile(
  file: File
): Promise<{ points: [number, number][]; name?: string; cropType?: string } | null> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const feature =
    parsed.type === "FeatureCollection" ? parsed.features?.[0] : parsed.type === "Feature" ? parsed : null;
  const geometry = feature?.geometry ?? (parsed.type === "Polygon" ? parsed : null);
  if (!geometry || geometry.type !== "Polygon") return null;

  const ring = geometry.coordinates?.[0] as [number, number][] | undefined;
  if (!ring || ring.length < 3) return null;

  const points = ring.slice(0, -1);
  return {
    points,
    name: feature?.properties?.name,
    cropType: feature?.properties?.cropType,
  };
}
