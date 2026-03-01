import { motion } from "framer-motion";
import { FlaskConical, ChevronRight } from "lucide-react";

interface OptimizationFormProps {
  inputs: any;
  setInputs: (inputs: any) => void;
  loading: boolean;
  handleOptimize: () => void;
}

export function OptimizationForm({ inputs, setInputs, loading, handleOptimize }: OptimizationFormProps) {
  return (
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
                      value={inputs[field.key]}
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
    </section>
  );
}
