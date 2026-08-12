import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "./contact-dialog";
import { fraunces } from "./fonts";
import { LandingFooter } from "./landing-footer";

export function CtaSection() {
  return (
    <section id="story" className="relative overflow-hidden pt-32 sm:pt-40">
      <Image
        src="/images/agrovia_clean_banner_3.png"
        alt="Farm field at golden hour"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center sm:px-10">
        <h2 className="text-3xl font-medium leading-tight text-white sm:text-5xl">
          <span className="block">Make farming smarter,</span>
          <span className={`block ${fraunces.className} italic text-primary`}>
            stronger, and simpler
          </span>
        </h2>
        <p className="mt-5 text-base text-white/70">
          Straightforward answers to help you make confident decisions for
          your farm.
        </p>
        <div className="mt-9">
          <ContactDialog>
            <Button size="lg" className="h-12 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              Contact Us
            </Button>
          </ContactDialog>
        </div>
      </div>

      <div className="relative mt-16 pb-16 sm:mt-20 sm:pb-20">
        <LandingFooter />
      </div>
    </section>
  );
}
