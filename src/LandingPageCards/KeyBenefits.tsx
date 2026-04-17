import { motion } from "framer-motion";
import LandCard from "../components/LandCard";
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Puzzle, 
  BarChart3 
} from "lucide-react";

function KeyBenefits() {
    const benefits = [
        {
            title: "Boost Efficiency & Save Time",
            desc: "No more wasting hours on repetitive calls. Paul.ai automates tasks so your team can focus on high-value work.",
            icon: <Zap size={28} />,
        },
        {
            title: "Cut Costs by 70–80%",
            desc: "Eliminate the need for large call center teams—Paul.ai delivers scalable AI-powered calls at a fraction of the cost.",
            icon: <TrendingDown size={28} />,
        },
        {
            title: "Increase Revenue by 50–80%",
            desc: "With AI-driven precision, more leads convert into paying customers, resulting in higher profits.",
            icon: <TrendingUp size={28} />,
        },
        {
            title: "24/7 Connectivity",
            desc: "Paul.ai never sleeps, ensuring seamless customer engagement anytime, anywhere around the globe.",
            icon: <Clock size={28} />,
        },
        {
            title: "Seamless Sync",
            desc: "Works effortlessly with your existing tools (CRM, databases, and more) without disrupting your current workflow.",
            icon: <Puzzle size={28} />,
        },
        {
            title: "AI Insights",
            desc: "Every call is recorded, transcribed, and analyzed for smarter decisions and deeper customer understanding.",
            icon: <BarChart3 size={28} />,
        },
    ];

    return (
        <section className="py-24 px-6 md:px-8 relative overflow-hidden">
            <div className="relative flex flex-col items-center z-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="px-4 py-1 glass rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary mb-6"
                    >
                        Key Benefits
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                    >
                        Why Paul.ai <span className="text-brand-accent">Stands Out</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg mt-6 max-w-2xl font-medium"
                    >
                        Enhance engagement and achieve real results with our cutting-edge AI engine.
                    </motion.p>
                </div>

                {/* Benefit Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <LandCard
                                subtitle={item.title}
                                desc={item.desc}
                                icon={item.icon}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default KeyBenefits;
