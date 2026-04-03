"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  LayoutDashboard, 
  BarChart3, 
  Layers, 
  Calendar, 
  MessageSquare,
  Sparkles, 
  Send,
  Zap,
  CheckCircle2,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const performanceData = [
  { name: "Mon", value: 3200, reach: 4500 },
  { name: "Tue", value: 4100, reach: 5200 },
  { name: "Wed", value: 3800, reach: 4800 },
  { name: "Thu", value: 5200, reach: 6400 },
  { name: "Fri", value: 6800, reach: 8100 },
  { name: "Sat", value: 7400, reach: 9200 },
  { name: "Sun", value: 8200, reach: 10500 },
];

const platformEngagement = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "Twitter/X", value: 30, color: "#000000" },
  { name: "YouTube", value: 25, color: "#FF0000" },
];

// --- Sub-Views ---

const DashboardView = ({ displayText, isTyping }: any) => (
  <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-12 gap-6 relative">
      {/* Main Chart Card */}
      <div className="col-span-12 lg:col-span-8 p-6 lg:px-8 lg:py-8 rounded-3xl border border-black/5 bg-[#f6f9fc] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider mb-1">Growth Forecast</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl lg:text-3xl font-black text-[#1a1f36]">12.4k</h4>
              <span className="text-[11px] font-bold text-[#09825d] bg-[#efffee] px-2 py-0.5 rounded-full">+18%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#635bff]" />
            <span className="text-[10px] font-bold text-[#1a1f36]">Reach</span>
          </div>
        </div>
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635bff" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e3e8ef" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8792a2", fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8792a2", fontSize: 10, fontWeight: 700 }} />
              <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: "bold" }} />
              <Area type="monotone" dataKey="value" stroke="#635bff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side Widgets */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="p-6 rounded-3xl border border-black/5 bg-white shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <div className="w-8 h-8 rounded-lg bg-[#efffee] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#09825d]" />
             </div>
             <span className="text-[10px] font-bold text-[#8792a2]">NOW ACTIVE</span>
          </div>
          <p className="text-sm font-bold text-[#1a1f36]">AI Optimizer Engine</p>
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="p-6 rounded-3xl border border-[#635bff]/10 bg-[#635bff]/5 flex flex-col gap-1">
           <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#635bff]" />
              <p className="text-[10px] font-black text-[#635bff] uppercase tracking-wider">Top Recommendation</p>
           </div>
           <p className="text-xs font-bold text-[#3c4257] leading-relaxed italic">
             "Shift your posting to 11 AM tomorrow for 40% more engagement."
           </p>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-12 gap-8">
       {/* Detailed Metrics */}
       <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
         <div className="p-8 rounded-3xl border border-black/5 bg-[#f6f9fc]">
           <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest mb-6 px-1">Engagement Heatmap</p>
           <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8792a2", fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? "#635bff" : "#e3e8ef"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
         </div>
       </div>

       {/* Platform Breakdown */}
       <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="p-8 rounded-3xl border border-black/5 bg-white shadow-sm flex flex-col gap-6">
            <h4 className="text-sm font-bold text-[#1a1f36]">Platform Split</h4>
            <div className="space-y-4">
              {platformEngagement.map(p => (
                <div key={p.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                     <span className="text-[#3c4257]">{p.name}</span>
                     <span style={{ color: p.color }}>{p.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.value}%` }} className="h-full" style={{ backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-[#635bff] text-white flex items-center justify-between group cursor-pointer overflow-hidden relative shadow-lg shadow-[#635bff]/20">
             <div className="relative z-10">
               <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Growth Factor</p>
               <h4 className="text-xl font-bold">New Viral Pattern</h4>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
               <ArrowRight className="w-5 h-5 text-white" />
             </div>
             <TrendingUp className="absolute bottom-[-20%] right-[-10%] w-32 h-32 text-white/5 -rotate-12" />
          </div>
       </div>
    </div>
  </div>
);

const CalendarView = () => (
  <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
     <div className="p-8 rounded-[2.5rem] bg-[#f6f9fc] border border-black/5">
        <div className="grid grid-cols-7 gap-4 mb-8">
           {['m', 't', 'w', 't', 'f', 's', 's'].map((d, i) => (
             <div key={i} className="text-[10px] font-black text-[#8792a2] uppercase text-center">{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
           {Array.from({ length: 31 }).map((_, i) => {
             const hasPost = [4, 6, 12, 18, 22, 28].includes(i);
             const isToday = i === 18;
             return (
               <div key={i} className={cn(
                 "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border relative group transition-all",
                 isToday ? "bg-white border-[#635bff] shadow-md scale-110 z-10" : "bg-transparent border-black/5 hover:border-black/10"
               )}>
                 <span className={cn("text-[10px] font-bold", isToday ? "text-[#635bff]" : "text-[#8792a2]")}>{i + 1}</span>
                 {hasPost && (
                   <div className="flex gap-1 justify-center">
                      <div className={cn("w-1.5 h-1.5 rounded-full", i % 2 === 0 ? "bg-[#E1306C]" : "bg-[#000000]")} />
                      {i % 3 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />}
                   </div>
                 )}
               </div>
             );
           })}
        </div>
     </div>
  </div>
);

const AutoReplyView = () => (
   <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500 max-w-2xl mx-auto w-full pt-4">
      <div className="space-y-6">
         {[
           { user: "Alex J.", comment: "Love the new update! How can I join the beta?", reply: "Hey Alex! We're thrilled you're excited. You can join the beta at socialpilot.io/beta-access! 🚀", platform: <FaInstagram className="w-3 h-3 text-[#E1306C]" /> },
           { user: "Sarah Sun", comment: "Is there a trial plan for agencies?", reply: "Yes Sarah! Our Agency Pro plan comes with a 14-day full trial. Sending you a DM with details! 📩", platform: <FaXTwitter className="w-3 h-3 text-[#1a1f36]" /> }
         ].map((chat, i) => (
           <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.4 }} key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 border border-black/5" />
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-[#1a1f36]">{chat.user}</span>
                    <p className="text-xs text-[#3c4257]">{chat.comment}</p>
                 </div>
              </div>
              <div className="ml-11 p-4 rounded-2xl bg-[#f6f9fc] border border-black/5 relative">
                 <div className="absolute top-0 left-[-6px] top-4 w-4 h-4 bg-[#f6f9fc] rotate-45 border-l border-b border-black/5" />
                 <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-4 rounded bg-[#635bff] flex items-center justify-center"><Zap className="w-2.5 h-2.5 text-white" /></div>
                    <span className="text-[10px] font-black text-[#635bff] uppercase tracking-wider">AI Copilot</span>
                    <div className="h-1 flex-1 bg-[#635bff]/10 mx-2" />
                    {chat.platform}
                 </div>
                 <p className="text-[11px] font-bold text-[#1a1f36] leading-relaxed italic">{chat.reply}</p>
              </div>
           </motion.div>
         ))}
      </div>
   </div>
);

// --- Main Interactive Preview ---

export function InteractivePreview() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [displayText, setDisplayText] = useState("");
  const fullText = "Just optimized our weekly growth strategy via Social Copilot AI. Results are incredible so far! 🚀 #Growth #Analytics";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        setTimeout(() => { i = 0; }, 5000);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[660px] flex items-stretch bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl relative">
      
      {/* Sidebar Mockup */}
      <div className="w-16 lg:w-24 bg-[#f8fafc] border-r border-[#f1f5f9] flex flex-col items-center py-10 gap-10">
        <div className="w-12 h-12 rounded-2xl bg-[#635bff] flex items-center justify-center shadow-lg shadow-[#635bff]/20 relative group hover:scale-110 transition-transform cursor-pointer">
          <span className="text-white font-black text-2xl">✦</span>
        </div>
        <div className="flex flex-col gap-8">
          {[
            { id: "Dashboard", icon: LayoutDashboard, color: "#635bff" },
            { id: "Analytics", icon: BarChart3, color: "#3cb371" },
            { id: "Calendar", icon: Calendar, color: "#fa8072" },
            { id: "Replies", icon: MessageSquare, color: "#6495ed" },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative w-12 h-12 flex items-center justify-center transition-all group",
                  isActive ? "text-[#635bff]" : "text-[#8792a2] hover:text-[#3c4257]"
                )}
              >
                {isActive && (
                   <motion.div layoutId="active-nav" className="absolute inset-0 bg-white shadow-xl shadow-black/5 border border-[#f1f5f9] rounded-2xl" />
                )}
                <item.icon className={cn("w-6 h-6 relative z-10 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#635bff] rounded-full -ml-[12px] lg:-ml-[16px]" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto mb-2 flex flex-col gap-6">
           <div className="w-10 h-10 rounded-full border border-black/5 bg-white shadow-sm flex items-center justify-center text-[#8792a2] hover:text-[#635bff] transition-colors cursor-pointer"><Bell className="w-5 h-5" /></div>
           <div className="w-10 h-10 rounded-full border border-black/5 bg-slate-200" />
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col p-8 lg:p-14 overflow-hidden relative">
        
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-1 h-3 rounded-full bg-[#635bff]" />
             <h2 className="text-2xl font-black text-[#1a1f36] tracking-tight">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-black/5 rounded-full">
                <Search className="w-3.5 h-3.5 text-[#8792a2]" />
                <span className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest">Global Search</span>
             </div>
             <Button size="sm" className="bg-[#1a1f36] hover:bg-black text-white h-10 px-5 font-black text-[11px] rounded-full gap-2">
                CREATE <Plus className="w-4 h-4" />
             </Button>
          </div>
        </div>

        <div className="flex-1 relative overflow-visible">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
               className="h-full"
             >
                {activeTab === "Dashboard" && <DashboardView displayText={displayText} isTyping={true} />}
                {activeTab === "Analytics" && <AnalyticsView />}
                {activeTab === "Calendar" && <CalendarView />}
                {activeTab === "Replies" && <AutoReplyView />}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Global Floating Composer (Only in Dashboard or Overlay mode) */}
        {activeTab === "Dashboard" && (
           <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 1, duration: 0.8 }}
             className="absolute bottom-12 right-12 w-80 p-7 rounded-[2rem] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.18)] border border-black/5 z-50 group hover:-translate-y-2 transition-all duration-500"
           >
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-[#635bff] flex items-center justify-center text-white shadow-lg shadow-[#635bff]/20">
                      <Send className="w-4 h-4" />
                   </div>
                   <p className="text-sm font-black text-[#1a1f36]">AI Composer</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#efffee] border border-[#09825d]/10">
                   <Zap className="w-3 h-3 text-[#09825d] animate-pulse" />
                   <span className="text-[9px] font-black text-[#09825d]">POWERED</span>
                </div>
             </div>

             <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 min-h-[140px] flex flex-col justify-between mb-6">
                <p className="text-xs font-bold text-[#3c4257] leading-relaxed">
                   {displayText}
                   <span className="inline-block w-1 h-3.5 bg-[#635bff] ml-1 animate-bounce" />
                </p>
                <div className="flex items-center gap-2 pt-4">
                   <FaXTwitter className="w-3.5 h-3.5 text-[#1a1f36]" />
                   <FaInstagram className="w-3.5 h-3.5 text-[#E1306C]" />
                   <div className="h-1 flex-1 bg-slate-200 rounded-full" />
                </div>
             </div>

             <Button className="w-full bg-[#635bff] hover:bg-[#4f46e5] h-12 rounded-2xl font-black text-[12px] shadow-xl shadow-[#635bff]/20">
                PROCEED TO POST
             </Button>
           </motion.div>
        )}

      </div>
    </div>
  );
}
