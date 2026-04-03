"use client";

import React from "react";
import { TrendingUp, TrendingDown, Heart, MessageSquare, Share2 } from "lucide-react";
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
    best: { content: "Social Copilot: Full Walkthrough & Setup Guide 🎥", likes: "5.2k", comments: "310", shares: "890", engagement: "9.8%", date: "2 weeks ago" },
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
  const data = matchupData[platform] || matchupData["Instagram"];
  const theme = PLATFORM_THEMES[platform] || PLATFORM_THEMES["All Platforms"];

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
            <span className="text-sm font-bold text-[#1a1f36]">High Performer</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>{data.best.engagement} Engagement</span>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]/50 group-hover:bg-white transition-colors">
             <p className="text-sm text-[#3c4257] font-medium leading-relaxed">
               "{data.best.content}"
             </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
             <span className="text-xs text-[#8792a2]">{data.best.date}</span>
             <div className="flex items-center gap-4 text-[#3c4257]">
               <div className="flex items-center gap-1">
                 <Heart className="w-3.5 h-3.5 text-red-500" />
                 <span className="text-xs font-bold">{data.best.likes}</span>
               </div>
               <div className="flex items-center gap-1">
                 <MessageSquare className="w-3.5 h-3.5 text-[#635bff]" />
                 <span className="text-xs font-bold">{data.best.comments}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Share2 className="w-3.5 h-3.5 text-[#09825d]" />
                 <span className="text-xs font-bold">{data.best.shares}</span>
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
            <span className="text-sm font-bold text-[#3c4257]">Lowest Engagement</span>
          </div>
          <span className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">{data.worst.engagement} Engagement</span>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]/50">
             <p className="text-sm text-[#8792a2] leading-relaxed">
               "{data.worst.content}"
             </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
             <span className="text-xs text-[#8792a2]">{data.worst.date}</span>
             <div className="flex items-center gap-4 text-[#8792a2]">
               <div className="flex items-center gap-1">
                 <Heart className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{data.worst.likes}</span>
               </div>
               <div className="flex items-center gap-1">
                 <MessageSquare className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{data.worst.comments}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Share2 className="w-3.5 h-3.5" />
                 <span className="text-xs font-medium">{data.worst.shares}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
