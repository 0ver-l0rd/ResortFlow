"use client";

import React, { useRef } from "react";
import { 
  Target, 
  Zap, 
  Sparkles,
  Globe,
  Link2,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

export function HowItWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const steps = [
    {
      step: "01",
      title: "Connect Your Hotel System",
      desc: "Connect your hotel software in seconds. Our AI starts learning about your rooms and guests right away.",
      icon: Link2,
      color: "text-[#635bff]",
      label: "Everything Connected"
    },
    {
      step: "02",
      title: "Set Your Goals",
      desc: "Tell the AI what you want to do—get more guests, sell big rooms, or help with a holiday sale.",
      icon: Target,
      color: "text-[#f5a623]",
      label: "Smart Goal"
    },
    {
      step: "03",
      title: "AI Makes Your Posts",
      desc: "The AI makes beautiful photos and writes posts that fit your hotel and what guests want right now.",
      icon: Sparkles,
      color: "text-[#09825d]",
      label: "Photo Maker"
    },
    {
      step: "04",
      title: "Start & Grow",
      desc: "Your posts go live everywhere. The AI watches them and makes changes to help you earn more money.",
      icon: Zap,
      color: "text-[#635bff]",
      label: "Working Now"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e3e8ef] to-transparent" />
      <div className="absolute -top-[10%] right-[-5%] w-[600px] h-[600px] bg-[#635bff03] blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ef] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#635bff]" />
            <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-[0.2em]">Simple Steps</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[40px] md:text-[60px] font-black tracking-[-0.04em] text-[#1a1f36] leading-[1.05] mb-8"
          >
            How It Works. <br />
            <span className="text-[#635bff]">Simple & Smart.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[#3c4257] font-semibold max-w-2xl mx-auto leading-relaxed opacity-90 tracking-tight"
          >
            Get your hotel marketing running in four easy steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-7xl mx-auto">
          {steps.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col group relative"
            >
              <div className="mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#e3e8ef] flex items-center justify-center shadow-premium-subtle group-hover:border-[#635bff]/30 transition-all duration-500 relative z-10">
                   <item.icon className={cn("w-7 h-7", item.color)} />
                </div>
                {/* Connector Line (Desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-16 w-full h-[1px] border-t border-dashed border-[#e3e8ef] -z-10" />
                )}
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-white border border-[#e3e8ef] flex items-center justify-center font-black text-[10px] text-[#8792a2] z-20">
                  {item.step}
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-flex px-2 py-0.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ef]">
                   <span className="text-[8px] font-black text-[#1a1f36] uppercase tracking-widest">{item.label}</span>
                </div>
                <h3 className="text-xl font-black text-[#1a1f36] tracking-tight">{item.title}</h3>
                <p className="text-[15px] text-[#424770] font-medium leading-relaxed opacity-80">
                  {item.desc}
                </p>
              </div>

              {/* Mobile Arrow */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center py-8">
                  <ArrowRight className="w-5 h-5 text-[#e3e8ef]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
