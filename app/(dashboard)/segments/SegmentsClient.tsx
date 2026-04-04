"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Sparkles, 
  Star, 
  Clock, 
  History, 
  ChevronRight, 
  Plus, 
  X, 
  Target, 
  Info, 
  Search, 
  SlidersHorizontal, 
  MoreHorizontal, 
  ArrowUpRight, 
  CheckCircle2,
  Layers,
  ArrowRight,
  Command,
  Gem,
  AlertCircle,
  UserPlus,
  Heart,
  Percent,
  Compass,
  ArrowUp
} from "lucide-react";
import { AutopilotModal } from "@/components/autopilot/AutopilotModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

const DEFAULT_SEGMENTS = [
  {
    id: "high-spenders",
    name: "High Spenders",
    type: "ai",
    icon: Gem,
    description: "Customers who booked 3+ times with an average booking value greater than $200 per stay.",
    memberCount: 142,
    trend: "+12",
    trendUp: true,
    avgRevenue: 340,
    bestContent: "VIP offers, spa exclusives",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "VIP loyalty campaigns",
    engagementScore: 94,
  },
  {
    id: "likely-to-book",
    name: "Likely to Book",
    type: "ai",
    icon: Target,
    description: "Engaged with 3+ posts in the last 7 days but have not made a reservation yet.",
    memberCount: 847,
    trend: "+63",
    trendUp: true,
    avgRevenue: 180,
    bestContent: "Urgency posts, limited offers",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "Conversion push",
    engagementScore: 78,
  },
  {
    id: "about-to-churn",
    name: "About to Churn",
    type: "ai",
    icon: AlertCircle,
    description: "Previously active customers who have not engaged or booked in over 30 days.",
    memberCount: 234,
    trend: "-18",
    trendUp: false,
    avgRevenue: 90,
    bestContent: "Win-back offers, special deals",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "Win-back sequences",
    engagementScore: 22,
  },
  {
    id: "first-time-visitors",
    name: "First-Time Visitors",
    type: "ai",
    icon: UserPlus,
    description: "New followers who discovered your property in the last 7 days.",
    memberCount: 391,
    trend: "+47",
    trendUp: true,
    avgRevenue: 0,
    bestContent: "Welcome posts, property highlights",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "Welcome sequence",
    engagementScore: 65,
  },
  {
    id: "loyal-fans",
    name: "Loyal Fans",
    type: "ai",
    icon: Heart,
    description: "Highly engaged audience members who have commented on 10+ posts.",
    memberCount: 89,
    trend: "+7",
    trendUp: true,
    avgRevenue: 520,
    bestContent: "Behind-the-scenes, exclusive previews",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "Brand advocacy ask",
    engagementScore: 98,
  },
  {
    id: "deal-seekers",
    name: "Deal Seekers",
    type: "ai",
    icon: Percent,
    description: "Contacts who primarily engage with promotional and discount-focused content.",
    memberCount: 512,
    trend: "+22",
    trendUp: true,
    avgRevenue: 95,
    bestContent: "Flash sales, promo codes",
    color: "#635bff",
    bg: "#fcfdfe",
    borderColor: "#e3e8ef",
    useCase: "Promotional campaigns",
    engagementScore: 45,
  },
];

export function SegmentsClient({ initialSegments }: { initialSegments: any[] }) {
    const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
    const [selectedSegment, setSelectedSegment] = useState<any>(null);
    const [isAutopilotOpen, setIsAutopilotOpen] = useState(false);
    const [autopilotGoal, setAutopilotGoal] = useState("");
    const [isCreatingCustom, setIsCreatingCustom] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [isBuilding, setIsBuilding] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "ai" | "custom">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSegments = useMemo(() => {
       const tabFiltered = activeTab === "all" ? segments : segments.filter(s => s.type === activeTab);
       if (!searchQuery.trim()) return tabFiltered;
       return tabFiltered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [segments, activeTab, searchQuery]);

  const totalMembers = segments.reduce((s, seg) => s + seg.memberCount, 0);
  const avgRevenuePerMember = Math.round(segments.reduce((s, seg) => s + seg.avgRevenue, 0) / segments.length);

  const handleLaunchCampaign = (seg: any) => {
    setAutopilotGoal(`Focus on "${seg.name}" segment — ${seg.useCase}`);
    setIsAutopilotOpen(true);
  };

  const handleBuildCustom = async () => {
    if (!customPrompt.trim()) return;
    setIsBuilding(true);
    const buildToast = toast.loading("AI is engineering audience pattern...");
    await new Promise((r) => setTimeout(r, 2000));
    setIsBuilding(false);
    setIsCreatingCustom(false);
    setCustomPrompt("");
    toast.dismiss(buildToast);
    toast.success("Segment engineered successfully", {
      description: "1,240 contacts identified.",
      icon: <Sparkles className="w-4 h-4 text-[#635bff]" />
    });
  };

  return (
    <div className="bg-[#f6f9fc] min-h-screen flex flex-col font-sans">
        {/* ── Sticky Top Architectural Section ── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e3e8ef]">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#635bff]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#635bff]">Intelligence / Audience</span>
                        </div>
                        <h1 className="text-[44px] font-black tracking-[-0.04em] text-[#1a1f36] leading-[1.0]">
                            Segments
                        </h1>
                        <p className="max-w-xl text-[16px] text-[#4f566b] font-medium leading-relaxed">
                            Connect and group your audience based on behavioral signals. 
                            Identify high-value trends and seasonal patterns.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-6 md:pt-0">
                        <button
                            onClick={() => setIsCreatingCustom(true)}
                            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#635bff] text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(99,91,255,0.25)] hover:bg-[#534bbd] transition-all active:scale-[0.98]"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            <span>Create Custom</span>
                        </button>
                    </div>
                </div>

                {/* ── Summary Stats (Sticky-In) ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center gap-16 border-t border-[#e3e8ef] pt-10"
                >
                    <div className="flex items-center gap-12 w-full md:w-auto">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                                <Users size={10} strokeWidth={2.5} />
                                Total Members
                            </div>
                            <p className="text-[28px] font-black text-[#1a1f36] tracking-tight">{totalMembers.toLocaleString()}</p>
                        </div>
                        
                        <div className="space-y-1.5 border-l border-[#e3e8ef] pl-10">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                                <Sparkles size={10} strokeWidth={2.5} />
                                AI Models
                            </div>
                            <p className="text-[24px] font-bold text-[#1a1f36] tracking-tight">{segments.filter(s => s.type === "ai").length}</p>
                        </div>

                        <div className="space-y-1.5 border-l border-[#e3e8ef] pl-10 hidden lg:block">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                                <BarChart3 size={10} strokeWidth={2.5} />
                                Avg Potential
                            </div>
                            <p className="text-[24px] font-bold text-[#1a1f36] tracking-tight">${avgRevenuePerMember}</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Navigation Tabs (Sticky-In) ── */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f0f3f7]">
                    <div className="flex gap-10">
                        {(["all", "ai", "custom"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-3 text-[14px] font-bold transition-all ${activeTab === tab ? "text-[#635bff]" : "text-[#8792a2] hover:text-[#1a1f36]"}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#635bff] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="relative group hidden sm:block">
                            <Search size={14} className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? "text-[#635bff]" : "text-[#8792a2] group-focus-within:text-[#635bff]"}`} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search strategy..." 
                                className="pl-6 py-1 bg-transparent text-[13px] font-bold focus:outline-none transition-all w-32 focus:w-48 text-[#1a1f36] placeholder:text-[#c4cdd6]"
                            />
                        </div>
                        <button 
                            onClick={() => toast.info("Opening Advanced Filters...", {
                                description: "Segment by booking frequency, average stay value, and engagement velocity.",
                                icon: <SlidersHorizontal size={14} className="text-[#635bff]" />
                            })}
                            className="text-[13px] font-bold text-[#1a1f36] hover:text-[#635bff] transition-colors flex items-center gap-2"
                        >
                            <SlidersHorizontal size={14} strokeWidth={1.5} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Main content view area (scrollable) ── */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-[#f6f9fc] custom-scrollbar">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-16 pb-48">
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {filteredSegments.map((seg) => (
                        <motion.div
                            variants={item}
                            key={seg.id}
                            className="bg-white border border-[#e3e8ef] rounded-[28px] p-10 shadow-sm hover:shadow-xl hover:border-[#635bff]/20 transition-all duration-300 cursor-pointer group flex flex-col relative overflow-hidden active:scale-[0.99]"
                            onClick={() => setSelectedSegment(seg)}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight size={18} strokeWidth={1.5} className="text-[#c4cdd6]" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef] group-hover:bg-[#635bff]/5 transition-all">
                                    <seg.icon size={26} strokeWidth={1.2} className="text-[#635bff]" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                <h3 className="text-[20px] font-black text-[#1a1f36] tracking-tight">{seg.name}</h3>
                                <p className="text-[15px] text-[#4f566b] font-medium leading-relaxed line-clamp-2">
                                    {seg.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 border-t border-[#f0f3f7] pt-10 gap-6 mb-10">
                                <div>
                                    <p className="text-[10px] text-[#8792a2] font-black uppercase tracking-widest mb-1">Contacts</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[22px] font-black text-[#1a1f36] tracking-tight">{seg.memberCount.toLocaleString()}</span>
                                        <span className={`text-[11px] font-bold ${seg.trendUp ? "text-[#09825d]" : "text-[#e11d48]"}`}>
                                            {seg.trend}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#8792a2] font-black uppercase tracking-widest mb-1">Prediction</p>
                                    <span className="text-[22px] font-black text-[#1a1f36] tracking-tight">
                                        ${seg.avgRevenue || "—"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleLaunchCampaign(seg); }}
                                    className="w-full py-4 rounded-2xl text-[14px] font-black text-[#1a1f36] bg-[#f6f9fc] border border-[#e3e8ef] hover:bg-[#635bff] hover:text-white hover:border-[#635bff] transition-all duration-200 active:scale-[0.98]"
                                >
                                    Focus on Audience
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>

        {/* ── Slide-over Drawer (Segment Detail) ── */}
        <AnimatePresence>
            {selectedSegment && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0f121d]/40 backdrop-blur-[2px]" 
                        onClick={() => setSelectedSegment(null)} 
                    />
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative bg-white shadow-[-32px_0_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-lg h-full overflow-hidden flex flex-col"
                    >
                        <div className="p-10 sm:p-14 h-full overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="flex items-center justify-between mb-16">
                                <div className="w-16 h-16 rounded-[22px] bg-[#fcfdfe] flex items-center justify-center border border-[#e3e8ef] shadow-sm">
                                    <selectedSegment.icon size={32} strokeWidth={1.2} className="text-[#635bff]" />
                                </div>
                                <button onClick={() => setSelectedSegment(null)} className="w-10 h-10 rounded-full hover:bg-[#f6f9fc] flex items-center justify-center transition-all">
                                    <X size={20} strokeWidth={2} className="text-[#697386]" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-16">
                                <h2 className="text-[36px] font-black text-[#1a1f36] tracking-tight leading-[1.0]">{selectedSegment.name}</h2>
                                <div className="flex items-center gap-3 text-[14px] font-bold text-[#697386]">
                                    <Users size={16} strokeWidth={1.5} />
                                    {selectedSegment.memberCount.toLocaleString()} individuals identified
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-12 mb-16 border-t border-b border-[#f0f3f7] py-12">
                                {[
                                    { label: "Predicted Impact", value: `+$${selectedSegment.avgRevenue || 0}/mo`, icon: TrendingUp },
                                    { label: "Optimal Signal", value: "Multi-touch Velocity", icon: ArrowUpRight },
                                    { label: "Sync frequency", value: "Real-time active", icon: History },
                                    { label: "Intensity Score", value: `${selectedSegment.engagementScore}% Active`, icon: Sparkles },
                                ].map((m) => (
                                    <div key={m.label} className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8792a2]">
                                            <m.icon size={11} strokeWidth={2.5} />
                                            {m.label}
                                        </div>
                                        <p className="text-[17px] font-bold text-[#1a1f36]">{m.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-10 flex-1">
                                <div className="space-y-5">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-[#8792a2]">Recommended Strategy</p>
                                    <div className="bg-[#fcfdfe] rounded-[28px] p-10 border border-[#f0f3f7] relative group">
                                        <Sparkles size={18} strokeWidth={1.2} className="absolute top-8 right-8 text-[#635bff] animate-pulse" />
                                        <p className="text-[18px] text-[#3c4257] leading-relaxed font-semibold italic">
                                            {selectedSegment.id === "high-spenders" && "Prioritize exclusivity. personalized VIP sequence highlighting limited availability stays will maximize yield."}
                                            {selectedSegment.id === "likely-to-book" && "Scarcity models suggest a 12-hour flash sale for property highlights will convert this audience today."}
                                            {selectedSegment.id === "about-to-churn" && "High priority re-engagement. Highlighting unique seasonal benefits before total inactivity is detected."}
                                            {selectedSegment.id === "first-time-visitors" && "Focus on property discovery. Lifestyle highlights will move these contacts into the middle-funnel phase."}
                                            {selectedSegment.id === "loyal-fans" && "Incentivize advocacy. This cohort is ready for referral-based growth strategies."}
                                            {selectedSegment.id === "deal-seekers" && "Time-sensitive flash offers generate 2.4× more intensity among these price-conscious contacts."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { handleLaunchCampaign(selectedSegment); setSelectedSegment(null); }}
                                className="mt-16 w-full py-5 rounded-2xl text-[16px] font-bold text-white bg-[#635bff] hover:bg-[#534bbd] shadow-[0_16px_32px_rgba(99,91,255,0.3)] transition-all active:scale-[0.98]"
                            >
                                Launch Strategic Action
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <AutopilotModal
            isOpen={isAutopilotOpen}
            onClose={() => setIsAutopilotOpen(false)}
            initialGoal={autopilotGoal}
        />
    </div>
  );
}
