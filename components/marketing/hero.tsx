"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { InteractivePreview } from "./InteractivePreview";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#f6f9fc]">
      {/* Stripe-style Mesh Gradient Background */}
      <div className="absolute top-0 inset-x-0 h-[1000px] -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-[#7a73ff] rounded-full blur-[120px] opacity-[0.15] animate-pulse" />
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-[#80e9ff] rounded-full blur-[120px] opacity-[0.15]" />
        <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[40%] bg-[#ffe1ff] rounded-full blur-[120px] opacity-[0.1]" />
      </div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 shadow-sm mb-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#3c4257] uppercase tracking-wider pl-1">
                Trusted by 2,000+ creators
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[44px] md:text-[84px] font-black tracking-[-0.03em] text-[#1a1f36] leading-[0.95] mb-8"
            >
              The intelligence layer for <br />
              <span className="text-[#635bff] relative">
                social growth
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#635bff]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-[#3c4257] mb-10 font-medium leading-relaxed opacity-80"
            >
              Scale your digital footprint with AI-driven automation. Compose, schedule, and analyze your performance across every platform from one executive dashboard.
            </motion.p>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <SignUpButton mode="modal">
                <Button size="lg" className="h-14 px-8 text-[15px] bg-[#635bff] hover:bg-[#4f46e5] text-white font-bold rounded-full shadow-xl shadow-[#635bff]/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none">
                  Start scaling now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </SignUpButton>
              <Button variant="ghost" size="lg" className="h-14 px-8 text-[15px] font-bold text-[#3c4257] hover:text-[#1a1f36] hover:bg-white/50 rounded-full transition-all">
                Contact sales
              </Button>
            </motion.div>
          </div>

          {/* Hero Visual - Premium Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Floating UI Elements */}
            <div className="absolute -top-12 -left-12 z-20 hidden lg:block">
               <motion.div 
                 animate={{ y: [0, -10, 0] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="p-4 rounded-2xl bg-white shadow-2xl border border-black/5 flex items-center gap-4"
               >
                 <div className="w-10 h-10 rounded-full bg-[#efffee] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#09825d]" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-[#8792a2] uppercase tracking-wider">Growth Rate</p>
                    <p className="text-lg font-bold text-[#1a1f36]">+142%</p>
                 </div>
               </motion.div>
            </div>

            <div className="absolute -bottom-8 -right-12 z-20 hidden lg:block">
               <motion.div 
                 animate={{ y: [0, 10, 0] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="p-5 rounded-2xl bg-white shadow-2xl border border-black/5 flex flex-col gap-3 min-w-[200px]"
               >
                 <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#635bff]/10 flex items-center justify-center">
                       <Zap className="w-4 h-4 text-[#635bff]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#09825d] bg-[#efffee] px-2 py-0.5 rounded-full">AI Active</span>
                 </div>
                 <p className="text-xs font-bold text-[#3c4257]">Optimization Complete</p>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[#635bff]" />
                 </div>
               </motion.div>
            </div>

            {/* Main Interactive Preview Container */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-x-0 -inset-y-12 bg-gradient-to-tr from-[#635bff]/20 to-[#80e9ff]/10 blur-[120px] opacity-40 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-[2.5rem] bg-white/40 p-2 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden backdrop-blur-3xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-1000">
                <InteractivePreview />
              </div>
            </div>
            
            {/* Soft Shadow Base */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[95%] h-32 bg-[#635bff]/10 blur-[140px] -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Feature Badges Container */}
      <div className="container mx-auto px-6 mt-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { icon: CheckCircle2, label: "Multi-Platform Sync" },
             { icon: Sparkles, label: "AI Content Studio" },
             { icon: TrendingUp, label: "Growth Intelligence" },
             { icon: Zap, label: "Auto-Pilot Engagement" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 opacity-60">
                <item.icon className="w-5 h-5 text-[#635bff]" />
                <span className="text-sm font-bold text-[#1a1f36]">{item.label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
