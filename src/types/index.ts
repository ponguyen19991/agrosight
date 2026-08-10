import type {
  EquipmentStatus,
  FieldStatus,
  ResourceCategory,
  ResourcePeriod,
} from "@prisma/client";

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface FieldSummary {
  id: string;
  farmId: string;
  name: string;
  cropType: string;
  status: FieldStatus;
  areaHectares: number;
  soilMoisturePct: number;
  temperatureC: number;
  growthStage: string;
  healthScore: number;
  phLevel: number;
  humidityPct: number;
  waterConsumptionL: number;
  fertilizerEfficiencyPct: number;
  equipmentStatus: EquipmentStatus;
  boundary: GeoJsonPolygon;
}

export interface ResourceAllocationSummary {
  category: ResourceCategory;
  percentage: number;
  period: ResourcePeriod;
}

export interface WeeklyPerformanceCell {
  dayOfWeek: number;
  hour: number;
  score: number;
}

export interface YieldTrendPoint {
  month: string;
  valueKg: number;
}

export interface FarmSummary {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  timezone: string;
  fieldCount: number;
  resourceAllocations: ResourceAllocationSummary[];
  weeklyPerformance: WeeklyPerformanceCell[];
  yieldTrend: YieldTrendPoint[];
}
