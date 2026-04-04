"use client";

import { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Award, 
  ArrowUpRight, 
  BarChart3, 
  Zap, 
  Info, 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  ArrowRight,
  Target,
  ArrowUp,
  CheckCircle2,
  PieChart,
  Activity,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

const CAMPAIGN_ROI_DATA = [
  { campaign: "Weekend Spa Deal", reach: 4200, bookings: 8, revenue: 960, roi: "340%", roiPct: 80 },
  { campaign: "Room Fill Friday", reach: 2800, bookings: 5, revenue: 600, roi: "280%", roiPct: 65 },
  { campaign: "Loyalty Blast", reach: 1100, bookings: 3, revenue: 360, roi: "420%", roiPct: 100 },
  { campaign: "Instagram Reel Push", reach: 6500, bookings: 12, revenue: 1440, roi: "310%", roiPct: 73 },
];

const FORECAST_DATA = [
  { label: "Mon — Wed", value: 420 },
  { label: "Thu — Fri", value: 680 },
  { label: "Weekend", value: 700 },
];

const ATTRIBUTION_DATA = [
  { label: "Direct (UTM)", value: 1840, pct: 43 },
  { label: "Assisted", value: 1440, pct: 34 },
  { label: "Predicted", value: 1000, pct: 23 },
];

export function RevenueClient({ campaigns }: { campaigns: any[] }) {
  const [activeRange, setActiveRange] = useState("Last 30 days");

  return (
    <div className="bg-[#f6f9fc] min-h-screen flex flex-col font-sans selection:bg-[#635bff44]">
      {/* ── Extreme Stripe Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e3e8ef]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                  <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#635bff]">Revenue</span>
                          <span className="w-1 h-1 rounded-full bg-[#635bff]/20" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8792a2]">Intelligence</span>
                      </div>
                      <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#1a1f36]">
                        Insights
                      </h1>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#f6f9fc] border border-[#e3e8ef] rounded-xl hover:border-[#635bff] transition-all cursor-pointer group active:scale-[0.98]">
                          <Calendar className="w-3.5 h-3.5 text-[#8792a2] group-hover:text-[#635bff]" strokeWidth={1.2} />
                          <span className="text-[13px] font-bold text-[#1a1f36]">{activeRange}</span>
                          <ChevronDown className="w-3 h-3 text-[#c4cdd6]" strokeWidth={2.0} />
                      </div>
                      <button 
                        onClick={() => toast.success("Generating financial intelligence report...", {
                          description: "Your report will be ready for download in a few seconds.",
                          icon: <Activity className="w-4 h-4 text-[#635bff]" />
                        })}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#635bff] text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(99,91,255,0.25)] hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>Generated Report</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* ── Final Minimalist Data View Area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white shadow-inner custom-scrollbar">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-24 pb-64">
            
            {/* ── Unified Metric Rail ── */}
            <div className="bg-white border border-[#e3e8ef] rounded-[28px] divide-x divide-[#e3e8ef] flex flex-col md:flex-row overflow-hidden shadow-[0_1px_1px_rgba(31,41,55,0.08)]">
                {[
                  { label: "Net Revenue", value: "$4,280.00", icon: DollarSign, trend: "+34%", up: true, sub: "Synchronized active" },
                  { label: "Predicted Velocity", value: "$1,800.00", icon: Sparkles, trend: "+12%", up: true, sub: "7-day AI horizon" },
                  { label: "Yield Performance", value: "420% ROI", icon: Award, trend: "+7%", up: true, sub: "Loyalty campaign peak" },
                  { label: "Conversion Match", value: "94.2%", icon: Target, trend: "+2%", up: true, sub: "Matched UTM signals" },
                ].map((stat) => (
                  <div key={stat.label} className="p-10 flex-1 hover:bg-[#fcfdfe] transition-colors group">
                      <div className="flex items-center justify-between mb-8">
                         <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8792a2] group-hover:text-[#635bff]">{stat.label}</p>
                         <stat.icon size={16} strokeWidth={1.2} className="text-[#8792a2] group-hover:text-[#635bff] transition-colors" />
                      </div>
                      <div className="flex items-baseline gap-4 mb-3">
                          <p className="text-[32px] font-black text-[#1a1f36] tracking-[-0.04em] leading-tight">{stat.value}</p>
                          <span className={`text-[11px] font-black ${stat.up ? "text-[#09825d]" : "text-[#e11d48]"}`}>{stat.trend}</span>
                      </div>
                      <p className="text-[12px] font-bold text-[#697386]">{stat.sub}</p>
                  </div>
                ))}
            </div>

            {/* ── Integrated Trend View ── */}
            <div className="space-y-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#1a1f36] tracking-tight">Growth Projection</h3>
                        <p className="text-[13px] text-[#8792a2] font-semibold mt-1">Real-time velocity vs model-generated benchmarks.</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#1a1f36]" />
                            <span className="text-[11px] font-black uppercase text-[#8792a2] tracking-[0.2em]">Actual</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#e3e8ef]" />
                            <span className="text-[11px] font-black uppercase text-[#8792a2] tracking-[0.2em]">Benchmark</span>
                        </div>
                    </div>
                </div>

                {/* Minimalist Line Chart Simulation */}
                <div className="relative h-[280px] w-full px-4 overflow-hidden border-b border-[#e3e8ef]/50">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 280">
                        <line x1="0" y1="70" x2="1000" y2="70" stroke="#f0f3f7" strokeWidth="1" />
                        <line x1="0" y1="140" x2="1000" y2="140" stroke="#f0f3f7" strokeWidth="1" />
                        <line x1="0" y1="210" x2="1000" y2="210" stroke="#f0f3f7" strokeWidth="1" />

                        <path 
                            d="M 50 220 L 210 180 L 370 195 L 530 140 L 690 125 L 850 160" 
                            fill="none" 
                            stroke="#e3e8ef" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />

                        <path 
                            d="M 50 240 L 210 200 L 370 210 L 530 130 L 690 110 L 850 50" 
                            fill="none" 
                            stroke="#635bff" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="drop-shadow-[0_4px_12px_rgba(99,91,255,0.2)]"
                        />
                        
                        {[50, 210, 370, 530, 690, 850].map((x, i) => (
                            <circle key={i} cx={x} cy={[240, 200, 210, 130, 110, 50][i]} r="4" fill="white" stroke="#635bff" strokeWidth="2.5" />
                        ))}
                    </svg>
                    <div className="flex justify-between px-1.5 mt-8 text-[11px] font-black text-[#8792a2] uppercase tracking-[0.3em]">
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                    </div>
                </div>
            </div>

            {/* ── Main Data Rail Architecture ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#09825d] shadow-[0_0_8px_rgba(9,130,93,0.3)]" />
                             <h3 className="text-xl font-black text-[#1a1f36] tracking-tight">Dynamic Strategies</h3>
                        </div>
                        <p className="text-[13px] text-[#8792a2] font-semibold uppercase tracking-[0.2em]">Active engagement conversions</p>
                    </div>

                    <div className="divide-y divide-[#f0f3f7] border-t border-b border-[#f0f3f7]">
                        {CAMPAIGN_ROI_DATA.map((row) => (
                            <div key={row.campaign} className="py-10 flex items-center justify-between group hover:bg-[#fcfdfe] transition-all px-6 rounded-2xl">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-2xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef] group-hover:bg-[#635bff]/5 group-hover:border-[#635bff]/20 transition-all">
                                        <Zap size={16} strokeWidth={1.2} className="text-[#635bff]" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[16px] font-black text-[#1a1f36] tracking-tight">{row.campaign}</p>
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-[#697386] uppercase tracking-wider">
                                              <span className="text-[#635bff]">{row.reach.toLocaleString()} Reached</span>
                                              <span className="text-[#09825d]">{row.roi} ROI</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                     <div className="text-right">
                                         <p className="text-[18px] font-black text-[#1a1f36]">+${row.revenue.toLocaleString()}</p>
                                         <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-widest mt-1">Captured</p>
                                     </div>
                                     <ArrowRight className="w-4 h-4 text-[#c4cdd6] group-hover:text-[#635bff] group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                             <PieChart size={18} strokeWidth={1.2} className="text-[#8792a2]" />
                             <h3 className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.25em]">Attribution Score</h3>
                        </div>
                        <div className="space-y-12">
                            {ATTRIBUTION_DATA.map((item) => (
                                <div key={item.label} className="space-y-5">
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="font-bold text-[#697386]">{item.label}</span>
                                        <span className="font-black text-[#1a1f36]">{item.pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#f6f9fc] rounded-full overflow-hidden border border-[#e3e8ef]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.pct}%` }}
                                            transition={{ duration: 1, ease: "circOut" }}
                                            className="h-full bg-[#635bff] rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 rounded-[32px] border border-[#635bff]/15 bg-white relative group overflow-hidden shadow-[0_8px_32px_-12px_rgba(99,91,255,0.15)] hover:shadow-2xl hover:shadow-[#635bff]/10 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-40 group-hover:opacity-100 transition-opacity">
                             <Sparkles size={18} strokeWidth={1.2} className="text-[#635bff]" />
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#635bff]">Strategic Guidance</h4>
                            <p className="text-[17px] text-[#3c4257] leading-relaxed font-semibold italic">
                                "Weekend stay trends currently generate <span className="text-[#635bff] font-black underline decoration-[#635bff]/20 underline-offset-4 pointer-events-none">2.4× more intensity</span>. Deploying a Thursday blast would optimize efficiency."
                            </p>
                            <button 
                              onClick={() => toast.info("Opening AI Strategy Model...", {
                                description: "Loading latest seasonal behavioral weights.",
                                icon: <Sparkles className="w-4 h-4 text-[#635bff]" />
                              })}
                              className="text-[12px] font-black text-[#635bff] hover:underline flex items-center gap-2 group/link"
                            >
                                Analyze model
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8 pt-20">
                <div className="w-16 h-px bg-[#e3e8ef]" />
                <div className="flex items-center gap-4 text-[11px] font-bold text-[#8792a2]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09825d] animate-pulse shadow-[0_0_8px_rgba(9,130,93,0.5)]" />
                    <span className="uppercase tracking-[0.15em]">Global synchronization active across all matched UTM identifiers.</span>
                </div>
                <div className="flex items-center gap-8 mt-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                     <PieChart size={16} strokeWidth={1.5} />
                     <Zap size={16} strokeWidth={1.5} className="text-[#635bff]" />
                     <Activity size={16} strokeWidth={1.5} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
