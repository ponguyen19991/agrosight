import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deriveFieldStatus } from "@/lib/field-status";
import { createFieldSchema, fieldsQuerySchema } from "@/lib/validations/field";

export async function GET(req: NextRequest) {
  const parsed = fieldsQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const fields = await prisma.field.findMany({
      where: { farmId: parsed.data.farmId },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(fields);
  } catch (error) {
    console.error("[GET /api/fields]", error);
    return NextResponse.json(
      { error: "Failed to load fields. Is DATABASE_URL configured and migrated?" },
      { status: 500 }
    );
  }
}

// Only boundary, name, crop, growth stage, notes, manager, and irrigation
// come from the Add Field wizard — sensor/environmental readings a real
// field wouldn't have yet default to neutral starting values instead of
// being left blank, since the rest of the app assumes every field has them.
const NEW_FIELD_DEFAULTS = {
  healthScore: 75,
  soilMoisturePct: 50,
  temperatureC: 24,
  phLevel: 6.5,
  humidityPct: 55,
  waterConsumptionL: 0,
  fertilizerEfficiencyPct: 0,
  equipmentStatus: "ACTIVE" as const,
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createFieldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const field = await prisma.field.create({
      data: {
        farmId: parsed.data.farmId,
        name: parsed.data.name,
        cropType: parsed.data.cropType,
        growthStage: parsed.data.growthStage,
        boundary: parsed.data.boundary,
        areaHectares: parsed.data.areaHectares,
        notes: parsed.data.notes,
        assignedManagerName: parsed.data.assignedManagerName,
        irrigationType: parsed.data.irrigationType,
        plantingDate: parsed.data.plantingDate,
        status: deriveFieldStatus(NEW_FIELD_DEFAULTS.healthScore),
        ...NEW_FIELD_DEFAULTS,
      },
    });
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("[POST /api/fields]", error);
    return NextResponse.json({ error: "Failed to create field" }, { status: 500 });
  }
}
