"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformTheme } from "@/lib/analytics-themes";
import { motion } from "framer-motion";

interface ThemedMetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  note?: string;
  theme: PlatformTheme;
}

export function ThemedMetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  note,
  theme,
}: ThemedMetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative bg-white rounded-3xl border transition-all duration-300 group overflow-hidden",
        "px-7 py-7 flex flex-col gap-6",
        "border-[#f1f4f9] shadow-[0_1px_1px_rgba(0,0,0,0.02),0_4px_8px_-2px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_1px_1px_rgba(0,0,0,0.02),0_12px_40px_-12px_rgba(0,0,0,0.08)]",
        "hover:border-[#e2e8f0]"
      )}
    >
      {/* Stripe-style Accent Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1.5 text-left">
          <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em] leading-none">
            {label}
          </p>
          <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-[9px] font-bold uppercase tracking-wider text-[#3c4257]/60">Live Analytics</span>
          </div>
        </div>
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-black/5"
          style={{ background: `linear-gradient(135deg, white 0%, ${theme.primary}08 100%)` }}
        >
          <Icon className="w-5 h-5 transition-colors" style={{ color: theme.primary }} />
        </div>
      </div>
      
      <div className="text-left">
        <p className="text-4xl font-bold tracking-tight text-[#1a1f36] leading-none">
          {value}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl transition-colors border shadow-sm",
            trend === "up" 
              ? "bg-[#f0fdf4] border-[#dcfce7] text-[#09825d]" 
              : "bg-red-50 border-red-100 text-red-600"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {change}
        </span>
        {note && (
          <span className="text-[11px] text-[#8792a2] font-semibold leading-none">
            {note}
          </span>
        )}
      </div>

      {/* Very faint background icon for character */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
        <Icon className="w-24 h-24 rotate-12" />
      </div>
    </motion.div>
  );
}
