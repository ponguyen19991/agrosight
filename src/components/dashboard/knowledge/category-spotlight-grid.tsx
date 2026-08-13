"use client";

import { ArrowRight } from "lucide-react";
import { CATEGORIES, GUIDES, type Guide } from "./knowledge-data";

export function CategorySpotlightGrid({
  onReadGuide,
}: {
  onReadGuide: (guide: Guide) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CATEGORIES.map((category) => {
        const guide = GUIDES.find((g) => g.category === category.value);
        if (!guide) return null;
        return (
          <div key={category.value} className="glass-panel flex flex-col gap-5 rounded-2xl p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <category.icon className="h-4 w-4" strokeWidth={1.75} />
              {category.eyebrow}
            </p>
            <div className="flex-1">
              <p className="font-medium leading-snug">{guide.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{guide.readMinutes} min read</p>
            </div>
            <button
              type="button"
              onClick={() => onReadGuide(guide)}
              className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:underline"
            >
              Read guide
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
