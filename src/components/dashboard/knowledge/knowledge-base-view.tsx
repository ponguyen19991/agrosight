"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AskFarmAiCard } from "./ask-farm-ai-card";
import { CATEGORIES, GUIDES, type Guide, type GuideCategory } from "./knowledge-data";
import { CategorySpotlightGrid } from "./category-spotlight-grid";
import { FeaturedGuides } from "./featured-guides";
import { GuideDialog } from "./guide-dialog";
import { GuideResultsList } from "./guide-results-list";
import { RecentSaved } from "./recent-saved";

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function KnowledgeBaseView() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | GuideCategory>("all");
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  const isFiltering = query.trim().length > 0 || activeCategory !== "all";

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GUIDES.filter((guide) => {
      const matchesCategory = activeCategory === "all" || guide.category === activeCategory;
      const matchesQuery =
        !q || guide.title.toLowerCase().includes(q) || guide.summary.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl min-w-0 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Knowledge Base</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Farm knowledge, guides and resources.
        </p>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search crops, diseases, irrigation..."
            className="h-11 rounded-full pl-10"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <CategoryPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
            All
          </CategoryPill>
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category.value}
              active={activeCategory === category.value}
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </CategoryPill>
          ))}
        </div>
      </div>

      {isFiltering ? (
        <GuideResultsList guides={filteredGuides} onReadGuide={setActiveGuide} />
      ) : (
        <>
          <CategorySpotlightGrid onReadGuide={setActiveGuide} />
          <FeaturedGuides onReadGuide={setActiveGuide} />
          <RecentSaved onReadGuide={setActiveGuide} />
        </>
      )}

      <AskFarmAiCard />

      <GuideDialog guide={activeGuide} onOpenChange={(open) => !open && setActiveGuide(null)} />
    </div>
  );
}
