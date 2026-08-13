"use client";

import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES, type Guide } from "./knowledge-data";

export function GuideDialog({
  guide,
  onOpenChange,
}: {
  guide: Guide | null;
  onOpenChange: (open: boolean) => void;
}) {
  const category = guide && CATEGORIES.find((c) => c.value === guide.category);

  return (
    <Dialog open={guide !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {guide && (
          <>
            <DialogHeader>
              {category && (
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-primary">
                  <category.icon className="h-3.5 w-3.5" />
                  {category.eyebrow}
                </p>
              )}
              <DialogTitle className="text-xl">{guide.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3" />
                {guide.readMinutes} min read
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {guide.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
