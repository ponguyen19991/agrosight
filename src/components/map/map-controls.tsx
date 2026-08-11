"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { Maximize, Minimize, Plus, LocateFixed, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MapControlsProps {
  mapRef: RefObject<MapLibreMap | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onRecenter: () => void;
}

export function MapControls({ mapRef, containerRef, onRecenter }: MapControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  };

  return (
    <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
      <ControlButton label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>
        <Plus className="h-4 w-4" />
      </ControlButton>
      <ControlButton label="Zoom out" onClick={() => mapRef.current?.zoomOut()}>
        <Minus className="h-4 w-4" />
      </ControlButton>
      <ControlButton label="Recenter map" onClick={onRecenter}>
        <LocateFixed className="h-4 w-4" />
      </ControlButton>
      <ControlButton
        label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-9 w-9"
          onClick={onClick}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
