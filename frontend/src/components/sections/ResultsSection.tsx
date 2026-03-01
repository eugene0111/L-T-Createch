import { motion } from "framer-motion";
import { CheckCircle2, DollarSign, Clock, Layers, Zap, AlertTriangle, FlaskConical } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { ScanLine } from "../ui/ScanLine";

interface ResultsSectionProps {
  result: {
    metrics: Record<string, number>;
    insight: string;
    tracker_data: {
      categories: string[];
      before: number[];
      after: number[];
    };
  };
  inputs: Record<string, number>;
  handleDownloadPDF: () => void;
  downloadingReport: boolean;
}

export function ResultsSection({ result, inputs, handleDownloadPDF, downloadingReport }: ResultsSectionProps) {
  if (!result) return null;

  return (
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
            
            {result.tracker_data.categories.map((category: string, i: number) => {
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

      {/* Graphical Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Mix Composition Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-display font-bold text-white text-lg tracking-tight">Mix Composition Breakdown</h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Cement', value: inputs.cement_content },
                    { name: 'Water', value: inputs.cement_content * inputs.wc_ratio },
                    { name: 'SCM', value: inputs.cement_content * (inputs.scm_pct / 100) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Cement', value: inputs.cement_content },
                    { name: 'Water', value: inputs.cement_content * inputs.wc_ratio },
                    { name: 'SCM', value: inputs.cement_content * (inputs.scm_pct / 100) },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#fec00f', '#4ade80', '#ffffff'][index % 3]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | string | undefined) => [`${Number(value || 0).toFixed(1)} kg`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Radar className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-white text-lg tracking-tight">Risk Footprint (Baseline vs AI)</h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                result.tracker_data.categories.map((cat: string, i: number) => ({
                  subject: cat.split(' ')[0], // Shorten name for chart
                  Baseline: result.tracker_data.before[i],
                  Optimized: result.tracker_data.after[i],
                  fullMark: 40,
                }))
              }>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                <Radar name="Baseline Risk" dataKey="Baseline" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)" fillOpacity={0.6} />
                <Radar name="AI Optimized Risk" dataKey="Optimized" stroke="#4ade80" fill="#4ade80" fillOpacity={0.5} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1c23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | string | undefined) => [`${value}%`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Actions Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end mt-8"
      >
        <button
          onClick={handleDownloadPDF}
          disabled={downloadingReport}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl border font-display font-semibold transition-all ${
            downloadingReport 
            ? "bg-white/5 border-white/10 text-white/40 cursor-wait" 
            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-95"
          }`}
        >
          {downloadingReport ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full"
              />
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Executive Report (PDF)
            </>
          )}
        </button>
      </motion.div>
    </motion.section>
  );
}
