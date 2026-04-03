"use client";

import React, { useState, useEffect } from "react";
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
  MousePointer2
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Sub-Components: The Master Planner ---

const ProperMiniCalendar = ({ isActive }: { isActive: boolean }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const events = [
    { day: 0, icon: FaInstagram, color: "bg-[#E1306C]", delay: 0.2, label: "Feed Post" },
    { day: 1, icon: Mail, color: "bg-[#635bff]", delay: 0.8, label: "VIP Invite" },
    { day: 2, icon: FaWhatsapp, color: "bg-[#25D366]", delay: 1.4, label: "Guest DM" },
    { day: 4, icon: FaInstagram, color: "bg-[#E1306C]", delay: 2.0, label: "Luxury Reel" },
    { day: 5, icon: Zap, color: "bg-[#f5a623]", delay: 2.6, label: "Flash Sale" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-7 gap-3 relative">
        {/* The "AI Scan" Line */}
        {isActive && (
          <motion.div 
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#635bff] to-transparent z-20 shadow-[0_0_15px_rgba(99,91,255,0.5)]"
          />
        )}

        {days.map((day, i) => (
          <div key={day} className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-[#8792a2] uppercase tracking-tighter text-center">{day}</span>
            <div className="aspect-[4/5] rounded-xl bg-slate-50 border border-black/5 relative group overflow-hidden flex flex-col items-center justify-start p-1 transition-colors hover:bg-white">
               {/* Event Placement Animation */}
               {isActive && events.filter(e => e.day === i).map((event, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.5, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: event.delay, type: "spring", damping: 12 }}
                   className={cn(
                     "w-full p-1.5 rounded-lg mb-1 flex flex-col items-center gap-1 shadow-sm border border-white/20",
                     event.color
                   )}
                 >
                    <event.icon className="w-2.5 h-2.5 text-white" />
                    <div className="h-0.5 w-[60%] bg-white/30 rounded-full" />
                 </motion.div>
               ))}
            </div>
          </div>
        ))}
      </div>

      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="h-[1px] flex-1 bg-slate-100" />
          <div className="px-4 py-1.5 rounded-full bg-[#635bff]/5 border border-[#635bff]/10 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#635bff] animate-pulse" />
             <span className="text-[10px] font-black text-[#635bff] uppercase tracking-widest">Strategy Locked & Scheduled</span>
          </div>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </motion.div>
      )}
    </div>
  );
};

const GrowthChart = () => (
  <div className="h-24 w-full flex items-end gap-1 px-2">
    {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
      <motion.div 
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ delay: i * 0.1, duration: 1 }}
        className="flex-1 bg-[#09825d] rounded-t-sm opacity-20"
      />
    ))}
  </div>
);

export function Autopilot() {
  const [step, setStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const inputGoal = "Increase weekend occupancy by 15% with high-value VIP offers.";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === 0) {
      let charIndex = 0;
      timer = setInterval(() => {
        setDisplayText(inputGoal.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === inputGoal.length) {
          clearInterval(timer);
          setTimeout(() => setStep(1), 1000);
        }
      }, 40);
    } else if (step === 1) {
      timer = setTimeout(() => setStep(2), 3000);
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 5000);
    } else if (step === 3) {
      timer = setTimeout(() => {
        setStep(0);
        setDisplayText("");
      }, 8000);
    }
    
    return () => clearInterval(timer);
  }, [step]);

  return (
    <section id="autopilot" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#635bff]/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#635bff]/10 border border-[#635bff]/20">
            <RefreshCcw className="w-3.5 h-3.5 text-[#635bff]" />
            <span className="text-[11px] font-black text-[#635bff] uppercase tracking-widest">Autonomous Lifecycle</span>
          </div>
          
          <h2 className="text-[40px] md:text-[64px] font-black text-[#1a1f36] leading-[1.05] tracking-tight">
            Put Your Marketing <br />
            <span className="text-[#635bff]">on Autopilot.</span>
          </h2>
          <p className="text-xl text-[#3c4257] font-medium leading-relaxed opacity-80 max-w-2xl mx-auto">
            Give your AI agent a goal, and watch it build, schedule, and optimize your entire campaign strategy.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch min-h-[660px]">
           
           {/* Left Console */}
           <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 p-8 lg:p-10 rounded-[2.5rem] bg-[#f8fafc] border border-black/5 shadow-inner flex flex-col gap-8">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Agent Command Console</p>
                    <div className="flex gap-2 items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse" />
                       <span className="text-[9px] font-black text-[#1a1f36] uppercase">AI Active</span>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center font-black text-[10px] text-[#3c4257]">RM</div>
                       <div>
                          <p className="text-[11px] font-black text-[#1a1f36] uppercase tracking-wider">Resort Manager</p>
                          <p className="text-[9px] font-bold text-[#8792a2]">Strategic Objective Entry</p>
                       </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#f8fafc] border border-black/5 min-h-[90px] relative">
                       <p className="text-sm font-bold text-[#3c4257] leading-relaxed">
                          {displayText}
                          {step === 0 && <span className="inline-block w-1.5 h-4 bg-[#635bff] ml-1 animate-pulse" />}
                       </p>
                       {step > 0 && (
                         <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#09825d]" />
                            <span className="text-[8px] font-black text-[#09825d] uppercase">COMMAND SENT</span>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex-1 space-y-4 pt-4">
                    <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest px-2">Autopilot Orchestration</p>
                    <div className="grid grid-cols-1 gap-3">
                       {[
                         { id: 1, label: "BUILDING", desc: "Constructing Multi-Channel Assets", icon: Zap, activeColor: "text-[#635bff]" },
                         { id: 2, label: "SCHEDULING", desc: "Autonomous Sequential Planner", icon: Calendar, activeColor: "text-[#f5a623]" },
                         { id: 3, label: "OPTIMIZING", desc: "Real-time Booking Insights", icon: TrendingUp, activeColor: "text-[#09825d]" }
                       ].map((item) => {
                         const isActive = step >= item.id;
                         return (
                           <div key={item.id} className={cn(
                             "p-5 rounded-2xl border transition-all duration-500 flex items-center gap-4",
                             isActive ? "bg-white border-[#635bff]/20 shadow-lg shadow-[#635bff]/5 scale-100" : "bg-white/50 border-transparent scale-95 opacity-40 grayscale"
                           )}>
                              <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                                isActive ? "bg-[#635bff]/10" : "bg-slate-100"
                              )}>
                                 <item.icon className={cn("w-5 h-5", isActive ? item.activeColor : "text-[#8792a2]", step === item.id && "animate-pulse")} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[#1a1f36]">{item.label}</p>
                                 <p className="text-xs font-bold text-[#1a1f36]">{item.desc}</p>
                              </div>
                              {isActive && <CheckCircle2 className="w-4 h-4 text-[#09825d]" />}
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Evolver */}
           <div className="lg:col-span-7 relative flex items-center">
              <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-[#635bff]/5 to-transparent blur-3xl -z-10" />
              
              <div className="w-full relative min-h-[500px] lg:min-h-[540px]">
                 <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="building"
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20, position: "absolute" }}
                        className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-black/5 shadow-2xl space-y-10 w-full"
                      >
                         <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-[#635bff] animate-pulse" />
                            <h4 className="text-2xl font-black text-[#1a1f36] tracking-tight">Building Strategy...</h4>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            {[
                              { icon: Mail, label: "VIP Emails", text: "Writing Offers...", color: "bg-indigo-50" },
                              { icon: FaInstagram, label: "Instagram", text: "Designing Reels...", color: "bg-pink-50" },
                              { icon: MessageSquare, label: "WhatsApp", text: "Drafting Messages...", color: "bg-green-50" },
                              { icon: Smartphone, label: "SMS Blitz", text: "Finalizing Copy...", color: "bg-blue-50" }
                            ].map((b, i) => (
                              <div 
                                key={i} className={cn("p-6 rounded-2xl border border-black/5", b.color)}
                              >
                                 <b.icon className="w-5 h-5 text-[#635bff] mb-3" />
                                 <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest">{b.label}</p>
                                 <p className="text-sm font-bold text-[#1a1f36]">{b.text}</p>
                                 <div className="h-1.5 w-full bg-black/5 mt-4 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: "100%" }} 
                                      transition={{ duration: 2.5, ease: "easeInOut" }} 
                                      className="h-full bg-[#635bff]" 
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
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20, position: "absolute" }}
                        className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-black/5 shadow-2xl space-y-12 h-full flex flex-col justify-center w-full"
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                                  <Calendar className="w-7 h-7" />
                               </div>
                               <div>
                                  <h4 className="text-2xl font-black text-[#1a1f36] tracking-tight leading-none">The Master Planner</h4>
                                  <p className="text-xs font-bold text-[#8792a2] mt-1">Autonomous Content Distribution</p>
                               </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-black/5">
                               <MousePointer2 className="w-3 h-3 text-[#635bff]" />
                               <span className="text-[10px] font-black text-[#635bff] uppercase tracking-widest">Optimizing Times</span>
                            </div>
                         </div>
                         
                         <ProperMiniCalendar isActive={step === 2} />
                      </motion.div>
                    )}

                    {step >= 3 && (
                      <motion.div 
                        key="optimizing"
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-black/5 shadow-2xl space-y-10 w-full"
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-[#09825d]/10 flex items-center justify-center text-[#09825d]">
                                  <TrendingUp className="w-7 h-7" />
                               </div>
                               <h4 className="text-2xl font-black text-[#1a1f36] tracking-tight leading-none">Performance Monitoring</h4>
                            </div>
                            <div className="text-right">
                               <p className="text-[11px] font-black text-[#8792a2] tracking-[0.2em] mb-1">REVPAR LIFT</p>
                               <p className="text-3xl font-black text-[#09825d]">+$154.20/room</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-[#f8fafc] border border-black/5 flex flex-col gap-6">
                               <div className="flex items-center justify-between">
                                  <p className="text-[11px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Booking Velocity</p>
                                  <div className="flex items-center gap-1.5 text-[#09825d]">
                                     <TrendingUp className="w-3.5 h-3.5" />
                                     <span className="text-xs font-black">+42%</span>
                                  </div>
                               </div>
                               <GrowthChart />
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-[#f8fafc] border border-black/5 flex flex-col gap-8 justify-center items-center text-center">
                               <div className="relative">
                                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
                                     <span className="text-3xl font-black text-[#1a1f36]">28%</span>
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#635bff] border-2 border-white flex items-center justify-center">
                                     <Sparkles className="w-3 h-3 text-white" />
                                  </div>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[11px] font-black text-[#09825d] uppercase tracking-widest">Autonomous ROI Boost</p>
                                  <p className="text-xs font-bold text-[#8792a2]">Compared to manual strategy</p>
                               </div>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-black/5 flex items-center justify-between opacity-60">
                            <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Continuous Strategy Optimization Active</p>
                            <BarChart3 className="w-4 h-4 text-[#635bff]" />
                         </div>
                      </motion.div>
                    )}

                    {step === 0 && (
                      <div 
                        className="h-[500px] border-2 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-6"
                      >
                         <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-black/5 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-[#635bff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <Zap className="w-10 h-10 text-slate-200 relative z-10" />
                         </div>
                         <div className="text-center space-y-2">
                             <p className="text-xs font-black text-[#1a1f36] uppercase tracking-widest">Awaiting Strategic Goal</p>
                             <p className="text-[10px] font-bold text-[#8792a2] max-w-[200px] mx-auto opacity-60">Define your resort objective to start the autonomous lifecycle</p>
                         </div>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
