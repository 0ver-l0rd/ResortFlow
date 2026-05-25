"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

type ActivityPost = {
  status: string;
  mediaUrls?: string[] | null;
  createdAt?: string | null;
  publishedAt?: string | null;
  scheduledAt?: string | null;
};

const buildActivityData = (posts: ActivityPost[]) => {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      date: date.toLocaleDateString(undefined, { month: "short", day: "2-digit" }),
      published: 0,
      media: 0,
    };
  });

  const lookup = new Map(days.map((day) => [day.key, day]));
  posts.forEach((post) => {
    const stamp = post.publishedAt || post.createdAt || post.scheduledAt;
    if (!stamp) return;
    const row = lookup.get(new Date(stamp).toISOString().slice(0, 10));
    if (!row) return;
    if (post.status === "published") row.published += 1;
    if (post.mediaUrls?.length) row.media += 1;
  });

  return days.map(({ key, ...rest }) => rest);
};

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { PLATFORM_THEMES } from "@/lib/analytics-themes";

const chartConfig = {
  published: {
    label: "Published Posts",
    color: "#2d6a4f",
  },
  media: {
    label: "Media Posts",
    color: "#09825d",
  },
} satisfies ChartConfig;

export function EngagementChart({ platform = "All Platforms" }: { platform?: string }) {
  const theme = PLATFORM_THEMES[platform] || PLATFORM_THEMES["All Platforms"];

  // 1. Fetch connected accounts
  const { data: accounts = [], isLoading: isAccountsLoading } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await fetch("/api/social/accounts");
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json() as Promise<{ platform: string }[]>;
    },
  });

  const normalizedPlatform = platform.toLowerCase().split("/")[0].trim();

  // 2. Fetch posts for truthful activity history
  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["analytics-post-activity", normalizedPlatform],
    queryFn: async () => {
      const search = platform === "All Platforms" ? "" : `?platform=${encodeURIComponent(normalizedPlatform)}`;
      const response = await fetch(`/api/posts${search}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json() as Promise<ActivityPost[]>;
    },
  });

  // Check if platform is connected
  const isConnected = platform === "All Platforms" || accounts.some(
    (a) => a.platform.toLowerCase().split("/")[0].trim() === normalizedPlatform
  );

  const platformPosts = posts;

  if (isAccountsLoading || isPostsLoading) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#e2e8f0] h-[340px] flex items-center justify-center text-sm font-semibold text-[#8792a2]">
        Loading tracking matrix…
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#e2e8f0] shadow-sm h-[340px] flex flex-col items-center justify-center p-8 gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-md font-bold text-[#1a1f36]">{platform} is not connected</h4>
          <p className="text-xs text-[#8792a2] max-w-sm leading-relaxed">
            Link your {platform} profile in the connections dashboard to start tracking real-time engagement and audience flows.
          </p>
        </div>
        <a 
          href="/connections" 
          className="mt-2 text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Manage Connections
        </a>
      </div>
    );
  }

  const currentData = React.useMemo(() => buildActivityData(platformPosts), [platformPosts]);
  const showDemoNotice = currentData.every((point) => point.published === 0 && point.media === 0);

  return (
    <div className="bg-white rounded-[2rem] border border-[#e2e8f0] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_12px_60px_-12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700">
      {showDemoNotice && (
        <div className="bg-amber-50/80 border-b border-amber-100 px-8 py-2.5 text-left flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            No recent post history found for this channel. Showing the last 7 days of real activity only.
          </span>
        </div>
      )}
      <div className="flex items-center justify-between px-8 py-7 border-b border-[#f1f4f9] bg-gradient-to-r from-white to-[#f8fafc]">
        <div className="text-left">
          <h3 className="text-lg font-bold text-[#1a1f36] tracking-tight">
            {platform === "All Platforms" ? "Publishing Activity" : `${platform} Activity`}
          </h3>
          <p className="text-[10px] font-bold text-[#8792a2] mt-1 uppercase tracking-[0.2em]">
            {showDemoNotice ? "Last 7 Days · No activity yet" : "Last 7 Days · Real post history"}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.primary }} />
            <span className="text-[10px] font-bold text-[#3c4257]/60 uppercase tracking-widest group-hover:text-[#1a1f36] transition-colors">Published</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.secondary || "#09825d" }} />
            <span className="text-[10px] font-bold text-[#3c4257]/60 uppercase tracking-widest group-hover:text-[#1a1f36] transition-colors">Media Posts</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-8 h-[340px] relative">
        {showDemoNotice && (
          <div className="absolute top-4 right-6 z-10 px-2.5 py-1 bg-amber-100/60 text-amber-800 border border-amber-200/50 rounded-lg text-[9px] font-bold uppercase tracking-wider">
            No Activity Yet
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.primary} stopOpacity={0.1} />
                <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="media"
              stroke={theme.secondary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMedia)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="published"
              stroke={theme.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPublished)"
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
