"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Clock, Layers, AlertCircle, XCircle, ZapOff } from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  {
    title: "Low Booking Rates",
    description: "Resorts often struggle with seasonal dips and unoptimized booking funnels that bleed potential revenue.",
    icon: TrendingDown,
    color: "text-[#ff3b30]",
    bg: "bg-[#ff3b30]/5",
    accent: "border-[#ff3b30]/10",
    animation: "trend"
  },
  {
    title: "Manual Marketing Grind",
    description: "Teams spend hours manually posting, replying, and managing campaigns across fragmented platforms.",
    icon: Clock,
    color: "text-[#f5a623]",
    bg: "bg-[#f5a623]/5",
    accent: "border-[#f5a623]/10",
    animation: "clock"
  },
  {
    title: "Disconnected Tools",
    description: "Marketing tools are complex, expensive, and rarely talk to each other, leading to poor guest targeting.",
    icon: Layers,
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/5",
    accent: "border-[#635bff]/10",
    animation: "layers"
  },
];

export function Problem() {
  return (
    <section id="problem" className="py-32 md:py-48 bg-white relative overflow-hidden">
      {/* Stripe-Level Texture & Accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e3e8ef] to-transparent" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Modern Centered Header */}
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff5f5] border border-[#feb2b2]/30 mb-8"
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span className="text-[10px] font-black text-[#ff3b30] uppercase tracking-[0.2em]">The Innovation Gap</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[42px] md:text-[60px] font-black tracking-[-0.035em] text-[#1a1f36] leading-[1.05] mb-8"
          >
            Resort marketing is <br />
            <span className="text-[#8792a2]">broken and disconnected.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-[21px] text-[#424770] font-medium max-w-2xl mx-auto leading-relaxed opacity-90"
          >
            Traditional methods are too slow, too manual, and fail to capture the modern guest's attention.
          </motion.p>
        </div>

        {/* Problem Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto mb-20 px-4">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={cn(
                "p-10 rounded-[2.5rem] border bg-white transition-all duration-500 group relative overflow-hidden",
                "border-[#f0f3f7] hover:border-[#e3e8ef] hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)]"
              )}
            >
              {/* Animated Icon Container */}
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110",
                prob.bg
              )}>
                <prob.icon className={cn("w-7 h-7", prob.color)} />
                
                {/* Micro-Animation Indicators */}
                {prob.animation === 'trend' && (
                    <motion.div 
                        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1"
                    >
                        <XCircle className="w-4 h-4 text-[#ff3b30]" />
                    </motion.div>
                )}
                {prob.animation === 'clock' && (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 m-auto w-10 h-10 border border-dashed border-[#f5a623]/30 rounded-full"
                    />
                )}
                {prob.animation === 'layers' && (
                    <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <ZapOff className="w-10 h-10 text-[#635bff]/10" />
                    </motion.div>
                )}
              </div>

              <h4 className="text-[20px] font-black text-[#1a1f36] mb-4 tracking-tight">{prob.title}</h4>
              <p className="text-[15px] text-[#697386] font-medium leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                {prob.description}
              </p>

              {/* Status Pill */}
              <div className="mt-10 flex items-center gap-2">
                 <div className="h-1 flex-1 bg-[#f0f3f7] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "100%" }}
                        whileInView={{ width: "30%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className={cn("h-full", i === 0 ? "bg-[#ff3b30]" : i === 1 ? "bg-[#f5a623]" : "bg-[#635bff]")}
                    />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#8792a2]">Inefficiency Level</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modern Bottom Accent */}
        <div className="flex flex-col items-center opacity-40">
            <div className="w-px h-20 bg-gradient-to-b from-[#e3e8ef] to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1a1f36] mt-4">Legacy Friction Points</span>
        </div>
      </div>
    </section>
  );
}
