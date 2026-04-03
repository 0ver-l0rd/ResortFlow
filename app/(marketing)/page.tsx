import { Hero } from "@/components/marketing/hero";
import { PlatformBar } from "@/components/marketing/platform-bar";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero />
      <PlatformBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
    </div>
  );
}
