import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { BannerPlaceholder } from "./banner-placeholder";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

// Fictional names/quotes paired with real photo assets — same
// pure-asset-replacement pattern as the banner placeholders above.
const TESTIMONIALS = [
  {
    quote:
      "Soil sensors alone paid for themselves in one season — we stopped guessing and started irrigating exactly when the data said to.",
    name: "Minh Tran",
    role: "Rice grower, Mekong Delta",
    imageSrc: "/images/agrosight_review_minh_tran.png",
  },
  {
    quote:
      "The weather alerts gave us two days' notice before a frost. That's the difference between a full harvest and a lost one.",
    name: "Elena Rojas",
    role: "Vineyard owner, Mendoza",
    imageSrc: "/images/agrosight_review_elena_rojas.png",
  },
  {
    quote:
      "AgroSight turned three spreadsheets and a notebook into one dashboard. Our whole team finally looks at the same numbers.",
    name: "David Okafor",
    role: "Farm operations lead, Kaduna",
    imageSrc: "/images/agrosight_review_david_okafor.png",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionBadge>Farmer Stories</SectionBadge>
        <h2 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-5xl">
          <span className="block">Real farmers.</span>
          <span className={`block ${fraunces.className} italic text-primary`}>
            Real results.
          </span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
            >
              {t.imageSrc ? (
                <div className="relative aspect-square overflow-hidden border-b border-white/10">
                  <Image
                    src={t.imageSrc}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
              ) : (
                <BannerPlaceholder
                  label={`Banner ở đây — ${t.name} photo`}
                  className="aspect-[4/3] rounded-none border-0 border-b border-white/10"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <Quote className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-white/50 transition-colors hover:text-white"
                  >
                    Read more
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
