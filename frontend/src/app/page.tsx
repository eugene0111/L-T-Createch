"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import TeamSection from "../team/TeamSection";

// Import modular sections
import { HeroSection } from "@/components/sections/HeroSection";
import { OptimizationForm } from "@/components/sections/OptimizationForm";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { ChatbotUI } from "@/components/sections/ChatbotUI";

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

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { role: "user", content: chatInput.trim() };
    const updatedHistory = [...chatHistory, newMessage];
    
    setChatHistory(updatedHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory }),
      });
      
      if (!res.ok) throw new Error("Failed to send message.");
      
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "model", content: data.response }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "model", content: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setChatLoading(false);
    }
  };

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

  const [downloadingReport, setDownloadingReport] = useState<boolean>(false);
  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloadingReport(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: result.metrics,
          insight: result.insight
        }),
      });
      
      if (!res.ok) throw new Error("Failed to generate PDF.");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "LT_Precast_Optimization_Report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(err);
      setError("Failed to download executive report.");
    } finally {
      setDownloadingReport(false);
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-lt-dark/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-yellow rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-lt-dark text-xs tracking-tight">L&T</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <span className="font-display font-semibold text-sm text-white/70 tracking-wide uppercase">Precast Digital Chemist</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection heroOpacity={heroOpacity} heroY={heroY} heroRef={heroRef} />

      {/* Main Control */}
      <OptimizationForm 
        inputs={inputs} 
        setInputs={setInputs} 
        loading={loading} 
        handleOptimize={handleOptimize} 
      />

      {/* Error Message */}
      {error && (
        <section className="px-6 max-w-7xl mx-auto mt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4">
            <div>
              <div className="font-display font-semibold text-red-300 text-sm">OPTIMIZATION FAILED</div>
              <p className="text-red-400/70 text-sm mt-1">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {!loading && result && (
        <ResultsSection 
          result={result} 
          inputs={inputs} 
          handleDownloadPDF={handleDownloadPDF} 
          downloadingReport={downloadingReport} 
        />
      )}

      {/* Team Section */}
      <TeamSection />

      {/* Footer Placeholder for visual padding */}
      <div className="h-32" />

      {/* Chatbot Navigation injected at root level */}
      <ChatbotUI 
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatHistory={chatHistory}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatLoading={chatLoading}
        handleSendMessage={handleSendMessage}
        chatEndRef={chatEndRef}
      />
    </div>
  );
}
