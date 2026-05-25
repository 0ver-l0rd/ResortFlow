"use client";

import React, { useState, useEffect } from "react";
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
  Globe,
  ArrowUpRight,
  MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Connect to Your Hotel System",
    desc: "We connect directly to your hotel software so you always know which rooms are free.",
    icon: Globe,
    roi: "+22% Income",
    color: "text-[#2d6a4f]",
    bg: "bg-[#2d6a4f]/10",
  },
  {
    title: "Happy Guest Tracker",
    desc: "Our AI watches what guests say about you online to make sure your hotel looks great.",
    icon: MessageSquare,
    roi: "98% Positive",
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
  },
  {
    title: "Profit Guard",
    desc: "We automatically start new ads if you have too many empty rooms.",
    icon: ShieldCheck,
    roi: "-15% Empty Rooms",
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
  },
  {
    title: "Smart Future Planning",
    desc: "We guess how many guests are coming and put your ads on the best websites.",
    icon: BarChart3,
    roi: "5x Ad Return",
    color: "text-[#e1306c]",
    bg: "bg-[#fdf0f5]",
  }
];

export function Solution() {
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveMetric(prev => (prev + 1) % 7);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="solution" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Stripe-Level Background Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e3e8ef] to-transparent" />
      <div className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-[#2d6a4f05] blur-[180px] -z-10 rounded-full" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Modern 2-Column Header Alignment (Stripe Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 md:mb-20 items-end">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] mb-8"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Save Time & Work</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[40px] md:text-[62px] font-black text-[#1a1f36] leading-[1.02] tracking-[-0.04em]"
              >
                One Simple Tool for Your <br />
                <span className="text-[#2d6a4f]">Whole Hotel.</span>
              </motion.h2>
            </div>
            <div className="lg:col-span-1" /> {/* Spacer */}
            <div className="lg:col-span-4">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-[#3c4257] font-semibold leading-relaxed opacity-90 max-w-lg tracking-tight"
              >
                Replace all your old tools with one smart assistant that handles your bookings, guests, and social media at once.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Left Column: Refined Bento Features */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                 {features.map((feat, i) => (
                   <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="p-8 rounded-[2rem] border border-[#f0f3f7] bg-white hover:border-[#2d6a4f]/20 hover:shadow-[0_45px_70px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden"
                   >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm", feat.bg)}>
                         <feat.icon className={cn("w-5.5 h-5.5", feat.color)} />
                      </div>
                      <div className="absolute top-8 right-8 px-2.5 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] text-[9px] font-black text-[#1a1f36] shadow-sm tracking-widest uppercase">
                         {feat.roi}
                      </div>
                      <h4 className="text-[17px] font-bold text-[#1a1f36] mb-3 tracking-tight">{feat.title}</h4>
                      <p className="text-[14px] text-[#697386] font-medium leading-relaxed opacity-90">
                         {feat.desc}
                      </p>
                      <div className="mt-8 flex items-center gap-1.5 text-[11px] font-black text-[#2d6a4f] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                         See How it Works <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                   </motion.div>
                 ))}
              </div>
            </div>

            {/* Right Column: Stripe-Level RevPAR Growth Engine */}
            <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="relative group/mockup perspective-2000">
                    {/* Animated Background Aura */}
                    <div className="absolute -inset-20 bg-[radial-gradient(circle_at_center,#2d6a4f10_0%,transparent_70%)] blur-[100px] animate-pulse pointer-events-none" />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative rounded-[3rem] bg-[#fcfdfe] p-2.5 lg:p-4 border border-[#e3e8ef] shadow-[0_50px_100px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                        <div className="bg-white rounded-[2.2rem] overflow-hidden border border-[#e3e8ef] shadow-sm relative">
                            {/* Dashboard UI Top Bar */}
                            <div className="px-6 py-5 border-b border-[#f0f3f7] flex items-center justify-between bg-[#fcfdfe]/50 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#2d6a4f]/10 flex items-center justify-center">
                                        <TrendingUp className="w-4.5 h-4.5 text-[#2d6a4f]" />
                                    </div>
                                    <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Income Manager</span>
                                </div>
                                <div className="flex gap-2.5">
                                    <div className="h-2 w-12 bg-[#f0f3f7] rounded-full" />
                                    <div className="h-2 w-8 bg-[#f0f3f7] rounded-full" />
                                </div>
                            </div>

                            {/* Main Animated Visualization Area */}
                            <div className="p-10 space-y-12 min-h-[420px] relative">
                                {/* The "AI Beam" Scanning Effect */}
                                <motion.div 
                                    animate={{ top: ['5%', '95%', '5%'] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#2d6a4f]/40 to-transparent z-10 pointer-events-none blur-[1px]"
                                />

                                {/* Floating Progress Metrics */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[#8792a2] uppercase tracking-[0.2em] leading-none">Price per Night</p>
                                            <h3 className="text-2xl font-black text-[#1a1f36] tracking-tighter">Higher Room Prices</h3>
                                        </div>
                                        <motion.div 
                                            animate={{ scale: [1, 1.05, 1] }} 
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-4 py-2 rounded-2xl bg-[#efffee] border border-[#09825d]/10 flex items-center gap-2 shadow-sm"
                                        >
                                            <ArrowUpRight className="w-4 h-4 text-[#09825d]" />
                                            <span className="text-[15px] font-black text-[#09825d] tabular-nums tracking-tighter">+14.2%</span>
                                        </motion.div>
                                    </div>

                                    {/* Breathing Bar Chart (Multi-Sequence) */}
                                    <div className="flex items-end justify-between gap-4 h-44 pt-6">
                                        {[40, 75, 45, 100, 65, 85, 95, 75, 85].map((h, i) => (
                                            <div key={i} className="flex-1 relative group/bar h-full flex flex-col justify-end">
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    transition={{ 
                                                        delay: i * 0.08, 
                                                        duration: 1.5, 
                                                        ease: [0.16, 1, 0.3, 1]
                                                    }}
                                                    className={cn(
                                                        "w-full rounded-t-xl transition-all duration-700 relative",
                                                        i === activeMetric 
                                                            ? "bg-gradient-to-t from-[#2d6a4f] to-[#a29bfe] shadow-[0_10px_25px_rgba(99,91,255,0.25)]" 
                                                            : "bg-[#f6f9fc] group-hover/bar:bg-[#f0f3f7]"
                                                    )}
                                                >
                                                    {i === activeMetric && (
                                                        <motion.div 
                                                           layoutId="data-bubble"
                                                           className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[#1a1f36] text-white text-[10px] font-black shadow-2xl z-30 whitespace-nowrap"
                                                        >
                                                           ${(h * 3.4).toFixed(1)} / Night
                                                           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#1a1f36]" />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                                <div className="h-1 mt-3 w-1/2 mx-auto rounded-full bg-[#f0f3f7]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Optimization Log (Sync with Metric) */}
                                <div className="pt-10 border-t border-[#f0f3f7] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-6 h-6 rounded-full border-2 border-[#2d6a4f]/10 border-t-[#2d6a4f] animate-spin" />
                                            <Zap className="absolute inset-0 m-auto w-3 h-3 text-[#2d6a4f]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.2em] leading-none mb-1">Smart Assistant</span>
                                            <AnimatePresence mode="wait">
                                                <motion.span 
                                                    key={activeMetric}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="text-[11px] text-[#8792a2] font-semibold"
                                                >
                                                    {activeMetric % 2 === 0 ? "Increasing room prices for you..." : "Finding more guests for your rooms..."}
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map((i) => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-black text-[8px] text-[#424770] shadow-sm">
                                                P{i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Floating Asset */}
                        <motion.div 
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 1 }}
                           className="absolute top-20 -left-16 z-30 p-5 rounded-[1.5rem] bg-white shadow-premium border border-[#f0f3f7] hidden xl:flex items-center gap-4 transition-transform hover:scale-105 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#2d6a4f08] flex items-center justify-center text-[#2d6a4f] shadow-inner">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-[#8792a2] uppercase tracking-[0.2em] leading-none mb-1">Market Position</p>
                               <p className="text-[15px] font-black text-[#1a1f36] tracking-tight">Market Leader</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
