
function ThreeSteps() {

    const steps = [
        {
            title: "Assign a Task",
            desc: "Set up your call requirements—whether it’s sales, support, follow-ups, or reminders.",
        },
        {
            title: "AI Takes Over",
            desc: "Paul.ai dials, engages, and responds in real-time, handling interactions just like a human.",
        },
        {
            title: "Track & Optimize",
            desc: "Access instant call transcripts, insights, and analytics to continuously improve conversations.",
        },

    ];


    return (
        <section className="flex flex-col items-center px-4 py-12 md:px-16 text-center bg-white overflow-hidden">
            {/* Section Header */}
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-2 text-gray-900">
                3 Easy Steps to Smarter, AI-Powered Calls
            </h2>
            <p className="text-blue-900 text-[clamp(0.875rem,2vw,1rem)] mb-8">
                Boost Engagement and Drive Results with Paul.ai
            </p>

            {/* Steps Grid */}
            <div className="flex flex-wrap justify-center items-center gap-6 w-full px-3 sm:px-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="
        relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl
        bg-gradient-to-r from-[#382b86] to-[#00021D] text-white
        flex flex-col justify-center items-center text-center
        w-[260px] h-[260px] sm:w-[240px] sm:h-[240px] md:w-[250px] md:h-[250px]
        max-[400px]:w-[220px] max-[400px]:h-[220px] max-[350px]:w-[200px] max-[350px]:h-[200px]
        transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
        animate-gradient-move
      "
                    >
                        <h3 className="font-bold text-[clamp(1rem,2.5vw,1.125rem)] text-white drop-shadow-sm">
                            {step.title}
                        </h3>
                        <p className="mt-2 text-[clamp(0.75rem,2vw,0.875rem)] text-gray-200 max-w-[10rem]">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>




            <p className="text-center text-gray-800 mt-8 text-sm md:text-base">
                It’s that simple!
            </p>
            <button className="text-blue-900 text-base font-semibold bg-white px-6 py-3 rounded-md border border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-6">
                <span>Try QCall.ai Today</span>
            </button>
        </section>
    )
}

export default ThreeSteps
