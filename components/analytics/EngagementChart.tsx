"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const data = [
  { date: "Mar 28", engagement: 4500, reach: 12000 },
  { date: "Mar 29", engagement: 5200, reach: 15000 },
  { date: "Mar 30", engagement: 4800, reach: 14000 },
  { date: "Mar 31", engagement: 6100, reach: 18000 },
  { date: "Apr 01", engagement: 5900, reach: 17500 },
  { date: "Apr 02", engagement: 7200, reach: 21000 },
  { date: "Apr 03", engagement: 6800, reach: 20000 },
];

const platformData: Record<string, typeof data> = {
  "Instagram": [
    { date: "Mar 28", engagement: 1200, reach: 4000 },
    { date: "Mar 29", engagement: 1500, reach: 4500 },
    { date: "Mar 30", engagement: 1100, reach: 4200 },
    { date: "Mar 31", engagement: 1800, reach: 5000 },
    { date: "Apr 01", engagement: 1600, reach: 4800 },
    { date: "Apr 02", engagement: 2100, reach: 6000 },
    { date: "Apr 03", engagement: 1900, reach: 5500 },
  ],
  "Twitter / X": [
    { date: "Mar 28", engagement: 800, reach: 3000 },
    { date: "Mar 29", engagement: 950, reach: 3200 },
    { date: "Mar 30", engagement: 700, reach: 2800 },
    { date: "Mar 31", engagement: 1100, reach: 3500 },
    { date: "Apr 01", engagement: 1050, reach: 3400 },
    { date: "Apr 02", engagement: 1400, reach: 4200 },
    { date: "Apr 03", engagement: 1300, reach: 4000 },
  ],
  "LinkedIn": [
    { date: "Mar 28", engagement: 400, reach: 1500 },
    { date: "Mar 29", engagement: 550, reach: 1700 },
    { date: "Mar 30", engagement: 300, reach: 1400 },
    { date: "Mar 31", engagement: 610, reach: 2000 },
    { date: "Apr 01", engagement: 590, reach: 1900 },
    { date: "Apr 02", engagement: 720, reach: 2200 },
    { date: "Apr 03", engagement: 680, reach: 2100 },
  ],
  "YouTube": [
    { date: "Mar 28", engagement: 2100, reach: 6000 },
    { date: "Mar 29", engagement: 2200, reach: 6500 },
    { date: "Mar 30", engagement: 2800, reach: 7000 },
    { date: "Mar 31", engagement: 3100, reach: 8500 },
    { date: "Apr 01", engagement: 2900, reach: 8000 },
    { date: "Apr 02", engagement: 3200, reach: 9000 },
    { date: "Apr 03", engagement: 3000, reach: 8800 },
  ],
};

import { PLATFORM_THEMES } from "@/lib/analytics-themes";

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "#635bff",
  },
  reach: {
    label: "Reach",
    color: "#09825d",
  },
} satisfies ChartConfig;

export function EngagementChart({ platform = "All Platforms" }: { platform?: string }) {
  const currentData = platform === "All Platforms" ? data : (platformData[platform] || data);
  const theme = PLATFORM_THEMES[platform] || PLATFORM_THEMES["All Platforms"];

  return (
    <div className="bg-white rounded-[2rem] border border-[#e2e8f0] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_12px_60px_-12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700">
      <div className="flex items-center justify-between px-8 py-7 border-b border-[#f1f4f9] bg-gradient-to-r from-white to-[#f8fafc]">
        <div>
          <h3 className="text-lg font-bold text-[#1a1f36] tracking-tight">
            {platform === "All Platforms" ? "Global Performance" : `${platform} Metrics`}
          </h3>
          <p className="text-[10px] font-bold text-[#8792a2] mt-1 uppercase tracking-[0.2em]">Audience Flux & Interaction Matrix</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.primary }} />
            <span className="text-[10px] font-bold text-[#3c4257]/60 uppercase tracking-widest group-hover:text-[#1a1f36] transition-colors">Engagement</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.secondary || "#09825d" }} />
            <span className="text-[10px] font-bold text-[#3c4257]/60 uppercase tracking-widest group-hover:text-[#1a1f36] transition-colors">Reach</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-8 h-[340px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.primary} stopOpacity={0.1} />
                <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.secondary} stopOpacity={0.05} />
                <stop offset="95%" stopColor={theme.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f3f7" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8792a2", fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8792a2", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => `${value > 999 ? (value / 1000).toFixed(1) + "k" : value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="reach"
              stroke={theme.secondary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReach)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke={theme.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEngagement)"
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
