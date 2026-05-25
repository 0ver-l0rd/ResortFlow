"use client";

import { useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { AutopilotModal } from "./AutopilotModal";

import { motion } from "framer-motion";

interface AutopilotBannerProps {
  lastRun?: {
    timeAgo: string;
    revenueGenerated: number;
  };
}

export function AutopilotBanner({ lastRun }: AutopilotBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-[24px] relative overflow-hidden shadow-[0_12px_40px_-12px_rgba(34,42,66,0.25)] group transition-all duration-500 border border-white/5"
        style={{
          background: "linear-gradient(135deg, #0f121d 0%, #1a1f36 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2d6a4f] rounded-full blur-[120px] opacity-[0.15] translate-x-1/4 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1b4332] rounded-full blur-[100px] opacity-10 -translate-x-1/4 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="px-3 py-1 rounded-full bg-[#2d6a4f]/20 border border-[#2d6a4f]/20 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#8b84ff] fill-[#8b84ff]/20 shadow-sm" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8b84ff]">
                  Autopilot mode
                </p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.1]">
              Scale your marketing <br className="hidden lg:block"/> with autonomous AI
            </h2>
            <p className="text-[16px] text-[#a9b5c7] leading-relaxed font-medium">
              Define your business goal and let Gemini handle strategy, content creation, and cross-platform execution in real-time.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center sm:items-end gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white shadow-[0_20px_40px_-12px_rgba(99,91,255,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.6)] active:scale-[0.97] transition-all duration-300 border border-white/10 w-full sm:w-auto relative overflow-hidden group/btn"
              style={{
                background: "linear-gradient(135deg, #2d6a4f 0%, #443ae0 100%)"
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-2.5 text-[15px]">
                <Zap className="w-5 h-5 fill-white/20" />
                Run marketing agent
              </span>
            </button>
            
            <div className="flex flex-col items-center sm:items-end text-[11px] uppercase tracking-widest font-bold">
              {lastRun ? (
                <>
                  <p className="text-[#a9b5c7]">Last active {lastRun.timeAgo}</p>
                  <p className="text-[#09825d] bg-[#efffee]/5 px-2 py-0.5 rounded-md mt-1 border border-[#09825d]/20 shadow-sm">
                    ${lastRun.revenueGenerated.toLocaleString()} Generated
                  </p>
                </>
              ) : (
                <p className="text-[#a9b5c7]/60">Agent ready for deployment</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AutopilotModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}
