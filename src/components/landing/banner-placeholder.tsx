import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Stand-in for the satellite/farm imagery that will be dropped in later —
// keeps layout and aspect ratio correct so swapping in real photos is a
// pure asset replacement, not a layout change.
export function BannerPlaceholder({
  className,
  label = "Banner ở đây",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.03]",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-white/25">
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
