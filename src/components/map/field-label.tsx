"use client";

import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldLabelProps {
  name: string;
  cropType: string;
  isActive: boolean;
  onClick: () => void;
}

export function FieldLabel({ name, cropType, isActive, onClick }: FieldLabelProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pointer-events-auto flex flex-col items-center gap-0.5 rounded-lg px-1 py-0.5 text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-transform hover:scale-105",
        isActive && "scale-105"
      )}
    >
      <Sprout className="h-4 w-4" />
      <span className="text-xs font-semibold leading-tight">{name}</span>
      <span className="text-[10px] leading-tight text-white/80">{cropType}</span>
    </button>
  );
}
