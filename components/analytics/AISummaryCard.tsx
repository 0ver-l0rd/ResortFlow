"use client";

import React from "react";
import { Sparkles, TrendingUp, Lightbulb, Loader2 } from "lucide-react";

interface AISummaryData {
  summary: string;
  insights: string[];
  tip: string;
}

interface AISummaryCardProps {
  data: AISummaryData | null;
  isLoading: boolean;
  platform: string;
}

export function AISummaryCard({ data, isLoading, platform }: AISummaryCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#e3e8ef] p-8 shadow-[0_1px_3px_rgba(60,66,87,0.05)] flex flex-col items-center justify-center text-center gap-4 h-[300px]">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-[#2d6a4f] animate-spin" />
          <Sparkles className="w-5 h-5 text-[#f5a623] absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1a1f36]">AI is analyzing {platform}...</h4>
          <p className="text-xs text-[#8792a2] mt-1 italic">Drawing conclusions from your latest metrics</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#f0f3f7] flex items-center justify-between bg-gradient-to-r from-[#2d6a4f]/5 via-transparent to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a1f36]">AI Performance Summary</h3>
            <p className="text-[10px] font-semibold text-[#2d6a4f] uppercase tracking-wider">Insights for {platform}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Main Summary */}
        <div className="relative p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]/50">
          <p className="text-sm text-[#3c4257] leading-relaxed italic">
            "{data.summary}"
          </p>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#09825d]">
            <TrendingUp className="w-3.5 h-3.5" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Key Conclusions</h4>
          </div>
          <ul className="space-y-2">
            {data.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#3c4257] leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#09825d] mt-1.5" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Tip */}
        <div className="mt-auto pt-6 border-t border-[#f0f3f7]">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#efffee] border border-[#09825d]/10 group hover:border-[#09825d]/30 transition-colors">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Lightbulb className="w-4 h-4 text-[#f5a623]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#09825d] uppercase tracking-wider mb-0.5">Recommendations</p>
              <p className="text-xs text-[#3c4257] font-medium leading-relaxed">
                {data.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
