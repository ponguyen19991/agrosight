"use client";

import { Sparkles } from "lucide-react";
import { useChatPanel } from "@/hooks/use-chat-panel";

export function AskFarmAiCard() {
  const { openChat } = useChatPanel();

  return (
    <button
      type="button"
      onClick={openChat}
      className="glass-panel-strong flex w-full items-center gap-4 rounded-2xl border border-primary/20 p-5 text-left transition-colors hover:border-primary/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-medium">Ask Farm AI</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Ask anything about your farm, based on this knowledge base.
        </p>
      </div>
    </button>
  );
}
