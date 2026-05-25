import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  note?: string;
  color?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  note,
  color = "#2d6a4f",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] px-5 py-5 flex flex-col gap-3 shadow-[0_1px_3px_rgba(60,66,87,0.05)] hover:shadow-[0_4px_20px_rgba(60,66,87,0.08)] hover:-translate-y-px transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#8792a2] uppercase tracking-wider">
          {label}
        </p>
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="w-4 h-4 transition-colors" style={{ color }} />
        </div>
      </div>
      
      <div>
        <p className="text-[28px] font-bold tracking-[-0.03em] text-[#1a1f36] leading-none">
          {value}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-auto">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
            trend === "up" 
              ? "bg-[#efffee] text-[#09825d]" 
              : "bg-red-50 text-red-600"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-2.5 h-2.5" />
          ) : (
            <ArrowDownRight className="w-2.5 h-2.5" />
          )}
          {change}
        </span>
        {note && <span className="text-xs text-[#8792a2]">{note}</span>}
      </div>
    </div>
  );
}
