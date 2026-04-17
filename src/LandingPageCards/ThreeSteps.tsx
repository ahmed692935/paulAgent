import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Cpu, BarChart2, ArrowRight } from "lucide-react";

function ThreeSteps() {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Assign a Task",
      desc: "Set up your call requirements—whether it’s sales, support, follow-ups, or reminders.",
      icon: <MessageSquarePlus size={40} />,
      color: "brand-primary"
    },
    {
      title: "AI Takes Over",
      desc: "Paul.ai dials, engages, and responds in real-time, handling interactions just like a human.",
      icon: <Cpu size={40} />,
      color: "brand-secondary"
    },
    {
      title: "Track & Optimize",
      desc: "Access instant call transcripts, insights, and analytics to continuously improve conversations.",
      icon: <BarChart2 size={40} />,
      color: "brand-accent"
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 text-center relative overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4">
          3 Steps to <span className="text-brand-primary">Automation.</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Ready to scale your communications? Our onboarding is as seamless as our AI.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
            className="group relative w-full sm:w-[350px]"
          >
            {/* Connection Line (Desktop) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-12 w-24 h-[2px] bg-gradient-to-r from-brand-primary/20 to-transparent z-0" />
            )}

            <div className="glass p-12 rounded-[3.5rem] flex flex-col items-center gap-6 hover:bg-white/5 transition-all duration-500 border border-white/5 group-hover:border-white/20">
              <div className={`p-6 rounded-3xl bg-dark-card text-${step.color} shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-black text-white">{step.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-20 flex flex-col items-center"
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3 px-8 py-4 glass rounded-full text-white font-bold hover:bg-white/10 transition-all border border-white/10"
        >
          Check out our demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
}

export default ThreeSteps;
