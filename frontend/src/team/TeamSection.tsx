"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { teamData } from "./TeamData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function TeamSection() {
  return (
    <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto border-t border-white/5 mt-16">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-yellow/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Meet Team <span className="text-brand-yellow">THASSA</span>
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          A multidisciplinary collective of concrete technologists, data
          scientists, and engineers dedicated to driving the digital
          transformation of precast construction.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
      >
        {teamData.map((member) => (
          <motion.div
            key={member.id}
            variants={itemVariants}
            className="group relative bg-[#15171e] rounded-3xl p-1 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(254,192,15,0.15)]"
          >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-brand-yellow/5 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-lt-dark rounded-[22px] p-8 h-full flex flex-col items-center text-center border border-white/5 group-hover:border-brand-yellow/20 transition-colors duration-500">
              {/* Avatar Ring */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-brand-yellow/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-br from-brand-yellow/50 to-white/10 overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full bg-[#1a1c23]"
                  />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-brand-yellow transition-colors duration-300">
                {member.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
