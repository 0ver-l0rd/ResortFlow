"use client";

import React, { useRef } from "react";
import { 
  Database, 
  Target, 
  Zap, 
  TrendingUp, 
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

const workflowSteps = [
  {
    title: "Eco-Sync",
    desc: "Seamlessly ingest real-time data from your Resort PMS, Social Hubs, and Guest CRMs to create a unified intelligence layer.",
    icon: Database,
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/5",
    accent: "#635bff",
    tag: "PMS Integration"
  },
  {
    title: "Goal Framing",
    desc: "Define your high-level objective: 'Shift occupancy by 15%' or 'Max out Q3 Spa RevPAR'. Your AI Agent handles the rest.",
    icon: Target,
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
    accent: "#09825d",
    tag: "Revenue Strategy"
  },
  {
    title: "Auto-Build",
    desc: "Social Copilot autonomously constructs, schedules, and iterates on campaign strategies across all platforms in milliseconds.",
    icon: Zap,
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
    accent: "#f5a623",
    tag: "Creative Forge"
  },
  {
    title: "Profit Pulse",
    desc: "Track every dollar of influenced revenue and guest engagement through the real-time AI attribution engine.",
    icon: TrendingUp,
    color: "text-[#1a1f36]",
    bg: "bg-slate-100",
    accent: "#1a1f36",
    tag: "Attribution"
  }
];

export function HowItWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="workflow" className="py-32 md:py-48 bg-[#fcfdfe] relative overflow-hidden" ref={containerRef}>
      {/* Decorative High-Fidelity Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#635bff]/5 via-transparent to-transparent blur-[120px] opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-[#e3e8ef] shadow-sm mb-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#635bff] rounded-full blur-[4px] animate-pulse opacity-40" />
              <Bot className="w-4 h-4 text-[#635bff] relative" />
            </div>
            <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.25em]">Precision Workflow</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[44px] md:text-[80px] font-black text-[#1a1f36] leading-[0.95] tracking-[-0.04em] mb-12"
          >
            The Resort AI Workflow. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635bff] to-[#a29bfe] italic">Simple & Strategic.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#3c4257] font-semibold leading-relaxed max-w-3xl mx-auto tracking-tight opacity-90"
          >
            We've condensed resort growth into a simplified, 4-step autonomous engine. Capture every revenue opportunity without lifting a finger.
          </motion.p>
        </div>

        {/* High-Fidelity Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 max-w-7xl mx-auto relative px-4">
           {/* Connecting Animated Path (Desktop) */}
           <div className="hidden lg:block absolute top-[80px] left-[10%] right-[10%] -z-10 h-10 overflow-visible pointer-events-none">
             <svg width="100%" height="20" viewBox="0 0 1000 20" fill="none" preserveAspectRatio="none">
               <motion.path 
                  d="M 0 10 L 1000 10" 
                  stroke="#e3e8ef" 
                  strokeWidth="2" 
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, ease: "easeInOut" }}
               />
               <motion.circle 
                  cx="0" cy="10" r="4" fill="#635bff"
                  animate={{ cx: [0, 1000] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="opacity-40"
               />
             </svg>
           </div>

           {workflowSteps.map((step, i) => (
             <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center group relative pt-4"
             >
                <div className="mb-10 relative">
                   {/* Step Number Indicator */}
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-[#e3e8ef] flex items-center justify-center font-black text-[11px] text-[#8792a2] shadow-2xl group-hover:text-[#635bff] group-hover:border-[#635bff]/30 transition-all z-20">
                      0{i + 1}
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        className="absolute inset-0 bg-[#635bff]/5 rounded-full -z-10"
                      />
                   </div>
                   
                   {/* Icon Architecture */}
                   <div className="w-[160px] h-[160px] rounded-[3.5rem] flex items-center justify-center transition-all duration-700 shadow-premium-subtle group-hover:shadow-2xl group-hover:-translate-y-4 relative overflow-hidden bg-white border border-[#e3e8ef] group-hover:border-[#635bff]/30">
                      {/* Internal Hover Elements */}
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700", step.bg)} />
                      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#635bff]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Main Icon Vessel */}
                      <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center relative z-10 transition-transform duration-700 group-hover:scale-110 shadow-sm",
                        step.bg,
                        "border border-white/50"
                      )}>
                         <step.icon className={cn("w-9 h-9", step.color)} />
                         {/* Particle Glint */}
                         <motion.div 
                           animate={{ 
                             opacity: [0, 1, 0],
                             scale: [0.8, 1.1, 0.8],
                             rotate: [0, 45, 0]
                           }}
                           transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                           className="absolute -top-1 -right-1"
                         >
                           <Sparkles className="w-4 h-4 text-[#635bff]/20" />
                         </motion.div>
                      </div>
                      
                      {/* Dynamic Scan Bar */}
                      <motion.div 
                         animate={{ top: ['-20%', '120%'] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
                         className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#635bff]/10 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                   </div>

                   {/* Desktop Arrow Indicator - Premium Version */}
                   {i < workflowSteps.length - 1 && (
                     <div className="hidden lg:flex absolute top-1/2 -right-10 items-center justify-center w-6 h-6 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] opacity-40 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3.5 h-3.5 text-[#1a1f36]" />
                     </div>
                   )}
                </div>

                <div className="space-y-5 px-6 text-center transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                   <div className="space-y-2">
                       <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.25em] mb-1">{step.tag}</p>
                       <h3 className="text-2xl font-black text-[#1a1f36] tracking-[-0.02em] group-hover:text-[#635bff] transition-colors duration-500">
                          {step.title}
                       </h3>
                   </div>
                   <p className="text-[15px] font-semibold text-[#8792a2] leading-relaxed group-hover:text-[#1a1f36] transition-colors duration-500 line-clamp-3">
                      {step.desc}
                   </p>
                </div>

                {/* Floating Reflection Effect */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-[#1a1f36]/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
