-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('HEALTHY', 'STABLE', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('IRRIGATION_SYSTEMS', 'CROP_NUTRITION', 'EQUIPMENT_MAINTENANCE', 'PEST_CONTROL', 'LOGISTICS_DISTRIBUTION');

-- CreateEnum
CREATE TYPE "ResourcePeriod" AS ENUM ('WEEK', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'auto',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "areaHectares" DOUBLE PRECISION NOT NULL,
    "status" "FieldStatus" NOT NULL DEFAULT 'HEALTHY',
    "soilMoisturePct" DOUBLE PRECISION NOT NULL,
    "temperatureC" DOUBLE PRECISION NOT NULL,
    "growthStage" TEXT NOT NULL,
    "healthScore" INTEGER NOT NULL,
    "phLevel" DOUBLE PRECISION NOT NULL,
    "humidityPct" DOUBLE PRECISION NOT NULL,
    "waterConsumptionL" DOUBLE PRECISION NOT NULL,
    "fertilizerEfficiencyPct" DOUBLE PRECISION NOT NULL,
    "equipmentStatus" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "boundary" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_allocations" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "category" "ResourceCategory" NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "period" "ResourcePeriod" NOT NULL DEFAULT 'WEEK',

    CONSTRAINT "resource_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_logs" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "performance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yield_records" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cropType" TEXT NOT NULL,
    "valueKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "yield_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fields_farmId_idx" ON "fields"("farmId");

-- CreateIndex
CREATE INDEX "resource_allocations_farmId_idx" ON "resource_allocations"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_allocations_farmId_category_period_key" ON "resource_allocations"("farmId", "category", "period");

-- CreateIndex
CREATE INDEX "performance_logs_fieldId_idx" ON "performance_logs"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "performance_logs_fieldId_dayOfWeek_hour_key" ON "performance_logs"("fieldId", "dayOfWeek", "hour");

-- CreateIndex
CREATE INDEX "yield_records_fieldId_idx" ON "yield_records"("fieldId");

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_logs" ADD CONSTRAINT "performance_logs_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yield_records" ADD CONSTRAINT "yield_records_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
