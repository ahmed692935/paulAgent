import benefitBg from "../assets/Images/benefit-bg.webp";
import LandCard from "../components/LandCard";

function KeyBenefits() {
    const benefits = [
        {
            title: "Boost Efficiency & Save Time",
            desc: "No more wasting hours on repetitive calls. Paul.ai automates tasks so your team can focus on high-value work.",
        },
        {
            title: "Cut Costs by 70–80%",
            desc: "Eliminate the need for large call center teams—Paul.ai delivers scalable AI-powered calls at a fraction of the cost.",
        },
        {
            title: "Increase Revenue by 50–80%",
            desc: "With AI-driven precision, more leads convert into paying customers, resulting in higher profits.",
        },
        {
            title: "24/7 Availability",
            desc: "Paul.ai never sleeps, ensuring seamless customer engagement anytime, anywhere.",
        },
        {
            title: "Seamless Integration",
            desc: "Works effortlessly with your existing tools (CRM, databases, and more) without disrupting your workflow.",
        },
        {
            title: "Data-Driven Insights",
            desc: "Every call is recorded, transcribed, and analyzed for smarter decisions and deeper customer understanding.",
        },

    ];

    return (
        <section className="py-16 text-center bg-white overflow-hidden">
            <div className="relative w-full h-full px-4 md:px-8 py-16">
                {/* Background Image */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <img
                        src={benefitBg}
                        alt="bg-img"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative flex flex-col items-center z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center max-w-2xl mx-auto">
                        <span className="px-4 py-1 border border-gray-200 rounded-full text-xs text-white">
                            Key Benefits
                        </span>
                        <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-bold text-gray-200 mt-4">
                            Why Paul.ai Stands Out
                        </h2>
                        <p className="text-gray-200 text-[clamp(0.875rem,2vw,1.125rem)] mt-2">
                            Enhance engagement and achieve real results.
                        </p>
                    </div>

                    {/* Benefit Cards */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl px-2 sm:px-4">
                        {benefits.map((item, index) => (
                            <LandCard
                                key={index}
                                subtitle={item.title}
                                desc={item.desc}
                                className="border border-gray-200 bg-transparent hover:scale-105 hover:shadow-lg text-white benef-card"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}



export default KeyBenefits;
