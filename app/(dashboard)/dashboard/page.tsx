import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, CheckCircle2, ChevronRight, Share2, MessageSquare } from "lucide-react";

const stats = [
  { label: "Total Posts", value: "248", change: "↑ 12%", icon: Share2, color: "text-purple-400" },
  { label: "Scheduled", value: "14", change: "↑ 3", icon: Calendar, color: "text-cyan-400" },
  { label: "Published", value: "234", change: "↑ 8%", icon: CheckCircle2, color: "text-green-400" },
  { label: "Engagement", value: "4.2%", change: "↑ 0.5%", icon: TrendingUp, color: "text-orange-400" },
];

const activities = [
  { id: 1, type: "publish", text: "Post published to Instagram & Twitter", time: "2 minutes ago", color: "bg-purple-500" },
  { id: 2, type: "reply", text: "Auto-reply sent on LinkedIn comment", time: "15 minutes ago", color: "bg-cyan-500" },
  { id: 3, type: "schedule", text: "Post scheduled for tomorrow 9:00 AM", time: "1 hour ago", color: "bg-amber-500" },
];

const connectedAccounts = [
  { id: 1, platform: "Instagram", handle: "@johndoe_ig", status: "online" },
  { id: 2, platform: "Twitter", handle: "@johndoe", status: "online" },
  { id: 3, platform: "LinkedIn", handle: "John Doe", status: "online" },
  { id: 4, platform: "YouTube", handle: "John's Channel", status: "offline" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#0f0f1a] border-[#1e1e2e] hover:border-purple-500/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-12 h-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <p className="text-xs text-green-400 font-bold mt-1 flex items-center gap-1">
                {stat.change} <span className="text-[10px] text-slate-500 font-normal">vs last month</span>
              </p>
            </CardContent>
            <div className="h-1 w-full bg-[#1e1e2e]">
              <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 w-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-[#0f0f1a] border-[#1e1e2e]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-white">Recent Activity</CardTitle>
            <button className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors">View All</button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 rounded-2xl bg-[#0a0a0f] border border-[#1e1e2e] group hover:bg-[#151520] transition-colors relative">
                <div className={`w-10 h-10 rounded-xl ${activity.color}/20 flex items-center justify-center shrink-0`}>
                  <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors self-center" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="bg-[#0f0f1a] border-[#1e1e2e]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Connected Accounts</CardTitle>
            <CardDescription className="text-slate-500">Active platform tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1e1e2e] flex items-center justify-center">
                    {account.platform === "Instagram" && <span className="text-lg">📸</span>}
                    {account.platform === "Twitter" && <span className="text-lg">🐦</span>}
                    {account.platform === "LinkedIn" && <span className="text-lg">💼</span>}
                    {account.platform === "YouTube" && <span className="text-lg">▶</span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{account.handle}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{account.platform}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${account.status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-700"}`} />
              </div>
            ))}
            <button className="w-full mt-2 py-3 rounded-xl border border-dashed border-[#334155] text-slate-400 text-xs font-bold hover:border-purple-500/50 hover:text-white transition-all flex items-center justify-center gap-2">
              <Plus className="w-3 h-3" /> Connect New Account
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
