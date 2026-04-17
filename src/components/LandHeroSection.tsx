import { motion } from "framer-motion";
import Header from "../components/HeaderLanding";
import heroVideo from "../assets/Videos/herobg.mp4";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

function LandHeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[45rem] md:h-screen overflow-hidden bg-dark-bg">
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

      {/* Themed Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/40 to-dark-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)]" />

      {/* Header */}
      <Header />

      {/* HERO CONTENT */}
      <div className="relative z-10 container mx-auto h-full px-6 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/70">
            Paul.ai - The Next Generation Calling Agent
          </p>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight tracking-tighter"
        >
          Smarter <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">Calls</span>
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 text-3xl sm:text-5xl md:text-7xl font-light tracking-tight text-white/90"
        >
          Better Conversations.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-2xl mx-auto text-gray-400 text-sm sm:text-lg md:text-xl font-medium leading-relaxed"
        >
          Spending too much time on repetitive calls? Let Paul.ai handle your outreach, support, and follow-ups with lifelike AI - freeing you to focus on growth.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 items-center"
        >
          <button
            onClick={() => navigate("/call")}
            className="group relative px-8 py-4 bg-brand-primary rounded-full font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => navigate("/call")}
            className="group px-8 py-4 glass rounded-full font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Play size={18} className="fill-brand-secondary text-brand-secondary" />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default LandHeroSection;
