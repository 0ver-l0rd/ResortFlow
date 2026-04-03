"use client";

import React from "react";
import { 
  Sparkles, 
  Target, 
  Zap, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  Search,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "PMS Real-time Sync",
    desc: "Direct integration with your Property Management System for instant occupancy updates.",
    icon: Globe,
    roi: "+22% RevPAR",
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/10",
  },
  {
    title: "Guest Sentiment AI",
    desc: "Autonomous monitoring of mentions and reviews to maintain your resort's elite reputation.",
    icon: MessageSquare,
    roi: "98% Positive",
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
  },
  {
    title: "RevPAR Shield",
    desc: "Automatically launches recovery campaigns when booking velocity dips below targets.",
    icon: ShieldCheck,
    roi: "-15% Vacancy",
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
  },
  {
    title: "Predictive Analytics",
    desc: "Forecasts future demand and adjusts marketing spend across 9+ global platforms.",
    icon: BarChart3,
    roi: "5.2x ROAS",
    color: "text-[#e1306c]",
    bg: "bg-[#fdf0f5]",
  }
];

export function Solution() {
  return (
    <section id="solution" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#635bff]/5 to-transparent -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#635bff]/10 border border-[#635bff]/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#635bff]" />
                <span className="text-[11px] font-black text-[#635bff] uppercase tracking-widest">Growth Intelligence</span>
              </div>
              <h2 className="text-[40px] md:text-[64px] font-black text-[#1a1f36] leading-[1.05] tracking-tight">
                One Agent for Your <br />
                <span className="text-[#635bff]">Entire Resort Growth.</span>
              </h2>
            </div>
            <p className="text-xl text-[#3c4257] font-medium leading-relaxed opacity-80 max-w-md">
              Replace fragmented tools with a single autonomous agent that deeply understands your resort’s inventory and guest sentiment.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Left Column: Bento Features */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                 {features.map((feat, i) => (
                   <div 
                      key={i} 
                      className="p-8 rounded-[2.5rem] border border-black/5 bg-[#f8fafc] hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden"
                   >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feat.bg)}>
                         <feat.icon className={cn("w-7 h-7", feat.color)} />
                      </div>
                      <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-white border border-black/5 text-[10px] font-black text-[#1a1f36] shadow-sm tracking-tight">
                         {feat.roi}
                      </div>
                      <h4 className="text-lg font-black text-[#1a1f36] mb-3">{feat.title}</h4>
                      <p className="text-sm text-[#8792a2] font-semibold leading-relaxed">
                         {feat.desc}
                      </p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Right Column: Preview Mockup (Internal Animations Preserved) */}
            <div className="flex-1 w-full relative order-1 lg:order-2">
               <div className="absolute inset-x-0 -inset-y-16 bg-gradient-to-tr from-[#635bff]/20 to-[#80e9ff]/10 blur-[120px] opacity-40 -z-10" />
               <div 
                 className="relative rounded-[3rem] bg-white p-4 border border-black/5 shadow-2xl overflow-hidden group/mockup"
               >
                  <div className="aspect-[4/3] rounded-[2.5rem] bg-[#f8fafc] border border-black/5 overflow-hidden relative">
                     <div className="absolute top-0 inset-x-0 h-12 bg-white border-b border-black/5 flex items-center px-6 justify-between">
                        <div className="flex gap-1.5">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                        </div>
                        <div className="w-32 h-4 bg-slate-100 rounded-full" />
                        <div className="w-5 h-5 rounded-full bg-slate-100" />
                     </div>
                     
                     <div className="p-8 mt-12 space-y-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em]">Live Intelligence</p>
                              <p className="text-xl font-black text-[#1a1f36]">RevPAR Growth Engine</p>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-[#635bff]/10 flex items-center justify-center text-[#635bff]">
                              <TrendingUp className="w-6 h-6" />
                           </div>
                        </div>
                        
                        <div className="h-32 flex items-end gap-2 pb-2">
                           {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                             <motion.div 
                               key={i}
                               initial={{ height: 0 }}
                               animate={{ height: `${h}%` }}
                               transition={{ delay: i * 0.1, duration: 1 }}
                               className="flex-1 bg-[#635bff] rounded-t-lg opacity-80"
                             />
                           ))}
                        </div>
                        <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-[#8792a2]" />
                              <span className="text-[10px] font-black text-[#8792a2] uppercase tracking-widest">Optimizing Inventory...</span>
                           </div>
                           <div className="flex -space-x-2">
                              {[1,2,3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
