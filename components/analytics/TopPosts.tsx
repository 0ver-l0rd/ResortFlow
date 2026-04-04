"use client";

import React from "react";
import { MessageSquare, Heart, Share2, BarChart2, Sparkles, Loader2, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

const PLATFORM_ICONS: Record<string, any> = {
  "Instagram": { icon: FaInstagram, color: "#E1306C" },
  "Twitter / X": { icon: FaXTwitter, color: "#000000" },
  "Twitter": { icon: FaXTwitter, color: "#000000" },
  "LinkedIn": { icon: FaLinkedinIn, color: "#0077B5" },
  "YouTube": { icon: FaYoutube, color: "#FF0000" },
  "Facebook": { icon: FaFacebook, color: "#1877F2" },
  "TikTok": { icon: FaTiktok, color: "#000000" },
  "Pinterest": { icon: FaPinterest, color: "#BD081C" },
};

export function TopPosts() {
  const queryClient = useQueryClient();
  const [showSimulated, setShowSimulated] = React.useState(true);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["top-posts"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/top-posts");
      if (!response.ok) throw new Error("Failed to fetch top posts");
      return response.json();
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/social/sync", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({ platform: "twitter" }), // Default to twitter for now
      });
      if (!response.ok) throw new Error("Sync failed");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["top-posts"] });
      toast.success(`Sync complete! Found ${data.results?.[0]?.count || 0} recent posts.`);
    },
    onError: () => {
      toast.error("Failed to sync history. Please check your connections.");
    }
  });

  const filteredPosts = posts.filter((p: any) => {
    const isSim = p.isSimulated || p.error === "SIMULATED_SUCCESS";
    return showSimulated ? true : !isSim;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#e2e8f0] p-12 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_8px_40px_-12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-6 h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-[#e2e8f0]">
             <Loader2 className="w-8 h-8 text-[#635bff] animate-spin" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#635bff] flex items-center justify-center shadow-lg animate-pulse">
             <Zap className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-[#1a1f36]">Aggregating Intelligence...</h4>
          <p className="text-[10px] text-[#8792a2] font-bold uppercase tracking-[0.2em]">Cross-Platform Syncing Active</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-[#e2e8f0] p-12 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_8px_40px_-12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-6 h-[400px]">
        <div className="w-16 h-16 rounded-3xl bg-[#f8fafc] flex items-center justify-center shadow-inner border border-[#e2e8f0]">
            <Sparkles className="w-8 h-8 text-[#635bff]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#1a1f36]">Broadcast your first message</h3>
          <p className="text-sm font-medium text-[#8792a2] max-w-[280px] mx-auto leading-relaxed">
            Your top performing content will appear here once you start sharing with your audience.
          </p>
        </div>
        <button 
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#635bff] text-white text-xs font-bold shadow-lg hover:bg-[#5a51e6] transition-all disabled:opacity-50"
        >
          {syncMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Import Existing History
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-[#e2e8f0] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_12px_60px_-12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700">
      <div className="px-8 py-7 border-b border-[#f1f4f9] flex items-center justify-between bg-gradient-to-r from-white to-[#f8fafc]">
        <div>
          <h3 className="text-lg font-bold text-[#1a1f36] tracking-tight">Post Intelligence</h3>
          <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em] mt-1">Live Engagement Matrix</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowSimulated(!showSimulated)}
             className={cn(
               "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider",
               showSimulated 
                 ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm" 
                 : "bg-[#f8fafc] border-[#e2e8f0] text-[#8792a2]"
             )}
           >
             <Zap className={cn("w-3 h-3", showSimulated ? "text-amber-500 fill-amber-500" : "text-slate-400")} />
             {showSimulated ? "Demo Mode: On" : "Show Simulations"}
           </button>
           <div className="w-px h-6 bg-slate-100" />
           <button 
             onClick={() => syncMutation.mutate()}
             disabled={syncMutation.isPending}
             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2e8f0] hover:bg-white hover:shadow-sm transition-all group disabled:opacity-50"
           >
             <RefreshCw className={cn("w-3.5 h-3.5 text-[#635bff] transition-transform group-hover:rotate-180 duration-500", syncMutation.isPending && "animate-spin")} />
             <span className="text-[10px] font-bold text-[#3c4257] uppercase tracking-wider">Sync History</span>
           </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#f1f4f9]">
              <th className="px-8 py-4 text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em]">Broadcast Details</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em]">Platform</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em] text-center">Score</th>
              <th className="px-8 py-4 text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.2em] text-right">Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f4f9]">
            {filteredPosts.map((post: any, idx: number) => {
                const platformInfo = PLATFORM_ICONS[post.platform] || { icon: Sparkles, color: "#635bff" };
                const Icon = platformInfo.icon;
                const isSimulated = post.isSimulated || post.error === "SIMULATED_SUCCESS";
                
                return (
                  <motion.tr 
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[#f6f9fc]/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4 max-w-[400px]">
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <div className="relative shrink-0 group/media">
                            <img 
                              src={post.mediaUrls[0]} 
                              alt="Post media" 
                              className="w-12 h-12 rounded-xl object-cover border border-[#e2e8f0] shadow-sm group-hover/media:scale-105 transition-transform duration-300"
                            />
                            {post.mediaUrls.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-[#635bff] text-white text-[8px] font-black px-1 rounded-md border-2 border-white shadow-sm">
                                +{post.mediaUrls.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#1a1f36] truncate group-hover:text-[#635bff] transition-colors leading-[1.6]">
                              {post.content}
                            </p>
                            {isSimulated && (
                              <span 
                                title="This post was simulated in Demo Mode because API credits were depleted or a connection was unavailable. Content it validated but not broadcast."
                                className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-black uppercase tracking-tighter cursor-help hover:bg-amber-100 transition-colors"
                              >
                                Simulated
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">{post.date}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-200" />
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-wider",
                               isSimulated ? "text-amber-500" : "text-emerald-500"
                             )}>
                               {isSimulated ? "Demo Active" : "High Velocity"}
                             </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 transition-transform group-hover:scale-110 duration-500"
                          style={{ backgroundColor: `${platformInfo.color}08` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: platformInfo.color }} />
                        </div>
                        <span className="text-[11px] font-bold text-[#3c4257] uppercase tracking-wider">{post.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#efffee] border border-[#09825d]/10 text-[#09825d] text-[11px] font-bold shadow-sm">
                        <Zap className="w-3.5 h-3.5 fill-[#09825d]" />
                        {post.engagement}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-6 text-[#8792a2]">
                        <div className="flex items-center gap-1.5 group/stat">
                          <Heart className="w-4 h-4 transition-colors group-hover/stat:text-pink-500" />
                          <span className="text-[11px] font-bold text-[#1a1f36]">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat">
                          <MessageSquare className="w-4 h-4 transition-colors group-hover/stat:text-[#635bff]" />
                          <span className="text-[11px] font-bold text-[#1a1f36]">{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat">
                          <Share2 className="w-4 h-4 transition-colors group-hover/stat:text-emerald-500" />
                          <span className="text-[11px] font-bold text-[#1a1f36]">{post.shares}</span>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
