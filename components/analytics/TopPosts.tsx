"use client";

import React from "react";
import Image from "next/image";
import { MessageSquare, Heart, Share2, BarChart2 } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const topPosts = [
  {
    id: 1,
    content: "Excited to announce our new partnership with @HospitalityGroup! 🏨✨",
    platform: "Instagram",
    Icon: FaInstagram,
    color: "#E1306C",
    likes: "1.2k",
    comments: "84",
    shares: "12",
    date: "2 days ago",
    engagement: "4.8%",
  },
  {
    id: 2,
    content: "Why AI-powered scheduling is the future of social media management. 🧵",
    platform: "Twitter / X",
    Icon: FaXTwitter,
    color: "#000000",
    likes: "856",
    comments: "42",
    shares: "156",
    date: "3 days ago",
    engagement: "6.2%",
  },
  {
    id: 3,
    content: "New case study: How our clients scaled their engagement by 300%.",
    platform: "LinkedIn",
    Icon: FaLinkedinIn,
    color: "#0077B5",
    likes: "432",
    comments: "12",
    shares: "45",
    date: "5 days ago",
    engagement: "3.5%",
  },
  {
    id: 4,
    content: "10 Tips for Better Social Media Presence in 2024. 🎥",
    platform: "YouTube",
    Icon: FaYoutube,
    color: "#FF0000",
    likes: "2.5k",
    comments: "310",
    shares: "89",
    date: "1 week ago",
    engagement: "5.1%",
  },
];

export function TopPosts() {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#f0f3f7] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1a1f36]">Top Performing Posts</h3>
          <p className="text-xs text-[#8792a2] mt-0.5">Posts with highest engagement ratings</p>
        </div>
        <button className="text-xs font-medium text-[#635bff] hover:text-[#4f46e5] transition-colors">
          View Detailed List
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f6f9fc] border-b border-[#f0f3f7]">
              <th className="px-6 py-3 text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">Post Details</th>
              <th className="px-4 py-3 text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">Platform</th>
              <th className="px-4 py-3 text-[10px] font-bold text-[#8792a2] uppercase tracking-wider text-center">Engagement</th>
              <th className="px-4 py-3 text-[10px] font-bold text-[#8792a2] uppercase tracking-wider text-right">Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f7]">
            {topPosts.map((post) => (
              <tr key={post.id} className="hover:bg-[#f6f9fc]/50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 max-w-[300px]">
                    <p className="text-sm font-medium text-[#3c4257] line-clamp-1 group-hover:text-[#1a1f36] transition-colors">
                      {post.content}
                    </p>
                    <span className="text-[10px] text-[#8792a2]">{post.date}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${post.color}10` }}
                    >
                      <post.Icon className="w-3.5 h-3.5" style={{ color: post.color }} />
                    </div>
                    <span className="text-xs font-medium text-[#3c4257]">{post.platform}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#efffee] text-[#09825d] text-[10px] font-bold">
                    <BarChart2 className="w-3 h-3" />
                    {post.engagement}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-4 text-[#8792a2]">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{post.shares}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
