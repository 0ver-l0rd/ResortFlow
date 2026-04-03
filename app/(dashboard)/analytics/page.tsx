"use client";

import React, { useState } from "react";
import { 
  Users, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar as CalendarIcon, 
  ChevronDown 
} from "lucide-react";
import { ThemedMetricCard } from "@/components/analytics/ThemedMetricCard";
import { ThemedAIRecommendation } from "@/components/analytics/ThemedAIRecommendation";
import { PlatformStatus } from "@/components/analytics/PlatformStatus";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { PlatformSpecMetrics } from "@/components/analytics/PlatformSpecMetrics";
import { PostMatchup } from "@/components/analytics/PostMatchup";
import { TopPosts } from "@/components/analytics/TopPosts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PLATFORM_THEMES } from "@/lib/analytics-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const summaryStats = [
  {
    label: "Total Reach",
    value: "148.5k",
    change: "+12.4%",
    trend: "up" as const,
    icon: Eye,
    color: "#635bff",
    note: "vs last 7 days",
  },
  {
    label: "Avg. Engagement",
    value: "4.82%",
    change: "+0.5%",
    trend: "up" as const,
    icon: BarChart3,
    color: "#09825d",
    note: "vs last 7 days",
  },
  {
    label: "Total Followers",
    value: "24.2k",
    change: "+156",
    trend: "up" as const,
    icon: Users,
    color: "#f5a623",
    note: "new this week",
  },
  {
    label: "Growth Rate",
    value: "8.4%",
    change: "-1.2%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "#e1306c",
    note: "vs last month",
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");

  const currentTheme = PLATFORM_THEMES[selectedPlatform] || PLATFORM_THEMES["All Platforms"];

  // Fetch AI Summary based on selected platform
  const { data: aiSummary, isLoading: isAiLoading } = useQuery({
    queryKey: ["analytics-summary", selectedPlatform, timeRange],
    queryFn: async () => {
      const response = await fetch("/api/ai/analytics-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          platform: selectedPlatform,
          metrics: summaryStats 
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json();
    },
    enabled: true,
  });

  return (
    <div 
      className="min-h-screen pb-12 transition-colors duration-700" 
      style={{ 
        backgroundColor: currentTheme.id === "All Platforms" ? "#f6f9fc" : `${currentTheme.primary}05` 
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6">
        
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8792a2]">
                Intelligence
              </p>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: currentTheme.primary }}>
                {currentTheme.name}
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1f36]">
              Growth Insights
            </h1>
            <p className="text-sm text-[#8792a2] max-w-md">
              Harness AI-driven patterns to scale your digital footprint across {selectedPlatform === "All Platforms" ? "all channels" : selectedPlatform}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="bg-white border-[#e3e8ef] text-[#3c4257] h-10 gap-2.5 shadow-sm hover:bg-[#f6f9fc] transition-all font-semibold">
                  <CalendarIcon className="w-4 h-4 text-[#8792a2]" />
                  {timeRange}
                  <ChevronDown className="w-3.5 h-3.5 text-[#c4cdd6]" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => setTimeRange("Last 24 hours")}>Last 24 hours</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("Last 7 days")}>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("Last 30 days")}>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("Last 90 days")}>Last 90 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="bg-white border-[#e3e8ef] text-[#1a1f36] hover:bg-[#f6f9fc] font-bold h-10 gap-2 shadow-sm transition-all border">
              <Download className="w-4 h-4 text-[#8792a2]" />
              Export
            </Button>
          </div>
        </div>

        {/* ── Platform Selector ── */}
        <PlatformStatus 
          selected={selectedPlatform} 
          onSelect={(id) => setSelectedPlatform(id)} 
        />

        {/* ── AI Strategy Card (CORE) ── */}
        <ThemedAIRecommendation 
          data={aiSummary} 
          isLoading={isAiLoading} 
          theme={currentTheme} 
        />

        {/* ── Content Layout ── */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {summaryStats.map((stat) => (
                <ThemedMetricCard key={stat.label} {...stat} theme={currentTheme} />
              ))}
            </div>

            {/* Platform Deep Dives */}
            {selectedPlatform !== "All Platforms" && (
              <div className="space-y-10">
                <PostMatchup platform={selectedPlatform} />
                <PlatformSpecMetrics platform={selectedPlatform} />
              </div>
            )}

            {/* Performance Analysis Area */}
            <div className="grid grid-cols-1 gap-8">
               <EngagementChart platform={selectedPlatform} />
            </div>

            {/* Universal Top Content (Only shown in Overview or adapted) */}
            {selectedPlatform === "All Platforms" && (
              <div className="space-y-6 pt-4">
                 <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em] whitespace-nowrap">Global Top Content</h3>
                    <div className="h-px w-full bg-[#e3e8ef]" />
                 </div>
                 <TopPosts />
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>

        {/* ── Footer Link ── */}
        <div 
          className="relative rounded-3xl overflow-hidden px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-white border border-[#e3e8ef] shadow-[0_1px_3px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all"
        >
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#efffee] flex items-center justify-center border border-[#09825d]/10 transition-transform group-hover:scale-110">
              <TrendingUp className="w-7 h-7 text-[#09825d]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1a1f36]">Ready for your next campaign? 🚀</h4>
              <p className="text-sm text-[#8792a2] mt-1 max-w-md">
                Based on current insights, your audience is peaking. Use our AI Composer to draft your next viral post.
              </p>
            </div>
          </div>
          <Button 
            className="shrink-0 px-8 h-12 bg-[#635bff] hover:bg-[#4f46e5] text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
            onClick={() => window.location.href = '/compose'}
          >
            Create New Post
          </Button>
        </div>

      </div>
    </div>
  );
}
