"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, TrendingUp, TrendingDown, Heart, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_THEMES } from "@/lib/analytics-themes";

interface PostData {
  content: string;
  likes: string;
  comments: string;
  shares: string;
  engagement: string;
  date: string;
}

interface PostMatchupProps {
  platform: string;
}

const matchupData: Record<string, { best: PostData; worst: PostData }> = {
  "Instagram": {
    best: { content: "New partnership announcement! 🏨✨", likes: "2.4k", comments: "156", shares: "84", engagement: "8.4%", date: "2 days ago" },
    worst: { content: "Checking in for the weekend.", likes: "450", comments: "12", shares: "2", engagement: "1.2%", date: "5 days ago" },
  },
  "Twitter / X": {
    best: { content: "Why AI-powered scheduling is the future of social management. 🧵", likes: "1.8k", comments: "84", shares: "450", engagement: "12.5%", date: "1 day ago" },
    worst: { content: "Have a great Monday everyone!", likes: "120", comments: "4", shares: "5", engagement: "0.8%", date: "3 days ago" },
  },
  "LinkedIn": {
    best: { content: "Scaling our client's engagement by 300% in 3 months. [Case Study]", likes: "850", comments: "42", shares: "120", engagement: "6.2%", date: "4 days ago" },
    worst: { content: "We are hiring!", likes: "45", comments: "2", shares: "1", engagement: "0.5%", date: "1 week ago" },
  },
  "YouTube": {
    best: { content: "ResortFlow: Full Walkthrough & Setup Guide 🎥", likes: "5.2k", comments: "310", shares: "890", engagement: "9.8%", date: "2 weeks ago" },
    worst: { content: "Short: Testing the new camera.", likes: "840", comments: "15", shares: "10", engagement: "2.5%", date: "1 month ago" },
  },
  "Facebook": {
    best: { content: "Join our next webinar on social automation! 🚀", likes: "1.1k", comments: "84", shares: "156", engagement: "4.5%", date: "3 days ago" },
    worst: { content: "Office views today.", likes: "120", comments: "5", shares: "2", engagement: "0.9%", date: "6 days ago" },
  },
  "TikTok": {
    best: { content: "How to save 10 hours/week on social media. #tips #ai", likes: "12.4k", comments: "840", shares: "2.1k", engagement: "15.2%", date: "1 day ago" },
    worst: { content: "Office pet tour! 🐶", likes: "2.1k", comments: "120", shares: "45", engagement: "3.4%", date: "4 days ago" },
  },
  "Pinterest": {
    best: { content: "10 Aesthetics for Your Next Hospital Content Strategy 📌", likes: "4.5k", comments: "12", shares: "1.8k", engagement: "6.8%", date: "1 month ago" },
    worst: { content: "New logo design concept.", likes: "120", comments: "1", shares: "15", engagement: "0.2%", date: "2 months ago" },
  },
};

export function PostMatchup({ platform }: PostMatchupProps) {
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

  // 2. Fetch top posts
  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["analytics-top-posts"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/top-posts");
      if (!response.ok) throw new Error("Failed to fetch top posts");
      return response.json() as Promise<any[]>;
    },
  });

  const normalizedPlatform = platform.toLowerCase().split("/")[0].trim();
  const isConnected = accounts.some(
    (a) => a.platform.toLowerCase().split("/")[0].trim() === normalizedPlatform
  );

  if (isAccountsLoading || isPostsLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#e3e8ef] text-center text-sm font-semibold text-[#8792a2]">
        Analyzing channel matchups…
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#e3e8ef] shadow-sm text-center flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1a1f36]">{platform} Matchup Unavailable</h4>
          <p className="text-xs text-[#8792a2]">
            Connect your {platform} account to view post matchups.
          </p>
        </div>
      </div>
    );
  }

  // Filter posts by platform
  const platformPosts = posts.filter(
    p => p.platform.toLowerCase().split("/")[0].trim() === normalizedPlatform
  );

  // If fewer than 2 posts, matchup is unavailable
  if (platformPosts.length < 2) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-[#e3e8ef] shadow-sm text-center flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-[#e3e8ef] flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-[#8792a2]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1a1f36]">Performance Matchup Unavailable</h4>
          <p className="text-xs text-[#8792a2] max-w-sm leading-relaxed">
            We need at least two published posts on {platform} to compute comparison metrics. Keep composing and scheduling!
          </p>
        </div>
      </div>
    );
  }

  // Parse engagement rate helper
  const parseEngagement = (eng: string) => {
    if (!eng || eng === "N/A") return -1;
    return parseFloat(eng.replace("%", ""));
  };

  // Sort by engagement
  const sortedPosts = [...platformPosts].sort(
    (a, b) => parseEngagement(b.engagement) - parseEngagement(a.engagement)
  );

  const bestPost = sortedPosts[0];
  const worstPost = sortedPosts[sortedPosts.length - 1];

  const bestPostData: PostData = {
    content: bestPost.content,
    likes: bestPost.likes,
    comments: bestPost.comments,
    shares: bestPost.shares || "0",
    engagement: bestPost.engagement,
    date: bestPost.date,
  };

  const worstPostData: PostData = {
    content: worstPost.content,
    likes: worstPost.likes,
    comments: worstPost.comments,
    shares: worstPost.shares || "0",
    engagement: worstPost.engagement,
    date: worstPost.date,
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Best Post */}
      <div 
        className="bg-white rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group transition-all duration-500"
        style={{ borderBlockColor: `${theme.primary}40` }}
      >
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: `${theme.primary}05`, borderColor: `${theme.primary}10` }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: theme.primary }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1a1f36]">High Performer (Live)</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>{bestPostData.engagement} Engagement</span>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]/50 group-hover:bg-white transition-colors text-left">
             <p className="text-sm text-[#3c4257] font-medium leading-relaxed">
               "{bestPostData.content}"
             </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
             <span className="text-xs text-[#8792a2]">{bestPostData.date}</span>
             <div className="flex items-center gap-4 text-[#3c4257]">
               <div className="flex items-center gap-1">
                 <Heart className="w-3.5 h-3.5 text-red-500" />
                 <span className="text-xs font-bold">{bestPostData.likes}</span>
               </div>
               <div className="flex items-center gap-1">
                 <MessageSquare className="w-3.5 h-3.5 text-[#2d6a4f]" />
                 <span className="text-xs font-bold">{bestPostData.comments}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Share2 className="w-3.5 h-3.5 text-[#09825d]" />
                 <span className="text-xs font-bold">{bestPostData.shares}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Worst Post */}
      <div className="bg-white rounded-2xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden flex flex-col group hover:border-red-100 transition-all">
        <div className="px-5 py-4 border-b border-[#f0f3f7] flex items-center justify-between bg-[#fcfcfc]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8792a2] flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#3c4257]">Lowest Engagement (Live)</span>
          </div>
          <span className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">{worstPostData.engagement} Engagement</span>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]/50 text-left">
             <p className="text-sm text-[#8792a2] leading-relaxed">
               "{worstPostData.content}"
             </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
             <span className="text-xs text-[#8792a2]">{worstPostData.date}</span>
             <div className="flex items-center gap-4 text-[#8792a2]">
               <div className="flex items-center gap-1">
                 <Heart className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{worstPostData.likes}</span>
               </div>
               <div className="flex items-center gap-1">
                 <MessageSquare className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{worstPostData.comments}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Share2 className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{worstPostData.shares}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
