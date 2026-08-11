import type { FieldSummary } from "@/types";

// Standalone fixture data so <FarmMap /> is reusable/demoable on its own,
// without any database or API wiring. DashboardShell overrides this with
// real DB-backed fields via the `fields` prop.

const MOCK_CENTER = { lat: 11.906, lng: 108.351 };

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function organicPolygon(
  centerLat: number,
  centerLng: number,
  baseRadiusDeg: number,
  seed: number
) {
  const vertexCount = 9;
  const latCompression = Math.cos((centerLat * Math.PI) / 180);
  const coords: number[][] = [];

  for (let i = 0; i <= vertexCount; i++) {
    const angle = (i % vertexCount) * (360 / vertexCount) * (Math.PI / 180);
    const jitter = 0.7 + seededRandom(seed * 97 + i) * 0.6;
    const radius = baseRadiusDeg * jitter;
    const lng = centerLng + (radius * Math.cos(angle)) / latCompression;
    const lat = centerLat + radius * Math.sin(angle);
    coords.push([lng, lat]);
  }

  return { type: "Polygon" as const, coordinates: [coords] };
}

const MOCK_FIELD_INPUTS: Array<
  Omit<FieldSummary, "id" | "farmId" | "boundary"> & {
    offset: { lat: number; lng: number };
  }
> = [
  {
    name: "North Field A1",
    cropType: "Corn",
    status: "HEALTHY",
    areaHectares: 2.3,
    soilMoisturePct: 68,
    temperatureC: 26,
    growthStage: "Vegetative",
    healthScore: 70,
    phLevel: 6.4,
    humidityPct: 32,
    waterConsumptionL: 1250,
    fertilizerEfficiencyPct: 87,
    equipmentStatus: "ACTIVE",
    offset: { lat: 0.012, lng: -0.01 },
  },
  {
    name: "East Field B2",
    cropType: "Wheat",
    status: "STABLE",
    areaHectares: 3.1,
    soilMoisturePct: 72,
    temperatureC: 24,
    growthStage: "Flowering",
    healthScore: 78,
    phLevel: 6.8,
    humidityPct: 45,
    waterConsumptionL: 980,
    fertilizerEfficiencyPct: 91,
    equipmentStatus: "ACTIVE",
    offset: { lat: 0.006, lng: 0.014 },
  },
  {
    name: "South Field C3",
    cropType: "Soybean",
    status: "WARNING",
    areaHectares: 1.8,
    soilMoisturePct: 41,
    temperatureC: 29,
    growthStage: "Pod Development",
    healthScore: 52,
    phLevel: 5.9,
    humidityPct: 28,
    waterConsumptionL: 1560,
    fertilizerEfficiencyPct: 63,
    equipmentStatus: "MAINTENANCE",
    offset: { lat: -0.014, lng: -0.004 },
  },
  {
    name: "West Field D4",
    cropType: "Rice",
    status: "HEALTHY",
    areaHectares: 4.2,
    soilMoisturePct: 81,
    temperatureC: 27,
    growthStage: "Tillering",
    healthScore: 85,
    phLevel: 6.1,
    humidityPct: 55,
    waterConsumptionL: 2100,
    fertilizerEfficiencyPct: 94,
    equipmentStatus: "ACTIVE",
    offset: { lat: -0.004, lng: -0.02 },
  },
  {
    name: "Central Field E5",
    cropType: "Sugarcane",
    status: "CRITICAL",
    areaHectares: 1.4,
    soilMoisturePct: 22,
    temperatureC: 33,
    growthStage: "Germination",
    healthScore: 31,
    phLevel: 5.2,
    humidityPct: 18,
    waterConsumptionL: 640,
    fertilizerEfficiencyPct: 40,
    equipmentStatus: "OFFLINE",
    offset: { lat: -0.02, lng: 0.008 },
  },
];

export const MOCK_FIELDS: FieldSummary[] = MOCK_FIELD_INPUTS.map((input, index) => {
  const { offset, ...rest } = input;
  const centerLat = MOCK_CENTER.lat + offset.lat;
  const centerLng = MOCK_CENTER.lng + offset.lng;
  return {
    ...rest,
    id: `mock-${index}`,
    farmId: "mock-farm",
    boundary: organicPolygon(centerLat, centerLng, 0.0045, index + 1),
  };
});

export const MOCK_CENTER_LOCATION = MOCK_CENTER;
