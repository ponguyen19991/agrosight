import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const field = await prisma.field.findUnique({
      where: { id: params.id },
      include: {
        farm: true,
        yieldRecords: { orderBy: { date: "asc" } },
      },
    });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json(field);
  } catch (error) {
    console.error("[GET /api/fields/[id]]", error);
    return NextResponse.json({ error: "Failed to load field" }, { status: 500 });
  }
}
