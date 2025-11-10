import LandCard from "../components/LandCard";

function CallAction() {
    const callStats = [
        {
            title: "Quick to Access",
            value: "1 Day",
            desc: "Average time from contract to project kick-off with Paul.ai",
        },
        {
            title: "Quality of Services",
            value: "50% Savings",
            desc: "Achieve significant cost reductions through smarter, AI-driven actions",
        },
        {
            title: "Queue-Free",
            value: "50+ Features",
            desc: "Comprehensive tools available for all your essential calling tasks",
        },

    ];

    return (
        <section className="py-16 px-4 md:px-8 bg-white text-center">
            <div className="flex flex-col items-center">
                <span className="px-4 py-1 border border-blue-500 rounded-full text-xs text-black">
                    The Core of Paul.ai
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                    Making Every Call Effortless
                </h2>
                <p className="text-blue-500 text-base md:text-lg mt-2">
                    Enhancing Engagement and Delivering Results
                </p>
            </div>

            {/* Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {callStats.map((item, i) => (
                    <LandCard
                        key={i}
                        title={item.title}
                        value={item.value}
                        desc={item.desc}
                    />
                ))}
            </div>
        </section>
    );
}

export default CallAction;
