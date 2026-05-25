"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const data = [
  { platform: "Instagram", reach: 45000, engagement: 8200, color: "#E1306C" },
  { platform: "Twitter / X", reach: 32000, engagement: 4500, color: "#000000" },
  { platform: "LinkedIn", reach: 28000, engagement: 3100, color: "#0077B5" },
  { platform: "YouTube", reach: 56000, engagement: 12000, color: "#FF0000" },
];

const chartConfig = {
  reach: {
    label: "Reach",
    color: "#2d6a4f",
  },
} satisfies ChartConfig;

export function PlatformBreakdown() {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#f0f3f7]">
        <h3 className="text-sm font-semibold text-[#1a1f36]">Platform Breakdown</h3>
        <p className="text-xs text-[#8792a2] mt-0.5">Total reach distribution across social channels</p>
      </div>
      <div className="px-4 py-8 h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid horizontal={false} vertical={false} stroke="#f0f3f7" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="platform"
              type="category"
              axisLine={false}
              tickLine={false}
              fontSize={11}
              width={100}
              tick={{ fill: "#3c4257" }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="reach" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
