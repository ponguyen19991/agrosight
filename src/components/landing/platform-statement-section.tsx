import { SectionBadge } from "./section-badge";

export function PlatformStatementSection() {
  return (
    <section className="border-t border-white/10 py-10 sm:py-18">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionBadge>AgroSight Legacy</SectionBadge>

        <p className="mt-6 max-w-3xl text-2xl font-medium leading-snug text-white sm:text-4xl">
          Our platform is built to support{" "}
          <span className="text-white">
            farmers, agribusinesses, and agricultural innovators
          </span>{" "}
          <span className="text-white/40">
            by delivering intelligent tools that respect the land while
            improving productivity.
          </span>
        </p>
      </div>
    </section>
  );
}
