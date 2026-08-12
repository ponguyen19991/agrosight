import Image from "next/image";
import { cn } from "@/lib/utils";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

const FIELDS = [
  {
    name: "West Field D4",
    crop: "Rice Plantation",
    health: 85,
    moisture: 68,
    className: "left-[6%] top-[18%]",
  },
  {
    name: "North Ridge A1",
    crop: "Wheat",
    health: 72,
    moisture: 54,
    className: "right-[8%] top-[38%]",
  },
  {
    name: "South Plot C2",
    crop: "Sugarcane",
    health: 91,
    moisture: 77,
    className: "left-[14%] bottom-[10%]",
  },
] as const;

function FieldCard({
  name,
  crop,
  health,
  moisture,
  className,
}: (typeof FIELDS)[number]) {
  return (
    <div
      className={cn(
        "glass-panel absolute w-52 rounded-2xl p-4 text-white shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-white/50">{crop}</p>
        </div>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
        <div>
          <p className="text-xl font-semibold">{health}%</p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Health score</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{moisture}%</p>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Moisture</p>
        </div>
      </div>
    </div>
  );
}

export function FieldShowcaseSection() {
  return (
    <section id="platform" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <SectionBadge>Live Field View</SectionBadge>
          <h2 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-5xl">
            Not a map.{" "}
            <span className={`${fraunces.className} italic text-primary`}>
              A living field.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Every plot updates as conditions change — health, moisture, and
            growth stage layered directly over the satellite view, not buried
            in a spreadsheet.
          </p>
        </div>

        <div className="relative mt-14 aspect-[16/10] w-full sm:aspect-[16/8]">
          <Image
            src="/images/satellite_field_mosaic.png"
            alt="Satellite mosaic of farm fields"
            fill
            className="rounded-2xl object-cover"
            sizes="(min-width: 1024px) 1152px, 100vw"
          />
          {FIELDS.map((field) => (
            <FieldCard key={field.name} {...field} />
          ))}
        </div>
      </div>
    </section>
  );
}
