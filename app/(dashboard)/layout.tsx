import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, PenSquare, Calendar, Link2, MessageSquare, BarChart3, CreditCard, Bell, Settings, Plus } from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PenSquare, label: "Compose", href: "/compose" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Link2, label: "Connections", href: "/connections" },
  { icon: MessageSquare, label: "Auto-Reply", href: "/auto-reply" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white w-full overflow-hidden">
        <Sidebar className="border-r border-[#1e1e2e] bg-[#0f0f1a]">
          <SidebarHeader className="p-6 border-b border-[#1e1e2e]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-xl">
                ✦
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SocialCopilot
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    render={<Link href={item.href} />}
                    className="hover:bg-[#1e1e2e] transition-colors group flex items-center gap-3 px-3 py-2 text-slate-400 group-hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-[#1e1e2e]">
            <div className="flex items-center gap-3 px-3 py-2">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-[#0f0f1a] border border-[#1e1e2e] text-white",
                  }
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Pro Account</span>
                <span className="text-[10px] text-purple-400 font-bold tracking-wider uppercase">✦ Pro Plan</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="text-xl font-bold tracking-tight text-white">Dashboard Overview</h1>
            <div className="flex items-center gap-4">
              <button 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-purple-500/10 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-[#1e1e2e] border border-[#334155] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-[#1e1e2e] border border-[#334155] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
