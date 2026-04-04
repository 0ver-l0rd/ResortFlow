"use client";

import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenSquare, Calendar, Link2, MessageSquare, BarChart3, Bell, Plus, Zap, Sparkles, Target, Users, DollarSign, Contact } from "lucide-react";
import Link from "next/link";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";

const navGroups = [
  {
    label: "Core",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
      { icon: PenSquare, label: "Compose", href: "/compose" },
      { icon: Calendar, label: "Calendar", href: "/calendar" },
      { icon: Sparkles, label: "AI Agent", href: "/agent", isAgent: true },
    ],
  },
  {
    label: "Autopilot",
    items: [
      { icon: Zap, label: "Campaigns", href: "/campaigns" },
      { icon: Target, label: "Triggers", href: "/triggers" },
      { icon: Users, label: "Segments", href: "/segments" },
      { icon: DollarSign, label: "Revenue", href: "/revenue" },
    ],
  },
  {
    label: "Platform",
    items: [
      { icon: Link2, label: "Connections", href: "/connections" },
      { icon: MessageSquare, label: "Auto-Reply", href: "/auto-reply" },
      { icon: Contact, label: "Contacts", href: "/contacts" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: "#f6f9fc" }}>
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
                  {group.items.map((item: any) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={(e) => {
                          if (item.isAgent) {
                            e.preventDefault();
                            setIsAgentOpen(!isAgentOpen);
                          }
                        }}
                        render={item.isAgent ? <button /> : <Link href={item.href} />}
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

          </SidebarFooter>
        </Sidebar>

        {/* ── Main content area with motion stretching ── */}
        <motion.main 
          animate={{ marginRight: isAgentOpen ? 400 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex-1 flex flex-col min-h-screen overflow-hidden"
        >
          {/* Top bar */}
          <header
            className="h-14 border-b border-[#e3e8ef] flex items-center justify-between px-8 shrink-0 sticky top-0 z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}
          >
            <div />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <NotificationBell />
              </div>
              <div className="h-6 w-px bg-[#e3e8ef]" />
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 border border-black/5 shadow-sm hover:scale-105 transition-transform",
                      userButtonPopoverCard: "shadow-xl rounded-xl border border-[#e3e8ef]",
                    },
                  }}
                />
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {children}
          </div>
        </motion.main>

        {/* ── AI Agent Sidebar ── */}
        <AgentSidebar 
          isOpen={isAgentOpen} 
          onClose={() => setIsAgentOpen(false)} 
        />
      </div>
    </SidebarProvider>
  );
}
