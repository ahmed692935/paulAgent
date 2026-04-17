import soundImg from "../assets/Images/soundwave.webp";
import { motion } from "framer-motion";

function BannerLand() {
  return (
    <div className="py-24 px-6 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full h-[15rem] sm:h-[22rem] md:h-[30rem] rounded-[4rem] overflow-hidden glass border-white/5"
        >
          <img
            src={soundImg}
            alt="sound wave"
            loading="lazy"
            className="w-full h-full object-cover mix-blend-screen opacity-20 filter invert grayscale"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-brand-accent/10 pointer-events-none animate-pulse-slow" />

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 flex items-center justify-center font-black text-[20vw] whitespace-nowrap select-none pointer-events-none text-white/[0.03] tracking-tighter"
          >
            PAUL.AI
          </motion.h2>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Purely <span className="text-brand-primary">Neural.</span>
              </h3>
              <p className="text-gray-400 max-w-md mx-auto text-lg font-medium leading-relaxed">
                Driven by the most advanced language models in existence, 
                powering the next generation of human-AI interaction.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BannerLand;
