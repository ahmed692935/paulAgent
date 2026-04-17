import { motion } from "framer-motion";
import LandCard from "../components/LandCard";

function CallAction() {
  const callStats = [
    {
      title: "Quick to Access",
      value: "24 Hours",
      desc: "Average time from contract to project kick-off with Paul.ai team",
    },
    {
      title: "Quality of Services",
      value: "60% Savings",
      desc: "Achieve significant cost reductions through smarter, AI-driven efficiencies",
    },
    {
      title: "Queue-Free",
      value: "Unlimited capacity",
      desc: "Comprehensive tools available for all your essential business calling tasks",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-8 relative">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="px-4 py-1 glass rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary mb-6"
        >
          The Engine of Paul.ai
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white tracking-tighter"
        >
          Making Every Interaction <span className="text-brand-secondary">Effortless.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg md:text-xl mt-6 max-w-2xl font-medium"
        >
          Enhancing Engagement and Delivering Results through advanced neural processing.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {callStats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <LandCard
              title={item.title}
              value={item.value}
              desc={item.desc}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CallAction;
