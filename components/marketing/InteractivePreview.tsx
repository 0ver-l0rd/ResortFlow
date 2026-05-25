"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Cpu, 
  Eye, 
  History, 
  Layout, 
  Link2, 
  MoreHorizontal, 
  MousePointer2, 
  Play,
  Plus, 
  Search, 
  Settings, 
  Share2, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowUpRight,
  Shield,
  Star,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Send,
  Wand2,
  Bot,
  ZapIcon
} from "lucide-react";
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Nav Items ---
const navItems = [
  { id: "Overview", icon: Layout, label: "Overview" },
  { id: "Compose", icon: Wand2, label: "Compose" },
  { id: "Calendar", icon: CalendarIcon, label: "Calendar" },
  { id: "Connections", icon: Link2, label: "Connections" },
  { id: "Replies", icon: Bot, label: "Auto-Reply" },
  { id: "Analytics", icon: BarChart3, label: "Analytics" },
];

// --- 1. Overview View ---
const AnimatedNumber = ({ value }: { value: string }) => {
   const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
   const suffix = value.replace(/[0-9.]/g, '');
   const [displayValue, setDisplayValue] = useState(0);

   useEffect(() => {
      let start = 0;
      const duration = 1000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = numericValue / steps;

      const timer = setInterval(() => {
         start += increment;
         if (start >= numericValue) {
            setDisplayValue(numericValue);
            clearInterval(timer);
         } else {
            setDisplayValue(start);
         }
      }, stepTime);
      return () => clearInterval(timer);
   }, [numericValue]);

   return (
      <span className="tabular-nums">
         {displayValue.toLocaleString(undefined, { 
            minimumFractionDigits: value.includes('.') ? 1 : 0, 
            maximumFractionDigits: 1 
         })}
         {suffix}
      </span>
   );
};

const OverviewView = () => (
  <motion.div 
    initial="hidden"
    animate="show"
    variants={{
       show: { transition: { staggerChildren: 0.05 } }
    }}
    className="space-y-6 overflow-y-auto h-full pr-1 custom-scrollbar"
  >
    <div className="flex items-end justify-between px-1">
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-1.5">Overview</p>
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1f36]">Good morning 👋</h2>
        <p className="text-[11px] text-[#8792a2] mt-1 font-medium">Here's the resort's performance at a glance.</p>
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="flex items-center gap-2">
         <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200 shadow-sm" />)}
         </div>
         <span className="text-[9px] font-black text-[#1a1f36] uppercase tracking-widest">+4 Team</span>
      </motion.div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Posts", value: "248", change: "+12%", icon: Share2 },
        { label: "Scheduled", value: "14", change: "+3", icon: CalendarIcon },
        { label: "Published", value: "234", change: "+8%", icon: CheckCircle2 },
        { label: "Avg. Engagement", value: "4.2%", change: "+0.5%", icon: TrendingUp }
      ].map((stat, i) => (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          key={i} 
          className="bg-white rounded-xl border border-[#e3e8ef] p-4 shadow-sm hover:shadow-md transition-all group cursor-default"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.1em]">{stat.label}</p>
            <stat.icon className="w-3.5 h-3.5 text-[#8792a2] group-hover:text-[#2d6a4f] transition-colors" />
          </div>
          <p className="text-xl font-bold text-[#1a1f36]">
             <AnimatedNumber value={stat.value} />
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-[#09825d]">{stat.change}</span>
            <span className="text-[9px] text-[#8792a2]">vs last mo</span>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f0f3f7] bg-[#fcfdfe] flex items-center justify-between">
            <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-widest">Recent Activity</span>
            <ChevronRight className="w-3 h-3 text-[#c4cdd6]" />
          </div>
          <div className="divide-y divide-[#f0f3f7]">
            {[
              { label: "Post published", detail: "Instagram & Twitter", time: "2 min ago", color: "#09825d" },
              { label: "Auto-reply sent", detail: "LinkedIn comment", time: "15 min ago", color: "#2d6a4f" },
              { label: "Post scheduled", detail: "Tomorrow at 9:00 AM", time: "1 hr ago", color: "#f5a623" }
            ].map((activity, i) => (
              <motion.div 
                whileHover={{ x: 4, backgroundColor: "#fcfdfe" }}
                key={i} 
                className="px-5 py-3 flex items-center gap-4 transition-all"
              >
                <div className="w-2 h-2 rounded-full relative">
                   <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: activity.color }} />
                   <div className="relative w-full h-full rounded-full" style={{ background: activity.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-[#3c4257]">{activity.label}</p>
                  <p className="text-[9px] text-[#8792a2]">{activity.detail}</p>
                </div>
                <span className="text-[9px] text-[#8792a2]">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }} className="space-y-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#2d6a4f] rounded-xl p-5 text-white relative overflow-hidden shadow-lg shadow-[#2d6a4f]/20 cursor-pointer group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform duration-500">
            <Zap className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80">Upgrade to Pro</p>
          <p className="text-sm font-bold leading-tight mb-4">Unlock Business <br />Intelligence Tools</p>
          <button className="w-full py-2 bg-white text-[#2d6a4f] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">Upgrade Now</button>
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

// --- 2. Compose View ---
const ComposeView = ({ displayedPrompt: targetText, step }: { displayedPrompt: string, step: number }) => {
    const [processStep, setProcessStep] = useState<'conceptualizing' | 'drafting' | 'ready'>('conceptualizing');
    const [typedText, setTypedText] = useState("");
    const resortImage = "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop";

    useEffect(() => {
        if (step === 0) {
            setProcessStep('conceptualizing');
            setTypedText("");
        } else if (step < 3) {
            setProcessStep('drafting');
        } else {
            setProcessStep('ready');
        }
    }, [step]);

    useEffect(() => {
        if (targetText && processStep !== 'conceptualizing') {
            let i = 0;
            const interval = setInterval(() => {
                setTypedText(targetText.slice(0, i + 1));
                i++;
                if (i >= targetText.length) clearInterval(interval);
            }, 12);
            return () => clearInterval(interval);
        }
    }, [targetText, processStep]);

    const metrics = [
        { label: "Tone", val: "Luxe Concierge", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "ROI Pick", val: "+12.4% Lift", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { label: "Optimal", val: "10:00 AM", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Sentiment", val: "98% Pos.", icon: Sparkles, color: "text-pink-600", bg: "bg-pink-50" },
        { label: "Reach", val: "High Est.", icon: ZapIcon, color: "text-[#2d6a4f]", bg: "bg-[#2d6a4f]/5" }
    ];

    const platforms = [
        { id: 'IG', name: 'Instagram', icon: FaInstagram, color: '#E1306C', desc: 'Sponored • Maldives' },
        { id: 'X', name: 'Twitter', icon: FaXTwitter, color: '#000000', desc: '@resort_social' },
        { id: 'TT', name: 'TikTok', icon: SiTiktok, color: '#000000', desc: 'Resort Growth' }
    ];

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500 overflow-hidden">
            {/* Left Column: Editor */}
            <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 h-full">
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#2d6a4f]/10 flex items-center justify-center shadow-sm border border-[#2d6a4f]/5">
                            <Wand2 className="w-4.5 h-4.5 text-[#2d6a4f]" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-[#1a1f36]">AI Composer</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={processStep}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                                    processStep === 'ready' ? "bg-[#e7f6f2] text-[#09825d] border-[#09825d]/10" : "bg-[#f6f9fc] text-[#2d6a4f] border-[#2d6a4f]/10"
                                )}
                            >
                                {processStep === 'conceptualizing' && <><Clock className="w-3 h-3 animate-spin" /> Thinking</>}
                                {processStep === 'drafting' && <><Sparkles className="w-3 h-3" /> Drafting</>}
                                {processStep === 'ready' && <><CheckCircle2 className="w-3 h-3" /> Ready</>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e3e8ef] shadow-sm overflow-hidden flex flex-col flex-1 min-h-0 relative group">
                    <div className="flex items-center gap-4 p-4 border-b border-[#f0f3f7] bg-[#fcfdfe] shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8792a2]">Context</p>
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-1.5 opacity-50"><Target className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest text-[#697386]">Targeted</span></div>
                            <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-green-600" /><span className="text-[9px] font-black uppercase tracking-widest text-[#1a1f36]">High ROI</span></div>
                        </div>
                    </div>
                    
                    <div className="p-7 flex-1 relative overflow-y-auto custom-scrollbar bg-slate-50/20">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#2d6a4f]/10" />
                        <p className="text-[15px] text-[#1a1f36] leading-relaxed whitespace-pre-wrap font-medium">
                            {processStep === 'conceptualizing' ? (
                                <span className="text-[#8792a2] italic opacity-50">AI is conceptualizing your resort narrative...</span>
                            ) : (
                                <>
                                    {typedText}
                                    {(processStep === 'drafting' || (processStep === 'ready' && typedText.length === targetText.length)) && (
                                        <motion.span 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: [0, 1, 0] }} 
                                            transition={{ repeat: Infinity, duration: 1 }} 
                                            className="inline-block w-[2.5px] h-[18px] bg-[#2d6a4f] ml-1 align-bottom shadow-[0_0_8px_#2d6a4f]" 
                                        />
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="p-4 bg-[#fcfdfe] border-t border-[#f0f3f7] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", processStep === 'ready' ? "bg-[#09825d]" : "bg-[#f5a623] animate-pulse")} />
                                <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.15em]">
                                    {processStep === 'ready' ? 'Post Ready' : 'Optimizing...'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="h-1.5 w-28 bg-[#e3e8ef] rounded-full overflow-hidden shadow-inner hidden sm:block">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (typedText.length/280)*100)}%` }} className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#a29bfe]" />
                           </div>
                           <span className="text-[10px] font-black text-[#8792a2] tabular-nums whitespace-nowrap">{typedText.length} / 280</span>
                        </div>
                    </div>
                </div>

                {/* Intelligence Metrics: Horizontal Scroll with Edge Fades */}
                <div className="relative shrink-0 mt-auto">
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#f6f9fc] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f6f9fc] to-transparent z-10 pointer-events-none" />
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar no-scrollbar scroll-smooth">
                        {metrics.map((m, i) => (
                            <div key={i} className="p-4 rounded-2xl border border-[#e3e8ef] bg-white flex items-center gap-3.5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md min-w-[170px] shrink-0 border-l-4" style={{ borderLeftColor: m.color === 'text-blue-600' ? '#3b82f6' : m.color === 'text-green-600' ? '#22c55e' : m.color === 'text-orange-600' ? '#f97316' : '#2d6a4f' }}>
                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm", m.bg)}>
                                    <m.icon className={cn("w-4.5 h-4.5", m.color)} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.15em] mb-0.5">{m.label}</p>
                                    <p className="text-[13px] font-bold text-[#1a1f36] truncate">{m.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Platform Preview Carousel */}
            <div className="lg:col-span-5 flex flex-col min-h-0 h-full">
                <div className="flex items-center justify-between mb-3 shrink-0">
                    <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Multi-Platform Simulation</p>
                    <div className="flex items-center gap-1.5 grayscale opacity-60">
                       <span className="text-[9px] font-black text-[#1a1f36] uppercase tracking-widest">Swipe to preview</span>
                       <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-x-auto custom-scrollbar no-scrollbar snap-x snap-mandatory flex gap-6 pb-2 min-h-0">
                    {platforms.map((p) => (
                        <div key={p.id} className="min-w-full h-full snap-center">
                            <div className="h-full bg-white rounded-3xl border border-[#e3e8ef] shadow-2xl overflow-hidden flex flex-col font-sans group/preview relative">
                                <div className="p-4 border-b border-[#f0f3f7] flex items-center justify-between shrink-0 bg-[#fcfdfe]">
                                    <div className="flex items-center gap-2.5">
                                        <p.icon className="w-4 h-4" style={{ color: p.color }} />
                                        <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.1em]">{p.name}</span>
                                    </div>
                                    <Share2 className="w-3.5 h-3.5 text-[#c4cdd6]" />
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                    <div className="p-5 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center font-black text-[18px] text-[#1a1f36] shrink-0 shadow-inner">R</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-bold text-[#1a1f36] leading-none mb-1">{p.name === 'TikTok' ? 'Resort Growth' : 'Resort Growth'}</p>
                                                <p className="text-[11px] text-[#8792a2] font-medium">{p.desc}</p>
                                            </div>
                                            <MoreHorizontal className="w-4 h-4 text-[#8792a2]" />
                                        </div>

                                        <div className={cn(
                                            "aspect-[4/5] bg-[#f8fafc] border border-[#e3e8ef] rounded-2xl overflow-hidden relative shadow-inner group/media transition-all duration-500",
                                            p.id === 'TT' && "aspect-[3/4] sm:aspect-[9/16]"
                                        )}>
                                            {processStep !== 'conceptualizing' ? (
                                                <motion.div 
                                                    initial={{ opacity: 0 }} 
                                                    animate={{ opacity: 1 }} 
                                                    className="w-full h-full"
                                                >
                                                    <img src={resortImage} alt="Luxury Resort" className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                                    {processStep === 'ready' && (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }} 
                                                            animate={{ opacity: 1 }} 
                                                            className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1.5px]"
                                                        >
                                                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-2xl">
                                                               <Sparkles className="w-8 h-8 text-white animate-pulse" />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50">
                                                   <div className="w-10 h-10 rounded-full border-2 border-[#2d6a4f]/20 border-t-[#2d6a4f] animate-spin" />
                                                   <span className="text-[9px] font-black text-[#2d6a4f] uppercase tracking-widest">Optimizing Assets</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between py-1 px-1">
                                            <div className="flex items-center gap-5 text-[#1a1f36]">
                                                <Heart className="w-7 h-7 cursor-pointer hover:text-[#ff3040] hover:scale-110 transition-all" />
                                                <MessageCircle className="w-7 h-7 cursor-pointer hover:text-[#2d6a4f] hover:scale-110 transition-all" />
                                                <Send className="w-7 h-7 cursor-pointer hover:text-[#2d6a4f] hover:scale-110 transition-all" />
                                            </div>
                                            <Bookmark className="w-7 h-7 cursor-pointer hover:text-[#2d6a4f] hover:scale-110 transition-all" />
                                        </div>

                                        <div className="space-y-1.5 px-1 pb-6">
                                            <p className="text-[14px] font-black text-[#1a1f36]">1,248 engagement</p>
                                            <div className="text-[14px] leading-[1.5] text-[#1a1f36]">
                                                <span className="font-bold mr-2">resort_social</span>
                                                <span className="font-medium opacity-90 transition-opacity">
                                                    {typedText || "Analyzing narrative..."}
                                                    {(processStep === 'drafting' || (processStep === 'ready' && typedText.length === targetText.length)) && (
                                                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-[1.5px] h-[14px] bg-[#1a1f36] ml-1 align-middle" />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 3. Calendar View ---
const CalendarView = () => {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  
  // Diverse schedules for a high-fidelity look
  const getSchedules = (day: number) => {
    if (day === 4) return [{ icon: FaInstagram, color: "#E1306C", label: "IG" }];
    if (day === 8) return [{ icon: SiTiktok, color: "#000000", label: "TT" }];
    if (day === 12) return [{ icon: FaXTwitter, color: "#000000", label: "X" }];
    if (day === 14) return [
      { icon: FaInstagram, color: "#E1306C", label: "IG" },
      { icon: FaFacebookF, color: "#1877F2", label: "FB" }
    ];
    if (day === 18) return [{ icon: FaLinkedinIn, color: "#0077B5", label: "LI" }];
    if (day === 22) return [{ icon: SiTiktok, color: "#000000", label: "TT" }];
    if (day === 26) return [{ icon: FaInstagram, color: "#E1306C", label: "IG" }];
    if (day === 29) return [{ icon: FaYoutube, color: "#FF0000", label: "YT" }];
    return [];
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-end justify-between px-1 shrink-0">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-1.5">Schedule</p>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1f36]">Campaign Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-[#f6f9fc] border border-[#e3e8ef] rounded-lg p-1 shrink-0">
              <button className="px-2 py-1 bg-white shadow-sm border border-[#e3e8ef] rounded-md text-[9px] font-black text-[#1a1f36] uppercase tracking-widest whitespace-nowrap">Month</button>
           </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-[#e3e8ef] overflow-hidden shadow-sm flex flex-col min-h-0">
        <div className="grid grid-cols-7 border-b border-[#f0f3f7] bg-[#fcfdfe] shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-2.5 text-center border-r border-[#f0f3f7] last:border-r-0">
              <span className="text-[8px] font-black text-[#8792a2] uppercase tracking-[0.15em]">{day}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar">
          {days.map((day, i) => {
             const actualDay = (day % 31) + 1;
             const schedules = getSchedules(day);
             return (
               <div key={i} className={cn(
                  "min-h-[75px] border-r border-b border-[#f0f3f7] p-1.5 hover:bg-[#fcfdfe] transition-colors last:border-r-0 relative group",
                  day > 31 && "bg-[#f8fafc]/50"
               )}>
                 <span className={cn("text-[10px] font-bold", [4, 14, 29].includes(day) ? "text-[#2d6a4f]" : "text-[#d1d5db]")}>{actualDay}</span>
                 {schedules.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                       {schedules.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1 p-0.5 rounded bg-white border border-[#e3e8ef] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                             <s.icon className="w-2 h-2 shrink-0" style={{ color: s.color }} />
                             <span className="text-[6.5px] font-black text-[#1a1f36] leading-none truncate tracking-tighter">{s.label}·9:00A</span>
                          </div>
                       ))}
                    </div>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 4. Connections View ---
const ConnectionsView = () => {
    const [connectState, setConnectState] = useState<'idle' | 'linking' | 'connected'>('idle');

    useEffect(() => {
        const timer = setInterval(() => {
            setConnectState(prev => prev === 'connected' ? 'idle' : prev === 'idle' ? 'linking' : 'connected');
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const connectedOthers = [
        { platform: "Instagram", account: "@luxuryresort_ig", icon: FaInstagram, color: "#E1306C", bg: "#fef1f5", status: "Active" },
        { platform: "LinkedIn", account: "Resort Elite", icon: FaLinkedinIn, color: "#0077B5", bg: "#f0f7fb", status: "Active" },
        { platform: "TikTok", account: "@resortreelz", icon: SiTiktok, color: "#000000", bg: "#f6f9fc", status: "Syncing" }
    ];

    const available = [
        { platform: "Facebook", icon: FaFacebookF, color: "#1877F2", bg: "#f0f4fd" },
        { platform: "YouTube", icon: FaYoutube, color: "#FF0000", bg: "#fff1f1" }
    ];

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
            <div className="flex items-end justify-between px-1 shrink-0">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-1.5">Network</p>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a1f36]">Platform Ecosystem</h2>
                </div>
                <div className="h-9 px-4 bg-[#f6f9fc] border border-[#e3e8ef] rounded-full flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#09825d]" />
                    <span className="text-[9px] font-black text-[#1a1f36] uppercase tracking-widest">Enterprise Encrypted</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div className="space-y-8">
                    {/* Active Connections */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[11px] font-black text-[#3c4257] uppercase tracking-widest">Active Channels</span>
                            <div className="h-px flex-1 bg-[#f0f3f7]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {/* Dynamic X Connection Card */}
                            <div className="bg-white rounded-xl border border-[#e3e8ef] p-5 shadow-sm group relative overflow-hidden transition-all flex items-center gap-4 min-h-[100px]">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner",
                                    connectState === 'idle' ? "bg-slate-100 grayscale border border-[#e3e8ef]" : "bg-black"
                                )}>
                                    <FaXTwitter className={cn("w-7 h-7", connectState === 'idle' ? "text-[#8792a2]" : "text-white")} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[14px] font-black text-[#1a1f36] tracking-tight">Twitter / X</p>
                                        <AnimatePresence mode="wait">
                                            <motion.div 
                                                key={connectState}
                                                initial={{ opacity: 0, x: 5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                    connectState === 'connected' ? "bg-[#e7f6f2] text-[#09825d]" : "bg-[#f6f9fc] text-[#8792a2]"
                                                )}
                                            >
                                                {connectState === 'idle' ? 'Disconnected' : connectState === 'linking' ? 'Syncing' : 'Live'}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[11px] font-bold text-[#8792a2] truncate">
                                            {connectState === 'idle' ? 'Awaiting authorization' : connectState === 'linking' ? 'Refreshing tokens...' : '@resortgrowth'}
                                        </p>
                                        {connectState === 'connected' && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-1 flex-1 bg-[#e3e8ef] rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="bg-[#09825d] h-full" />
                                                </div>
                                                <span className="text-[8px] font-black text-[#8792a2]">84% Health</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {connectedOthers.map((conn, i) => (
                                <div key={i} className="bg-white rounded-xl border border-[#e3e8ef] p-5 shadow-sm flex items-center gap-4 min-h-[100px]">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: conn.bg }}>
                                        <conn.icon className="w-7 h-7" style={{ color: conn.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[14px] font-black text-[#1a1f36] tracking-tight">{conn.platform}</p>
                                            <div className="px-2 py-0.5 rounded bg-[#e7f6f2] text-[#09825d] text-[8px] font-black uppercase tracking-widest">
                                                {conn.status}
                                            </div>
                                        </div>
                                        <p className="text-[11px] font-bold text-[#8792a2] truncate">{conn.account}</p>
                                        <div className="mt-2.5 flex items-center gap-3">
                                            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" /><span className="text-[8px] font-bold text-[#8792a2]">Verified</span></div>
                                            <div className="flex items-center gap-1"><Clock className="w-2.5 h-2.5 text-[#c4cdd6]" /><span className="text-[8px] font-bold text-[#8792a2]">12m ago</span></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Available Platforms */}
                    <section className="opacity-60">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[11px] font-black text-[#8792a2] uppercase tracking-widest">Available Channels</span>
                            <div className="h-px flex-1 bg-[#f0f3f7]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {available.map((conn, i) => (
                                <div key={i} className="bg-[#fcfdfe] rounded-xl border border-[#e3e8ef] border-dashed p-5 flex items-center gap-4 group hover:border-[#2d6a4f] transition-colors cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center grayscale group-hover:grayscale-0 transition-all" style={{ background: conn.bg }}>
                                        <conn.icon className="w-6 h-6" style={{ color: conn.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-[#697386] tracking-tight group-hover:text-[#1a1f36]">{conn.platform}</p>
                                        <p className="text-[10px] font-medium text-[#8792a2]">Click to authorize</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-[#c1c9d2] group-hover:text-[#2d6a4f]" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// --- 5. Analytics View (TikTok Focused) ---
const AnalyticsView = () => (
   <div className="space-y-8 animate-in fade-in duration-500 overflow-hidden h-full flex flex-col min-h-0">
     <div className="flex items-end justify-between px-1 shrink-0">
       <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <SiTiktok className="w-5 h-5" />
         </div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-0.5 whitespace-nowrap">TikTok Intel</p>
            <h2 className="text-xl font-bold tracking-tight text-[#1a1f36] whitespace-nowrap">Video Performance</h2>
         </div>
       </div>
     </div>

     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
       {[
         { label: "Video Views", value: "842.1k", change: "+45%", icon: Play, color: "#000000" },
         { label: "Completion", value: "68.4%", change: "+5.2%", icon: Target, color: "#000000" },
         { label: "Shares", value: "12.4k", change: "+18%", icon: Share2, color: "#000000" },
         { label: "Sound Attribution", value: "2.5k", change: "+24%", icon: Wand2, color: "#000000" }
       ].map((stat, i) => (
         <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-xl border border-[#e3e8ef] p-4 shadow-sm relative overflow-hidden group"
         >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                 <stat.icon className="w-4 h-4 text-[#8792a2] group-hover:scale-110 transition-all" />
                 <span className="text-[9px] font-black text-[#09825d] bg-[#efffee] px-1.5 py-0.5 rounded uppercase">{stat.change}</span>
              </div>
              <p className="text-xl font-bold text-[#1a1f36] tabular-nums mb-0.5">{stat.value}</p>
              <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-widest">{stat.label}</p>
            </div>
         </motion.div>
       ))}
     </div>

     <div className="flex-1 bg-white rounded-2xl border border-[#e3e8ef] p-6 shadow-sm relative overflow-hidden min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
           <h3 className="text-[11px] font-black text-[#1a1f36] uppercase tracking-widest">Global Retention Velocity</h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2d6a4f]" /><span className="text-[9px] font-bold text-[#3c4257]">TikTok</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[9px] font-bold text-[#3c4257]">Benchmark</span></div>
           </div>
        </div>
        
        <div className="flex-1 relative min-h-[120px]">
           <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <motion.path
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 d="M 50 180 C 150 100, 300 150, 450 50 S 650 100, 750 20"
                 fill="none"
                 stroke="#2d6a4f"
                 strokeWidth="4"
                 strokeLinecap="round"
              />
              <motion.path
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 0.3 }}
                 transition={{ duration: 2, delay: 0.3 }}
                 d="M 50 180 C 150 120, 300 160, 450 80 S 650 120, 750 60"
                 fill="none"
                 stroke="#cbd5e1"
                 strokeWidth="2"
                 strokeDasharray="6 6"
              />
           </svg>
           
           <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="absolute top-[20px] right-[5%] bg-black text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2"
           >
              <TrendingUp className="w-3 h-3 text-[#09825d]" />
              <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Viral Probability: 84%</span>
           </motion.div>
        </div>
     </div>
   </div>
);

// --- 6. Auto-Reply View (Social Multi-Animation) ---
const AutoReplyView = () => {
    const [activeComment, setActiveComment] = useState(0);
    const [replyStep, setReplyStep] = useState<'comment' | 'thinking' | 'reply'>('comment');

    const socialComments = [
        { 
            platform: 'Twitter', 
            icon: FaXTwitter, 
            color: '#000000', 
            user: '@beachlover', 
            postContext: "Our infinity pool is now open until 10 PM. Come for the sunset, stay for the stars. ✨",
            text: "Is the pool heated in Oct?", 
            reply: "Yes! Both our Infinity and Garden pools stay at a cozy 82°F year-round." 
        },
        { 
            platform: 'Instagram', 
            icon: FaInstagram, 
            color: '#E1306C', 
            user: 'adventure_sue', 
            postContext: "Weekend wellness: Book any massage and get a complimentary detox shot. 🍵",
            text: "Do you have any spa openings for Saturday?", 
            reply: "We have two slots left at 2:00 PM and 4:30 PM! Check the link in bio to book." 
        },
        { 
            platform: 'Facebook', 
            icon: FaFacebookF, 
            color: '#1877F2', 
            user: 'Mark Thompson', 
            postContext: "Sharing some guest favorites from last week's seafood night! 🦞",
            text: "The stay was amazing, can't wait to return!", 
            reply: "Thank you Mark! We've added a returning guest credit to your account." 
        }
    ];

    useEffect(() => {
        const sequence = async () => {
            setReplyStep('comment');
            await new Promise(r => setTimeout(r, 2000));
            setReplyStep('thinking');
            await new Promise(r => setTimeout(r, 1200));
            setReplyStep('reply');
            await new Promise(r => setTimeout(r, 4000));
            setActiveComment(prev => (prev + 1) % socialComments.length);
        };
        sequence();
    }, [activeComment]);

    const current = socialComments[activeComment];

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
            <div className="flex items-end justify-between px-1 shrink-0">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-1.5 whitespace-nowrap">Agent Activity</p>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a1f36]">Autonomous Monitoring</h2>
                </div>
                <div className="h-10 px-4 bg-white border border-[#e3e8ef] rounded-xl flex items-center gap-3 shadow-sm shrink-0">
                   <div className="w-2 h-2 rounded-full bg-[#09825d] animate-pulse" />
                   <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-widest whitespace-nowrap">Resolving Live</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeComment}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 w-full py-4"
                    >
                        {/* Reference Post Context */}
                        <div className="relative p-5 bg-[#f8fafc] border border-[#e3e8ef] rounded-2xl overflow-hidden group">
                           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                              <current.icon className="w-8 h-8" style={{ color: current.color }} />
                           </div>
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-wider">Original Post</span>
                           </div>
                           <p className="text-[12px] text-[#4f566b] leading-relaxed italic font-medium">
                              "{current.postContext}"
                           </p>
                        </div>

                        {/* Comment Thread Line */}
                        <div className="relative pl-12 space-y-6">
                           <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e3e8ef] via-[#e3e8ef] to-transparent" />

                           {/* Guest Comment */}
                           <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="relative"
                           >
                              <div className="absolute -left-[32px] top-2 w-6 h-6 rounded-full bg-white border-2 border-[#e3e8ef] flex items-center justify-center overflow-hidden z-10">
                                 <current.icon className="w-full h-full p-1.5" style={{ color: current.color }} />
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-[#1a1f36]">{current.user}</span>
                                    <span className="text-[9px] font-bold text-[#8792a2]">Commented</span>
                                 </div>
                                 <div className="p-3.5 bg-white border border-[#e3e8ef] rounded-2xl rounded-tl-none shadow-sm inline-block max-w-[90%]">
                                    <p className="text-[13px] font-medium text-[#1a1f36] leading-relaxed">"{current.text}"</p>
                                 </div>
                              </div>
                           </motion.div>

                           {/* AI Reply */}
                           <div className="relative min-h-[60px]">
                               <AnimatePresence mode="wait">
                                  <motion.div 
                                     key={replyStep} 
                                     initial={{ opacity: 0 }} 
                                     animate={{ opacity: 1 }} 
                                     exit={{ opacity: 0 }}
                                  >
                                    {replyStep === 'thinking' && (
                                       <motion.div 
                                          initial={{ opacity: 0, scale: 0.95 }} 
                                          animate={{ opacity: 1, scale: 1 }} 
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          className="flex items-center gap-3 py-2"
                                       >
                                          <div className="w-8 h-8 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center">
                                             <Bot className="w-4 h-4 text-[#2d6a4f] animate-pulse" />
                                          </div>
                                          <span className="text-[10px] font-black text-[#2d6a4f] uppercase tracking-widest">AI Agent is thinking...</span>
                                       </motion.div>
                                    )}

                                    {replyStep === 'reply' && (
                                       <motion.div 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="space-y-1"
                                       >
                                          <div className="flex items-center gap-2">
                                             <div className="w-5 h-5 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white">
                                                <Bot className="w-3 h-3" />
                                             </div>
                                             <span className="text-[10px] font-black text-[#2d6a4f] uppercase tracking-widest">Resort Assistant</span>
                                             <div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
                                          </div>
                                          <div className="p-4 bg-[#2d6a4f] text-white border border-[#2d6a4f]/20 rounded-2xl rounded-tl-none shadow-lg shadow-[#2d6a4f]/20 max-w-[90%]">
                                             <p className="text-[13px] font-bold leading-relaxed italic">
                                                "{current.reply}"
                                             </p>
                                          </div>
                                       </motion.div>
                                    )}
                                  </motion.div>
                               </AnimatePresence>
                           </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- AI Agent Sidebar ---
const AIAgentPanel = ({ activeTab }: { activeTab: string }) => {
   const [displayedPrompt, setDisplayedPrompt] = useState("");
   const [visibleLogs, setVisibleLogs] = useState<{ text: string, status: string }[]>([]);
   const [step, setStep] = useState(0);
   
   const contextData: any = {
      Overview: {
         prompt: "AI, analyze Resort ROI across all active platforms.",
         logs: [
            { text: "Fetching platforms (X, IG, FB)", status: "SYNCING" },
            { text: "Attributing RevPAR lift", status: "PROCESSING" },
            { text: "ROI calibrated: +14.2%", status: "READY" }
         ]
      },
      Compose: {
         prompt: "Draft a viral Instagram Reel script for the new Infinity Pool.",
         logs: [
            { text: "Analyzing brand voice", status: "COMPLETED" },
            { text: "Optimizing hashtags cluster", status: "APPLIED" },
            { text: "Formatting: X, IG, LinkedIn", status: "FORMATTED" }
         ]
      },
      Calendar: {
         prompt: "AI, re-balance our August content schedule.",
         logs: [
            { text: "Detecting gaps (Aug 14-22)", status: "SCANNING" },
            { text: "Applying optimal frequency", status: "RESOLVED" },
            { text: "Strategy locked: 42 posts", status: "LOCKED" }
         ]
      },
      Connections: {
         prompt: "Perform security audit on all network tokens.",
         logs: [
            { text: "Verifying OAuth2 heartbeats", status: "SECURE" },
            { text: "TikTok Pixel integrity check", status: "ACTIVE" },
            { text: "Token refresh: 12d remaining", status: "HEALTHY" }
         ]
      },
      Replies: {
         prompt: "AI, respond to guests about the wine tasting event.",
         logs: [
            { text: "Sentiment analysis: 98% Match", status: "DETECTED" },
            { text: "Drafting concierge replies", status: "ACTIVE" },
            { text: "142 guests reached", status: "HANDLED" }
         ]
      },
      Analytics: {
         prompt: "AI, execute deep-dive attribution report.",
         logs: [
            { text: "Extracting conversion data", status: "EXTRACTING" },
            { text: "Multi-touch attribution", status: "CALCULATING" },
            { text: "ROI exported: 4.8x Multiple", status: "DONE" }
         ]
      }
   };

   useEffect(() => {
      const data = contextData[activeTab] || contextData.Overview;
      const fullPrompt = data.prompt;
      
      setDisplayedPrompt("");
      setVisibleLogs([]);
      setStep(0);

      let i = 0;
      const typingInterval = setInterval(() => {
         setDisplayedPrompt(fullPrompt.slice(0, i + 1));
         i++;
         if (i >= fullPrompt.length) {
            clearInterval(typingInterval);
            setTimeout(() => setStep(1), 500);
            data.logs.forEach((log: any, index: number) => {
               setTimeout(() => {
                  setVisibleLogs(prev => [...prev, log]);
                  setStep(index + 2);
               }, (index + 1) * 800);
            });
         }
      }, 30);
      return () => clearInterval(typingInterval);
   }, [activeTab]);

   return (
      <div className="w-full h-full flex flex-col p-8 bg-[#f8fafc] gap-8">
         <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Agent Console</p>
            <div className="flex gap-2 items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse" />
               <span className="text-[8px] font-black text-[#1a1f36] uppercase tracking-widest">Active</span>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center font-black text-[9px] text-[#3c4257]">AC</div>
               <p className="text-[10px] font-black text-[#1a1f36] uppercase tracking-wider">Command Sent</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-black/5 min-h-[60px]">
               <p className="text-[11px] font-bold text-[#3c4257] leading-relaxed">
                  "{displayedPrompt}"
                  {step === 0 && <span className="inline-block w-1 h-3.5 bg-[#2d6a4f] ml-1 animate-pulse rounded-full" />}
               </p>
            </div>
         </div>

         <div className="flex-1 space-y-2">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] px-2">Logs</p>
            <AnimatePresence mode="popLayout">
               {visibleLogs.map((log) => (
                  <motion.div key={log.text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl border border-[#2d6a4f]/10 bg-white shadow-sm flex items-center gap-3">
                     <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-[#1a1f36] leading-none mb-1">{log.text}</p>
                        <p className="text-[8px] font-bold text-[#8792a2] uppercase tracking-widest">{log.status}</p>
                     </div>
                     <CheckCircle2 className="w-3.5 h-3.5 text-[#09825d]" />
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
   );
};

// --- Main Export ---
export function InteractivePreview({ activeTab: externalTab, setActiveTab: setExternalTab }: { activeTab?: string; setActiveTab?: (tab: string) => void }) {
  const [internalTab, setInternalTab] = useState("Overview");
  const activeTab = externalTab || internalTab;
  const setActiveTab = setExternalTab || setInternalTab;

  return (
    <div className="w-full h-[640px] flex bg-white rounded-2xl overflow-hidden border border-[#e3e8ef] shadow-sm">
      <div className="w-20 lg:w-60 bg-[#fcfdfe] border-r border-[#f0f3f7] flex flex-col shrink-0">
         <div className="p-6 border-b border-[#f0f3f7] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a1f36] flex items-center justify-center text-white shadow-lg"><Zap className="w-4.5 h-4.5" /></div>
            <span className="hidden lg:block font-black text-[15px] tracking-tight text-[#1a1f36]">ResortFlow</span>
         </div>
         <div className="flex-1 py-8 px-4 space-y-1">
            {navItems.map((item) => {
               const isActive = activeTab === item.id;
               return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all", isActive ? "bg-white text-[#2d6a4f] shadow-sm border border-[#eceff3]" : "text-[#697386] hover:bg-[#f6f9fc]")}>
                     <item.icon className={cn("w-4 h-4", isActive ? "text-[#2d6a4f]" : "text-[#8792a2]")} />
                     <span className="hidden lg:block text-[12px] font-black tracking-tight">{item.label}</span>
                  </button>
               );
            })}
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
         <header className="h-14 border-b border-[#f0f3f7] px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-[#f6f9fc] px-4 py-1.5 rounded-full border border-[#e3e8ef] w-full max-w-xs text-[#8792a2]">
               <Search className="w-3.5 h-3.5" />
               <span className="text-[11px] font-black text-[#8792a2] uppercase tracking-widest">Search Console</span>
            </div>
            <Button className="h-9 px-5 bg-[#2d6a4f] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#2d6a4f]/20"><Plus className="w-3.5 h-3.5 mr-2" /> New</Button>
         </header>

         <div className="flex-1 p-6 overflow-hidden">
            <AnimatePresence mode="wait">
               <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full">
                  {activeTab === "Overview" && <OverviewView />}
                  {activeTab === "Compose" && <ComposeView displayedPrompt="Checking Resort voice... Draft: Escape to paradise at our Infinity Pool suites! 🌴 Book now for exclusive rates. #ResortLife #LuxeTravel" step={1} />}
                  {activeTab === "Calendar" && <CalendarView />}
                  {activeTab === "Connections" && <ConnectionsView />}
                  {activeTab === "Replies" && <AutoReplyView />}
                  {activeTab === "Analytics" && <AnalyticsView />}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>

      <div className="hidden xl:flex w-80 border-l border-[#f0f3f7] bg-[#f8fafc] flex flex-col">
         <AIAgentPanel activeTab={activeTab} />
      </div>
    </div>
  );
}
