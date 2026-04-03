"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformTheme } from "@/lib/analytics-themes";

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
  const isMinimal = theme.vibe === "minimal";

  return (
    <div 
      className={cn(
        "relative bg-white rounded-2xl border transition-all duration-300 group overflow-hidden",
        "px-6 py-6 flex flex-col gap-4",
        "shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        "hover:-translate-y-0.5",
        isMinimal ? "border-[#e3e8ef]" : ""
      )}
      style={{ borderBlockColor: !isMinimal ? theme.border : undefined }}
    >
      {/* Decorative Brand Accent */}
      {!isMinimal && (
        <div 
          className="absolute top-0 left-0 w-1 h-full opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: theme.primary }}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.1em]">
            {label}
          </p>
          {theme.id !== "All Platforms" && (
            <div className="flex items-center gap-1.5 mt-1">
               <theme.logo className="w-3 h-3" style={{ color: theme.primary }} />
               <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: theme.primary }}>{theme.name}</span>
            </div>
          )}
        </div>
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${theme.primary}10` }}
        >
          <Icon className="w-4.5 h-4.5 transition-colors" style={{ color: theme.primary }} />
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold tracking-tight text-[#1a1f36] leading-none">
          {value}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors",
            trend === "up" 
              ? "bg-[#efffee] text-[#09825d]" 
              : "bg-red-50 text-red-600"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </span>
        {note && <span className="text-[11px] text-[#8792a2] font-medium leading-none">{note}</span>}
      </div>
    </div>
  );
}
