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
  PenSquare, 
  Calendar as CalendarIcon, 
  Link2, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Bell,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  MousePointer2,
  Cpu,
  Brain,
  ChevronRight,
  Send,
  ImageIcon,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Share2
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const resortStats = [
  { name: "Mon", revpar: 185, direct: 60, ota: 40 },
  { name: "Tue", revpar: 198, direct: 62, ota: 38 },
  { name: "Wed", revpar: 210, direct: 68, ota: 32 },
  { name: "Thu", revpar: 245, direct: 75, ota: 25 },
  { name: "Fri", revpar: 310, direct: 84, ota: 16 },
  { name: "Sat", revpar: 345, direct: 92, ota: 8 },
  { name: "Sun", revpar: 290, direct: 88, ota: 12 },
];

const navItems = [
  { id: "Overview", icon: LayoutDashboard, label: "Overview" },
  { id: "Compose", icon: PenSquare, label: "Compose" },
  { id: "Calendar", icon: CalendarIcon, label: "Calendar" },
  { id: "Connections", icon: Link2, label: "Connections" },
  { id: "Replies", icon: MessageSquare, label: "Auto-Reply" },
  { id: "Analytics", icon: BarChart3, label: "Analytics" },
];

// --- High-Fidelity Resort Sub-Views ---

const CountUp = ({ value, prefix = "", suffix = "" }: { value: string, prefix?: string, suffix?: string }) => {
   const [count, setCount] = useState(0);
   const target = parseFloat(value.replace(/[^0-9.]/g, ""));
   
   useEffect(() => {
      let start = 0;
      const end = target;
      const duration = 2000;
      const step = end / (duration / 16);
      
      const timer = setInterval(() => {
         start += step;
         if (start >= end) {
            setCount(end);
            clearInterval(timer);
         } else {
            setCount(start);
         }
      }, 16);
      return () => clearInterval(timer);
   }, [target]);

   return <span>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: value.includes(".") ? 1 : 0, maximumFractionDigits: 1 })}{suffix}</span>;
};

const OverviewView = () => {
   const stats = [
      { label: "Direct Revenue", value: "312.4", prefix: "$", suffix: "k", change: "+14%", icon: TrendingUp, color: "#635bff" },
      { label: "Guest Reach", value: "248.0", suffix: "k", change: "+12%", icon: Share2, color: "#f5a623" },
      { label: "Booking Rate", value: "14.2", suffix: "%", change: "+4.1%", icon: Target, color: "#09825d" },
      { label: "AI Resolution", value: "98.4", suffix: "%", change: "+2%", icon: Zap, color: "#1a1f36" },
   ];
   const activities = [
      { id: 1, label: "Campaign Published", detail: "Social Hub", time: "2m", dot: "#09825d" },
      { id: 2, label: "AI Search", detail: "Booking Gap", time: "15m", dot: "#635bff" },
      { id: 3, label: "Reply Sent", detail: "Spa Inquiry", time: "1h", dot: "#f5a623" },
   ];
   const connections = [
      { platform: "Instagram", icon: FaInstagram, color: "#E1306C", active: true },
      { platform: "Facebook", icon: FaFacebook, color: "#1877F2", active: true },
      { platform: "TikTok", icon: FaTiktok, color: "#000000", active: true },
   ];

   return (
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="flex-1 flex flex-col gap-5">
         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
               <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} key={stat.label} className="bg-white rounded-xl border border-[#eceff3] p-4 shadow-stripe overflow-hidden relative">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-widest">{stat.label}</p>
                     <stat.icon className="w-3 h-3 text-[#8792a2]" />
                  </div>
                  <h4 className="text-xl font-black text-[#1a1f36] mb-1">
                     <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </h4>
                  <span className="text-[9px] font-black text-[#008a00] bg-[#e6f4e6] px-1.5 py-0.5 rounded-full">{stat.change}</span>
               </motion.div>
            ))}
         </div>

         {/* Middle Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="lg:col-span-2 bg-white rounded-2xl border border-[#e3e8ef] shadow-sm flex flex-col min-h-[180px]">
               <div className="px-5 py-3 border-b border-[#f0f3f7] flex items-center justify-between"><h5 className="text-[11px] font-black text-[#1a1f36] uppercase tracking-widest">Orchestration</h5></div>
               <div className="divide-y divide-[#f0f3f7] flex-1">
                  {activities.map((activity) => (
                     <div key={activity.id} className="flex items-center gap-4 px-5 py-2.5 hover:bg-[#f6f9fc] transition-colors group cursor-pointer">
                        <div className="w-6 h-6 rounded-lg bg-[#f6f9fc] border border-[#e3e8ef] flex items-center justify-center shrink-0"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activity.dot }} /></div>
                        <div className="flex-1 min-w-0"><p className="text-[11px] font-black text-[#1a1f36] truncate">{activity.label}</p></div>
                        <span className="text-[9px] font-black text-[#8792a2]">{activity.time}</span>
                     </div>
                  ))}
               </div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0 } }} className="bg-[#fcfdfe] rounded-2xl border border-[#e3e8ef] shadow-sm flex flex-col h-full">
               <div className="px-5 py-3 border-b border-[#f0f3f7]"><h5 className="text-[11px] font-black text-[#1a1f36] uppercase tracking-widest">Status</h5></div>
               <div className="divide-y divide-[#f0f3f7] flex-1">
                  {connections.map((account) => (
                     <div key={account.platform} className="flex items-center gap-3 px-5 py-2.5">
                        <account.icon className="w-3.5 h-3.5" style={{ color: account.color }} />
                        <span className="text-[10px] font-black text-[#1a1f36] flex-1">{account.platform}</span>
                        <div className={cn("w-1.5 h-1.5 rounded-full", account.active ? "bg-[#09825d]" : "bg-[#8792a2]")} />
                     </div>
                  ))}
               </div>
            </motion.div>
         </div>

         {/* Enterprise Strip */}
         <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <div className="relative rounded-2xl overflow-hidden px-6 py-4 flex items-center justify-between gap-4" style={{ background: "linear-gradient(135deg, #635bff 0%, #302681 100%)" }}>
               <div className="relative z-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md"><Zap className="w-5 h-5 text-white" /></div>
                  <div>
                     <p className="text-sm font-black text-white mb-0.5">Unlock Enterprise</p>
                     <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Multi-property orchestration</p>
                  </div>
               </div>
               <Button className="relative z-10 h-9 px-6 rounded-lg bg-white text-[#1a1f36] font-black text-[10px] uppercase tracking-widest hover:bg-white/90 shadow-xl transition-all active:scale-95">Upgrade</Button>
            </div>
         </motion.div>
      </motion.div>
   );
};

const AnalyticsView = () => {
   const data = [
      { name: "Week 1", rev: 4000, bookings: 240, roi: 12 },
      { name: "Week 2", rev: 3000, bookings: 139, roi: 15 },
      { name: "Week 3", rev: 2000, bookings: 980, roi: 8 },
      { name: "Week 4", rev: 2780, bookings: 390, roi: 10 },
      { name: "Week 5", rev: 1890, bookings: 480, roi: 14 },
      { name: "Week 6", rev: 2390, bookings: 380, roi: 13 },
      { name: "Week 7", rev: 3490, bookings: 430, roi: 18 },
   ];

   return (
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="flex-1 flex flex-col gap-5 h-full overflow-hidden">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0">
            {/* Main Yield Chart */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl border border-[#eceff3] p-5 shadow-sm flex flex-col overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                  <div>
                     <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em] mb-1">Weekly Yield Performance</p>
                     <h4 className="text-xl font-black text-[#1a1f36]">RevPAR Growth</h4>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#efffee] border border-[#09825d]/20"><div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" /><span className="text-[9px] font-black text-[#09825d]">+12.4%</span></div>
                  </div>
               </div>
               <div className="flex-1 min-h-[140px] -ml-6">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#635bff" stopOpacity={0.2}/><stop offset="95%" stopColor="#635bff" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f7" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                              const dataPoint = payload[0].payload;
                              return <div className="bg-[#1a1f36] px-3 py-2 rounded-xl shadow-2xl border border-white/10"><p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{dataPoint?.name}</p><p className="text-lg font-black text-white">${payload[0].value?.toLocaleString()}</p></div>;
                           }
                           return null;
                        }} />
                        <Area type="monotone" dataKey="rev" stroke="#635bff" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </motion.div>

            {/* Sub Charts */}
            <div className="flex flex-col gap-5 overflow-hidden">
               <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex-1 bg-white rounded-2xl border border-[#eceff3] p-5 shadow-sm flex flex-col min-h-[100px]">
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Booking Distribution</p>
                     <BarChart3 className="w-3.5 h-3.5 text-[#8792a2]" />
                  </div>
                  <div className="flex-1 -ml-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                           <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#635bff" : "#e3e8ef"} />)}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </motion.div>
               <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex-1 bg-[#fcfdfe] rounded-2xl border border-[#eceff3] p-5 shadow-sm flex flex-col min-h-[100px]">
                  <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em] mb-4">Marketing ROI Profile</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div><p className="text-[9px] font-bold text-[#8792a2] uppercase tracking-widest mb-1">Conversion</p><h5 className="text-2xl font-black text-[#1a1f36]">18.4%</h5></div>
                     <div><p className="text-[9px] font-bold text-[#8792a2] uppercase tracking-widest mb-1">AI Efficiency</p><h5 className="text-2xl font-black text-[#09825d]">98%</h5></div>
                  </div>
               </motion.div>
            </div>
         </div>
      </motion.div>
   );
};

const ComposeView = () => {
   const [text, setText] = useState("");
   const [status, setStatus] = useState("Drafting");
   const fullText = "Escape to paradise this weekend! 🌴 Our Luxury Spa Suites are opening up for a special mid-week booking. Use code 'SUNSET15' for exclusive rates. #ResortLife #LuxuryTravel";

   useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
         setText(fullText.slice(0, i));
         i++;
         if (i > fullText.length) {
            clearInterval(interval);
            setTimeout(() => setStatus("Scheduled"), 1000);
         }
      }, 30);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="flex-1 flex gap-8 h-full">
         <div className="flex-1 p-8 bg-[#fcfdfe] border border-[#e3e8ef] rounded-[2.5rem] flex flex-col gap-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#635bff] flex items-center justify-center text-white"><PenSquare className="w-5 h-5" /></div>
                  <h4 className="font-black text-lg text-[#1a1f36]">Design Campaign</h4>
               </div>
               <div className="px-4 py-1.5 rounded-full bg-[#efffee] text-[10px] font-black text-[#09825d] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse" />
                  {status}
               </div>
            </div>
            <div className="flex-1 bg-white border border-[#e3e8ef] rounded-xl p-4 relative overflow-hidden group">
               <p className="text-[12px] font-medium text-[#1a1f36] leading-relaxed whitespace-pre-wrap">
                  {text}
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-0.5 h-3.5 bg-[#635bff] ml-1 align-middle" />
               </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#f0f3f7]">
               <div className="flex items-center gap-2">
                  {[FaInstagram, FaFacebook, FaTiktok].map((Icon, i) => (
                     <div key={i} className="w-7 h-7 rounded-lg bg-slate-50 border border-[#e3e8ef] flex items-center justify-center text-[#8792a2]"><Icon className="w-3.5 h-3.5" /></div>
                  ))}
               </div>
               <Button className={cn("h-10 px-6 rounded-lg font-black text-[10px] gap-2 transition-all active:scale-95", status === "Scheduled" ? "bg-[#09825d] hover:bg-[#09825d]" : "bg-[#1a1f36] hover:bg-black")}>
                  {status === "Scheduled" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  {status === "Scheduled" ? "QUEUED" : "SCHEDULE"}
               </Button>
            </div>
         </div>
         <div className="w-72 group flex flex-col h-full">
            <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] mb-3 px-2">Live Preview</p>
            <div className="bg-white border border-[#e3e8ef] rounded-[2rem] shadow-sm overflow-hidden flex flex-col flex-1 transform transition-transform group-hover:scale-[1.01]">
               <div className="h-36 bg-slate-100 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center" />
               </div>
               <div className="p-4 space-y-3 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-5 rounded-full bg-slate-200" />
                     <span className="text-[10px] font-black text-[#1a1f36]">luxe_resort</span>
                  </div>
                  <p className="text-[10px] font-medium text-[#697386] line-clamp-4 leading-relaxed">{text}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

const CalendarView = () => (
   <div className="flex-1 p-6 bg-[#fcfdfe] border border-[#e3e8ef] rounded-[2rem] flex flex-col shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-1">
         <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-[#635bff]" />
            <h4 className="font-black text-md text-[#1a1f36]">Schedule</h4>
         </div>
         <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-[#8792a2] border border-[#e3e8ef] rounded-md">Month</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-white bg-[#1a1f36] rounded-md">Week</Button>
         </div>
      </div>
      <div className="flex-1 grid grid-cols-7 gap-4">
         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em] pb-2 border-b border-[#f0f3f7]">{day}</div>
         ))}
         {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#f0f3f7] rounded-2xl p-3 flex flex-col gap-2 min-h-[90px] relative group hover:border-[#635bff]/20 transition-all hover:shadow-md cursor-pointer">
               <span className={cn("text-[10px] font-black", i === 3 ? "text-[#635bff]" : "text-[#8792a2]")}>{12 + i}</span>
               {i === 3 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-2 rounded-xl bg-[#eff6ff] border border-[#635bff]/10 space-y-1">
                     <p className="text-[8px] font-black text-[#635bff] uppercase truncate">Spa Promo</p>
                     <div className="flex gap-1">
                        <FaInstagram className="w-2.5 h-2.5 text-[#635bff]/60" />
                        <FaFacebook className="w-2.5 h-2.5 text-[#635bff]/60" />
                     </div>
                  </motion.div>
               )}
               {i === 5 && (
                  <div className="p-2 rounded-xl bg-[#efffee] border border-[#09825d]/10 space-y-1 opacity-60">
                     <p className="text-[8px] font-black text-[#09825d] uppercase truncate">Tour Reel</p>
                     <FaTiktok className="w-2.5 h-2.5 text-[#09825d]/60" />
                  </div>
               )}
            </div>
         ))}
      </div>
   </div>
);

const ConnectionsView = () => (
   <div className="flex-1 grid grid-cols-2 md:grid-cols-2 gap-4 p-1">
      {[
         { name: "Instagram", user: "@resort_luxe", icon: FaInstagram, color: "#E1306C" },
         { name: "Facebook", user: "Resort Elite", icon: FaFacebook, color: "#1877F2" },
         { name: "TikTok", user: "resort_vibe", icon: FaTiktok, color: "#000000" },
         { name: "YouTube", user: "Resort TV", icon: FaYoutube, color: "#FF0000" }
      ].map((p, i) => (
         <div key={i} className="p-5 bg-white border border-[#eceff3] rounded-2xl shadow-sm group hover:scale-[1.01] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-lg bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef] group-hover:border-black/10 transition-colors">
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
               </div>
               <div className="px-2.5 py-0.5 rounded-full bg-[#e6f4e6] text-[8px] font-black text-[#008a00] uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#008a00]" />
                  LIVE
               </div>
            </div>
            <div>
               <h4 className="text-[13px] font-black text-[#1a1f36]">{p.name}</h4>
               <p className="text-[11px] font-medium text-[#697386] truncate">{p.user}</p>
            </div>
            <div className="mt-4 flex gap-2">
               <Button size="sm" variant="outline" className="flex-1 h-8 px-2 rounded-md font-black text-[9px] uppercase tracking-widest border-[#f0f3f7]">Sync</Button>
            </div>
         </div>
      ))}
   </div>
);

const AutoReplyView = () => (
   <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
      <div className="p-5 bg-[#f6f9fc] border border-[#e3e8ef] rounded-[1.5rem] flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-[#635bff] flex items-center justify-center text-white shadow-lg shadow-[#635bff]/20"><Zap className="w-4.5 h-4.5" /></div>
             <div>
                <p className="text-[10px] font-black text-[#1a1f36] uppercase tracking-widest leading-none mb-1">Reply Autopilot</p>
                <p className="text-[9px] font-bold text-[#635bff] uppercase tracking-wider">AI Strategist ACTIVE</p>
             </div>
         </div>
         <div className="h-1.5 w-24 bg-white rounded-full overflow-hidden shadow-inner">
             <motion.div animate={{ width: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-[#635bff]" />
         </div>
      </div>
      
      <div className="space-y-3">
         {[
            { user: "Sarah Sun", text: "How much per night for the pool villa?", time: "2m ago", platform: <FaInstagram className="w-3 h-3 text-pink-500" /> },
            { user: "HotelExplorer", text: "Is there a gym?", time: "Just now", platform: <FaFacebook className="w-3 h-3 text-blue-600" /> }
         ].map((chat, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} key={chat.user} className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-[#e3e8ef]" />
                  <div className="flex-1">
                     <p className="text-[10px] font-black text-[#1a1f36]">{chat.user}</p>
                     <p className="text-[11px] font-medium text-[#697386]">{chat.text}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                     {chat.platform} <span className="text-[9px] font-bold text-[#8792a2]">{chat.time}</span>
                  </div>
               </div>
               <div className="ml-10 p-4 bg-white border border-[#e3e8ef] rounded-xl relative shadow-sm">
                  <div className="absolute top-4 -left-1.5 w-2.5 h-2.5 bg-white rotate-45 border-l border-b border-[#e3e8ef]" />
                  <div className="flex items-center gap-2 mb-1.5">
                     <Zap className="w-2.5 h-2.5 text-[#635bff]" />
                     <span className="text-[8px] font-black text-[#635bff] uppercase tracking-widest">Resort AI</span>
                     <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-[#008a00]" />
                  </div>
                  <p className="text-[10px] font-black text-[#1a1f36] leading-relaxed italic">
                     "Hi {chat.user}! Our pool villas start at $450/night. You can check availability here: [Link]. Hope to see you!"
                  </p>
               </div>
            </motion.div>
         ))}
      </div>
   </div>
);

// --- AI Agent Sidebar ---

const AIAgentPanel = ({ activeTab }: { activeTab: string }) => {
   const [state, setState] = useState("Scanning");
   const [feed, setFeed] = useState<{ text: string, status: string }[]>([]);
   const [isExecuting, setIsExecuting] = useState(false);
   
   const contextData = {
      Overview: {
         prompt: "AI, identify resort booking gaps and maximize RevPAR.",
         logs: [
            { text: "Detected 14% gap: Weekend 22", status: "ALERT" },
            { text: "Optimizing Direct-to-OTA distribution", status: "PROCESSING" },
            { text: "RevPAR forecast calibrated: +12.4%", status: "CALCULATED" }
         ]
      },
      Compose: {
         prompt: "Draft a high-engagement post for the new Spa wing.",
         logs: [
            { text: "Analyzing brand voice (Sophisticated)", status: "COMPLETED" },
            { text: "Hashtag optimization: #ResortLife", status: "APPLIED" },
            { text: "Tone: Relaxing + Professional", status: "SYNCED" }
         ]
      },
      Calendar: {
         prompt: "AI, fill all mid-week scheduling gaps for the pool bar.",
         logs: [
            { text: "Scheduling peak-hour distribution", status: "ACTIVE" },
            { text: "Gap detection: Mid-week vacancy", status: "RESOLVED" },
            { text: "Optimizing frequency: 1.2/day", status: "LOCKED" }
         ]
      },
      Connections: {
         prompt: "Verify health of all resort social platforms.",
         logs: [
            { text: "Meta Graph API heartbeat: 14ms", status: "HEALTHY" },
            { text: "TikTok Pixel: Verifying conversion", status: "ACTIVE" },
            { text: "Auth token refresh cycle: 12d", status: "SECURE" }
         ]
      },
      Replies: {
         prompt: "Auto-reply to all spa and dining inquiries.",
         logs: [
            { text: "Sentiment analysis: 94% Positive", status: "STABLE" },
            { text: "Auto-resolution: Spa Information", status: "DRAFTING" },
            { text: "Priority escalation: VIP Guest", status: "HANDLED" }
         ]
      },
      Analytics: {
         prompt: "AI, crunch ROI for the summer campaign.",
         logs: [
            { text: "Attribution model: Multi-touch", status: "RESOLVED" },
            { text: "RevPAR Trend: Bullish +8.2%", status: "PREDICTED" },
            { text: "Data exported: ROI Attribution", status: "DONE" }
         ]
      }
   };

   useEffect(() => {
      setIsExecuting(true);
      const data = (contextData as any)[activeTab] || contextData.Overview;
      setTimeout(() => {
         setFeed(data.logs);
         setIsExecuting(false);
         setState(["Analyzing", "Optimizing", "Resolving"][Math.floor(Math.random() * 3)]);
      }, 1500);
   }, [activeTab]);

   return (
      <div className="w-full h-full flex flex-col gap-4 p-1 overflow-hidden">
         {/* Neural Header (Light) */}
         <div className="p-6 rounded-[2.5rem] bg-[#fcfdfe] border border-[#f0f3f7] relative flex flex-col items-center justify-center gap-5 min-h-[180px] shadow-sm overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#635bff05_0%,transparent_70%)]" />
            
            <div className="relative w-16 h-16 flex items-center justify-center">
               <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute inset-0 bg-[#635bff]/5 rounded-full blur-xl" />
               <motion.div 
                  animate={{ y: [0, -3, 0], rotate: [0, 1, 0, -1, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
                  className="w-12 h-12 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center border border-[#f0f3f7] relative z-20"
               >
                  <Brain className="w-6 h-6 text-[#635bff]" />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#09825d] rounded-full border-2 border-white animate-pulse" />
               </motion.div>
            </div>

            <div className="text-center relative z-10">
               <h5 className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.4em] mb-1">{state}</h5>
               <div className="flex gap-1 justify-center">
                   <motion.div animate={{ width: [10, 40, 10] }} transition={{ repeat: Infinity, duration: 2 }} className="h-0.5 bg-[#635bff] rounded-full" />
               </div>
            </div>
         </div>

         {/* Command & Intelligence Feed (Light Theme) */}
         <div className="flex-1 flex flex-col p-6 rounded-[2.5rem] bg-white border border-[#e3e8ef] shadow-premium relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-1 rounded-full bg-[#635bff] shadow-[0_0_8px_#635bff]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#635bff]">Intelligence Stream</span>
            </div>

            {/* Simulated Prompt */}
            <div className="mb-8 p-4 bg-[#f6f9fc] rounded-2xl border border-[#eceff3]">
               <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-3 h-3 text-[#635bff]" />
                  <span className="text-[8px] font-black text-[#1a1f36] uppercase tracking-widest opacity-50">Resort Core Command</span>
               </div>
               <p className="text-[11px] font-black text-[#1a1f36] italic leading-relaxed">
                  "{(contextData as any)[activeTab]?.prompt || contextData.Overview.prompt}"
               </p>
               {isExecuting && (
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-0.5 bg-[#635bff] mt-3 rounded-full" />
               )}
            </div>

            {/* Logs */}
            <div className="space-y-4 flex-1">
               <AnimatePresence mode="popLayout">
                  {!isExecuting && feed.map((log, i) => (
                     <motion.div 
                        key={`${activeTab}-${log.text}`} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col gap-1.5"
                     >
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black text-[#1a1f36] leading-tight tracking-wide">{log.text}</p>
                           <span className={cn(
                              "text-[7px] font-black px-1.5 py-0.5 rounded-md tracking-tighter border",
                              log.status === "ACTIVE" || log.status === "ALERT" 
                                 ? "text-[#635bff] border-[#635bff]/20 bg-[#f6f9fc]" 
                                 : "text-[#09825d] border-[#09825d]/20 bg-[#e6f4e6]"
                           )}>
                              {log.status}
                           </span>
                        </div>
                        <div className="h-[1px] w-full bg-[#f0f3f7]" />
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            {/* Status Strip */}
            <div className="mt-4 flex items-center justify-between text-[8px] font-black text-[#8792a2] uppercase tracking-[0.2em] pt-4 border-t border-[#f0f3f7]">
               <span>Core v2.4.0</span>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
                  <span>AI Strategist High</span>
               </div>
            </div>
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
    <div className="w-full h-[640px] flex bg-white rounded-[3.5rem] overflow-hidden border border-[#e3e8ef] shadow-premium relative group/dash transition-all">
      
      {/* 1. Dashboard Nav (Left) */}
      <div className="w-20 lg:w-60 bg-[#fcfdfe] border-r border-[#f0f3f7] flex flex-col shrink-0 transition-all">
         <div className="p-6 pb-8 border-b border-[#f0f3f7] flex items-center justify-center lg:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a1f36] flex items-center justify-center shadow-lg shadow-black/10">
               <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="hidden lg:block font-black text-[15px] tracking-tight text-[#1a1f36]">SocialCopilot</span>
         </div>
         <div className="flex-1 py-8 px-4 flex flex-col gap-8 overflow-hidden">
            <div>
               <p className="hidden lg:block px-4 mb-4 text-[9px] font-black text-[#8792a2] uppercase tracking-[0.4em] opacity-60">Resort Core</p>
               <div className="space-y-1">
                  {navItems.map((item) => {
                     const isActive = activeTab === item.id;
                     return (
                        <button 
                           key={item.id} 
                           onClick={() => setActiveTab(item.id)} 
                           className={cn(
                              "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all group relative", 
                              isActive 
                                 ? "bg-white text-[#635bff] shadow-sm border border-[#eceff3]" 
                                 : "text-[#697386] hover:bg-[#f6f9fc] hover:text-[#1a1f36]"
                           )}
                        >
                           <item.icon className={cn("w-4 h-4 shrink-0 transition-all group-hover:scale-110", isActive ? "text-[#635bff]" : "text-[#8792a2] group-hover:text-[#1a1f36]")} />
                           <span className="hidden lg:block text-[12px] font-black tracking-tight">{item.label}</span>
                           {isActive && <motion.div layoutId="nav-glow-2" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#635bff] rounded-r-full shadow-[0_0_12px_rgba(99,91,255,0.4)]" />}
                        </button>
                     );
                  })}
               </div>
            </div>
         </div>
         <div className="p-6">
            <div className="flex items-center justify-center lg:justify-start gap-3 border border-[#f0f3f7] p-3 rounded-2xl bg-white">
               <div className="w-7 h-7 rounded-full bg-slate-100 border border-[#e3e8ef]" />
               <div className="hidden lg:block">
                  <p className="text-[10px] font-black text-[#1a1f36]">Admin</p>
                  <p className="text-[8px] font-black text-[#09825d] uppercase tracking-widest">Active Plan</p>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Main Workspace (Center) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
         <header className="h-14 border-b border-[#f0f3f7] px-6 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3 bg-[#f6f9fc] px-4 py-1.5 rounded-full border border-[#e3e8ef] w-full max-w-xs">
               <Search className="w-3.5 h-3.5 text-[#8792a2]" />
               <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[11px] font-black text-[#1a1f36] placeholder-[#8792a2] w-full" />
            </div>
            <div className="flex items-center gap-3">
               <Button className="h-9 px-5 rounded-lg bg-[#635bff] hover:bg-[#4f46e5] text-white font-black text-[11px] uppercase tracking-widest gap-2 shadow-lg shadow-[#635bff]/20 transition-all active:scale-95">
                  <Plus className="w-3.5 h-3.5" /> New
               </Button>
            </div>
         </header>

         <div className="flex-1 p-6 overflow-hidden bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:40px_40px]">
            <AnimatePresence mode="wait">
               <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="h-full">
                  {activeTab === "Overview" && <OverviewView />}
                  {activeTab === "Compose" && <ComposeView />}
                  {activeTab === "Calendar" && <CalendarView />}
                  {activeTab === "Connections" && <ConnectionsView />}
                  {activeTab === "Replies" && <AutoReplyView />}
                  {activeTab === "Analytics" && <AnalyticsView />}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>

      {/* 3. AI Agent Sidebar (Right) */}
      <div className="hidden xl:flex w-80 bg-[#fcfdfe] border-l border-[#f0f3f7] flex flex-col p-6 shrink-0">
         <AIAgentPanel activeTab={activeTab} />
      </div>
      
    </div>
  );
}
