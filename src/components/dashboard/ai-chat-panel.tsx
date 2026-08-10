"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { AlertTriangle, Bot, Send, Sparkles, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AiChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseErrorMessage(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  try {
    const parsed = JSON.parse(message);
    if (typeof parsed?.error === "string") return parsed.error;
  } catch {
    // not JSON, fall through
  }
  return message;
}

export function AiChatPanel({ open, onOpenChange }: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AgroSight Assistant
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="-mx-6 flex-1 px-6">
          <div className="flex flex-col gap-4 py-4">
            {messages.length === 0 && !error && (
              <p className="text-sm text-muted-foreground">
                Ask about field health, irrigation needs, or which fields need attention today.
              </p>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2 text-sm",
                  message.role === "user" && "flex-row-reverse text-right"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="glass-panel rounded-xl px-3 py-2 leading-relaxed">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? <span key={index}>{part.text}</span> : null
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{parseErrorMessage(error.message)}</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border pt-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask the farm assistant..."
            disabled={isBusy}
          />
          <Button type="submit" size="icon" disabled={isBusy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
