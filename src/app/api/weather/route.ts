import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/weather";
import { weatherQuerySchema } from "@/lib/validations/weather";

export async function GET(req: NextRequest) {
  const parsed = weatherQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const weather = await getWeather(parsed.data.lat, parsed.data.lng);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("[GET /api/weather]", error);
    return NextResponse.json({ error: "Failed to load weather" }, { status: 502 });
  }
}
