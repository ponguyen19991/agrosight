import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fieldsQuerySchema } from "@/lib/validations/field";

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
