import { Droplets, Sparkles, TrendingUp } from "lucide-react";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

const CAPABILITIES = [
  {
    icon: TrendingUp,
    title: "Yield forecasting",
    description: "Projects harvest outcomes weeks ahead from growth-stage trends.",
  },
  {
    icon: Sparkles,
    title: "Anomaly detection",
    description: "Flags stress, pests, or equipment drift before they spread.",
  },
  {
    icon: Droplets,
    title: "Resource optimization",
    description: "Times irrigation and fertilizer to exactly what each field needs.",
  },
];

export function AiInsightsSection() {
  return (
    <section id="insights" className="border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <SectionBadge>AI Assistant</SectionBadge>
            <h2 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-5xl">
              Insight, not just{" "}
              <span className={`${fraunces.className} italic text-primary`}>
                information.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/50">
              AgroSight reads every sensor and satellite pass so you don&apos;t
              have to — and tells you what it means for the next 48 hours.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live analysis
            </div>
            <p className="mt-4 text-sm font-medium text-white/90">
              Field A1 — Rice Plantation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Soil moisture dropped 12% over 3 days. Irrigation recommended
              within 48 hours to protect yield.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-14 sm:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-base font-medium text-white">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
