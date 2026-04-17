import { lazy } from "react";
import HeroSection from "../components/LandHeroSection";

const BannerLand = lazy(() => import("../components/BannerLand"));
const CallAction = lazy(() => import("../LandingPageCards/CallAction"));
const UseCases = lazy(() => import("../LandingPageCards/UseCases"));
const KeyBenefit = lazy(() => import("../LandingPageCards/KeyBenefits"));
const ThreeStep = lazy(() => import("../LandingPageCards/ThreeSteps"));
const FooterLand = lazy(() => import("../components/FooterLanding"));

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden selection:bg-brand-primary/30">
      {/* Mesh Gradient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-accent/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <div id="home">
          <HeroSection />
        </div>
        <BannerLand />
        <div id="about">
          <CallAction />
        </div>
        <div id="services">
          <UseCases />
        </div>
        <KeyBenefit />
        <ThreeStep />
        <div id="contact">
          <FooterLand />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
