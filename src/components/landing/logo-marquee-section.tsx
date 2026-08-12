"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fraunces } from "./fonts";

// Placeholder wordmarks, same disclaimer as the static trust bar — fictional
// names standing in for real partner logos later.
const PARTNERS = [
  { name: "TerraDrive", className: "font-semibold tracking-tight" },
  { name: "Halcyon Ag", className: `${fraunces.className} italic` },
  { name: "Ferrow & Co.", className: "font-medium tracking-wide" },
  { name: "Kestrel Machinery", className: "font-semibold uppercase tracking-widest text-sm" },
  { name: "Meridian Bank", className: "font-medium tracking-tight" },
  { name: "Northfield Equip.", className: "font-semibold tracking-tight" },
  { name: "Verdant Systems", className: `${fraunces.className} italic` },
  { name: "Roots & Ridge", className: "font-medium tracking-wide" },
  { name: "Amberfield Co.", className: "font-semibold uppercase tracking-widest text-sm" },
  { name: "Solace Robotics", className: "font-medium tracking-tight" },
];

// Duplicated so the track can loop seamlessly: at -50% transform it's
// exactly back at the start of the second copy.
const TRACK = [...PARTNERS, ...PARTNERS];

export function LogoMarqueeSection() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="border-t border-white/10 py-14">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <p className="text-sm text-white/50">
          Trusted by <span className="font-semibold text-white">1,000+</span> farm
          operations worldwide
        </p>

        <div
          className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
        >
          <div
            className={cn(
              "flex w-max items-center gap-14 text-white/40",
              "animate-marquee",
              paused && "[animation-play-state:paused]"
            )}
          >
            {TRACK.map((partner, i) => (
              <span
                key={`${partner.name}-${i}`}
                className={`shrink-0 text-lg transition-colors hover:text-white/70 ${partner.className}`}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
