import { lazy } from "react"
import HeroSection from "../components/LandHeroSection"

const BannerLand = lazy(() => import("../LandingPageCards/BannerLand"))
const CallAction = lazy(() => import("../LandingPageCards/CallAction"))
const UseCases = lazy(() => import("../LandingPageCards/UseCases"))
const KeyBenefit = lazy(() => import("../LandingPageCards/KeyBenefits"))
const ThreeStep = lazy(() => import("../LandingPageCards/ThreeSteps"))
const FooterLand = lazy(() => import("../components/FooterLanding"));


function LandingPage() {


  return (
    <>

      <HeroSection />
      <BannerLand />
      <CallAction />
      <UseCases />
      <KeyBenefit />
      <ThreeStep />
      <FooterLand />
    </>
  );
}



export default LandingPage;
