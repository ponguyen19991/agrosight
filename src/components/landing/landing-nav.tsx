"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { ContactDialog } from "./contact-dialog";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "platform", label: "Platform", href: "#platform" },
  { id: "insights", label: "Insights", href: "#insights" },
  { id: "story", label: "Story", href: "#story" },
];

const SECTION_IDS = ["platform", "insights", "story"];

export function LandingNav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Gives the fixed header a solid backdrop once the user has scrolled past
  // the hero, so it stays legible over whatever content comes next. Also
  // force "home" back to active near the very top — the IntersectionObserver
  // below only updates when an observed section's boundary is crossed, so a
  // fast scroll straight to the top can otherwise leave a stale section
  // highlighted with nothing to trigger a correction.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY < 80) setActive("home");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlights whichever section is currently crossing the middle of the
  // viewport, falling back to "home" near the top of the page.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          const topMost = intersecting.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
          setActive(topMost.target.id);
        } else if (window.scrollY < 80) {
          setActive("home");
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto grid max-w-6xl grid-cols-2 items-center px-6 py-5 sm:px-10 md:grid-cols-3">
        <Link href={ROUTES.home} className="flex items-center gap-2.5 justify-self-start text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-lg">
            <Image
              src="/images/logo-primary.png"
              alt="AgroSight"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-base font-semibold tracking-wide">AgroSight</span>
        </Link>

        <div className="col-start-2 hidden justify-self-center md:block">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 shadow-lg backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active === link.id
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 justify-self-end">
          <Link
            href={ROUTES.login}
            className="hidden text-sm font-semibold text-white transition-colors hover:text-white/80 sm:inline-block"
          >
            Login
          </Link>
          <ContactDialog>
            <Button className="bg-white text-black shadow-none hover:bg-white/90">
              Contact Us
            </Button>
          </ContactDialog>
        </div>
      </nav>
    </header>
  );
}
