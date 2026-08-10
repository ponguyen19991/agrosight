import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/geocode";
import { geocodeQuerySchema } from "@/lib/validations/geocode";

export async function GET(req: NextRequest) {
  const parsed = geocodeQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const results = await searchLocations(parsed.data.q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("[GET /api/geocode]", error);
    return NextResponse.json({ error: "Failed to search locations" }, { status: 502 });
  }
}
