"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PLATFORM_THEMES } from "@/lib/analytics-themes";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface PlatformStatusProps {
  selected: string;
  onSelect: (id: string) => void;
  connectedPlatforms: string[];
}

const PLATFORM_MAP: Record<string, string> = {
  "twitter": "Twitter / X",
  "instagram": "Instagram",
  "linkedin": "LinkedIn",
  "facebook": "Facebook",
  "tiktok": "TikTok",
  "youtube": "YouTube",
  "pinterest": "Pinterest"
};

export function PlatformStatus({ selected, onSelect, connectedPlatforms }: PlatformStatusProps) {
  const filteredThemes = Object.values(PLATFORM_THEMES).filter(theme => {
    if (theme.id === "All Platforms") return true;
    
    // Check if the theme matches any connected platform
    const dbName = Object.keys(PLATFORM_MAP).find(key => PLATFORM_MAP[key] === theme.id);
    return dbName ? connectedPlatforms.includes(dbName) : false;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em]">Select Profile</h2>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#efffee] border border-[#09825d]/10">
           <CheckCircle2 className="w-3 h-3 text-[#09825d]" />
           <span className="text-[10px] font-bold text-[#09825d] uppercase tracking-wider">All Tokens Active</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filteredThemes.map((theme) => {
          const isActive = selected === theme.id;
          const Icon = theme.icon;

          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={cn(
                "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-300",
                "min-w-fit whitespace-nowrap group",
                isActive 
                  ? "border-[#2d6a4f] bg-white shadow-lg shadow-[#2d6a4f]/8 scale-[1.02]" 
                  : "border-[#e3e8ef] bg-white hover:border-[#c9d0ef] hover:bg-[#f6f9fc]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-white -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div 
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-[#2d6a4f]/10" : "bg-muted/50 group-hover:bg-muted"
                )}
              >
                {Icon ? (
                  <Icon className="w-4 h-4" style={{ color: isActive ? "#2d6a4f" : "#8792a2" }} />
                ) : (
                  <Sparkles className="w-4 h-4" style={{ color: isActive ? "#2d6a4f" : "#8792a2" }} />
                )}
              </div>
              
              <div className="flex flex-col items-start leading-tight">
                <span 
                  className={cn(
                    "text-[11px] font-bold transition-colors",
                    isActive ? "text-[#1a1f36]" : "text-[#8792a2]"
                  )}
                >
                  {theme.name}
                </span>
                {isActive && (
                   <span className="text-[9px] font-bold text-[#2d6a4f] uppercase tracking-tight">Active</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
