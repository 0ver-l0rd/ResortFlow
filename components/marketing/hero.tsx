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
  PenSquare
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
          { id: 1, label: "RevPAR Velocity", value: "+24.8%", icon: TrendingUp, color: "text-[#09825d]", bg: "bg-[#efffee]", position: "-top-24 right-10" },
          { id: 2, label: "Direct Share", value: "84%", icon: Target, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-28 left-10" }
        ];
      case "Compose":
        return [
          { id: 1, label: "Drafting Score", value: "98.4%", icon: PenSquare, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-top-32 left-12" },
          { id: 2, label: "Media Match", value: "Perfect", icon: Sparkles, color: "text-[#f5a623]", bg: "bg-[#fff9f0]", position: "-bottom-24 right-12" }
        ];
      case "Calendar":
        return [
          { id: 1, label: "Campaign Load", value: "Balanced", icon: Calendar, color: "text-[#f5a623]", bg: "bg-[#fff9f0]", position: "-top-28 right-16" },
          { id: 2, label: "Optimized Slots", value: "14/14", icon: Sparkles, color: "text-[#635bff]", bg: "bg-[#eff6ff]", position: "-bottom-28 left-16" }
        ];
      case "Connections":
        return [
          { id: 1, label: "API Integrity", value: "100%", icon: Link2, color: "text-[#09825d]", bg: "bg-[#efffee]", position: "-top-22 left-20" },
          { id: 2, label: "Platform Sync", value: "Active", icon: Zap, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-32 right-20" }
        ];
      case "Replies":
        return [
          { id: 1, label: "Sentiment Lift", value: "High", icon: MessageSquare, color: "text-[#09825d]", bg: "bg-[#ecfdf5]", position: "-top-32 right-20" },
          { id: 2, label: "Auto-Response", value: "Active", icon: Brain, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-bottom-28 left-20" }
        ];
      default:
        return [
          { id: 1, label: "Agent Status", value: "Active", icon: Brain, color: "text-[#635bff]", bg: "bg-[#635bff]/5", position: "-top-24 left-1/2 -translate-x-1/2" },
        ];
    }
  };

  const floatingCards = getFloatingContent();

  return (
    <section id="hero" className="relative pt-32 pb-40 md:pt-48 md:pb-64 overflow-hidden bg-white">
      {/* Stripe-Level Light Mesh Gradient Background */}
      <div className="absolute inset-x-0 top-0 h-[1000px] pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#635bff]/5 to-transparent blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-[#7f78ff]/5 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-gradient-to-tr from-blue-400/5 to-transparent blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Core Hero Content: Minimalistic White Theme */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] mb-10 transition-all hover:shadow-md cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#635bff]" />
            <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Resort AI Marketing Agent</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] md:text-[64px] xl:text-[82px] font-black tracking-tight text-[#1a1f36] leading-[1.05] mb-10"
          >
            Your AI <span className="text-[#635bff]">Marketing</span> <br />
            <span className="text-[#635bff] italic">Team for Resorts.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#697386] font-medium mb-14 max-w-2xl mx-auto leading-relaxed"
          >
            Automate campaigns, personalize guest experiences, and increase bookings — all with one autonomous agent.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <SignUpButton mode="modal">
              <Button className="h-18 px-12 text-[18px] bg-[#635bff] hover:bg-[#4f46e5] text-white font-black rounded-2xl shadow-[0_20px_50px_rgba(99,91,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Start Free
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </SignUpButton>
            
            <Button variant="ghost" className="h-18 px-10 text-[18px] text-[#3c4257] font-black hover:bg-[#f6f9fc] rounded-2xl border border-[#e3e8ef] bg-white transition-all">
              See Demo
            </Button>
          </motion.div>
        </div>

        {/* Dashboard Preview: Minimalist 3-Column Dash */}
        <div className="max-w-[1150px] mx-auto relative perspective-2000">
          
          {/* Interactive Indicator (Top) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center mb-12 gap-3"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#635bff]/10 border border-[#635bff]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#635bff] animate-pulse glow-pulse" />
              <span className="text-[10px] font-black text-[#635bff] uppercase tracking-[0.25em]">Interactive Product Experience</span>
            </div>
            <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-widest">Click tabs to explore the resort orchestration engine</p>
          </motion.div>

          {/* Floating State-Synced Intelligence Cards */}
          <AnimatePresence mode="wait">
            {floatingCards.map((card) => (
              <motion.div 
                key={`${activeTab}-${card.id}`}
                initial={{ opacity: 0, scale: 0.8, y: card.id === 1 ? -30 : 30 }}
                animate={{ opacity: 1, scale: 0.9, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className={cn(
                  "absolute z-40 pointer-events-none hidden xl:flex items-center gap-4 px-6 py-4 rounded-[1.5rem] bg-white shadow-premium border border-[#f0f3f7] transition-all hover:scale-100",
                  card.position
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner", card.bg)}>
                  {React.createElement(card.icon as any, {className: cn("w-5 h-5", card.color)})}
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] leading-none mb-1">{card.label}</p>
                  <p className="text-xl font-black text-[#1a1f36] tabular-nums">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Perspective Shadow/Glow */}
          <div className="absolute inset-x-20 -top-20 -bottom-20 bg-[radial-gradient(circle_at_center,#635bff0a_0%,transparent_70%)] blur-[100px] pointer-events-none" />
          <div className="absolute inset-x-40 -bottom-20 h-40 bg-gradient-to-t from-[#635bff]/5 to-transparent blur-[120px] rounded-full pointer-events-none opacity-40" />

          {/* Perspective Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 2 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              transformStyle: "preserve-3d"
            }}
            className="w-full relative group"
          >
            {/* Minimalist Dashboard Container */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-[#e3e8ef] to-[#f0f3f7] rounded-3xl -z-10" />
            
            <div className="relative rounded-3xl bg-white p-1.5 lg:p-2 shadow-[0_30px_80px_rgba(0,0,0,0.04)] border border-[#e3e8ef] overflow-hidden transition-all duration-1000 group-hover:shadow-[0_45px_100px_rgba(31,38,135,0.08)]">
               <div className="origin-top transition-all duration-1000">
                  <InteractivePreview activeTab={activeTab} setActiveTab={setActiveTab} />
               </div>
            </div>

            {/* Hint Overlay (Bottom) */}
            <motion.div 
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            >
               <MousePointer2 className="w-3.5 h-3.5 text-[#635bff]" />
               <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.4em]">Proprietary AI Architecture</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
