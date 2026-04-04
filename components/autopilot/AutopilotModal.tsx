"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, ArrowRight, Zap, Target, Loader2, CheckCircle2, MessageSquare, ChevronRight, X, Brain, Globe, CreditCard, Calendar, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AutopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: string;
}

const GOAL_SUGGESTIONS = [
  "Fill hotel rooms this weekend",
  "Promote seasonal spa deals",
  "Recover abandoned bookings",
  "Viral brand engagement push",
];

type PlanResponse = {
  predictedRevenue: {
    low: number;
    mid: number;
    high: number;
  };
  posts: Array<{
    platform: string;
    content: string;
    scheduledAt: string;
  }>;
  whatsappMessage?: {
    text: string;
    recipientCount?: number;
  };
};

export function AutopilotModal({ isOpen, onClose, initialGoal }: AutopilotModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "planning" | "preview">("input");
  const [goal, setGoal] = useState("");
  const [planningStatus, setPlanningStatus] = useState("Initializing AI...");
  const [plan, setPlan] = useState<PlanResponse | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("input");
        setGoal("");
        setPlan(null);
      }, 300);
    } else if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [isOpen, initialGoal]);

  const handlePlanMyCampaign = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal first.");
      return;
    }
    setStep("planning");
    setPlanningStatus("Analyzing past performance...");

    try {
      const response = await fetch("/api/autopilot/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to start planning");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let finalPlan = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.status) setPlanningStatus(data.status);
            } catch (e) {}
          }
        }
        
        const matches = chunk.match(/event: plan\ndata: (.*)/);
        if (matches && matches[1]) {
          finalPlan = JSON.parse(matches[1]);
          setPlan(finalPlan);
          setStep("preview");
          break;
        }
      }
      
      if (!finalPlan) {
          toast.error("Planning failed to return a proper format.");
          setStep("input");
      }
    } catch (error) {
      toast.error("Something went wrong with planning.");
      setStep("input");
    }
  };

  const handleLaunchCampaign = async () => {
    const loadingToast = toast.loading("Deploying campaign to all channels...");
    try {
      const res = await fetch("/api/autopilot/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, plan }),
      });
      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Campaign launched successfully!", {
            icon: <CheckCircle2 className="w-4 h-4 text-[#09825d]" />,
        });
        onClose();
        router.refresh();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to launch campaign.");
      }
    } catch (error) {
       toast.dismiss(loadingToast);
       toast.error("An error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <DialogHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 text-[#635bff] mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#635bff]/10 flex items-center justify-center shadow-sm border border-[#635bff]/20">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-extrabold tracking-tight text-[#1a1f36]">Set your mission</DialogTitle>
                    <p className="text-[14px] font-medium text-[#697386] mt-1">
                      Gemini Agent will optimize your social strategy for growth.
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-8 py-4 space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#635bff]/20 to-[#4f46e5]/10 rounded-[20px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                  <textarea
                    value={goal}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.metaKey) handlePlanMyCampaign();
                    }}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., We have a few empty suites this weekend. Let's create a flash sale for 20% off to drive bookings."
                    className="relative w-full h-40 p-5 rounded-[18px] border border-[#e3e8ef] bg-[#fcfdfe] focus:bg-white focus:border-[#635bff] focus:ring-0 outline-none transition-all resize-none text-[15px] font-medium text-[#1a1f36] placeholder:text-[#8792a2] leading-relaxed shadow-inner"
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-[#8792a2] uppercase tracking-[0.1em]">
                    ⌘ + Enter to plan
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-widest px-1">Campaign blueprints</p>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setGoal(suggestion)}
                        className="px-4 py-2 text-[12px] font-bold rounded-xl bg-[#f6f9fc] text-[#475467] border border-[#e3e8ef] hover:border-[#635bff]/30 hover:bg-[#635bff]/5 hover:text-[#635bff] transition-all shadow-sm active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="p-8 pt-4 bg-[#fcfdfe] border-t border-[#f0f3f7] flex justify-end items-center gap-4">
                <button 
                  onClick={onClose}
                  className="text-sm font-bold text-[#697386] hover:text-[#1a1f36] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlanMyCampaign}
                  disabled={!goal.trim()}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[15px] font-bold text-white shadow-[0_16px_32px_-12px_rgba(99,91,255,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(99,91,255,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #635bff 0%, #443ae0 100%)" }}
                >
                  Generate strategy <ArrowRight className="w-4 h-4" />
                </button>
              </DialogFooter>
            </motion.div>
          )}

          {step === "planning" && (
            <motion.div 
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-16 text-center min-h-[500px] relative overflow-hidden"
            >
               {/* Gemini-like background pulse */}
               <div className="absolute inset-0 z-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#635bff] rounded-full blur-[120px] opacity-10 animate-pulse" />
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="relative w-24 h-24 mx-auto">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180, 270, 360] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-tr from-[#635bff] to-[#4f46e5] rounded-[30%] blur-xl opacity-20"
                    />
                    <div className="relative bg-white rounded-[24px] w-full h-full flex items-center justify-center border border-[#e3e8ef] shadow-2xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/5 to-transparent animate-pulse" />
                      <Sparkles className="w-10 h-10 text-[#635bff] animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-[#1a1f36] tracking-tight">Agent is thinking</h3>
                    <div className="flex flex-col items-center gap-1.5">
                       <p className="text-[14px] font-bold text-[#635bff] px-4 py-1.5 bg-[#635bff]/5 rounded-full border border-[#635bff]/10 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {planningStatus}
                      </p>
                      <p className="text-xs text-[#8792a2] font-semibold uppercase tracking-widest mt-2">Connecting to Real-time API</p>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === "preview" && plan && (
            <motion.div 
               key="preview"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col max-h-[90vh]"
            >
              <DialogHeader className="p-8 border-b border-[#f0f3f7] flext items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                         <div className="w-2 h-2 rounded-full bg-[#09825d] animate-pulse" />
                         <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#09825d]">Strategy verified</p>
                    </div>
                    <DialogTitle className="text-2xl font-extrabold text-[#1a1f36]">Deployment blueprint</DialogTitle>
                </div>
              </DialogHeader>

              <div className="p-8 overflow-y-auto bg-[#fcfdfe] space-y-8 custom-scrollbar">
                 {/* Prediction Card */}
                <div className="bg-white rounded-3xl border border-[#e3e8ef] p-7 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#09825d]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                   
                   <div className="relative">
                      <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-[0.15em] mb-4">Predicted revenue impact</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tighter text-[#1a1f36]">
                          ${plan.predictedRevenue.mid.toLocaleString()}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#09825d] flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Potential ROI
                            </span>
                            <span className="text-xs text-[#697386] font-medium">Estimated payout</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#8792a2]">
                            <span>Conservative: ${plan.predictedRevenue.low.toLocaleString()}</span>
                            <span>Optimistic: ${plan.predictedRevenue.high.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-[#f6f9fc] rounded-full overflow-hidden shadow-inner border border-[#e3e8ef]/50">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "65%" }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-[#09825d] to-[#34d399] rounded-full" 
                            />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Combined Workflow Feed */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between px-1">
                        <p className="text-[11px] font-extrabold text-[#8792a2] uppercase tracking-[0.2em]">Deployment tasks ({plan.posts.length + (plan.whatsappMessage ? 1 : 0)})</p>
                   </div>
                   
                   <div className="grid gap-3">
                      {plan.posts.map((post, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="bg-white rounded-2xl border border-[#e3e8ef] p-5 shadow-sm hover:shadow-md transition-all group border-l-4"
                          style={{ borderLeftColor: post.platform.toLowerCase() === 'instagram' ? '#E1306C' : '#635bff' }}
                        >
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${post.platform.toLowerCase() === 'instagram' ? 'bg-[#E1306C]/5 text-[#E1306C]' : 'bg-[#635bff]/5 text-[#635bff]'}`}>
                                  {post.platform}
                                </span>
                                <span className="text-[10px] font-bold text-[#8792a2] flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                             <div className="w-6 h-6 rounded-lg bg-white border border-[#e3e8ef] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-3 h-3 text-[#c4cdd6]" />
                             </div>
                          </div>
                          <p className="text-[14px] text-[#1a1f36] font-medium leading-relaxed">{post.content}</p>
                        </motion.div>
                      ))}

                      {plan.whatsappMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: plan.posts.length * 0.1 }}
                          className="bg-white rounded-2xl border border-[#e3e8ef] p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#25D366]"
                        >
                          <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#25D366]/5 text-[#25D366]">WhatsApp blast</span>
                                  <span className="text-[10px] font-bold text-[#8792a2]">{plan.whatsappMessage.recipientCount || 0} Segmented contacts</span>
                              </div>
                          </div>
                          <div className="p-4 bg-[#f6fbf8] rounded-xl border border-[#25D366]/10 relative">
                              <p className="text-[13px] text-[#3c4257] font-medium leading-relaxed italic whitespace-pre-wrap">
                                  &quot;{plan.whatsappMessage.text}&quot;
                              </p>
                          </div>
                        </motion.div>
                      )}
                   </div>
                </div>

                {/* Disclaimer */}
                <div className="p-5 rounded-2xl border border-dashed border-[#e3e8ef] bg-[#fcfdfe] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#e3e8ef] flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-[#8792a2]" />
                    </div>
                    <p className="text-[12px] text-[#697386] font-medium">
                        This campaign will utilize your active <span className="text-[#1a1f36] font-bold">Stripe Connect</span> and <span className="text-[#1a1f36] font-bold">Meta Business</span> tokens.
                    </p>
                </div>
              </div>

              <DialogFooter className="p-8 border-t border-[#f0f3f7] bg-white flex justify-between items-center sm:justify-between gap-4">
                <button
                  onClick={() => setStep("input")}
                  className="px-5 py-3 rounded-xl text-[14px] font-bold text-[#697386] hover:text-[#1a1f36] hover:bg-[#f6f9fc] transition-all"
                >
                  Edit strategy
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLaunchCampaign}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl text-[16px] font-bold text-white shadow-[0_20px_40px_-12px_rgba(99,91,255,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.5)] active:scale-[0.98] transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #635bff 0%, #443ae0 100%)" }}
                  >
                    Deploy campaign <Zap className="w-4 h-4 fill-white/20" />
                  </button>
                </div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function TrendingUp({ className }: { className?: string }) {
    return (
        <svg 
          className={className} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
