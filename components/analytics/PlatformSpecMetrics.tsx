"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Share2,
  MousePointer2,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import { MetricCard } from "./MetricCard";

interface PlatformSpecMetricsProps {
  platform: string;
}

interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: typeof UserPlus;
  note?: string;
  color?: string;
}

export function PlatformSpecMetrics({ platform }: PlatformSpecMetricsProps) {
  // 1. Fetch connected accounts
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await fetch("/api/social/accounts");
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json() as Promise<{ platform: string }[]>;
    },
  });

  const normalizedPlatform = platform.toLowerCase().split("/")[0].trim();
  const isConnected = accounts.some(
    (a) => a.platform.toLowerCase().split("/")[0].trim() === normalizedPlatform
  );

  const { data: stats } = useQuery({
    queryKey: ["analytics-stats", platform],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/stats?platform=${encodeURIComponent(platform)}`);
      if (!response.ok) throw new Error("Failed to fetch analytics stats");
      return response.json() as Promise<{ reach: number; followers: number; engagement: string; raw?: { source?: string } }>;
    },
    enabled: isConnected,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["platform-post-metrics", normalizedPlatform],
    queryFn: async () => {
      const response = await fetch(`/api/posts?platform=${encodeURIComponent(normalizedPlatform)}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json() as Promise<Array<{ status: string; mediaUrls?: string[]; isAiGenerated?: boolean }>>;
    },
    enabled: isConnected,
  });

  const formatCompact = (value: number) => value > 999 ? `${(value / 1000).toFixed(1)}k` : String(value || 0);
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const scheduledPosts = posts.filter((post) => post.status === "scheduled").length;
  const mediaPosts = posts.filter((post) => post.mediaUrls?.length).length;
  const aiPosts = posts.filter((post) => post.isAiGenerated).length;
  const sourceLabel = stats?.raw?.source === "zernio" ? "Zernio live" : "DB fallback";

  if (isLoading || !isConnected) return null;

  const currentMetrics: PlatformMetric[] = [
    { label: "Followers", value: formatCompact(stats?.followers || 0), change: sourceLabel, trend: (stats?.followers || 0) > 0 ? "up" : "down", icon: UserPlus, color: "#2d6a4f", note: "audience size" },
    { label: "Reach", value: formatCompact(stats?.reach || 0), change: stats?.engagement || "0.00%", trend: (stats?.reach || 0) > 0 ? "up" : "down", icon: MousePointer2, color: "#2d6a4f", note: "engagement rate" },
    { label: "Published Posts", value: String(publishedPosts), change: `${scheduledPosts} scheduled`, trend: publishedPosts > 0 ? "up" : "down", icon: Share2, color: "#2d6a4f", note: "this channel" },
    { label: "Media Posts", value: String(mediaPosts), change: `${aiPosts} AI-assisted`, trend: mediaPosts > 0 ? "up" : "down", icon: Play, color: "#2d6a4f", note: "with media" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-[#8792a2]" />
          <h3 className="text-sm font-bold text-[#1a1f36] uppercase tracking-wider">{platform} Details</h3>
        </div>
        <div className="px-2 py-1 bg-[#f6f9fc] rounded text-[10px] font-bold text-[#8792a2] uppercase tracking-widest border border-[#e3e8ef]">
          {stats?.raw?.source === "zernio" ? "Live + Local" : "Local Metrics"}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentMetrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>
    </div>
  );
}
