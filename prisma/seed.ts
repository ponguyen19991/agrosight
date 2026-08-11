import {
  PrismaClient,
  FieldStatus,
  EquipmentStatus,
  ResourceCategory,
  ResourcePeriod,
} from "@prisma/client";

const prisma = new PrismaClient();

const FARM_CENTER = { lat: 11.906, lng: 108.351 };

// Deterministic pseudo-random in [0, 1), so re-running the seed always
// produces the same field shapes.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// An irregular, organic field boundary (not a rigid rectangle) — an N-sided
// polygon around a center point with a jittered radius per vertex.
function organicField(
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
    const jitter = 0.7 + seededRandom(seed * 97 + i) * 0.6; // 0.7x - 1.3x
    const radius = baseRadiusDeg * jitter;
    const lng = centerLng + (radius * Math.cos(angle)) / latCompression;
    const lat = centerLat + radius * Math.sin(angle);
    coords.push([lng, lat]);
  }

  return {
    type: "Polygon" as const,
    coordinates: [coords],
  };
}

const fieldsData = [
  {
    name: "North Field A1",
    cropType: "Corn",
    status: FieldStatus.HEALTHY,
    areaHectares: 2.3,
    soilMoisturePct: 68,
    temperatureC: 26,
    growthStage: "Vegetative",
    healthScore: 70,
    phLevel: 6.4,
    humidityPct: 32,
    waterConsumptionL: 1250,
    fertilizerEfficiencyPct: 87,
    equipmentStatus: EquipmentStatus.ACTIVE,
    offset: { lat: 0.012, lng: -0.01 },
  },
  {
    name: "East Field B2",
    cropType: "Wheat",
    status: FieldStatus.STABLE,
    areaHectares: 3.1,
    soilMoisturePct: 72,
    temperatureC: 24,
    growthStage: "Flowering",
    healthScore: 78,
    phLevel: 6.8,
    humidityPct: 45,
    waterConsumptionL: 980,
    fertilizerEfficiencyPct: 91,
    equipmentStatus: EquipmentStatus.ACTIVE,
    offset: { lat: 0.006, lng: 0.014 },
  },
  {
    name: "South Field C3",
    cropType: "Soybean",
    status: FieldStatus.WARNING,
    areaHectares: 1.8,
    soilMoisturePct: 41,
    temperatureC: 29,
    growthStage: "Pod Development",
    healthScore: 52,
    phLevel: 5.9,
    humidityPct: 28,
    waterConsumptionL: 1560,
    fertilizerEfficiencyPct: 63,
    equipmentStatus: EquipmentStatus.MAINTENANCE,
    offset: { lat: -0.014, lng: -0.004 },
  },
  {
    name: "West Field D4",
    cropType: "Rice",
    status: FieldStatus.HEALTHY,
    areaHectares: 4.2,
    soilMoisturePct: 81,
    temperatureC: 27,
    growthStage: "Tillering",
    healthScore: 85,
    phLevel: 6.1,
    humidityPct: 55,
    waterConsumptionL: 2100,
    fertilizerEfficiencyPct: 94,
    equipmentStatus: EquipmentStatus.ACTIVE,
    offset: { lat: -0.004, lng: -0.02 },
  },
  {
    name: "Central Field E5",
    cropType: "Sugarcane",
    status: FieldStatus.CRITICAL,
    areaHectares: 1.4,
    soilMoisturePct: 22,
    temperatureC: 33,
    growthStage: "Germination",
    healthScore: 31,
    phLevel: 5.2,
    humidityPct: 18,
    waterConsumptionL: 640,
    fertilizerEfficiencyPct: 40,
    equipmentStatus: EquipmentStatus.OFFLINE,
    offset: { lat: -0.02, lng: 0.008 },
  },
];

const resourceAllocationsByPeriod: Record<
  "WEEK" | "MONTH" | "YEAR",
  { category: ResourceCategory; percentage: number }[]
> = {
  WEEK: [
    { category: ResourceCategory.IRRIGATION_SYSTEMS, percentage: 30 },
    { category: ResourceCategory.EQUIPMENT_MAINTENANCE, percentage: 20 },
    { category: ResourceCategory.CROP_NUTRITION, percentage: 25 },
    { category: ResourceCategory.PEST_CONTROL, percentage: 15 },
    { category: ResourceCategory.LOGISTICS_DISTRIBUTION, percentage: 10 },
  ],
  MONTH: [
    { category: ResourceCategory.IRRIGATION_SYSTEMS, percentage: 34 },
    { category: ResourceCategory.EQUIPMENT_MAINTENANCE, percentage: 18 },
    { category: ResourceCategory.CROP_NUTRITION, percentage: 24 },
    { category: ResourceCategory.PEST_CONTROL, percentage: 12 },
    { category: ResourceCategory.LOGISTICS_DISTRIBUTION, percentage: 12 },
  ],
  YEAR: [
    { category: ResourceCategory.IRRIGATION_SYSTEMS, percentage: 28 },
    { category: ResourceCategory.EQUIPMENT_MAINTENANCE, percentage: 24 },
    { category: ResourceCategory.CROP_NUTRITION, percentage: 22 },
    { category: ResourceCategory.PEST_CONTROL, percentage: 14 },
    { category: ResourceCategory.LOGISTICS_DISTRIBUTION, percentage: 12 },
  ],
};

const PERFORMANCE_HOURS = [13, 14, 15, 16, 17, 18];

async function main() {
  await prisma.performanceLog.deleteMany();
  await prisma.yieldRecord.deleteMany();
  await prisma.resourceAllocation.deleteMany();
  await prisma.field.deleteMany();
  await prisma.farm.deleteMany();

  const farm = await prisma.farm.create({
    data: {
      name: "AgroSight Demo Farm",
      address: "Tà Nung, Đà Lạt, Lâm Đồng, Vietnam",
      lat: FARM_CENTER.lat,
      lng: FARM_CENTER.lng,
      timezone: "Asia/Ho_Chi_Minh",
      resourceAllocations: {
        create: (Object.entries(resourceAllocationsByPeriod) as [
          keyof typeof resourceAllocationsByPeriod,
          { category: ResourceCategory; percentage: number }[],
        ][]).flatMap(([period, allocations]) =>
          allocations.map((allocation) => ({
            ...allocation,
            period: ResourcePeriod[period],
          }))
        ),
      },
    },
  });

  for (const [fieldIndex, data] of fieldsData.entries()) {
    const centerLat = FARM_CENTER.lat + data.offset.lat;
    const centerLng = FARM_CENTER.lng + data.offset.lng;

    const field = await prisma.field.create({
      data: {
        farmId: farm.id,
        name: data.name,
        cropType: data.cropType,
        status: data.status,
        areaHectares: data.areaHectares,
        soilMoisturePct: data.soilMoisturePct,
        temperatureC: data.temperatureC,
        growthStage: data.growthStage,
        healthScore: data.healthScore,
        phLevel: data.phLevel,
        humidityPct: data.humidityPct,
        waterConsumptionL: data.waterConsumptionL,
        fertilizerEfficiencyPct: data.fertilizerEfficiencyPct,
        equipmentStatus: data.equipmentStatus,
        boundary: organicField(centerLat, centerLng, 0.0045, fieldIndex + 1),
      },
    });

    const performanceLogs = [];
    for (let day = 0; day < 7; day++) {
      for (const hour of PERFORMANCE_HOURS) {
        const wave = Math.sin((day + fieldIndex) * 0.9) * 20;
        const hourBoost = (hour - 13) * 4;
        const base = data.healthScore - 15 + wave + hourBoost;
        const score = Math.max(5, Math.min(100, Math.round(base)));
        performanceLogs.push({ fieldId: field.id, dayOfWeek: day, hour, score });
      }
    }
    await prisma.performanceLog.createMany({ data: performanceLogs });

    const yieldRecords = [];
    const now = new Date();
    for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      const growth = (5 - monthsAgo) * (data.healthScore / 20);
      const valueKg = Math.round(400 + fieldIndex * 60 + growth * 18);
      yieldRecords.push({ fieldId: field.id, date, cropType: data.cropType, valueKg });
    }
    await prisma.yieldRecord.createMany({ data: yieldRecords });
  }

  console.log(`Seeded farm "${farm.name}" with ${fieldsData.length} fields.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
