import { motion, useTransform, MotionValue } from "framer-motion";
import { ParticleField } from "../ui/ParticleField";
import { Cpu, Zap, BarChart3 } from "lucide-react";

export function HeroSection({ heroOpacity, heroY, heroRef }: { heroOpacity: MotionValue<number>; heroY: MotionValue<number>; heroRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.section
      ref={heroRef}
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto"
    >
      <ParticleField />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[20vw] font-bold text-white/[0.02] tracking-tighter whitespace-nowrap">
          CONCRETE
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-12 bg-brand-yellow" />
        </div>

        <h1 className="font-display text-6xl sm:text-8xl font-bold leading-[0.9] tracking-tighter mb-8">
          <span className="block text-white">PRECAST</span>
          <span className="block text-white">DIGITAL</span>
          <span className="block relative">
            <span className="text-brand-yellow">CHEMIST</span>
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-brand-yellow"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        </h1>

        <p className="text-white/50 text-xl font-light max-w-xl leading-relaxed">
          Revolutionizing L&T yard operations through continuous AI-driven optimization. Days of trial-and-error distilled into milliseconds of computation.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
      >
        {[
          { label: "Optimization Speed", value: "< 2ms", icon: Zap },
          { label: "Algorithm", value: "Genetic Evo.", icon: Cpu },
          { label: "Model Accuracy", value: "99.8%", icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors px-8 py-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand-yellow" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-xl">{value}</div>
              <div className="text-white/30 text-xs font-medium tracking-wide mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
