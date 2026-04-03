"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Target,
  Brain,
  MousePointer2,
  Cpu,
  Link2,
  PenSquare,
  ChevronRight
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractivePreview } from "./InteractivePreview";

export function Hero() {
  const [activeTab, setActiveTab] = useState("Overview");

  // State-Synchronized Floating Cards (High-Fidelity Resort Logic)
  const getFloatingContent = () => {
    switch (activeTab) {
      case "Overview":
      case "Analytics":
        return [
          { id: 1, label: "RevPAR Velocity", value: "+24.8%", icon: TrendingUp, color: "text-[#09825d]", bg: "bg-[#efffee]", position: "-top-10 -right-12" },
          { id: 2, label: "Direct Share", value: "84%", icon: Target, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-12 -left-12" }
        ];
      case "Compose":
        return [
          { id: 1, label: "Drafting Score", value: "98.4%", icon: PenSquare, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-top-16 -left-14" },
          { id: 2, label: "Media Match", value: "Perfect", icon: Sparkles, color: "text-[#f5a623]", bg: "bg-[#fff9f0]", position: "-bottom-10 -right-14" }
        ];
      case "Calendar":
        return [
          { id: 1, label: "Campaign Load", value: "Balanced", icon: Calendar, color: "text-[#f5a623]", bg: "bg-[#fff9f0]", position: "-top-12 -right-16" },
          { id: 2, label: "Optimized Slots", value: "14/14", icon: Sparkles, color: "text-[#635bff]", bg: "bg-[#efffee]", position: "-bottom-12 -left-16" }
        ];
      case "Connections":
        return [
          { id: 1, label: "API Integrity", value: "100%", icon: Link2, color: "text-[#09825d]", bg: "bg-[#efffee]", position: "-top-8 -left-20" },
          { id: 2, label: "Platform Sync", value: "Active", icon: Zap, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-14 -right-20" }
        ];
      case "Replies":
        return [
          { id: 1, label: "Sentiment Lift", value: "High", icon: MessageSquare, color: "text-[#09825d]", bg: "bg-[#ecfdf5]", position: "-top-14 -right-20" },
          { id: 2, label: "Auto-Response", value: "Active", icon: Brain, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-12 -left-20" }
        ];
      default:
        return [
          { id: 1, label: "Agent Status", value: "Active", icon: Brain, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-top-10 left-1/2 -translate-x-1/2" },
        ];
    }
  };

  const floatingCards = getFloatingContent();

  return (
    <section id="hero" className="relative pt-32 pb-48 md:pt-40 md:pb-64 overflow-hidden bg-white">
      {/* Stripe-Level Complex Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_top_left,#635bff08_0%,transparent_50%)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_bottom_right,#7f78ff08_0%,transparent_50%)]" />
        <div className="absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(ellipse_at_center,#635bff05_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Centered Value Proposition */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] mb-10 group cursor-default shadow-sm transition-all hover:bg-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#635bff]" />
            <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.25em]">Resort AI Marketing Agent v2.0</span>
            <div className="w-[1px] h-3 bg-[#e3e8ef] mx-1" />
            <span className="text-[10px] font-bold text-[#635bff] uppercase tracking-widest animate-pulse">Live Demo</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[44px] md:text-[68px] xl:text-[84px] font-black tracking-[-0.035em] text-[#1a1f36] leading-[1.02] mb-10"
          >
            Your AI <span className="text-[#635bff]">Marketing Team</span> <br />
            for Resorts.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#424770] font-medium mb-14 max-w-3xl mx-auto leading-relaxed opacity-90"
          >
            Automate campaigns, personalize guest experiences, and increase bookings — all with one AI agent.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <SignUpButton mode="modal">
              <Button className="h-16 px-10 text-[18px] bg-[#635bff] hover:bg-[#4f46e5] text-white font-black rounded-2xl shadow-[0_20px_50px_rgba(99,91,255,0.18)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Start Free
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </SignUpButton>
            
            <Button variant="ghost" className="h-16 px-10 text-[18px] text-[#3c4257] font-black hover:bg-[#f6f9fc] rounded-2xl border border-[#e3e8ef] bg-white transition-all">
              See Demo
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Display: Below and Perspective Center */}
        <div className="max-w-[1100px] mx-auto relative group perspective-2000">
           {/* Interactive Display Indicator (Specific Above Preview) */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.5 }}
             className="flex flex-col items-center mb-10 gap-3"
           >
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] shadow-sm">
               <div className="w-1.5 h-1.5 rounded-full bg-[#635bff] animate-pulse glow-pulse" />
               <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.3em]">Interactive Dashboard Display</span>
             </div>
           </motion.div>
           {/* Floating State-Synced Intelligence Cards */}
           <AnimatePresence mode="wait">
            {floatingCards.map((card) => (
              <motion.div 
                key={`${activeTab}-${card.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className={cn(
                  "absolute z-40 hidden xl:flex items-center gap-4 px-6 py-4 rounded-[1.25rem] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-[#f0f3f7] transition-all hover:scale-105 group/card",
                  card.position
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner", card.bg)}>
                  {React.createElement(card.icon as any, {className: cn("w-5 h-5", card.color)})}
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] leading-none mb-1">{card.label}</p>
                  <p className="text-xl font-black text-[#1a1f36] tabular-nums tracking-tighter">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Perspective Shadow/Glow */}
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,#635bff0a_0%,transparent_70%)] blur-[100px] pointer-events-none" />
          
          {/* Dashboard Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateX: 2 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              transformStyle: "preserve-3d"
            }}
            className="w-full relative"
          >
            <div className="relative rounded-[2.5rem] bg-[#f6f9fc] p-2.5 lg:p-3.5 shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-[#e3e8ef] overflow-hidden transition-all duration-1000 group-hover:shadow-[0_70px_120px_rgba(99,91,255,0.1)]">
               <div className="bg-white rounded-[2rem] overflow-hidden border border-[#e3e8ef] shadow-sm">
                  <InteractivePreview activeTab={activeTab} setActiveTab={setActiveTab} />
               </div>
            </div>

            {/* Interaction Hint */}
            <motion.div 
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            >
               <MousePointer2 className="w-3.5 h-3.5 text-[#635bff]" />
               <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.4em]">Autonomous Resort Management Engine</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
