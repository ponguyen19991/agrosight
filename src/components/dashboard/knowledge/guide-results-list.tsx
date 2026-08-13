"use client";

import { ArrowRight } from "lucide-react";
import { CATEGORIES, type Guide } from "./knowledge-data";

export function GuideResultsList({
  guides,
  onReadGuide,
}: {
  guides: Guide[];
  onReadGuide: (guide: Guide) => void;
}) {
  if (guides.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-sm text-muted-foreground">
        No guides match your search.
      </div>
    );
  }

  return (
    <div className="glass-panel divide-y divide-border rounded-2xl px-5">
      {guides.map((guide) => {
        const category = CATEGORIES.find((c) => c.value === guide.category);
        return (
          <button
            key={guide.id}
            type="button"
            onClick={() => onReadGuide(guide)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <div className="flex min-w-0 items-center gap-3">
              {category && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <category.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium">{guide.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{guide.summary}</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              {guide.readMinutes} min
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
