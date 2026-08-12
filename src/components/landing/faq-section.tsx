"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { fraunces } from "./fonts";
import { SectionBadge } from "./section-badge";

const FAQS = [
  {
    question: "Does AgroSight work without an internet connection?",
    answer:
      "Field sensors keep logging locally and sync automatically once a connection is back, so you never lose readings from a dead zone.",
  },
  {
    question: "How accurate are the soil moisture and pH readings?",
    answer:
      "Sensors are factory-calibrated and cross-checked against satellite passes, typically within 2-3% of lab-tested accuracy for moisture and pH.",
  },
  {
    question: "Can I use AgroSight with equipment I already own?",
    answer:
      "Yes — AgroSight connects to most third-party irrigation controllers and weather stations, and you can add new sensors without replacing existing hardware.",
  },
  {
    question: "How many fields can I monitor on one account?",
    answer:
      "There's no hard limit. Accounts scale from a single plot to hundreds of fields across multiple farms, all in one dashboard.",
  },
  {
    question: "Is my farm data private?",
    answer:
      "Your field data belongs to you. We never sell it, and it's only used to power the insights and alerts inside your own account.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <SectionBadge>FAQ</SectionBadge>
        <h2 className="mt-4 text-3xl font-medium leading-tight text-white sm:text-5xl">
          Common Farmer{" "}
          <span className={`${fraunces.className} italic text-primary`}>Questions</span>
        </h2>
        <p className="mt-4 text-base text-white/50">
          Got questions? We&apos;ve got answers to help you get the most out of
          AgroSight.
        </p>

        <div className="mt-12 divide-y divide-white/10 rounded-2xl border border-white/15 text-left">
          {FAQS.map((faq, i) => {
            const isOpen = i === openIndex;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span
                    className={cn(
                      "text-sm font-medium sm:text-base",
                      isOpen ? "text-white" : "text-white/70"
                    )}
                  >
                    {faq.question}
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
                    <p className="px-5 pb-5 text-sm leading-relaxed text-white/50 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
