"use client";

import React from "react";
import { Sparkles, TrendingUp, Lightbulb, Loader2, ArrowRight, Zap } from "lucide-react";
import { PlatformTheme } from "@/lib/analytics-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="bg-white rounded-3xl border border-[#e2e8f0] p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_12px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-6 h-[280px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-white" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-[#e2e8f0]">
             <Loader2 className="w-8 h-8 text-[#2d6a4f] animate-spin" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2d6a4f] flex items-center justify-center shadow-lg"
          >
             <Zap className="w-3 h-3 text-white fill-white" />
          </motion.div>
        </div>
        <div className="space-y-1 relative z-10">
          <h4 className="text-base font-bold text-[#1a1f36]">Synthesizing Strategy...</h4>
          <p className="text-xs text-[#8792a2] font-semibold uppercase tracking-widest">Advanced Pattern Analysis Active</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isGlobal = theme.id === "All Platforms";
  const ThemeIcon = theme.icon;

  return (
    <div className="relative group">
      {/* Stripe-style Shadow layer */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] rounded-[2rem] opacity-[0.03] blur-xl group-hover:opacity-[0.08] transition-opacity duration-700" />
      
      <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_12px_60px_-12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700">
        
        {/* Top Accent Mesh Gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none overflow-hidden opacity-30">
           <div 
             className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[80px]" 
             style={{ backgroundColor: theme.primary }} 
           />
           <div 
             className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-[60px]" 
             style={{ backgroundColor: theme.secondary || theme.primary }} 
           />
        </div>

        <div className="relative p-1">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/20 transition-transform group-hover:scale-110 duration-500"
                style={{ background: isGlobal ? "linear-gradient(135deg, #1a1f36 0%, #000000 100%)" : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}
              >
                <ThemeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1f36] tracking-tight">Intelligence Strategy</h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em]">{theme.name} Analysis Live</p>
                </div>
              </div>
            </div>
            
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-[11px] font-bold shadow-[0_4px_12px_rgba(99,91,255,0.25)] hover:shadow-[0_8px_20px_rgba(99,91,255,0.3)] hover:-translate-y-0.5 transition-all">
                Action Strategy
                <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8 p-8 pt-2">
            
            {/* Insights Section */}
            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#2d6a4f]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Summary Insight</span>
                  </div>
                  <p className="text-[15px] font-medium text-[#3c4257] leading-[1.6]">
                    {data.summary}
                  </p>
               </div>

               <div className="flex flex-wrap gap-2.5">
                 {data.insights.map((insight, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="px-4 py-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-bold text-[#1a1f36] shadow-sm hover:shadow-md hover:border-[#cbd5e1] transition-all cursor-default"
                   >
                     {insight}
                   </motion.div>
                 ))}
               </div>
            </div>

            {/* Recommendation Box */}
            <div className="relative group/box">
               <div className="absolute inset-0 bg-[#efffee] rounded-3xl border border-[#09825d]/10 transition-transform group-hover/box:scale-[1.01] duration-500" />
               <div className="relative p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#09825d]/5">
                      <Lightbulb className="w-5 h-5 text-[#f5a623]" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-[#09825d] uppercase tracking-[0.2em]">Priority Action</h4>
                        <p className="text-[9px] font-bold text-[#3c4257]/60 uppercase tracking-widest leading-none mt-0.5">High Confidence Recommendation</p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#1a1f36] leading-relaxed">
                    {data.tip}
                  </p>

                  <div className="pt-2">
                    <div className="h-1 w-full bg-[#09825d]/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "85%" }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                        />
                    </div>
                    <p className="text-[9px] font-bold text-[#8792a2] mt-2 flex justify-between items-center px-0.5">
                       <span>Expected Strategy Impact</span>
                       <span className="text-emerald-600">+85%</span>
                    </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
