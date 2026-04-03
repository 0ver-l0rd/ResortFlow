import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenSquare, Calendar, Link2, MessageSquare, BarChart3, CreditCard, Bell, Settings, Plus, Zap } from "lucide-react";
import Link from "next/link";

const navGroups = [
  {
    label: "Core",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
      { icon: PenSquare, label: "Compose", href: "/compose" },
      { icon: Calendar, label: "Calendar", href: "/calendar" },
    ],
  },
  {
    label: "Platform",
    items: [
      { icon: Link2, label: "Connections", href: "/connections" },
      { icon: MessageSquare, label: "Auto-Reply", href: "/auto-reply" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: CreditCard, label: "Billing", href: "/billing" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full" style={{ backgroundColor: "#f6f9fc" }}>
        {/* ── Sidebar ── */}
        <Sidebar
          className="border-r border-[#e3e8ef] shadow-none"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Logo */}
          <SidebarHeader className="px-5 py-5 border-b border-[#f0f3f7]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #635bff 0%, #7f78ff 100%)" }}
              >
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="font-bold text-[15px] tracking-[-0.02em] text-[#1a1f36]">
                SocialCopilot
              </span>
            </div>
          </SidebarHeader>

          {/* Nav */}
          <SidebarContent className="px-3 py-4 flex flex-col gap-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-[#8792a2] uppercase tracking-widest">
                  {group.label}
                </p>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        className="
                          flex items-center gap-2.5 px-3 py-2 rounded-lg w-full
                          text-sm font-medium text-[#697386]
                          hover:bg-[#f6f9fc] hover:text-[#1a1f36]
                          transition-all duration-150 group
                        "
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="px-3 py-4 border-t border-[#f0f3f7] space-y-2">
            {/* New Post CTA */}
            <Link
              href="/compose"
              className="
                flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg
                text-sm font-semibold text-white
                transition-all duration-150 active:scale-[0.98]
              "
              style={{ background: "linear-gradient(135deg, #635bff 0%, #7f78ff 100%)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Post
            </Link>

            {/* User */}
            <div className="flex items-center gap-3 px-3 py-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-7 h-7",
                    userButtonPopoverCard: "shadow-xl rounded-xl border border-[#e3e8ef]",
                  },
                }}
              />
              <div>
                <p className="text-xs font-semibold text-[#1a1f36] leading-tight">Pro Account</p>
                <p className="text-[10px] text-[#635bff] font-semibold leading-tight">Pro Plan</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar */}
          <header
            className="h-14 border-b border-[#e3e8ef] flex items-center justify-between px-8 shrink-0 sticky top-0 z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}
          >
            <div />
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg border border-[#e3e8ef] bg-white flex items-center justify-center text-[#697386] hover:bg-[#f6f9fc] hover:text-[#3c4257] transition-colors shadow-[0_1px_2px_rgba(60,66,87,0.06)]">
                <Bell className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg border border-[#e3e8ef] bg-white flex items-center justify-center text-[#697386] hover:bg-[#f6f9fc] hover:text-[#3c4257] transition-colors shadow-[0_1px_2px_rgba(60,66,87,0.06)]">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
