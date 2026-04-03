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
const OverviewView = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-end justify-between px-1">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2] mb-1.5">Overview</p>
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1f36]">Good morning 👋</h2>
        <p className="text-[11px] text-[#8792a2] mt-1 font-medium">Here's the resort's performance at a glance.</p>
      </div>
      <div className="flex items-center gap-2">
         <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200" />)}
         </div>
         <span className="text-[9px] font-black text-[#1a1f36] uppercase tracking-widest">+4 Team</span>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Posts", value: "248", change: "+12%", icon: Share2 },
        { label: "Scheduled", value: "14", change: "+3", icon: CalendarIcon },
        { label: "Published", value: "234", change: "+8%", icon: CheckCircle2 },
        { label: "Avg. Engagement", value: "4.2%", change: "+0.5%", icon: TrendingUp }
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#e3e8ef] p-4 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.1em]">{stat.label}</p>
            <stat.icon className="w-3.5 h-3.5 text-[#8792a2] group-hover:text-[#635bff] transition-colors" />
          </div>
          <p className="text-xl font-bold text-[#1a1f36] tabular-nums">{stat.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-[#09825d]">{stat.change}</span>
            <span className="text-[9px] text-[#8792a2]">vs last mo</span>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f0f3f7] bg-[#f6f9fc] flex items-center justify-between">
            <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-widest">Recent Activity</span>
            <ChevronRight className="w-3 h-3 text-[#c4cdd6]" />
          </div>
          <div className="divide-y divide-[#f0f3f7]">
            {[
              { label: "Post published", detail: "Instagram & Twitter", time: "2 min ago", color: "#09825d" },
              { label: "Auto-reply sent", detail: "LinkedIn comment", time: "15 min ago", color: "#635bff" },
              { label: "Post scheduled", detail: "Tomorrow at 9:00 AM", time: "1 hr ago", color: "#f5a623" }
            ].map((activity, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors">
                <div className="w-2 h-2 rounded-full" style={{ background: activity.color }} />
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-[#3c4257]">{activity.label}</p>
                  <p className="text-[9px] text-[#8792a2]">{activity.detail}</p>
                </div>
                <span className="text-[9px] text-[#8792a2]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#635bff] rounded-xl p-5 text-white relative overflow-hidden shadow-lg shadow-[#635bff]/20">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Zap className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80">Upgrade to Pro</p>
          <p className="text-sm font-bold leading-tight mb-4">Unlock Business <br />Intelligence Tools</p>
          <button className="w-full py-2 bg-white text-[#635bff] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Upgrade Now</button>
        </div>
      </div>
    </div>
  </div>
);

// --- 2. Compose View ---
const ComposeView = ({ displayedPrompt, step }: { displayedPrompt: string, step: number }) => (
  <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500 overflow-hidden">
    <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-[#1a1f36]">New Campaign</h2>
        <button className="p-1 px-3 bg-[#635bff]/5 border border-[#635bff]/10 rounded-lg text-[9px] font-black text-[#635bff] uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
           <Bot className="w-3 h-3" /> AI Assist
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
         <div className="flex items-center gap-2 p-3 border-b border-[#f0f3f7] bg-[#f6f9fc] shrink-0">
            <div className="flex -space-x-1 border-r border-[#e3e8ef] pr-3 mr-1">
               <FaXTwitter className="w-5 h-5 p-1 rounded bg-black text-white" />
               <FaInstagram className="w-5 h-5 p-1 rounded bg-[#E1306C] text-white" />
            </div>
            <div className="flex items-center gap-3 overflow-hidden">
               <span className="text-[9px] text-[#697386] font-bold flex items-center gap-1 whitespace-nowrap"><Wand2 className="w-3 h-3" /> Enhance</span>
               <span className="text-[9px] text-[#697386] font-bold flex items-center gap-1 whitespace-nowrap"><Sparkles className="w-3 h-3" /> Hashtags</span>
            </div>
         </div>
         <div className="p-5 flex-1 relative overflow-y-auto custom-scrollbar">
            <p className="text-sm text-[#1a1f36] leading-relaxed whitespace-pre-wrap font-medium">
               {displayedPrompt || "Your post content will appear here as AI generates it..."}
               {step === 0 && displayedPrompt && <span className="inline-block w-1.5 h-4 bg-[#635bff] ml-1 animate-pulse" />}
            </p>
         </div>
         <div className="p-3 bg-[#f6f9fc] border-t border-[#f0f3f7] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
               <span className="text-[9px] font-black text-[#1a1f36] uppercase tracking-widest">Optimized</span>
            </div>
            <span className="text-[9px] font-bold text-[#8792a2]">{displayedPrompt.length}/280</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 shrink-0">
         <div className="p-3 rounded-xl border border-[#e3e8ef] bg-white flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
               <CalendarIcon className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="min-w-0">
               <p className="text-[8px] font-black text-[#8792a2] uppercase tracking-widest leading-none mb-0.5 whitespace-nowrap">Schedule</p>
               <p className="text-[11px] font-bold text-[#1a1f36] truncate">Aug 12, 10:00 AM</p>
            </div>
         </div>
         <div className="p-3 rounded-xl border border-[#e3e8ef] bg-white flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
               <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div className="min-w-0">
               <p className="text-[8px] font-black text-[#8792a2] uppercase tracking-widest leading-none mb-0.5 whitespace-nowrap">Impact</p>
               <p className="text-[11px] font-bold text-[#09825d] whitespace-nowrap">High Forecast</p>
            </div>
         </div>
      </div>
    </div>

    <div className="lg:col-span-5 flex flex-col min-h-0">
       <div className="flex items-center justify-between mb-3 shrink-0">
          <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest">Live Preview</p>
          <Settings className="w-3.5 h-3.5 text-[#c4cdd6]" />
       </div>
       <div className="flex-1 bg-white rounded-2xl border border-[#e3e8ef] shadow-xl overflow-y-auto p-5 font-sans custom-scrollbar">
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center font-bold text-[#3c4257] shrink-0">R</div>
             <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 leading-none">
                   <p className="text-[14px] font-bold text-[#1a1f36] whitespace-nowrap">Resort Growth</p>
                   <p className="text-[14px] text-[#536471] truncate">@resort_social</p>
                </div>
                <div className="mt-2 text-[14px] text-[#1a1f36] leading-[1.3] whitespace-pre-wrap">
                   {displayedPrompt || "Predicting engagement patterns..."}
                   {step === 0 && <span className="inline-block w-1.5 h-3.5 bg-[#635bff] ml-1 animate-pulse" />}
                </div>
                <div className="mt-4 aspect-[16/9] bg-slate-50 border border-[#e3e8ef] rounded-xl flex items-center justify-center relative overflow-hidden group/preview shrink-0">
                   <Sparkles className="w-6 h-6 text-[#635bff] opacity-20" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#635bff]/5 via-transparent to-transparent" />
                </div>
                <div className="mt-4 flex items-center justify-between text-[#536471]">
                   <MessageCircle className="w-4 h-4" />
                   <Repeat2 className="w-4 h-4" />
                   <Heart className="w-4 h-4" />
                   <Bookmark className="w-4 h-4" />
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

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
                 <span className={cn("text-[10px] font-bold", [4, 14, 29].includes(day) ? "text-[#635bff]" : "text-[#d1d5db]")}>{actualDay}</span>
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
                                <div key={i} className="bg-[#fcfdfe] rounded-xl border border-[#e3e8ef] border-dashed p-5 flex items-center gap-4 group hover:border-[#635bff] transition-colors cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center grayscale group-hover:grayscale-0 transition-all" style={{ background: conn.bg }}>
                                        <conn.icon className="w-6 h-6" style={{ color: conn.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-[#697386] tracking-tight group-hover:text-[#1a1f36]">{conn.platform}</p>
                                        <p className="text-[10px] font-medium text-[#8792a2]">Click to authorize</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-[#c1c9d2] group-hover:text-[#635bff]" />
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
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#635bff]" /><span className="text-[9px] font-bold text-[#3c4257]">TikTok</span></div>
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
                 stroke="#635bff"
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
                                 {replyStep === 'thinking' && (
                                    <motion.div 
                                       initial={{ opacity: 0, scale: 0.95 }} 
                                       animate={{ opacity: 1, scale: 1 }} 
                                       exit={{ opacity: 0, scale: 0.95 }}
                                       className="flex items-center gap-3 py-2"
                                    >
                                       <div className="w-8 h-8 rounded-full bg-[#635bff]/10 flex items-center justify-center">
                                          <Bot className="w-4 h-4 text-[#635bff] animate-pulse" />
                                       </div>
                                       <span className="text-[10px] font-black text-[#635bff] uppercase tracking-widest">AI Agent is thinking...</span>
                                    </motion.div>
                                 )}

                                 {replyStep === 'reply' && (
                                    <motion.div 
                                       initial={{ opacity: 0, y: 10 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       className="space-y-1"
                                    >
                                       <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center text-white">
                                             <Bot className="w-3 h-3" />
                                          </div>
                                          <span className="text-[10px] font-black text-[#635bff] uppercase tracking-widest">Resort Assistant</span>
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
                                       </div>
                                       <div className="p-4 bg-[#635bff] text-white border border-[#635bff]/20 rounded-2xl rounded-tl-none shadow-lg shadow-[#635bff]/20 max-w-[90%]">
                                          <p className="text-[13px] font-bold leading-relaxed italic">
                                             "{current.reply}"
                                          </p>
                                       </div>
                                    </motion.div>
                                 )}
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
                  {step === 0 && <span className="inline-block w-1 h-3.5 bg-[#635bff] ml-1 animate-pulse rounded-full" />}
               </p>
            </div>
         </div>

         <div className="flex-1 space-y-2">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] px-2">Logs</p>
            <AnimatePresence mode="popLayout">
               {visibleLogs.map((log) => (
                  <motion.div key={log.text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl border border-[#635bff]/10 bg-white shadow-sm flex items-center gap-3">
                     <Sparkles className="w-3.5 h-3.5 text-[#635bff]" />
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
            <span className="hidden lg:block font-black text-[15px] tracking-tight text-[#1a1f36]">SocialCopilot</span>
         </div>
         <div className="flex-1 py-8 px-4 space-y-1">
            {navItems.map((item) => {
               const isActive = activeTab === item.id;
               return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all", isActive ? "bg-white text-[#635bff] shadow-sm border border-[#eceff3]" : "text-[#697386] hover:bg-[#f6f9fc]")}>
                     <item.icon className={cn("w-4 h-4", isActive ? "text-[#635bff]" : "text-[#8792a2]")} />
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
            <Button className="h-9 px-5 bg-[#635bff] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#635bff]/20"><Plus className="w-3.5 h-3.5 mr-2" /> New</Button>
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
