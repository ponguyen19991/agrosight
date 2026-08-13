"use client";

import { Bookmark, Clock } from "lucide-react";
import { GUIDES, RECENT_GUIDE_IDS, SAVED_GUIDE_IDS, type Guide } from "./knowledge-data";

function MiniGuideList({
  icon: Icon,
  title,
  ids,
  onReadGuide,
}: {
  icon: React.ElementType;
  title: string;
  ids: string[];
  onReadGuide: (guide: Guide) => void;
}) {
  const guides = ids.map((id) => GUIDES.find((g) => g.id === id)).filter((g): g is Guide => Boolean(g));

  return (
    <div className="glass-panel flex-1 rounded-2xl p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </p>
      <div className="mt-3 space-y-2.5">
        {guides.map((guide) => (
          <button
            key={guide.id}
            type="button"
            onClick={() => onReadGuide(guide)}
            className="block w-full truncate text-left text-sm transition-colors hover:text-primary"
          >
            {guide.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RecentSaved({ onReadGuide }: { onReadGuide: (guide: Guide) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <MiniGuideList icon={Clock} title="Recently Viewed" ids={RECENT_GUIDE_IDS} onReadGuide={onReadGuide} />
      <MiniGuideList icon={Bookmark} title="Saved" ids={SAVED_GUIDE_IDS} onReadGuide={onReadGuide} />
    </div>
  );
}
