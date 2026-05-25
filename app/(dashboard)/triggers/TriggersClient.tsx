"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Target, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Bell, 
  Clock, 
  Play, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  ArrowRight, 
  ChevronRight,
  History,
  Activity,
  ShieldCheck,
  ZapOff,
  SlidersHorizontal,
  BarChart3,
  Plus,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0 }
};

interface Trigger {
  id: string;
  type: string;
  name: string;
  condition: any;
  action: any;
  isActive: boolean;
  lastFiredAt: string | null;
  fireCount: number;
}

interface TriggerLog {
  id: string;
  triggerId: string;
  triggerName: string;
  firedAt: string;
  actionTaken: string;
  result: string;
  revenueGenerated: number;
}

const TYPE_CONFIG: Record<string, any> = {
  low_engagement: { icon: TrendingDown, color: "#e11d48" },
  viral_spike: { icon: TrendingUp, color: "#09825d" },
  booking_slump: { icon: AlertCircle, color: "#f5a623" },
  follower_milestone: { icon: Users, color: "#2d6a4f" },
  no_post_48h: { icon: Clock, color: "#8792a2" },
  content_gap: { icon: Clock, color: "#8792a2" },
  high_comment_volume: { icon: Bell, color: "#0284c7" },
  whatsapp_blast: { icon: MessageSquare, color: "#25D366" },
};

function timeAgo(isoString: string | null) {
  if (!isoString) return "Never fired";
  const diff = Date.now() - new Date(isoString).getTime();
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return "Just now";
}

export function TriggersClient({ initialTriggers = [] }: { initialTriggers?: any[] }) {
  const [triggers, setTriggers] = useState<Trigger[]>(initialTriggers as any[]);
  const [logs, setLogs] = useState<TriggerLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tRes, lRes] = await Promise.all([
        fetch("/api/triggers"),
        fetch("/api/triggers/logs")
      ]);
      if (tRes.ok) setTriggers(await tRes.json());
      if (lRes.ok) setLogs(await lRes.json());
    } catch (error) {
      console.error("Failed to fetch triggers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTrigger = async (id: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/triggers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        setTriggers(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentState } : t));
        toast.success(!currentState ? "⚡ Trigger activated" : "Trigger paused");
      }
    } catch (error) {
      toast.error("Failed to update trigger");
    }
  };

  const activeCount = triggers.filter(t => t.isActive).length;
  const totalFired = triggers.reduce((sum, t) => sum + (t.fireCount || 0), 0);
  const totalRevenue = logs.reduce((sum, l) => sum + (l.revenueGenerated || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-6 h-6 text-[#2d6a4f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f6f9fc] min-h-screen flex flex-col font-sans selection:bg-[#2d6a4f44]">
      {/* ── Extreme Stripe Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e3e8ef]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                  <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2d6a4f]">Autopilot</span>
                          <span className="w-1 h-1 rounded-full bg-[#1a1f36]/10" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8792a2]">Triggers</span>
                      </div>
                      <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#1a1f36]">
                        Management
                      </h1>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2.5 px-4 py-2 bg-[#efffee] border border-[#b7ebc8]/30 rounded-lg shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse" />
                          <span className="text-[11px] font-black text-[#09825d] uppercase tracking-wider">{activeCount} Systems Live</span>
                      </div>
                      <button 
                        onClick={() => toast.info("Initializing Trigger Builder...", {
                          description: "The AI agent is preparing the behavioral monitoring environment.",
                          icon: <Sparkles className="w-4 h-4 text-[#2d6a4f]" />
                        })}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#2d6a4f] text-white text-[12px] font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>Add Trigger</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* ── Final Minimalist Content Area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white shadow-inner custom-scrollbar">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-32 pb-64">
            
            {/* ── Unified Metric Rail ── */}
            <div className="bg-white border border-[#e3e8ef] rounded-[24px] divide-x divide-[#e3e8ef] flex flex-col md:flex-row overflow-hidden shadow-[0_1px_1px_rgba(31,41,55,0.08)]">
                {[
                  { label: "Detected Units", value: triggers.length, icon: Zap, sub: "Systems identified" },
                  { label: "Automated Fires", value: totalFired, icon: Activity, sub: "Historical velocity" },
                  { label: "ROI Protected", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, sub: "Yield matching" },
                ].map((stat) => (
                  <div key={stat.label} className="p-10 flex-1 hover:bg-[#fcfdfe] transition-colors group">
                      <div className="flex items-center justify-between mb-8">
                         <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8792a2] group-hover:text-[#2d6a4f]">{stat.label}</p>
                         <stat.icon size={16} strokeWidth={1.2} className="text-[#8792a2] group-hover:text-[#2d6a4f] transition-colors" />
                      </div>
                      <p className="text-[32px] font-black text-[#1a1f36] tracking-[-0.04em] leading-tight mb-2">{stat.value}</p>
                      <p className="text-[12px] font-bold text-[#697386]">{stat.sub}</p>
                  </div>
                ))}
            </div>

            {/* ── Main Data Rail Architecture ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                {/* Configuration List (Flat Architecture) */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#2d6a4f] shadow-[0_0_8px_rgba(99,91,255,0.3)]" />
                             <h3 className="text-xl font-black text-[#1a1f36] tracking-tight">Active Configurations</h3>
                        </div>
                        <p className="text-[13px] text-[#8792a2] font-semibold uppercase tracking-widest">Autonomous behavioral units</p>
                    </div>

                    <div className="divide-y divide-[#f0f3f7] border-t border-b border-[#f0f3f7]">
                        {triggers.map((trigger) => {
                            const config = TYPE_CONFIG[trigger.type] || { icon: Zap, color: "#2d6a4f" };
                            const Icon = config.icon;
                            return (
                                <div key={trigger.id} className="py-10 flex items-center justify-between group hover:bg-[#fcfdfe] transition-all px-6 rounded-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-2xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef] group-hover:bg-[#2d6a4f]/5 group-hover:border-[#2d6a4f]/20 transition-all">
                                            <Icon size={18} strokeWidth={1.2} className="text-[#2d6a4f]" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                 <p className="text-[16px] font-black text-[#1a1f36] tracking-tight">{trigger.name}</p>
                                                 <span className="text-[10px] font-black uppercase text-[#8792a2] tracking-wider bg-[#f6f9fc] px-1.5 py-0.5 rounded border border-[#e3e8ef]">
                                                     {trigger.type.replace(/_/g, ' ')}
                                                 </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] font-bold text-[#697386]">
                                                  <span className="text-[#2d6a4f]">{trigger.fireCount} events</span>
                                                  <span className="w-1 h-1 rounded-full bg-[#e3e8ef]" />
                                                  <span>{timeAgo(trigger.lastFiredAt)}</span>
                                                  <span className="w-1 h-1 rounded-full bg-[#e3e8ef]" />
                                                  <span className="text-[#1a1f36] truncate max-w-[200px]">{trigger.action.description || trigger.action.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                         <button
                                            onClick={(e) => { e.stopPropagation(); toggleTrigger(trigger.id, trigger.isActive); }}
                                            className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-all active:scale-[0.95]"
                                            style={{ backgroundColor: trigger.isActive ? "#2d6a4f" : "#e3e8ef" }}
                                         >
                                            <motion.span
                                                animate={{ x: trigger.isActive ? 22 : 2 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md"
                                            />
                                         </button>
                                         <ArrowUpRight className="w-4 h-4 text-[#c4cdd6] group-hover:text-[#2d6a4f] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Vertical Event Steam (High-Density) */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-[#e3e8ef] pb-8">
                        <div className="flex items-center gap-3">
                             <History size={18} strokeWidth={1.2} className="text-[#8792a2]" />
                             <h3 className="text-[13px] font-black text-[#1a1f36] uppercase tracking-[0.25em]">Live Timeline</h3>
                        </div>
                        <button 
                            onClick={() => {
                                setLogs([]);
                                toast.success("Timeline cleared successfully.");
                            }}
                            className="text-[10px] font-black text-[#e11d48] uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-opacity"
                        >
                            Clear logs
                        </button>
                    </div>

                    <div className="divide-y divide-[#f0f3f7] border-t border-b border-[#f0f3f7] bg-white rounded-lg px-2">
                        {logs.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="text-[12px] font-bold text-[#8792a2]">Timeline is silent...</p>
                            </div>
                        ) : (
                            logs.slice(0, 8).map((log) => (
                                <div key={log.id} className="py-6 flex flex-col gap-1.5 group hover:bg-[#fcfdfe] transition-all px-4 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[13px] font-black text-[#1a1f36] tracking-tight">{log.triggerName}</p>
                                        <span className="text-[10px] font-black text-[#8792a2] uppercase">{new Date(log.firedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[12px] text-[#697386] font-medium leading-relaxed truncate">{log.actionTaken}</p>
                                    {log.revenueGenerated > 0 && (
                                        <span className="text-[10px] font-black text-[#09825d] mt-1">
                                            +${log.revenueGenerated}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* AI Advisory Box */}
                    <div className="p-10 rounded-[32px] border border-[#2d6a4f]/15 bg-[#fcfdfe] relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-40 group-hover:opacity-100 transition-opacity">
                             <Sparkles size={18} strokeWidth={1.2} className="text-[#2d6a4f]" />
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#2d6a4f]">Strategic Shield Active</h4>
                            <p className="text-[16px] text-[#3c4257] leading-relaxed font-semibold italic">
                                "Triggers are currently monitoring for <span className="text-[#1a1f36] font-black underline decoration-[#2d6a4f]/20 underline-offset-4">engagement spikes</span> and content gaps. Autonomous protection is synchronized."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Global Status Feed ── */}
            <div className="flex flex-col items-center gap-8 pt-24">
                <div className="w-16 h-px bg-[#e3e8ef]" />
                <div className="flex items-center gap-5 text-[11px] font-bold text-[#8792a2]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse shadow-[0_0_8px_rgba(9,130,93,0.5)]" />
                    <span className="uppercase tracking-[0.2em]">Live system scanning frequencies active. Last heartbeat: Just now.</span>
                </div>
                <div className="flex items-center gap-10 mt-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                     <Zap size={16} strokeWidth={1.5} className="text-[#2d6a4f]" />
                     <ShieldCheck size={16} strokeWidth={1.5} />
                     <Activity size={16} strokeWidth={1.5} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
