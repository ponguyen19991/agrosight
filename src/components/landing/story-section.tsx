"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerPlaceholder } from "./banner-placeholder";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

export type StoryFeatureItem = {
  // A rendered icon element (e.g. <Droplets />), not a component reference —
  // these items are authored in a server component and passed down here, and
  // the RSC boundary can serialize elements but not bare functions.
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
};

function FeatureAccordion({
  items,
  openIndex,
  onSelect,
}: {
  items: StoryFeatureItem[];
  openIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-8 divide-y divide-white/15 rounded-2xl border border-white/25">
      {items.map((item, i) => {
        const isOpen = i === openIndex;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => onSelect(isOpen ? -1 : i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  isOpen ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/50"
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm font-medium sm:text-base",
                  isOpen ? "text-white" : "text-white/70"
                )}
              >
                {item.title}
              </span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-white/40" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-white/40" />
              )}
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-white/50">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StorySection({
  index,
  eyebrow,
  title,
  accent,
  items,
  defaultOpenIndex = 0,
  imageSide = "right",
  bannerLabel,
  imageSrc,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  accent: string;
  items: StoryFeatureItem[];
  defaultOpenIndex?: number;
  imageSide?: "left" | "right";
  bannerLabel: string;
  imageSrc?: string;
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const activeItem = items[openIndex];
  const activeImageSrc = activeItem?.imageSrc ?? imageSrc;

  return (
    <section className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-10 md:grid-cols-2 md:items-center md:gap-16">
        <div className={cn(imageSide === "left" ? "md:order-2" : "md:order-1")}>
          {index && <span className="font-mono text-xs text-white/30">{index}</span>}
          <div className="mt-3">
            <SectionBadge>{eyebrow}</SectionBadge>
          </div>
          <h3 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-4xl">
            <span className="block">{title}</span>
            <span className={`block ${fraunces.className} italic text-primary`}>{accent}</span>
          </h3>

          <FeatureAccordion items={items} openIndex={openIndex} onSelect={setOpenIndex} />
        </div>

        {activeImageSrc ? (
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15",
              imageSide === "left" ? "md:order-1" : "md:order-2"
            )}
          >
            <Image
              key={activeImageSrc}
              src={activeImageSrc}
              alt={activeItem?.title ?? bannerLabel}
              fill
              className="animate-in fade-in-0 object-cover duration-300"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white/80 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </div>
          </div>
        ) : (
          <BannerPlaceholder
            label={bannerLabel}
            className={cn(
              "aspect-[4/3]",
              imageSide === "left" ? "md:order-1" : "md:order-2"
            )}
          />
        )}
      </div>
    </section>
  );
}
