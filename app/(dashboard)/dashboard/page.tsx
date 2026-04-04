"use client";

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

// Brand icons for connected accounts section
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const stats = [
  {
    label: "Total posts",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Share2,
    note: "vs last month",
  },
  {
    label: "Scheduled",
    value: "14",
    change: "+3",
    trend: "up",
    icon: Calendar,
    note: "upcoming",
  },
  {
    label: "Published",
    value: "234",
    change: "+8%",
    trend: "up",
    icon: CheckCircle2,
    note: "verified",
  },
  {
    label: "Avg. engagement",
    value: "4.2%",
    change: "+0.5%",
    trend: "up",
    icon: TrendingUp,
    note: "highly active",
  },
];

const activities = [
  {
    id: 1,
    label: "Post published",
    detail: "Instagram & Twitter",
    time: "2 min ago",
    dot: "#09825d",
  },
  {
    id: 2,
    label: "Auto-reply sent",
    detail: "LinkedIn comment",
    time: "15 min ago",
    dot: "#635bff",
  },
  {
    id: 3,
    label: "Post scheduled",
    detail: "Tomorrow at 9:00 AM",
    time: "1 hr ago",
    dot: "#f5a623",
  },
  {
    id: 4,
    label: "Token refreshed",
    detail: "Twitter / X",
    time: "3 hr ago",
    dot: "#1a1f36",
  },
];

const connectedAccounts = [
  { platform: "Instagram", handle: "@johndoe_ig", Icon: FaInstagram, color: "#E1306C", bg: "#fdf0f5", active: true },
  { platform: "Twitter / X", handle: "@johndoe", Icon: FaXTwitter, color: "#000000", bg: "#f0f0f0", active: true },
  { platform: "LinkedIn", handle: "John Doe", Icon: FaLinkedinIn, color: "#0077B5", bg: "#eef6fb", active: true },
  { platform: "YouTube", handle: "John's Channel", Icon: FaYoutube, color: "#FF0000", bg: "#fff0f0", active: false },
];

const quickActions = [
  { label: "New post", href: "/compose", icon: Plus, color: "#635bff" },
  { label: "Calendar", href: "/calendar", icon: Calendar, color: "#f5a623" },
  { label: "Analytics", href: "/analytics", icon: TrendingUp, color: "#09825d" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* ── Autopilot Hero Section ── */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#635bff]/20 to-[#4f46e5]/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <AutopilotBanner />
      </section>

      {/* ── Page heading ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8792a2] mb-2 px-1">
            Overview
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-[#1a1f36]">
            Today&apos;s Snapshot
          </h1>
          <p className="text-[15px] text-[#697386] font-medium mt-1 leading-relaxed">
            Your social presence is <span className="text-[#09825d] font-bold">up 12%</span> this week. Here&apos;s the latest on your channels.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] group"
            >
              <action.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" style={{ color: action.color }} />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {stats.map((stat) => (
          <motion.div
            variants={itemVariants}
            key={stat.label}
            className="bg-white rounded-2xl border border-[#e3e8ef] px-6 py-6 flex flex-col gap-4 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_2px_4px_rgba(34,42,66,0.03)] hover:shadow-[0_8px_24px_rgba(60,66,87,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="w-9 h-9 rounded-xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef]/50 group-hover:bg-[#635bff]/5 group-hover:border-[#635bff]/20 transition-all duration-300 shadow-sm">
                <stat.icon className="w-4 h-4 text-[#8792a2] group-hover:text-[#635bff] group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-[#1a1f36]">
                {stat.value}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                stat.trend === "up"
                  ? "bg-[#efffee] text-[#09825d] border border-[#b7ebc8]/30"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
              <span className="text-[11px] font-semibold text-[#8792a2]">{stat.note}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity — 2-col span */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-[#e3e8ef] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,66,0.04)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3f7]">
            <div>
              <p className="text-[15px] font-bold text-[#1a1f36]">Recent activity</p>
              <p className="text-[11px] text-[#8792a2] font-semibold mt-0.5 whitespace-nowrap">Latest automated events across connected channels</p>
            </div>
            <Link 
              href="/triggers"
              className="text-[11px] font-bold text-[#635bff] hover:text-[#4f46e5] transition-colors uppercase tracking-widest bg-[#635bff]/5 px-3 py-1.5 rounded-lg border border-[#635bff]/10"
            >
              View all
            </Link>
          </div>
          {/* Rows */}
          <div className="divide-y divide-[#f0f3f7]">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-5 px-6 py-4 hover:bg-[#f6f9fc]/50 transition-colors group cursor-pointer"
              >
                {/* Dot / Icon container */}
                <div className="shrink-0 flex items-center justify-center w-4 h-4">
                  <div 
                    className="w-2.5 h-2.5 rounded-full ring-4 ring-offset-0 group-hover:scale-125 transition-transform" 
                    style={{ backgroundColor: activity.dot, '--tw-ring-color': `${activity.dot}20` } as any}
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#3c4257] group-hover:text-[#1a1f36] transition-colors">
                    {activity.label}
                  </p>
                  <p className="text-[12px] text-[#8792a2] font-medium">{activity.detail}</p>
                </div>
                {/* Time + chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-semibold text-[#8792a2] tracking-tight">{activity.time}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-sm">
                    <ChevronRight className="w-4 h-4 text-[#c4cdd6] group-hover:text-[#8792a2] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-[#e3e8ef] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,66,0.04)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3f7]">
            <div>
              <p className="text-[15px] font-bold text-[#1a1f36]">Connectivity</p>
              <p className="text-[11px] text-[#8792a2] font-semibold mt-0.5">Active platform synchronization</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#635bff]/5 flex items-center justify-center border border-[#635bff]/10">
               <Zap className="w-4 h-4 text-[#635bff] fill-[#635bff]/20" />
            </div>
          </div>

          <div className="p-2">
            <div className="grid gap-1">
              {connectedAccounts.map((account) => (
                <div
                  key={account.platform}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#f6f9fc]/80 transition-all border border-transparent hover:border-[#e3e8ef] active:scale-[0.98] cursor-pointer"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: account.bg }}
                  >
                    <account.Icon className="w-5 h-5" style={{ color: account.color }} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#3c4257] truncate tracking-tight">{account.handle}</p>
                    <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">{account.platform}</p>
                  </div>
                  {/* Status */}
                  <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-white/50 rounded-lg border border-[#e3e8ef]/50 shadow-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${account.active ? "bg-[#09825d]" : "bg-[#c4cdd6]"} ${account.active ? "animate-pulse" : ""}`}
                    />
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${account.active ? "text-[#09825d]" : "text-[#8792a2]"}`}>
                      {account.active ? "Live" : "Idle"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link to connections page */}
          <div className="px-4 py-4 border-t border-[#f0f3f7] bg-[#fcfdfe]">
            <Link
              href="/connections"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-white hover:border-[#635bff]/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-[#635bff]" />
              Manage all connections
            </Link>
          </div>
        </motion.div>
      </div>

      {/* AI Pulse Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl border border-[#635bff]/10 bg-gradient-to-br from-[#f8faff] to-[#f0eeff] relative overflow-hidden group hover:shadow-2xl hover:shadow-[#635bff]/5 transition-all duration-500"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#635bff]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative flex items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-3xl bg-white shadow-[0_8px_16px_-4px_rgba(99,91,255,0.2)] flex items-center justify-center shrink-0 border border-[#635bff]/10">
              <Sparkles className="w-7 h-7 text-[#635bff] fill-[#635bff]/10" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1a1f36] mb-1">Smart trigger insight</h3>
              <p className="text-[14px] text-[#697386] font-medium leading-relaxed max-w-xl">
                Your last post on <span className="text-[#E1306C] font-bold">Instagram</span> is performing <span className="text-[#09825d] font-bold">45% above average</span>. Autopilot is currently monitoring the engagement spike to trigger a follow-up WhatsApp blast if bookings remain low.
              </p>
            </div>
          </div>
          <button 
            onClick={() => toast.success("Opening Autopilot Configuration...", {
              description: "Adjusting behavioral response weights for the current Instagram spike.",
              icon: <Sparkles className="w-4 h-4 text-[#635bff]" />
            })}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1f36] text-white rounded-2xl text-[13px] font-bold hover:bg-[#635bff] transition-all shadow-xl active:scale-95 group"
          >
            <span>Configure response</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
