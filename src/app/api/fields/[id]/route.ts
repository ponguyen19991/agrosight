import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateFieldSchema } from "@/lib/validations/field";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  const parsed = updateFieldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const field = await prisma.field.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(field);
  } catch (error) {
    console.error("[PATCH /api/fields/[id]]", error);
    return NextResponse.json({ error: "Failed to update field" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.field.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/fields/[id]]", error);
    return NextResponse.json({ error: "Failed to delete field" }, { status: 500 });
  }
}
