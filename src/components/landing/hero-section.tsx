import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { fraunces } from "./fonts";

const AVATARS = [
  "/images/farmer_avatar_pixel_1.png",
  "/images/farmer_avatar_pixel_2.png",
  "/images/farmer_avatar_pixel_3.png",
];

const STATS = [
  { value: "10,000+", label: "Acres monitored" },
  { value: "24/7", label: "Satellite refresh" },
  { value: "98%", label: "Anomaly accuracy" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      <Image
        src="/images/agrovia_clean_banner_2.png"
        alt="Satellite view of a farm field"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-40 sm:px-10 sm:pb-24">
        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
          Farm Intelligence
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-[1.05] text-white sm:text-7xl">
          Every field has a{" "}
          <span className={`${fraunces.className} italic text-primary`}>story.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
          Satellite-grade visibility into soil, water, and growth — turned into
          decisions you can act on before sunrise.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-12 bg-primary px-7 text-primary-foreground hover:bg-primary/90">
            <Link href={ROUTES.login}>
              Request Access
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 border-white/40 bg-white/5 px-7 font-semibold text-white hover:bg-white/15 hover:text-white"
          >
            <a href="#platform">See it in action</a>
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-wide text-white/40">{stat.label}</p>
            </div>
          ))}

          <div className="flex items-center gap-3 sm:ml-auto sm:border-l sm:border-white/10 sm:pl-10">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-semibold text-white">4.9</span>
            </div>
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <span
                  key={src}
                  className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-black"
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </span>
              ))}
            </div>
            <span className="text-sm font-medium text-white/70">10k+ Farmers</span>
          </div>
        </div>
      </div>

      <a
        href="#platform"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white sm:flex"
      >
        Scroll
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>
    </section>
  );
}
