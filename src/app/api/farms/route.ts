import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FarmSummary, WeeklyPerformanceCell, YieldTrendPoint } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const farms = await prisma.farm.findMany({
      include: {
        resourceAllocations: true,
        fields: {
          select: {
            id: true,
            performanceLogs: { select: { dayOfWeek: true, hour: true, score: true } },
            yieldRecords: { select: { date: true, valueKg: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const summaries: FarmSummary[] = farms.map((farm) => {
      const performanceBuckets = new Map<string, { total: number; count: number }>();
      const yieldBuckets = new Map<string, number>();

      for (const field of farm.fields) {
        for (const log of field.performanceLogs) {
          const key = `${log.dayOfWeek}-${log.hour}`;
          const bucket = performanceBuckets.get(key) ?? { total: 0, count: 0 };
          bucket.total += log.score;
          bucket.count += 1;
          performanceBuckets.set(key, bucket);
        }
        for (const record of field.yieldRecords) {
          const month = record.date.toISOString().slice(0, 7);
          yieldBuckets.set(month, (yieldBuckets.get(month) ?? 0) + record.valueKg);
        }
      }

      const weeklyPerformance: WeeklyPerformanceCell[] = Array.from(
        performanceBuckets.entries()
      ).map(([key, bucket]) => {
        const [dayOfWeek, hour] = key.split("-").map(Number);
        return { dayOfWeek, hour, score: Math.round(bucket.total / bucket.count) };
      });

      const yieldTrend: YieldTrendPoint[] = Array.from(yieldBuckets.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, valueKg]) => ({ month, valueKg }));

      return {
        id: farm.id,
        name: farm.name,
        address: farm.address,
        lat: farm.lat,
        lng: farm.lng,
        timezone: farm.timezone,
        fieldCount: farm.fields.length,
        resourceAllocations: farm.resourceAllocations.map((allocation) => ({
          category: allocation.category,
          percentage: allocation.percentage,
          period: allocation.period,
        })),
        weeklyPerformance,
        yieldTrend,
      };
    });

    return NextResponse.json(summaries);
  } catch (error) {
    console.error("[GET /api/farms]", error);
    return NextResponse.json(
      { error: "Failed to load farms. Is DATABASE_URL configured and migrated?" },
      { status: 500 }
    );
  }
}
