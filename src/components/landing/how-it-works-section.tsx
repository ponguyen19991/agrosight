"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, LayoutDashboard, MapPin, Radio, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerPlaceholder } from "./banner-placeholder";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

const STEPS = [
  {
    icon: LayoutDashboard,
    title: "Overview",
    subtitle: "Real-Time Insights",
    location: "West Field D4, Vietnam",
    imageSrc: "/images/agrosight_overview_clean.png",
  },
  {
    icon: Radio,
    title: "Connect",
    subtitle: "Sensors & Satellite Sync",
    location: "North Ridge A1, Vietnam",
    imageSrc: "/images/agrosight_connect_banner_v2.png" as string | undefined,
  },
  {
    icon: Sparkles,
    title: "Analyze",
    subtitle: "AI-Powered Recommendations",
    location: "South Plot C2, Vietnam",
    imageSrc: "/images/agrosight_analyze_step.png" as string | undefined,
  },
  {
    icon: CheckCircle2,
    title: "Act",
    subtitle: "Apply & Track Results",
    location: "Mekong Delta, Vietnam",
    imageSrc: undefined as string | undefined,
  },
] as const;

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionBadge>How It Works</SectionBadge>
        <h2 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-5xl">
          <span className="block">Smart Farming,</span>
          <span className={`block ${fraunces.className} italic text-primary`}>
            Simple and Effective.
          </span>
        </h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {STEPS.map((s, i) => {
            const isActive = i === active;
            const Icon = s.icon;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors",
                  isActive
                    ? "border-white/25 bg-white/10"
                    : "border-white/10 bg-transparent hover:border-white/20"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isActive ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/50"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span>
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isActive ? "text-white" : "text-white/70"
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="block text-xs text-white/40">{s.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-8 aspect-[16/8] w-full overflow-hidden rounded-2xl">
          {step.imageSrc ? (
            <Image
              key={step.imageSrc}
              src={step.imageSrc}
              alt={`${step.title} — ${step.subtitle}`}
              fill
              className="animate-in fade-in-0 object-cover duration-300"
              sizes="(min-width: 1024px) 1152px, 100vw"
            />
          ) : (
            <BannerPlaceholder
              key={step.title}
              label={`Banner ở đây — ${step.title.toLowerCase()} step`}
              className="absolute inset-0 animate-in fade-in-0 duration-300"
            />
          )}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {step.location}
          </div>
        </div>
      </div>
    </section>
  );
}
