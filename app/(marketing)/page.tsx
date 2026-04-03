import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { PlatformBar } from "@/components/marketing/platform-bar";
import { Problem } from "@/components/marketing/problem";
import { Solution } from "@/components/marketing/solution";
import { Features } from "@/components/marketing/features";
import { Autopilot } from "@/components/marketing/autopilot";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Results } from "@/components/marketing/results";
import { Pricing } from "@/components/marketing/pricing";
import { FinalCTA } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <Hero />
      <PlatformBar />
      <Problem />
      <Solution />
      <Features />
      <Autopilot />
      <HowItWorks />
      <Results />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}