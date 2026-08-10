import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

const DEFAULT_MODELS = {
  anthropic: "claude-sonnet-5",
  openai: "gpt-4o-mini",
} as const;

export function isAiConfigured(): boolean {
  const provider = process.env.AI_PROVIDER;
  if (provider === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return false;
}

export function getModel(): LanguageModel {
  const provider = process.env.AI_PROVIDER;

  if (provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    return anthropic(process.env.AI_MODEL ?? DEFAULT_MODELS.anthropic);
  }

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    return openai(process.env.AI_MODEL ?? DEFAULT_MODELS.openai);
  }

  throw new Error(
    `Unsupported or unset AI_PROVIDER "${provider}". Set AI_PROVIDER to "anthropic" or "openai".`
  );
}
