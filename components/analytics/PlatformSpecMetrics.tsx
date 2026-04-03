"use client";

import React from "react";
import { 
  Play, 
  MessageCircle, 
  Share2, 
  MousePointer2, 
  UserPlus, 
  Clock, 
  Hash, 
  ArrowUpRight 
} from "lucide-react";
import { MetricCard } from "./MetricCard";

interface PlatformSpecMetricsProps {
  platform: string;
}

export function PlatformSpecMetrics({ platform }: PlatformSpecMetricsProps) {
  // Mock platform-specific data
  const metricsMap: Record<string, any[]> = {
    "Instagram": [
      { label: "Story Exit Rate", value: "12%", change: "-2%", trend: "up", icon: Share2, color: "#E1306C", note: "lower is better" },
      { label: "Reels Retention", value: "74%", change: "+28%", trend: "up", icon: Play, color: "#E1306C", note: "higher than avg." },
      { label: "Explore Reach", value: "8.4k", change: "+15%", trend: "up", icon: MousePointer2, color: "#E1306C", note: "top: travel posts" },
      { label: "Mentions", value: "156", change: "+12%", trend: "up", icon: Hash, color: "#E1306C", note: "mostly in stories" },
    ],
    "Twitter / X": [
      { label: "Thread Completion", value: "42%", change: "+5%", trend: "up", icon: Share2, color: "#000000", note: "avg: 8.4 tweets" },
      { label: "Reply Volume", value: "245", change: "+15%", trend: "up", icon: MessageCircle, color: "#000000", note: "peak: morning X" },
      { label: "Link Clicks", value: "890", change: "+8%", trend: "up", icon: MousePointer2, color: "#000000", note: "CTR: 2.8%" },
      { label: "New Followers", value: "156", change: "+12%", trend: "up", icon: UserPlus, color: "#000000", note: "net growth" },
    ],
    "LinkedIn": [
      { label: "Unique Visitors", value: "1.5k", change: "+10%", trend: "up", icon: MousePointer2, color: "#0077B5", note: "mostly IT/Managerial" },
      { label: "Page Views", value: "6.2k", change: "+22%", trend: "up", icon: Play, color: "#0077B5", note: "desktop: 70%" },
      { label: "Reactions", value: "432", change: "+18%", trend: "up", icon: MessageCircle, color: "#0077B5", note: "Insightful: 120" },
      { label: "Reposts", value: "45", change: "+5%", trend: "up", icon: Share2, color: "#0077B5", note: "re-shares by employees" },
    ],
    "YouTube": [
      { label: "Avg. View Duration", value: "8m 12s", change: "+12%", trend: "up", icon: Clock, color: "#FF0000", note: "higher for tutorials" },
      { label: "End Screen CTR", value: "8.4%", change: "+35%", trend: "up", icon: ArrowUpRight, color: "#FF0000", note: "impressions: 12k" },
      { label: "Subscribers Gained", value: "310", change: "+40%", trend: "up", icon: UserPlus, color: "#FF0000", note: "total: 15.2k" },
      { label: "Returning Viewers", value: "6.2k", change: "+5%", trend: "up", icon: MousePointer2, color: "#FF0000", note: "loyalty score: 8/10" },
    ],
    "Facebook": [
      { label: "Page Follows", value: "1.2k", change: "+8%", trend: "up", icon: UserPlus, color: "#1877F2", note: "organic: 82%" },
      { label: "Link Clicks", value: "2.4k", change: "+15%", trend: "up", icon: MousePointer2, color: "#1877F2", note: "CTR: 3.2%" },
      { label: "Post Shares", value: "450", change: "+22%", trend: "up", icon: Share2, color: "#1877F2", note: "viral reach: +5k" },
      { label: "Comment Sent.", value: "84%", change: "+2%", trend: "up", icon: MessageCircle, color: "#1877F2", note: "mostly positive" },
    ],
    "TikTok": [
      { label: "Sound Attribution", value: "1.5k", change: "+45%", trend: "up", icon: Hash, color: "#000000", note: "top: #trending" },
      { label: "Stitch/Duet Vol.", value: "840", change: "+28%", trend: "up", icon: Share2, color: "#000000", note: "engagement peak" },
      { label: "Completion Rate", value: "68%", change: "+5%", trend: "up", icon: Play, color: "#000000", note: "avg: 12s watch" },
      { label: "Profile Clicks", value: "120", change: "+12%", trend: "up", icon: MousePointer2, color: "#000000", note: "bio link: 45" },
    ],
    "Pinterest": [
      { label: "Outbound Clicks", value: "2.8k", change: "+12%", trend: "up", icon: MousePointer2, color: "#BD081C", note: "Conversion: 4.8%" },
      { label: "Pin Saves", value: "1.5k", change: "+35%", trend: "up", icon: Share2, color: "#BD081C", note: "total current: 15k" },
      { label: "Impression Vol.", value: "120k", change: "+18%", trend: "up", icon: Play, color: "#BD081C", note: "top: recipes" },
      { label: "Engaged Audience", value: "8.4k", change: "+5%", trend: "up", icon: UserPlus, color: "#BD081C", note: "mostly female 25-34" },
    ],
  };

  const currentMetrics = metricsMap[platform] || [];

  if (currentMetrics.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-[#8792a2]" />
          <h3 className="text-sm font-bold text-[#1a1f36] uppercase tracking-wider">{platform} Details</h3>
        </div>
        <div className="px-2 py-1 bg-[#f6f9fc] rounded text-[10px] font-bold text-[#8792a2] uppercase tracking-widest border border-[#e3e8ef]">
          Granular Metrics
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
