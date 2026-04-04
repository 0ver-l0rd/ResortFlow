"use client";

import { useState, useEffect } from "react";
import { AutopilotModal } from "@/components/autopilot/AutopilotModal";
import { Zap, Activity, CheckCircle2, AlertCircle, Clock, Plus, Target } from "lucide-react";

interface CampaignsClientProps {
  initialCampaigns: any[];
}

export function CampaignsClient({ initialCampaigns }: CampaignsClientProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-poll metrics for active campaigns
  useEffect(() => {
    const activeIds = campaigns.filter((c: any) => c.status === "active").map((c: any) => c.id);
    if (!activeIds.length) return;

    const interval = setInterval(async () => {
      for (const id of activeIds) {
        try {
          const res = await fetch(`/api/campaigns/${id}/metrics`);
          if (res.ok) {
             const data = await res.json();
             setCampaigns((prev) => prev.map((c: any) => 
               c.id === id ? { ...c, metrics: data } : c
             ));
          }
        } catch (e) {
          // ignore error
        }
      }
    }, 15000); // 15 seconds for testing instead of 30, for faster feedback

    return () => clearInterval(interval);
  }, [campaigns]);

  return (
    <div className="space-y-6">
      {/* Top CTA */}
      <div className="flex justify-end">
         <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] bg-[#2d6a4f] hover:bg-[#1b4332]"
            style={{ background: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)" }}
          >
            <Zap className="w-4 h-4 fill-white/20" /> New Campaign
          </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-[#e3e8ef]">
           <Zap className="w-10 h-10 text-[#c4cdd6] mx-auto mb-4" />
           <h3 className="text-[#1a1f36] font-semibold text-lg">No campaigns yet</h3>
           <p className="text-[#8792a2] text-sm mt-1">Start your first autonomous marketing run to see results here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((camp: any) => {
            const actualRevenue = camp.metrics?.actualRevenue ?? camp.actualRevenue ?? 0;
            const predRevenue = camp.predictedRevenue || 1; // avoid /0
            const percentage = Math.min(100, Math.round((actualRevenue / predRevenue) * 100));

            return (
              <div key={camp.id} className="bg-white rounded-xl border border-[#e3e8ef] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#f0f3f7] flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                         camp.status === 'active' ? 'bg-[#e0f2fe] text-[#0284c7]' : 
                         camp.status === 'completed' ? 'bg-[#efffee] text-[#09825d]' : 'bg-[#fff0f0] text-[#e11d48]'
                       }`}>
                         {camp.status}
                       </span>
                       <span className="text-xs text-[#8792a2]">Started {new Date(camp.createdAt).toLocaleDateString()}</span>
                     </div>
                     <h3 className="text-[#1a1f36] font-bold text-lg max-w-2xl">{camp.goal}</h3>
                   </div>
                   
                   <div className="text-right">
                      <p className="text-xs font-semibold text-[#8792a2] uppercase tracking-wider mb-1">
                        Revenue Target
                      </p>
                      <p className="text-2xl font-bold tracking-tight text-[#09825d]">
                        ${actualRevenue.toLocaleString()} 
                        <span className="text-sm font-medium text-[#8792a2] ml-1">
                          / ${predRevenue.toLocaleString()}
                        </span>
                      </p>
                   </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#f6f9fc]">
                  {/* Progress Bar & High level stats */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-sm font-medium text-[#3c4257]">Goal Progress</span>
                         <span className="text-sm font-bold text-[#1a1f36]">{percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#e3e8ef] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${percentage}%`, 
                            background: "linear-gradient(90deg, #2d6a4f 0%, #09825d 100%)" 
                          }} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-white p-4 rounded-lg border border-[#e3e8ef]">
                         <p className="text-[10px] uppercase font-bold text-[#8792a2] mb-1">Posts</p>
                         <p className="text-xl font-bold text-[#1a1f36]">
                           {camp.metrics?.postsPublished ?? (camp.posts?.filter((p:any) => p.status === 'published').length || 0)}
                           <span className="text-sm font-normal text-[#8792a2]">/{camp.posts?.length || 0}</span>
                         </p>
                       </div>
                       <div className="bg-white p-4 rounded-lg border border-[#e3e8ef]">
                         <p className="text-[10px] uppercase font-bold text-[#8792a2] mb-1">Messages</p>
                         <p className="text-xl font-bold text-[#1a1f36]">{camp.metrics?.messagesSent ?? 0}</p>
                       </div>
                       <div className="bg-white p-4 rounded-lg border border-[#e3e8ef]">
                         <p className="text-[10px] uppercase font-bold text-[#8792a2] mb-1">Bookings</p>
                         <p className="text-xl font-bold text-[#1a1f36]">{Math.floor(actualRevenue / 250)}</p>
                       </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="bg-white rounded-lg border border-[#e3e8ef] p-5 space-y-4">
                     <p className="text-xs uppercase font-bold text-[#8792a2]">Execution Steps</p>
                     
                     <div className="space-y-3">
                         <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-4 h-4 text-[#09825d]" />
                           <span className="text-sm text-[#3c4257]">AI Plan Generated</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                             {camp.status === 'active' ? (
                               <Activity className="w-4 h-4 text-[#0284c7] animate-pulse" />
                             ) : (
                               <CheckCircle2 className="w-4 h-4 text-[#09825d]" />
                             )}
                             <span className={`text-sm ${camp.status === 'active' ? "text-[#1a1f36] font-medium" : "text-[#3c4257]"}`}>Running Social Distribution</span>
                           </div>
                           {camp.status === 'active' && <span className="text-[10px] bg-[#f0f3f7] px-2 py-0.5 rounded text-[#697386]">In progress</span>}
                         </div>
                         {(camp.messages?.length > 0) && (
                           <div className="flex items-center gap-3">
                             <Clock className="w-4 h-4 text-[#f5a623]" />
                             <span className="text-sm text-[#3c4257]">WhatsApp Message Blast</span>
                           </div>
                         )}
                         <div className="flex items-center gap-3 opacity-50">
                           <Target className="w-4 h-4 text-[#8792a2]" />
                           <span className="text-sm text-[#3c4257]">Goal Reached</span>
                         </div>
                     </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      <AutopilotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
