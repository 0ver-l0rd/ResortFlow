"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#635bff]/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#635bff] flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-[#635bff]/20">
             <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-[32px] md:text-[64px] font-black tracking-tight text-[#1a1f36] leading-[1.05] mb-8">
             Ready to let AI <br />
             <span className="text-[#635bff]">Grow Your Resort?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-[#3c4257] font-medium opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
             Join the modern hospitality evolution. Start your autonomous growth journey today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <SignUpButton mode="modal">
                <Button size="lg" className="h-16 px-10 text-lg bg-[#635bff] hover:bg-[#4f46e5] text-white font-black rounded-full shadow-2xl shadow-[#635bff]/30 transition-all hover:scale-105 active:scale-95 border-none">
                   Get Started Free
                   <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
             </SignUpButton>
             <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-2 border-slate-200 text-[#1a1f36] font-black rounded-full hover:bg-slate-50 transition-all">
                Talk to Sales
             </Button>
          </div>

          <p className="mt-10 text-sm font-bold text-slate-400 tracking-wide uppercase">
             No credit card required • 14-day free trial on Growth plan
          </p>
        </div>
      </div>
    </section>
  );
}
