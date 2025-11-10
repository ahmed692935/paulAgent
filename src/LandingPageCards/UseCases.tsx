import LandCard from "../components/LandCard";

function UseCases() {
    const useCases = [
        {
            title: "Customer Support",
            desc: "Deliver 24/7 AI-powered assistance with Paul.ai, without increasing staff costs.",
            img: "/assets/support.png",
        },
        {
            title: "Appointment Scheduling",
            desc: "Paul.ai manages bookings, reschedules, and confirmations seamlessly.",
            img: "/assets/calender.png",
        },
        {
            title: "Survey & Feedback Calls",
            desc: "Gather valuable customer insights automatically, without human intervention.",
            img: "/assets/list.png",
        },
        {
            title: "Collections & Reminders",
            desc: "Automate payment reminders and reduce overdue payments effortlessly with Paul.ai.",
            img: "/assets/collection.png",
        },
        {
            title: "HR & Recruitment",
            desc: "Paul.ai pre-screens candidates, schedules interviews, and follows up automatically.",
            img: "/assets/fifth.png",
        },
        {
            title: "Custom Development",
            desc: "Tailored AI solutions from Paul.ai, designed to meet your unique business needs.",
            img: "/assets/calender.png",
        },

    ];

    return (
        <section className="py-16 px-4 md:px-8 text-center bg-white flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col items-center max-w-lg w-full">
                <span className="px-4 py-1 border border-blue-500 rounded-full text-xs text-black">
                    Use Cases
                </span>
                <h2 className="text-[clamp(1.25rem,5vw,2rem)] font-bold text-gray-900 mt-4">
                    Who Benefits from Paul.ai
                </h2>
                <p className="text-blue-500 mt-2 text-[clamp(0.875rem,3vw,1rem)] max-w-md">
                    Sales & Lead Generation – Let Paul handle cold calls, lead qualification, and follow-ups so you can focus on closing deals.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mt-10 justify-items-center">
                {useCases.map((item, index) => (
                    <LandCard
                        key={index}
                        subtitle={item.title}
                        desc={item.desc}
                        img={item.img}
                    />
                ))}
            </div>

            {/* Footer */}
            <p className="text-gray-600 text-[clamp(1rem,3vw,1.25rem)] mt-8 max-w-md text-center">
                Paul.ai: The Game-Changer for Every Call-Driven Business.
            </p>

            <div className="mt-6">
                <button className="text-blue-900 text-base font-semibold bg-white px-6 py-3 rounded-md border border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                    <span>Request a Demo</span>
                </button>
            </div>
        </section>
    );
}

export default UseCases;
