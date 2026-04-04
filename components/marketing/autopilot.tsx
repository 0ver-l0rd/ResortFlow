"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Brain,
  Mail,
  BarChart3,
  RefreshCcw,
  Smartphone,
  MousePointer2,
  Bot,
  Globe
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Sub-Components: The Master Planner ---

const lifecycle = [
  {
    icon: Sparkles,
    label: "MAKE",
    title: "Smart Photos",
    desc: "AI makes perfect photos for your hotel.",
    color: "text-[#2d6a4f]",
    bg: "bg-[#2d6a4f]/10",
    id: 1
  },
  {
    icon: Globe,
    label: "POST",
    title: "Post Everywhere",
    desc: "Sharing to all social media sites.",
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
    id: 2
  },
  {
    icon: TrendingUp,
    label: "GROW",
    title: "Track Your Money",
    desc: "See how much you earn from every post.",
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
    id: 3
  }
];

const ProperMiniCalendar = ({ isActive }: { isActive: boolean }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const events = [
    { day: 1, icon: FaInstagram, color: "bg-[#E1306C]", delay: 0.2, label: "Feed Post" },
    { day: 2, icon: Mail, color: "bg-[#2d6a4f]", delay: 0.8, label: "VIP Invite" },
    { day: 3, icon: FaWhatsapp, color: "bg-[#25D366]", delay: 1.4, label: "Guest DM" },
    { day: 5, icon: FaInstagram, color: "bg-[#E1306C]", delay: 2.0, label: "Luxury Reel" },
    { day: 6, icon: Zap, color: "bg-[#f5a623]", delay: 2.6, label: "Flash Sale" },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-7 gap-4 relative">
        {/* The "AI Scan" Line */}
        {isActive && (
          <motion.div 
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-transparent via-[#2d6a4f] to-transparent z-20 shadow-[0_0_15px_rgba(99,91,255,0.5)]"
          />
        )}

        {days.map((day, i) => (
          <div key={day} className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.1em] text-center">{day}</span>
            <div className="aspect-[3/4] rounded-2xl bg-[#f8fafc] border border-[#e3e8ef] relative group overflow-hidden flex flex-col items-center justify-start p-1.5 transition-all hover:bg-white hover:shadow-premium-subtle">
               {/* Event Placement Animation */}
               {isActive && events.filter(e => e.day === i).map((event, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.5, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: event.delay, type: "spring", damping: 15 }}
                   className={cn(
                     "w-full p-2 rounded-xl mb-1.5 flex flex-col items-center gap-1.5 shadow-sm border border-white/20 relative z-10",
                     event.color
                   )}
                 >
                    <event.icon className="w-3 h-3 text-white" />
                    <div className="h-[1.5px] w-[50%] bg-white/40 rounded-full" />
                 </motion.div>
               ))}
               <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1 bg-[#e3e8ef]" />
          <div className="px-5 py-2 rounded-full bg-white border border-[#e3e8ef] shadow-sm flex items-center gap-3">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#09825d] animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-[#09825d] animate-ping opacity-40" />
             </div>
             <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Strategy Optimized & Deployed</span>
          </div>
          <div className="h-px flex-1 bg-[#e3e8ef]" />
        </motion.div>
      )}
    </div>
  );
};

const GrowthChart = () => (
  <div className="h-32 w-full flex items-end gap-1.5 px-2">
    {[30, 45, 35, 60, 55, 80, 95, 75, 45, 90].map((h, i) => (
      <motion.div 
        key={i}
        initial={{ height: 0 }}
        whileInView={{ height: `${h}%` }}
        transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-gradient-to-t from-[#2d6a4f] to-[#a29bfe] rounded-t-lg shadow-sm"
        style={{ opacity: 0.15 + (i * 0.08) }}
      />
    ))}
  </div>
);

export function Autopilot() {
  const [step, setStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const inputGoal = "Increase weekend occupancy by 15% with coordinated luxury offers.";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === 0 && isInView) {
      let charIndex = 0;
      timer = setInterval(() => {
        setDisplayText(inputGoal.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === inputGoal.length) {
          clearInterval(timer);
          setTimeout(() => setStep(1), 1200);
        }
      }, 40);
    } else if (step === 1) {
      timer = setTimeout(() => setStep(2), 2500);
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 4500);
    } else if (step === 3) {
      timer = setTimeout(() => {
        setStep(0);
        setDisplayText("");
      }, 8000);
    }
    
    return () => clearInterval(timer);
  }, [step, isInView]);

  return (
    <section id="autopilot" className="py-16 md:py-24 bg-[#fcfdfe] relative overflow-hidden" ref={ref}>
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#2d6a4f]/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#09825d]/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Set It and Forget It</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[38px] md:text-[50px] font-black text-[#1a1f36] leading-[1.05] tracking-tight mb-6"
          >
            Marketing That Works <br />
            <span className="text-[#2d6a4f]">on Its Own.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[#3c4257] font-semibold max-w-2xl mx-auto leading-relaxed opacity-90 tracking-tight"
          >
            Our AI handles everything from making photos to posting them online, so you don't have to do any work.
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch min-h-[600px]">
           
           {/* Left Console: Command Center */}
           <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex-1 p-10 rounded-[3.5rem] bg-[#f8fafc] border border-[#e3e8ef] shadow-inner flex flex-col gap-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                    <Bot className="w-48 h-48 text-[#2d6a4f]" />
                 </div>

                 <div className="flex items-center justify-between relative z-10">
                    <p className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.25em]">Command Console</p>
                    <div className="flex gap-3 items-center">
                       <div className="w-2 h-2 rounded-full bg-[#09825d] animate-pulse" />
                       <span className="text-[10px] font-black text-[#09825d] uppercase tracking-widest">System Active</span>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border border-[#e3e8ef] shadow-premium-subtle space-y-6 relative z-10 transition-transform group-hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white border border-[#e3e8ef] shadow-sm flex items-center justify-center font-black text-[12px] text-[#1a1f36]">RM</div>
                       <div>
                          <p className="text-[12px] font-black text-[#1a1f36] uppercase tracking-wider mb-0.5">Resort Portfolio</p>
                          <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-widest">Primary Objective</p>
                       </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#fcfdfe] border border-[#e3e8ef] min-h-[110px] relative">
                       <p className="text-[15px] font-bold text-[#1a1f36] leading-relaxed italic">
                          "{displayText}"
                          {step === 0 && <span className="inline-block w-1.5 h-4 bg-[#2d6a4f] ml-1 animate-pulse" />}
                       </p>
                       <AnimatePresence>
                          {step > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute bottom-4 right-5 flex items-center gap-2"
                            >
                               <div className="px-3 py-1 rounded-full bg-[#efffee] border border-[#d1f2e9] flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09825d]" />
                                  <span className="text-[9px] font-black text-[#09825d] uppercase tracking-widest">Authenticated</span>
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>

                 <div className="flex-1 space-y-6 pt-4 relative z-10">
                    <p className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.4em] mb-6">How It Works</p>
                    <div className="space-y-4">
                      {lifecycle.map((item, i) => (
                        <motion.div 
                          key={i}
                          onMouseEnter={() => setStep(item.id)}
                          className={cn(
                            "p-6 rounded-[3.5rem] border transition-all duration-500 cursor-pointer group",
                            step === item.id 
                              ? "bg-white border-[#e3e8ef] shadow-[0_20px_40px_rgba(0,0,0,0.04)]" 
                              : "border-transparent opacity-40 hover:opacity-100"
                          )}
                        >
                          <div className="flex items-center gap-5">
                             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                                <item.icon className={cn("w-5 h-5", item.color)} />
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-[#8792a2] uppercase tracking-widest mb-1">{item.label}</p>
                                <h4 className="text-[15px] font-black text-[#1a1f36] tracking-tight">{item.title}</h4>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Evolver: The Execution Engine */}
           <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2d6a4f08_0%,transparent_70%)] animate-pulse" />
              
              <div className="w-full relative min-h-[560px]">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={step} 
                      className="w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {step === 1 && (
                        <motion.div 
                          key="building"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20, position: "absolute" }}
                          className="bg-white p-12 lg:p-16 rounded-[4rem] border border-[#e3e8ef] shadow-2xl space-y-12 w-full"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#2d6a4f]/10 flex items-center justify-center">
                                 <Sparkles className="w-5 h-5 text-[#2d6a4f] animate-pulse" />
                              </div>
                              <h4 className="text-3xl font-black text-[#1a1f36] tracking-[-0.03em]">Synthesizing Media...</h4>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              {[
                                { icon: Mail, label: "VIP CRM", text: "Crafting High-Yield Copy", color: "bg-emerald-50/50" },
                                { icon: FaInstagram, label: "Instagram", text: "Drafting Cinematic Reels", color: "bg-pink-50/50" },
                                { icon: FaWhatsapp, label: "WhatsApp", text: "Concierge Sequencing", color: "bg-green-50/50" },
                                { icon: Smartphone, label: "SMS Pulse", text: "Direct Capture Blitz", color: "bg-blue-50/50" }
                              ].map((b, i) => (
                                <div key={i} className={cn("p-8 rounded-3xl border border-[#e3e8ef] relative group/item overflow-hidden", b.color)}>
                                   <b.icon className="w-6 h-6 text-[#2d6a4f] mb-4 transition-transform group-hover/item:scale-110" />
                                   <p className="text-[11px] font-black text-[#8792a2] uppercase tracking-[0.2em] mb-1">{b.label}</p>
                                   <p className="text-[16px] font-black text-[#1a1f36] tracking-tight">{b.text}</p>
                                   <div className="h-2 w-full bg-white border border-[#e3e8ef] mt-6 rounded-full overflow-hidden shadow-inner">
                                      <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: "100%" }} 
                                        transition={{ duration: 2.5, ease: "easeInOut" }} 
                                        className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#a29bfe]" 
                                      />
                                   </div>
                                </div>
                              ))}
                           </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div 
                          key="scheduling"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20, position: "absolute" }}
                          className="bg-white p-12 lg:p-16 rounded-[4rem] border border-[#e3e8ef] shadow-2xl space-y-14 h-full flex flex-col justify-center w-full"
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-3xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] shadow-inner">
                                    <Calendar className="w-8 h-8" />
                                 </div>
                                 <div>
                                    <h4 className="text-3xl font-black text-[#1a1f36] tracking-[-0.03em] leading-none mb-1.5">Master Distribution</h4>
                                    <p className="text-[11px] font-black text-[#8792a2] uppercase tracking-[0.3em]">Lifecycle Sequential Hub</p>
                                 </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] shadow-sm">
                                 <MousePointer2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                                 <span className="text-[11px] font-black text-[#2d6a4f] uppercase tracking-widest">Optimizing Windows</span>
                              </div>
                           </div>
                           
                           <ProperMiniCalendar isActive={step === 2} />
                        </motion.div>
                      )}

                      {step >= 3 && (
                        <motion.div 
                          key="optimizing"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="bg-white p-12 lg:p-16 rounded-[4rem] border border-[#e3e8ef] shadow-2xl space-y-12 w-full"
                        >
                           <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                      <TrendingUp className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div>
                                      <h4 className="text-[#1a1f36] font-black text-sm uppercase tracking-widest">Increase Your Profits</h4>
                                      <p className="text-[#8792a2] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Live Engine Status</p>
                                  </div>
                              </div>
                              <div className="flex gap-1">
                                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400/20" />)}
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="p-10 rounded-[3rem] bg-[#f8fafc] border border-[#e3e8ef] flex flex-col gap-8 shadow-inner relative overflow-hidden">
                                 <div className="flex items-center justify-between relative z-10">
                                    <p className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.3em]">Revenue Velocity</p>
                                    <div className="flex items-center gap-2 text-[#09825d]">
                                       <TrendingUp className="w-4 h-4" />
                                       <span className="text-sm font-black tabular-nums">+42%</span>
                                    </div>
                                 </div>
                                 <div className="relative z-10">
                                     <GrowthChart />
                                 </div>
                              </div>
                              <div className="p-10 rounded-[3rem] bg-[#f8fafc] border border-[#e3e8ef] flex flex-col gap-10 justify-center items-center text-center shadow-inner relative overflow-hidden">
                                 <div className="relative">
                                    <motion.div 
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                      className="w-32 h-32 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center"
                                    >
                                        <div className="w-full h-full rounded-full border-[6px] border-[#2d6a4f30] border-t-[#2d6a4f]" />
                                    </motion.div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                       <span className="text-3xl font-black text-[#1a1f36] tracking-tighter">28%</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#2d6a4f] border-4 border-white flex items-center justify-center shadow-lg">
                                       <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <p className="text-[12px] font-black text-[#09825d] uppercase tracking-[0.25em]">Autonomous ROI Lift</p>
                                    <p className="text-[14px] font-bold text-[#8792a2]">Outperforming historical benchmarks</p>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      )}

                      {step === 0 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-[540px] border-2 border-dashed border-[#e3e8ef] rounded-[4rem] flex flex-col items-center justify-center gap-10 bg-white/50 backdrop-blur-sm"
                        >
                           <div className="relative">
                              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border border-[#e3e8ef] shadow-xl group cursor-pointer transition-transform hover:scale-110">
                                  <Zap className="w-12 h-12 text-[#e3e8ef] group-hover:text-[#2d6a4f] transition-colors" />
                                  <div className="absolute inset-0 rounded-full bg-[#2d6a4f]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -inset-8 bg-[#2d6a4f] rounded-full blur-3xl -z-10"
                              />
                           </div>
                           <div className="text-center space-y-3">
                               <p className="text-[13px] font-black text-[#1a1f36] uppercase tracking-[0.3em]">Awaiting Strategic Input</p>
                               <p className="text-[14px] font-bold text-[#8792a2] max-w-[280px] mx-auto opacity-70">Assign a revenue target to activate the autonomous engine.</p>
                           </div>
                        </motion.div>
                      )}
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
