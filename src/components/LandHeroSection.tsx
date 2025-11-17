import Header from "../components/HeaderLanding";
import heroVideo from "../assets/Videos/herobg.mp4";

function LandHeroSection() {
  return (
    <section className="relative w-full min-h-[40rem] md:h-[100vh] overflow-hidden bg-gradient-to-r from-blue-900 to-blue-500">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroVideo} />
      </video>

      {/* Header */}
      <Header />

      {/* HERO CONTENT */}
      <div className="relative container mx-auto h-full min-h-[inherit] px-3 sm:px-4 flex flex-col justify-center items-center text-center text-white tracking-[1px]">
        <p className="px-3 sm:px-4 py-2 mb-4 text-[10px] sm:text-xs border border-white rounded-full inline-block">
          Paul.ai - The AI Agent That Transforms Your Calling Experience
        </p>

        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold leading-tight">
          Paul.ai – Smarter Calls
        </h1>
        <h2 className="mt-2 text-lg sm:text-3xl md:text-5xl font-light leading-tight">
          Better Conversations
        </h2>

        <p className="mt-4 max-w-sm sm:max-w-md md:max-w-2xl mx-auto text-white text-xs sm:text-sm md:text-base px-2">
          Say Goodbye to Repetitive Calls. Let AI Handle It.
        </p>

        <p className="mt-3 max-w-sm sm:max-w-md md:max-w-2xl mx-auto text-white text-[11px] sm:text-xs md:text-sm px-2">
          Spending too much time on repetitive calls? Let Paul.ai take care of
          your outreach, support, and follow-ups with lifelike AI conversations
          - freeing you to focus on growth.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 items-center">
          <button className="bg-[#13243C] text-white text-sm sm:text-base font-semibold px-5 sm:px-8 py-2 sm:py-3 rounded-md shadow-lg border border-2 border-blue-900 hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-[85%] sm:w-auto w-fit">
            Try It Now For Free
          </button>

          <button className="bg-white text-blue-900 text-sm sm:text-base font-semibold px-5 sm:px-8 py-2 sm:py-3 rounded-md shadow-lg border border-2 border-blue-900 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-[85%] sm:w-auto">
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default LandHeroSection;
