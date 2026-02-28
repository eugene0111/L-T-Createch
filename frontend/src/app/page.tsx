"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Cpu, DollarSign, Clock, CheckCircle2, FlaskConical, AlertTriangle, ChevronRight, Zap, BarChart3, Layers } from "lucide-react";
import dotenv from "dotenv";

interface OptimizationResult {
  metrics: {
    "Strength gain rate": number;
    "Demould time": number;
    "Cost per element": number;
    "Energy consumption": number;
    "Mold utilization": number;
    "Risk of under-strength": number;
  };
  insight: string;
  tracker_data: {
    categories: string[];
    before: number[];
    after: number[];
  };
}

// Animated counter hook
function useCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useCounter(value);
  return <>{count.toFixed(decimals)}</>;
}

// Particle field component
function ParticleField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-brand-yellow rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Scanning line animation
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/60 to-transparent pointer-events-none z-10"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function Home() {
  const [inputs, setInputs] = useState({
    cement_content: 400,
    wc_ratio: 0.42,
    scm_pct: 25,
    ramp_rate: 20,
    hold_temperature: 65,
    ambient_temperature: 32,
    maturity_index: 550,
    mold_availability: 85,
    energy_tariff: 7
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -60]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleOptimize = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    const startTime = Date.now();
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (!res.ok) throw new Error("Failed to optimize. Ensure the backend is running.");
      const data = await res.json();
      const elapsed = Date.now() - startTime;
      if (elapsed < 1800) await new Promise(r => setTimeout(r, 1800 - elapsed));
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lt-dark text-white overflow-x-hidden font-body">

      {/* Cursor glow follower */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          background: "radial-gradient(circle, rgba(254,192,15,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Top nav bar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-lt-dark/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-yellow rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-lt-dark text-xs tracking-tight">L&T</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <span className="font-display font-semibold text-sm text-white/70 tracking-wide uppercase">Precast Digital Chemist</span>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
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

      {/* Main Control */}
      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-brand-yellow/40 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-brand-yellow/20 rounded-br-3xl pointer-events-none" />

          <div className="p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row gap-12 items-center">

              {/* Slider */}
              <div className="flex-1 w-full space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "cement_content", label: "Cement (kg/m³)", min: 200, max: 600, step: 1 },
                    { key: "wc_ratio", label: "W/C Ratio", min: 0.20, max: 0.70, step: 0.01 },
                    { key: "scm_pct", label: "SCM %", min: 0, max: 60, step: 1 },
                    { key: "ramp_rate", label: "Ramp (°C/hr)", min: 5, max: 40, step: 1 },
                    { key: "hold_temperature", label: "Hold Temp (°C)", min: 20, max: 85, step: 1 },
                    { key: "ambient_temperature", label: "Ambient (°C)", min: 10, max: 50, step: 1 },
                    { key: "maturity_index", label: "Maturity Target", min: 200, max: 1000, step: 1 },
                    { key: "mold_availability", label: "Mold Avail (%)", min: 50, max: 100, step: 1 },
                    { key: "energy_tariff", label: "Tariff (₹/kWh)", min: 2.0, max: 15.0, step: 0.1 }
                  ].map((field) => (
                    <div key={field.key} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-colors hover:border-brand-yellow/30">
                      <div className="text-[10px] font-mono tracking-[0.1em] text-white/40 uppercase mb-2">
                        {field.label}
                      </div>
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={(inputs as any)[field.key]}
                        onChange={(e) => setInputs({ ...inputs, [field.key]: parseFloat(e.target.value) || field.min })}
                        className="w-full bg-transparent text-white font-display font-semibold text-2xl outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0">
                <motion.button
                  whileHover={!loading ? { scale: 1.03 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  onClick={handleOptimize}
                  disabled={loading}
                  className={`relative w-64 h-64 rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden group ${
                    loading
                      ? "border-white/10 bg-white/[0.02] cursor-not-allowed"
                      : "border-brand-yellow/50 bg-brand-yellow/5 hover:bg-brand-yellow/10 hover:border-brand-yellow cursor-pointer"
                  }`}
                >
                  {/* Rotating ring */}
                  {loading && (
                    <motion.div
                      className="absolute inset-2 rounded-full border-2 border-transparent border-t-brand-yellow"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Hover fill */}
                  <motion.div
                    className="absolute inset-0 bg-brand-yellow rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center opacity-0 group-hover:opacity-5"
                  />

                  {loading ? (
                    <>
                      <div className="text-brand-yellow/60 font-mono text-xs tracking-[0.3em] uppercase">EVOLVING</div>
                      <div className="font-display font-bold text-white text-xl">Algorithm</div>
                      <motion.div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-brand-yellow"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                          />
                        ))}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-8 h-8 text-brand-yellow" />
                      <div className="text-center">
                        <div className="font-display font-bold text-white text-lg leading-tight">GENERATE</div>
                        <div className="font-display font-bold text-brand-yellow text-lg leading-tight">AI RECIPE</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-yellow/60 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-display font-semibold text-red-300 text-sm">OPTIMIZATION FAILED</div>
                <p className="text-red-400/70 text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 pb-24 max-w-7xl mx-auto space-y-6"
          >
            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent origin-left"
            />

            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-white/40 text-xs tracking-[0.2em] uppercase">Optimal AI Output Generated</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Cost/Element */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group bg-white/[0.03] border border-white/8 rounded-2xl p-8 overflow-hidden hover:border-brand-yellow/20 transition-colors"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                  <DollarSign className="w-28 h-28" />
                </div>
                <div className="font-mono text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Cost / Element</div>
                <div className="font-display font-bold text-5xl text-white tracking-tighter">
                  ₹<AnimatedNumber value={result.metrics["Cost per element"]} decimals={0} />
                </div>
              </motion.div>

              {/* Demould Time */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-brand-yellow rounded-2xl p-8 overflow-hidden group"
              >
                <ScanLine />
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Clock className="w-28 h-28 text-lt-dark" />
                </div>
                <div className="font-mono text-lt-dark/60 text-xs tracking-[0.2em] uppercase mb-4">Demould Time</div>
                <div className="font-display font-bold text-5xl text-lt-dark tracking-tighter flex items-baseline gap-2">
                  <AnimatedNumber value={result.metrics["Demould time"]} decimals={1} />
                  <span className="text-2xl font-display font-semibold text-lt-dark/50">hrs</span>
                </div>
              </motion.div>

              {/* Strength Rate */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative group bg-white/[0.03] border border-white/8 rounded-2xl p-8 overflow-hidden hover:border-emerald-500/20 transition-colors"
             >
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                  <Layers className="w-28 h-28" />
                </div>
                <div className="font-mono text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Strength Rate</div>
                <div className="font-display font-bold text-5xl text-emerald-400 tracking-tighter flex items-baseline gap-2">
                  <AnimatedNumber value={result.metrics["Strength gain rate"]} decimals={2} />
                  <span className="text-2xl font-display font-semibold text-emerald-400/40">MPa/hr</span>
                </div>
              </motion.div>

              {/* Mold Utilization */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative group bg-white/[0.03] border border-white/8 rounded-2xl p-8 overflow-hidden hover:border-emerald-500/20 transition-colors"
             >
                <div className="font-mono text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Mold Utilization</div>
                <div className="font-display font-bold text-5xl text-emerald-400 tracking-tighter flex items-baseline gap-2">
                  <AnimatedNumber value={result.metrics["Mold utilization"]} decimals={1} />
                  <span className="text-2xl font-display font-semibold text-emerald-400/40">%</span>
                </div>
              </motion.div>

              {/* Energy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative group bg-white/[0.03] border border-white/8 rounded-2xl p-8 overflow-hidden hover:border-brand-yellow/20 transition-colors"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                  <Zap className="w-28 h-28" />
                </div>
                <div className="font-mono text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Energy Consumed</div>
                <div className="font-display font-bold text-5xl text-white tracking-tighter flex items-baseline gap-2">
                  <AnimatedNumber value={result.metrics["Energy consumption"]} decimals={0} />
                  <span className="text-2xl font-display font-semibold text-white/40">kWh</span>
                </div>
              </motion.div>

              {/* Under-Strength Risk */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative group bg-white/[0.03] border border-white/8 rounded-2xl p-8 overflow-hidden hover:border-brand-yellow/20 transition-colors"
             >
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                  <AlertTriangle className="w-28 h-28" />
                </div>
                <div className="font-mono text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Under-Strength Risk</div>
                <div className="font-display font-bold text-5xl text-brand-yellow tracking-tighter flex items-baseline gap-2">
                  <AnimatedNumber value={result.metrics["Risk of under-strength"]} decimals={2} />
                  <span className="text-2xl font-display font-semibold text-brand-yellow/40">%</span>
                </div>
              </motion.div>

            </div>

            {/* AI Insights & Risk Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* AI Diagnostic Insights Box */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-display font-bold text-white text-lg tracking-tight">AI Diagnostic Insights</h3>
                </div>
                <div className="prose prose-invert prose-brand-yellow max-w-none text-sm leading-relaxed whitespace-pre-line text-white/80">
                  {result.insight}
                </div>
              </motion.div>

              {/* Risk De-escalation Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-display font-bold text-white text-lg tracking-tight">Risk De-escalation Tracker</h3>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between text-xs font-mono text-white/40 mb-2 px-2">
                    <span>RISK CATEGORY</span>
                    <div className="flex gap-12">
                      <span>BASELINE</span>
                      <span className="text-emerald-400">AI OPTIMIZED</span>
                    </div>
                  </div>
                  
                  {result.tracker_data.categories.map((category, i) => {
                    const before = result.tracker_data.before[i];
                    const after = result.tracker_data.after[i];
                    
                    return (
                      <div key={category} className="group relative">
                        <div className="flex items-center justify-between text-sm mb-1.5 px-2">
                          <span className="text-white/80">{category}</span>
                          <div className="flex items-center gap-12 font-mono tabular-nums">
                            <span className="text-white/40">{before}%</span>
                            <span className="text-emerald-400 font-bold w-8 text-right">{after}%</span>
                          </div>
                        </div>
                        
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                          {/* Before bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${before}%` }}
                            transition={{ duration: 1, delay: 0.8 + (i * 0.1), ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-white/10 rounded-full"
                          />
                          {/* After bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${after}%` }}
                            transition={{ duration: 1.2, delay: 1 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-white/20 text-xs">Team THASSA</span>
        </div>
      </footer>
    </div>
  );
}
