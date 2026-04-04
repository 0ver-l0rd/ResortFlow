"use client";

import React from "react";
import { 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Bookmark, 
  Send,
  CheckCircle2,
  RefreshCw,
  Music
} from "lucide-react";
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SocialCardPreviewProps {
  platform: string;
  content: string;
  mediaUrl?: string;
  avatarUrl?: string;
  username?: string;
  handle?: string;
}

export function SocialCardPreview({ 
  platform, 
  content, 
  mediaUrl, 
  avatarUrl, 
  username = "Resort Elite", 
  handle = "resort_luxury" 
}: SocialCardPreviewProps) {
  
  const isTikTok = platform.toLowerCase().includes("tiktok") || platform.toLowerCase() === "tt";
  
  if (isTikTok) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-black rounded-2xl overflow-hidden shadow-xl aspect-[9/16] relative font-sans text-left"
      >
        {/* Background Media */}
        <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
          {mediaUrl ? (
            <img src={mediaUrl} alt="TikTok Video" className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-20">
              <RefreshCw className="w-12 h-12 text-white animate-spin-slow" />
              <p className="text-white text-[10px] font-bold tracking-widest uppercase">Video Preview</p>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Heart className="w-6 h-6 fill-transparent" />
            </div>
            <span className="text-white text-[10px] font-bold">0</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-white text-[10px] font-bold">0</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-white text-[10px] font-bold">0</span>
          </div>
        </div>

        {/* Content Overlays */}
        <div className="absolute inset-x-0 bottom-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-bold text-[14px]">@{handle}</span>
            <span className="bg-[#fe2c55] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">FOLLOW</span>
          </div>
          <p className="text-white text-[13px] leading-snug line-clamp-3">
            {content}
          </p>
          <div className="flex items-center gap-2 mt-3 overflow-hidden">
             <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
               <Music className="w-3 h-3 text-white animate-spin-slow" />
             </div>
             <div className="text-white text-[11px] font-medium animate-marquee whitespace-nowrap">
               Original Sound - {username}
             </div>
          </div>
        </div>

        {/* TikTok Music Logo Spinning */}
        <div className="absolute right-3 bottom-6">
           <div className="w-10 h-10 rounded-full bg-[#333] border-4 border-[#111] flex items-center justify-center animate-spin-slow">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#fe2c55] via-white to-[#25f4ee]" />
           </div>
        </div>
      </motion.div>
    );
  }

  const isTwitter = platform.toLowerCase().includes("twitter") || platform.toLowerCase() === "x";
  const isInstagram = platform.toLowerCase().includes("instagram") || platform.toLowerCase() === "ig";
  const isLinkedIn = platform.toLowerCase().includes("linkedin") || platform.toLowerCase() === "li";

  if (isTwitter) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white border border-[#edf0f2] rounded-2xl p-4 shadow-sm font-sans text-left"
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-black/5">
             {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="font-bold text-[#1a1f36]">R</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-bold text-[14px] text-[#0f1419] truncate">{username}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1d9bf0] shrink-0" />
                <span className="text-[14px] text-[#536471] truncate ml-0.5">@{handle} · 1m</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#536471]" />
            </div>
            
            <p className="text-[14px] leading-normal text-[#0f1419] mt-1 break-words">
              {content}
            </p>
            
            {mediaUrl && (
              <div className="mt-3 rounded-2xl border border-[#edf0f2] overflow-hidden bg-slate-50 aspect-video">
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3 max-w-[90%] text-[#536471]">
              <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0]">
                <div className="p-1 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors"><MessageCircle className="w-4 h-4" /></div>
                <span className="text-[12px]">0</span>
              </div>
              <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#00ba7c]">
                <div className="p-1 group-hover:bg-[#00ba7c]/10 rounded-full transition-colors"><Repeat2 className="w-4 h-4" /></div>
                <span className="text-[12px]">0</span>
              </div>
              <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#f91880]">
                <div className="p-1 group-hover:bg-[#f91880]/10 rounded-full transition-colors"><Heart className="w-4 h-4" /></div>
                <span className="text-[12px]">0</span>
              </div>
              <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0]">
                <div className="p-1 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors"><Share2 className="w-4 h-4" /></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isInstagram) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white border border-[#efefef] rounded-2xl overflow-hidden shadow-sm font-sans text-left"
      >
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
              <div className="w-full h-full rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="font-bold text-[10px]">R</div>}
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#262626]">{handle}</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-[#262626]" />
        </div>
        
        <div className="aspect-square bg-[#fafafa] flex items-center justify-center border-y border-[#efefef]">
          {mediaUrl ? (
            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="p-10 text-center space-y-2 opacity-30">
              <FaInstagram className="w-10 h-10 mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Image missing</p>
            </div>
          )}
        </div>
        
        <div className="p-3 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-[#262626]">
              <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer" />
              <MessageCircle className="w-6 h-6 hover:text-gray-500 cursor-pointer" />
              <Send className="w-6 h-6 hover:text-gray-500 cursor-pointer" />
            </div>
            <Bookmark className="w-6 h-6 hover:text-gray-500 cursor-pointer shadow-none" />
          </div>
          
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-[#262626]">0 likes</p>
            <div className="text-[13px] leading-tight text-[#262626]">
              <span className="font-bold mr-2">{handle}</span>
              <span className="font-medium whitespace-pre-wrap">{content}</span>
            </div>
            <p className="text-[11px] text-[#8e8e8e] mt-1 font-medium uppercase tracking-tight">1 minute ago</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // LinkedIn / Facebook (Default Professional)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border border-[#e3e8ef] rounded-2xl p-4 shadow-sm font-sans text-left"
    >
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-[#e3e8ef]">
           {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="font-bold text-[18px] text-[#1a1f36]">R</div>}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-bold text-[#1a1f36] leading-tight flex items-center gap-1.5 truncate">
            {username}
            <span className="text-[11px] font-bold text-[#8792a2]">· 1st</span>
          </h4>
          <p className="text-[11px] text-[#8792a2] truncate">Leading the future of resort hospitality</p>
          <p className="text-[10px] text-[#8792a2] flex items-center gap-1 mt-0.5">
            1m · <span className="text-[12px]">🌐</span>
          </p>
        </div>
        <MoreHorizontal className="w-4 h-4 text-[#8792a2]" />
      </div>
      
      <p className="text-[13px] text-[#1a1f36] leading-relaxed mb-4 whitespace-pre-wrap">
        {content}
      </p>
      
      {mediaUrl && (
        <div className="rounded-xl border border-[#e3e8ef] overflow-hidden bg-slate-50 -mx-4">
          <img src={mediaUrl} alt="Preview" className="w-full object-cover max-h-[300px]" />
        </div>
      )}
      
      <div className="flex items-center gap-1.5 py-2 mt-2 border-t border-[#f0f3f7] grayscale opacity-40">
        <div className="flex -space-x-1">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-white" />
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-white" />
        </div>
        <span className="text-[10px] font-bold text-[#8792a2]">0 analytics</span>
      </div>
    </motion.div>
  );
}
