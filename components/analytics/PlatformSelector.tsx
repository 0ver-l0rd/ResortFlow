"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const platforms = [
  { id: "All Platforms", name: "Overview", icon: null, color: "#635bff", bg: "#f6f9fc" },
  { id: "Instagram", name: "Instagram", icon: FaInstagram, color: "#E1306C", bg: "#fdf0f5" },
  { id: "Twitter / X", name: "Twitter / X", icon: FaXTwitter, color: "#000000", bg: "#f0f0f0" },
  { id: "LinkedIn", name: "LinkedIn", icon: FaLinkedinIn, color: "#0077B5", bg: "#eef6fb" },
  { id: "Facebook", name: "Facebook", icon: FaFacebook, color: "#1877F2", bg: "#ebf4ff" },
  { id: "TikTok", name: "TikTok", icon: FaTiktok, color: "#000000", bg: "#f0f0f0" },
  { id: "YouTube", name: "YouTube", icon: FaYoutube, color: "#FF0000", bg: "#fff0f0" },
  { id: "Pinterest", name: "Pinterest", icon: FaPinterest, color: "#BD081C", bg: "#fdf0f0" },
];

interface PlatformSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
      {platforms.map((platform) => {
        const isActive = selected === platform.id;
        const Icon = platform.icon;

        return (
          <button
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[100px] h-[100px] rounded-2xl border-2 transition-all duration-200 group",
              isActive 
                ? "border-[#635bff] bg-white shadow-lg shadow-[#635bff]/10 -translate-y-1" 
                : "border-[#e3e8ef] bg-white hover:border-[#c9d0ef]"
            )}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors",
                isActive ? "bg-[#635bff]/10" : "bg-[#f6f9fc] group-hover:bg-[#f0f3f7]"
              )}
            >
              {Icon ? (
                <Icon className="w-5 h-5" style={{ color: isActive ? "#635bff" : "#8792a2" }} />
              ) : (
                <div className={cn("w-5 h-5 rounded-sm border-2", isActive ? "border-[#635bff]" : "border-[#8792a2]")} />
              )}
            </div>
            <span 
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isActive ? "text-[#1a1f36]" : "text-[#8792a2]"
              )}
            >
              {platform.name}
            </span>
            
            {/* Status Indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 translate-x-1.5 -translate-y-1.5 scale-75 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
               <span className="text-[10px] font-bold text-[#09825d]">Live</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
