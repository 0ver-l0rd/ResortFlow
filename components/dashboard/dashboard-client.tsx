"use client";

import { useState } from "react";
import { PostEventSheet } from "@/components/calendar/post-event-sheet";

import {
  TrendingUp,
  Share2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AutopilotBanner } from "@/components/autopilot/AutopilotBanner";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const quickActions = [
  { label: "New post", href: "/compose", icon: Plus, color: "#2d6a4f" },
  { label: "Calendar", href: "/calendar", icon: Calendar, color: "#f5a623" },
  { label: "Analytics", href: "/analytics", icon: TrendingUp, color: "#09825d" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardClient({ 
  stats, 
  activities, 
  connectedAccounts, 
  aiInsight 
}: any) {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Use real icons
  const getIcon = (name: string) => {
    switch (name) {
      case "Share2": return Share2;
      case "Calendar": return Calendar;
      case "CheckCircle2": return CheckCircle2;
      case "TrendingUp": return TrendingUp;
      case "FaInstagram": return FaInstagram;
      case "FaXTwitter": return FaXTwitter;
      case "FaLinkedinIn": return FaLinkedinIn;
      case "FaYoutube": return FaYoutube;
      default: return Share2;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2d6a4f]/20 to-[#1b4332]/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <AutopilotBanner />
      </section>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8792a2] mb-2 px-1">Overview</p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-[#1a1f36]">Today's Snapshot</h1>
          <p className="text-[15px] text-[#697386] font-medium mt-1 leading-relaxed">
            Your social presence is <span className="text-[#09825d] font-bold">up 12%</span> this week. Here's the latest on your channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] group">
              <action.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" style={{ color: action.color }} />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat: any) => {
          const Icon = getIcon(stat.icon);
          return (
            <motion.div variants={itemVariants} key={stat.label} className="bg-white rounded-2xl border border-[#e3e8ef] px-6 py-6 flex flex-col gap-4 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_2px_4px_rgba(34,42,66,0.03)] hover:shadow-[0_8px_24px_rgba(60,66,87,0.1)] hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">{stat.label}</p>
                <div className="w-9 h-9 rounded-xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef]/50 group-hover:bg-[#2d6a4f]/5 group-hover:border-[#2d6a4f]/20 transition-all duration-300 shadow-sm">
                  <Icon className="w-4 h-4 text-[#8792a2] group-hover:text-[#2d6a4f] group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <div><p className="text-3xl font-extrabold tracking-tight text-[#1a1f36]">{stat.value}</p></div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${stat.trend === "up" ? "bg-[#efffee] text-[#09825d] border border-[#b7ebc8]/30" : stat.trend === "neutral" ? "bg-[#f6f9fc] text-[#697386] border border-[#e3e8ef]" : "bg-red-50 text-red-600 border border-red-100"}`}>
                  <ArrowUpRight className={`w-3 h-3 ${stat.trend === "down" ? "rotate-90" : stat.trend === "neutral" ? "rotate-45 hidden" : ""}`} />
                  {stat.change}
                </span>
                <span className="text-[11px] font-semibold text-[#8792a2]">{stat.note}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white rounded-2xl border border-[#e3e8ef] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,66,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3f7]">
            <div>
              <p className="text-[15px] font-bold text-[#1a1f36]">Recent activity</p>
              <p className="text-[11px] text-[#8792a2] font-semibold mt-0.5 whitespace-nowrap">Latest automated events across connected channels</p>
            </div>
            <Link href="/calendar?view=all-posts" className="text-[11px] font-bold text-[#2d6a4f] hover:text-[#1b4332] transition-colors uppercase tracking-widest bg-[#2d6a4f]/5 px-3 py-1.5 rounded-lg border border-[#2d6a4f]/10">View all</Link>
          </div>
          <div className="divide-y divide-[#f0f3f7]">
            {activities.length > 0 ? activities.map((activity: any) => (
              <div 
                key={activity.id} 
                onClick={() => setSelectedPost(activity.post)}
                className="flex items-center gap-5 px-6 py-4 hover:bg-[#f6f9fc]/50 transition-colors group cursor-pointer"
              >
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  {activity.avatarUrl ? (
                    <img src={activity.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full ring-4 ring-offset-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: activity.dot, '--tw-ring-color': `${activity.dot}20` } as any} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#3c4257] group-hover:text-[#1a1f36] transition-colors">{activity.label}</p>
                  <p className="text-[12px] text-[#8792a2] font-medium">{activity.detail}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span suppressHydrationWarning className="text-[11px] font-semibold text-[#8792a2] tracking-tight">{activity.time}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-sm">
                    <ChevronRight className="w-4 h-4 text-[#c4cdd6] group-hover:text-[#8792a2] transition-colors" />
                  </div>
                </div>
              </div>
            )) : <div className="px-6 py-8 text-center text-[13px] text-[#8792a2] font-medium">No recent activity found.</div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-[#e3e8ef] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,66,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3f7]">
            <div>
              <p className="text-[15px] font-bold text-[#1a1f36]">Connectivity</p>
              <p className="text-[11px] text-[#8792a2] font-semibold mt-0.5">Active platform synchronization</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#2d6a4f]/5 flex items-center justify-center border border-[#2d6a4f]/10">
               <Zap className="w-4 h-4 text-[#2d6a4f] fill-[#2d6a4f]/20" />
            </div>
          </div>
          <div className="p-2">
            <div className="grid gap-1">
              {connectedAccounts.map((account: any) => {
                const Icon = getIcon(account.icon);
                return (
                  <div key={account.platform} className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#f6f9fc]/80 transition-all border border-transparent hover:border-[#e3e8ef] active:scale-[0.98] cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: account.bg }}>
                      <Icon className="w-5 h-5" style={{ color: account.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#3c4257] truncate tracking-tight">{account.handle}</p>
                      <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">{account.platform}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-white/50 rounded-lg border border-[#e3e8ef]/50 shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${account.active ? "bg-[#09825d]" : "bg-[#c4cdd6]"} ${account.active ? "animate-pulse" : ""}`} />
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${account.active ? "text-[#09825d]" : "text-[#8792a2]"}`}>{account.active ? "Live" : "Idle"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="px-4 py-4 border-t border-[#f0f3f7] bg-[#fcfdfe]">
            <Link href="/connections" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-white hover:border-[#2d6a4f]/30 hover:shadow-md transition-all active:scale-[0.98]">
              <Plus className="w-3.5 h-3.5 text-[#2d6a4f]" />Manage all connections
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-[#2d6a4f]/10 bg-gradient-to-br from-[#f8faff] to-[#f0eeff] relative overflow-hidden group hover:shadow-2xl hover:shadow-[#2d6a4f]/5 transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2d6a4f]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
        <div className="relative flex items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-3xl bg-white shadow-[0_8px_16px_-4px_rgba(99,91,255,0.2)] flex items-center justify-center shrink-0 border border-[#2d6a4f]/10">
              <Sparkles className="w-7 h-7 text-[#2d6a4f] fill-[#2d6a4f]/10" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1a1f36] mb-1">Smart trigger insight</h3>
              <p className="text-[14px] text-[#697386] font-medium leading-relaxed max-w-xl">
                {aiInsight}
              </p>
            </div>
          </div>
          <button onClick={() => toast.success("Opening Autopilot Configuration...", { description: "Adjusting behavioral response weights for the current insight.", icon: <Sparkles className="w-4 h-4 text-[#2d6a4f]" /> })} className="flex items-center gap-2 px-6 py-3 bg-[#1a1f36] text-white rounded-2xl text-[13px] font-bold hover:bg-[#2d6a4f] transition-all shadow-xl active:scale-95 group">
            <span>Configure response</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      <PostEventSheet
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
        onDelete={(id) => {
          toast.info("Delete post action via calendar");
          setSelectedPost(null);
        }}
      />
    </div>
  );
}
