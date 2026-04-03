import {
  TrendingUp,
  Share2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Brand icons for connected accounts section
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const stats = [
  {
    label: "Total Posts",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Share2,
    note: "vs. last month",
  },
  {
    label: "Scheduled",
    value: "14",
    change: "+3",
    trend: "up",
    icon: Calendar,
    note: "upcoming posts",
  },
  {
    label: "Published",
    value: "234",
    change: "+8%",
    trend: "up",
    icon: CheckCircle2,
    note: "vs. last month",
  },
  {
    label: "Avg. Engagement",
    value: "4.2%",
    change: "+0.5%",
    trend: "up",
    icon: TrendingUp,
    note: "vs. last month",
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
  { label: "New Post", href: "/compose", icon: Plus, color: "#635bff" },
  { label: "View Calendar", href: "/calendar", icon: Calendar, color: "#f5a623" },
  { label: "See Analytics", href: "/analytics", icon: TrendingUp, color: "#09825d" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ── Page heading ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8792a2] mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1f36]">
            Good morning 👋
          </h1>
          <p className="text-sm text-[#8792a2] mt-1">
            Here&apos;s what&apos;s happening across your social channels today.
          </p>
        </div>

        {/* Quick actions */}
        <div className="hidden sm:flex items-center gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.07)] active:scale-[0.98]"
            >
              <action.icon className="w-3.5 h-3.5" style={{ color: action.color }} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#e3e8ef] px-5 py-5 flex flex-col gap-3 shadow-[0_1px_3px_rgba(60,66,87,0.05)] hover:shadow-[0_4px_20px_rgba(60,66,87,0.1)] hover:-translate-y-px transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#8792a2] uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="w-7 h-7 rounded-lg bg-[#f6f9fc] flex items-center justify-center group-hover:bg-[#635bff]/8 transition-colors">
                <stat.icon className="w-3.5 h-3.5 text-[#8792a2] group-hover:text-[#635bff] transition-colors" />
              </div>
            </div>
            <div>
              <p className="text-[28px] font-bold tracking-[-0.03em] text-[#1a1f36] leading-none">
                {stat.value}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                stat.trend === "up"
                  ? "bg-[#efffee] text-[#09825d]"
                  : "bg-red-50 text-red-600"
              }`}>
                <ArrowUpRight className="w-2.5 h-2.5" />
                {stat.change}
              </span>
              <span className="text-xs text-[#8792a2]">{stat.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity — 2-col span */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
            <p className="text-sm font-semibold text-[#1a1f36]">Recent Activity</p>
            <button className="text-xs font-medium text-[#635bff] hover:text-[#4f46e5] transition-colors">
              View all
            </button>
          </div>
          {/* Rows */}
          <div className="divide-y divide-[#f0f3f7]">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f6f9fc] transition-colors group cursor-pointer"
              >
                {/* Dot */}
                <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#f6f9fc] border border-[#e3e8ef]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: activity.dot }}
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3c4257] group-hover:text-[#1a1f36] transition-colors">
                    {activity.label}
                  </p>
                  <p className="text-xs text-[#8792a2]">{activity.detail}</p>
                </div>
                {/* Time + chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#8792a2]">{activity.time}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#c4cdd6] group-hover:text-[#8792a2] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
            <div>
              <p className="text-sm font-semibold text-[#1a1f36]">Connected Accounts</p>
              <p className="text-xs text-[#8792a2] mt-0.5">Active platform tokens</p>
            </div>
          </div>

          <div className="divide-y divide-[#f0f3f7]">
            {connectedAccounts.map((account) => (
              <div
                key={account.platform}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#f6f9fc] transition-colors"
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: account.bg }}
                >
                  <account.Icon className="w-4 h-4" style={{ color: account.color }} />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#3c4257] truncate">{account.handle}</p>
                  <p className="text-[10px] text-[#8792a2]">{account.platform}</p>
                </div>
                {/* Status */}
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${account.active ? "bg-[#09825d]" : "bg-[#c4cdd6]"}`}
                  />
                  <span className={`text-[10px] font-medium ${account.active ? "text-[#09825d]" : "text-[#8792a2]"}`}>
                    {account.active ? "Active" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Link to connections page */}
          <div className="px-4 py-3 border-t border-[#f0f3f7]">
            <Link
              href="/connections"
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.06)] active:scale-[0.98]"
            >
              <Plus className="w-3 h-3 text-[#635bff]" />
              Manage connections
            </Link>
          </div>
        </div>
      </div>

      {/* ── Upgrade Banner ── */}
      <div
        className="relative rounded-xl overflow-hidden px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #635bff 0%, #7f78ff 60%, #9f99ff 100%)" }}
      >
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
        }} />
        <div className="relative">
          <p className="text-sm font-bold text-white">Upgrade to Business</p>
          <p className="text-xs text-white/70 mt-0.5 max-w-sm">
            Unlock unlimited posts, advanced analytics, and team collaboration tools.
          </p>
        </div>
        <Link
          href="/billing"
          className="relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#635bff] bg-white hover:bg-[#f6f9fc] transition-all active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
        >
          View plans
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
