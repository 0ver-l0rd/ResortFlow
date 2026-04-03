"use client";

import React from "react";
import { Sparkles, TrendingUp, Lightbulb, Loader2, ArrowRight } from "lucide-react";
import { PlatformTheme } from "@/lib/analytics-themes";
import { cn } from "@/lib/utils";

interface AISummaryData {
  summary: string;
  insights: string[];
  tip: string;
}

interface ThemedAIRecommendationProps {
  data: AISummaryData | null;
  isLoading: boolean;
  theme: PlatformTheme;
}

export function ThemedAIRecommendation({ data, isLoading, theme }: ThemedAIRecommendationProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e3e8ef] p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-6 h-[260px] animate-pulse">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#635bff] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#f5a623] absolute -top-2 -right-2" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1a1f36]">AI is thinking...</h4>
          <p className="text-xs text-[#8792a2]">Analyzing {theme.name} performance patterns</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isGlobal = theme.id === "All Platforms";

  return (
    <div 
      className={cn(
        "relative rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] border transition-all duration-700 group",
        "bg-white"
      )}
      style={{ borderBlockColor: theme.border }}
    >
      {/* Premium Glass Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />
      
      <div className="relative flex flex-col lg:flex-row items-stretch min-h-[220px]">
        {/* Sidebar Info */}
        <div 
          className="lg:w-72 p-8 flex flex-col justify-between text-white transition-colors duration-700"
          style={{ background: isGlobal ? "linear-gradient(135deg, #635bff 0%, #7f78ff 100%)" : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">AI Strategy</h3>
              <p className="text-xs font-medium text-white/80 uppercase tracking-widest mt-0.5">Focus: {theme.name}</p>
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0 flex items-center gap-2 group/btn cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">Apply Strategy</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white">
          {/* Summary Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[#8792a2]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Performance Insight</span>
             </div>
             <p className="text-sm font-medium text-[#1a1f36] leading-relaxed">
               {data.summary}
             </p>
             <div className="flex flex-wrap gap-2 pt-2">
               {data.insights.map((insight, idx) => (
                 <div key={idx} className="px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] text-[10px] font-bold text-[#3c4257]">
                   {insight}
                 </div>
               ))}
             </div>
          </div>

          {/* Actionable Tip Section */}
          <div className="p-6 rounded-2xl bg-[#efffee] border border-[#09825d]/10 space-y-4 relative overflow-hidden group/tip">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-[0.03] transition-transform group-hover/tip:scale-110 duration-500">
               <Lightbulb className="w-full h-full text-[#09825d]" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Lightbulb className="w-4 h-4 text-[#f5a623]" />
              </div>
              <h4 className="text-[11px] font-bold text-[#09825d] uppercase tracking-wider">Pro Recommendation</h4>
            </div>
            
            <p className="text-xs text-[#3c4257] font-semibold leading-relaxed relative z-10">
              {data.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
