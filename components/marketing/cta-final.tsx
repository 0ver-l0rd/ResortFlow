"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#f6f9fc] relative overflow-hidden">
      {/* High-Fidelity Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#635bff08_0%,transparent_50%)]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#635bff]/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-[#1a1f36] rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-indigo-900/20 group">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#635bff] to-[#a29bfe] opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
          <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
             <Sparkles className="w-64 h-64 text-white" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-[44px] md:text-[72px] font-black text-white leading-[1.02] tracking-[-0.04em] mb-10"
            >
              Ready to Grow Your Hotel <br />
              <span className="italic opacity-80">on its Own?</span>
            </motion.h2>

            <p className="text-xl md:text-2xl text-white/70 font-semibold mb-14 max-w-2xl mx-auto tracking-tight">
              Start using your AI assistant today and see the difference in your bookings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <SignUpButton mode="modal">
                <Button className="h-16 px-12 text-[18px] bg-white hover:bg-slate-50 text-[#1a1f36] font-black rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Get Started Free
                </Button>
              </SignUpButton>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1f36] bg-slate-200" />
                  ))}
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Join 150+ Top Hotels</span>
              </div>
            </div>
          </div>

          {/* Floating Brand Icons for Context */}
          <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 space-y-8 opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-1000">
             <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
             </div>
             <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center translate-x-12">
                <ArrowRight className="w-14 h-14 text-white" />
             </div>
             <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
             </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">
             Trusted by 500+ Luxury Resort Properties Worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
