import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { getModel, isAiConfigured } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

async function buildFarmContext(): Promise<string> {
  try {
    const farms = await prisma.farm.findMany({ include: { fields: true } });
    if (farms.length === 0) return "No farm data is available yet.";

    return farms
      .map((farm) => {
        const fieldLines = farm.fields
          .map(
            (field) =>
              `- ${field.name} (${field.cropType}): status=${field.status}, healthScore=${field.healthScore}, soilMoisture=${field.soilMoisturePct}%, temperature=${field.temperatureC}C, growthStage=${field.growthStage}, equipment=${field.equipmentStatus}`
          )
          .join("\n");
        return `Farm: ${farm.name} (${farm.address})\n${fieldLines || "No fields recorded."}`;
      })
      .join("\n\n");
  } catch (error) {
    console.error("[POST /api/chat] failed to load farm context", error);
    return "Farm data is temporarily unavailable (database not connected).";
  }
}

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "AI assistant is not configured. Set AI_PROVIDER and the matching API key in your environment.",
      },
      { status: 501 }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const context = await buildFarmContext();

  const system = `You are the AgroSight farm assistant. Answer questions about the farm using the live field data below. Be concise and practical, and proactively call out any field that needs attention.\n\n${context}`;

  const result = streamText({
    model: getModel(),
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
