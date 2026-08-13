"use client";

import { ArrowRight } from "lucide-react";
import { FEATURED_GUIDE_IDS, GUIDES, type Guide } from "./knowledge-data";

export function FeaturedGuides({ onReadGuide }: { onReadGuide: (guide: Guide) => void }) {
  const guides = FEATURED_GUIDE_IDS.map((id) => GUIDES.find((g) => g.id === id)).filter(
    (g): g is Guide => Boolean(g)
  );

  if (guides.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Featured
      </p>
      <div className="glass-panel mt-3 divide-y divide-border rounded-2xl px-5">
        {guides.map((guide) => (
          <button
            key={guide.id}
            type="button"
            onClick={() => onReadGuide(guide)}
            className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-medium transition-colors hover:text-primary"
          >
            {guide.title}
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
