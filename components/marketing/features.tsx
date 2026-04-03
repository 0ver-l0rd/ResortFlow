"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Calendar, 
  Layers,
  Brain,
  Zap,
  CheckCircle2
} from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Sub-Component: Live-Action "In Action" Studio Animation ---

const LiveActionStudio = () => {
  const [step, setStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Create a 5-star spa reel for the weekend...";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 0) {
      // Typewriter
      let charIndex = 0;
      timer = setInterval(() => {
        setDisplayText(fullText.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === fullText.length) {
          clearInterval(timer);
          setTimeout(() => setStep(1), 800);
        }
      }, 40);
    } else if (step === 1) {
      // "Thinking"
      timer = setTimeout(() => setStep(2), 2000);
    } else if (step === 2) {
      // "Finished"
      timer = setTimeout(() => {
        setStep(0);
        setDisplayText("");
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-[55%] lg:top-[50%] p-8 lg:p-10 pointer-events-none overflow-hidden">
       <div className="w-full h-full relative flex flex-col items-center">
          
          <AnimatePresence mode="wait">
             {step === 0 && (
               <motion.div 
                 key="typing"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="w-full max-w-[280px] bg-white p-4 rounded-2xl border border-black/5 shadow-xl flex flex-col gap-3"
               >
                  <div className="flex items-center gap-2">
                     <Brain className="w-3 h-3 text-[#635bff]" />
                     <span className="text-[8px] font-black text-[#635bff] uppercase tracking-widest">AI Prompting</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-black/5 rounded-xl min-h-[50px] flex items-center">
                     <p className="text-[10px] font-bold text-[#1a1f36] leading-relaxed">
                        {displayText}
                        <span className="inline-block w-1 h-3 bg-[#635bff] ml-1 animate-pulse" />
                     </p>
                  </div>
               </motion.div>
             )}

             {step === 1 && (
               <motion.div 
                 key="thinking"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.2 }}
                 className="flex flex-col items-center gap-4 py-4"
               >
                  <div className="relative">
                     <div className="w-16 h-16 rounded-full bg-[#635bff]/10 flex items-center justify-center animate-spin duration-[4s]">
                        <Sparkles className="w-8 h-8 text-[#635bff]" />
                     </div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-[#635bff]/20" 
                     />
                  </div>
                  <p className="text-[9px] font-black text-[#635bff] uppercase tracking-widest animate-pulse">Orchestrating Asset...</p>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div 
                 key="output"
                 initial={{ opacity: 0, scale: 0.9, y: 60, rotateX: 15 }}
                 animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                 exit={{ opacity: 0 }}
                 className="w-full max-w-[240px] bg-white rounded-3xl border border-black/5 shadow-2xl overflow-hidden shadow-[#635bff]/10"
               >
                  {/* High-Fidelity Instagram Mockup */}
                  <div className="p-3 border-b border-black/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-[#E1306C] p-[1.5px]">
                           <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-slate-100" />
                           </div>
                        </div>
                        <span className="text-[8px] font-black text-[#1a1f36]">azure_resort</span>
                     </div>
                     <span className="text-[10px] text-[#8792a2]">• • •</span>
                  </div>

                  <div className="h-32 bg-gradient-to-br from-[#635bff] to-[#7a73ff] flex items-center justify-center relative">
                     <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20">
                        <FaInstagram className="text-white w-2.5 h-2.5" />
                        <span className="text-white font-black text-[7px] uppercase tracking-widest tracking-tighter">SCHEDULED</span>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl shadow-black/10">
                        <Zap className="w-5 h-5 text-white animate-pulse" />
                     </div>
                  </div>

                  <div className="p-4 space-y-3 bg-white">
                     <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-3">
                           <div className="w-3.5 h-3.5 border-2 border-[#1a1f36] rounded-sm" />
                           <div className="w-3.5 h-3.5 border-2 border-[#1a1f36] rounded-full" />
                           <div className="w-3.5 h-3.5 border-2 border-[#1a1f36] rotate-45" />
                        </div>
                        <div className="w-3.5 h-4 border-2 border-[#1a1f36] rounded-sm" />
                     </div>
                     <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                        <div className="h-1.5 w-[70%] bg-slate-100 rounded-full" />
                     </div>
                     <div className="pt-2 flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-[#efffee] border border-[#09825d]/10 flex items-center gap-1">
                           <CheckCircle2 className="w-2.5 h-2.5 text-[#09825d]" />
                           <span className="text-[7px] font-black text-[#09825d] uppercase">AI OPTIMIZED</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>

       </div>
    </div>
  );
};

const featureCards = [
  {
    id: "content-studio",
    title: "AI Content Studio",
    desc: "Generate resort-ready posts for Instagram, Facebook, and TikTok in seconds. Our AI understands your brand voice and visual aesthetic completely.",
    icon: Sparkles,
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/10",
    span: "md:col-span-2 md:row-span-2",
    stat: "5x Production Speed"
  },
  {
    id: "auto-reply",
    title: "Omni-Channel Reply",
    desc: "AI handles guest comments across all 10+ platforms, ensuring no inquiry goes unanswered.",
    icon: MessageSquare,
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
    span: "md:col-span-1 md:row-span-1",
    stat: "98% Response Rate"
  },
  {
    id: "segmentation",
    title: "Guest Segmentation",
    desc: "Target luxury suite guests vs family travelers with AI precision for resort offers.",
    icon: Users,
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
    span: "md:col-span-1 md:row-span-1",
    stat: "22% Conversion Lift"
  },
  {
    id: "analytics",
    title: "Growth Intelligence",
    desc: "Real-time RevPAR and engagement tracking in one unified view. Data-driven decisions for your resort property.",
    icon: BarChart3,
    color: "text-[#1a1f36]",
    bg: "bg-slate-100",
    span: "md:col-span-2 md:row-span-1",
    stat: "Real-time Metrics"
  },
  {
    id: "scheduler",
    title: "Smart Scheduler",
    desc: "Autonomous resort campaign planning and execution based on booking trends.",
    icon: Calendar,
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/5",
    span: "md:col-span-1 md:row-span-1",
    stat: "Hands-free Planning"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#f6f9fc] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <h2 className="text-[40px] md:text-[56px] font-black text-[#1a1f36] leading-[1.05] tracking-tight mb-6">
            The Intelligence Hub <br />
            <span className="text-[#635bff] italic">For Resort Growth.</span>
          </h2>
          <p className="text-xl text-[#3c4257] font-medium leading-relaxed opacity-80">
            From content creation to revenue tracking, every tool is designed to eliminate manual marketing and maximize your booking potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] lg:auto-rows-[330px] gap-6 lg:gap-8 max-w-7xl mx-auto">
           {featureCards.map((feat, i) => (
             <div 
                key={feat.id} 
                className={cn(
                  "p-8 lg:p-10 rounded-[2.5rem] border border-black/5 bg-[#f8fafc] hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden",
                  feat.span
                )}
             >
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tr from-[#635bff]/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", feat.bg)}>
                      <feat.icon className={cn("w-7 h-7", feat.color)} />
                   </div>
                   <div className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em] group-hover:text-[#635bff] transition-colors bg-white px-3 py-1 rounded-full border border-black/5 shadow-sm">
                      {feat.stat}
                   </div>
                </div>

                <div className="relative z-10 flex-1">
                   <h3 className="text-2xl font-black text-[#1a1f36] mb-4 tracking-tight group-hover:text-[#635bff] transition-colors leading-none">{feat.title}</h3>
                   <p className={cn(
                     "text-sm font-semibold text-[#8792a2] leading-relaxed transition-all",
                     feat.span?.includes("row-span-2") ? "line-clamp-none max-w-xs" : "line-clamp-2"
                   )}>
                      {feat.desc}
                   </p>
                </div>

                {/* Specific Live-Action Animation for Content Studio */}
                {feat.id === "content-studio" && <LiveActionStudio />}

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
