import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { PlatformStatementSection } from "./platform-statement-section";
import { LogoMarqueeSection } from "./logo-marquee-section";
import { FieldShowcaseSection } from "./field-showcase-section";
import { StorySection } from "./story-section";
import { ABOUT_FEATURES } from "./story-content";
import { HowItWorksSection } from "./how-it-works-section";
import { TestimonialsSection } from "./testimonials-section";
import { FaqSection } from "./faq-section";
import { AiInsightsSection } from "./ai-insights-section";
import { CtaSection } from "./cta-section";

export function LandingPage() {
  return (
    // Forced dark regardless of the app's theme toggle — this is a
    // marketing page with its own visual identity, not a themed app view.
    <div className="dark farm-backdrop text-white">
      <LandingNav />
      <HeroSection />
      <LogoMarqueeSection />
      <PlatformStatementSection />
      <FieldShowcaseSection />

      <StorySection
        eyebrow="About AgroSight"
        title="Everything your farm"
        accent="needs to thrive."
        items={ABOUT_FEATURES}
        defaultOpenIndex={0}
        bannerLabel="Soil intelligence sensor in the field"
        imageSrc="/images/soil_intelligence_sensor.png"
        imageSide="right"
      />

      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <AiInsightsSection />
      <CtaSection />
    </div>
  );
}
