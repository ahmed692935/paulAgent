import { motion } from "framer-motion";
import LandCard from "../components/LandCard";
import { 
  Headphones, 
  Calendar, 
  ClipboardList, 
  Receipt, 
  Users, 
  Code,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function UseCases() {
  const navigate = useNavigate();
  const useCases = [
    {
      title: "Customer Support",
      desc: "Deliver 24/7 AI-powered assistance with Paul.ai, without increasing staff costs.",
      icon: <Headphones size={32} />,
    },
    {
      title: "Appointment Scheduling",
      desc: "Paul.ai manages bookings, reschedules, and confirmations seamlessly.",
      icon: <Calendar size={32} />,
    },
    {
      title: "Survey & Feedback Calls",
      desc: "Gather valuable customer insights automatically, without human intervention.",
      icon: <ClipboardList size={32} />,
    },
    {
      title: "Collections & Reminders",
      desc: "Automate payment reminders and reduce overdue payments effortlessly with Paul.ai.",
      icon: <Receipt size={32} />,
    },
    {
      title: "HR & Recruitment",
      desc: "Paul.ai pre-screens candidates, schedules interviews, and follows up automatically.",
      icon: <Users size={32} />,
    },
    {
      title: "Custom Development",
      desc: "Tailored AI solutions from Paul.ai, designed to meet your unique business needs.",
      icon: <Code size={32} />,
    },
  ];

  return (
    <section className="py-24 px-6 md:px-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="px-4 py-1 glass rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary mb-6"
        >
          Use Cases
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white tracking-tighter"
        >
          Who Benefits from <span className="text-brand-primary">Paul.ai</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg mt-6 max-w-2xl font-medium"
        >
          Sales & Lead Generation – Let Paul handle cold calls, lead qualification, and follow-ups so you can focus on closing deals.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
        {useCases.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <LandCard
              subtitle={item.title}
              desc={item.desc}
              icon={item.icon}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 flex flex-col items-center glass p-10 rounded-[3rem] max-w-4xl mx-auto text-center"
      >
        <p className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-8">
          Ready to transform your workflow?
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="group px-10 py-4 bg-brand-primary text-white rounded-full font-bold hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>Request a Connections</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
}

export default UseCases;
