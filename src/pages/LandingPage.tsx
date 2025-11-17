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
    <>
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
    </>
  );
}

export default LandingPage;
