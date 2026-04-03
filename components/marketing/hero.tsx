"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-cyan-300 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[50%] h-[30%] bg-purple-200 rounded-full blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-600 text-sm font-bold mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Social Media Management
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
          >
            Manage all your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
              Social Media
            </span> <br />
            in one place
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground mb-12 font-medium leading-relaxed"
          >
            Empower your brand with AI. Schedule, engage, and grow across Instagram, YouTube, TikTok, and more—all from a single, unified interface.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <SignUpButton mode="modal">
              <Button size="lg" className="h-16 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Start your free trial
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </SignUpButton>
            <Button variant="ghost" size="lg" className="h-16 px-10 text-lg font-bold text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-2xl transition-all">
              <PlayCircle className="mr-2 w-6 h-6" />
              Watch a quick demo
            </Button>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 relative"
          >
            <div className="relative mx-auto rounded-[2rem] p-2 bg-gradient-to-b from-white/80 to-white/20 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm overflow-hidden ring-1 ring-black/5">
              <div className="aspect-[16/10] rounded-[1.5rem] bg-slate-50 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50" />
                <div className="z-10 grid grid-cols-12 gap-4 w-full h-full p-8 opacity-40">
                  <div className="col-span-3 space-y-4">
                    <div className="h-2 w-full bg-indigo-200 rounded-full" />
                    <div className="h-32 w-full bg-slate-100 rounded-2xl border border-slate-200" />
                    <div className="h-32 w-full bg-slate-100 rounded-2xl border border-slate-200" />
                  </div>
                  <div className="col-span-9 space-y-4">
                    <div className="h-12 w-full bg-slate-100 rounded-2xl border border-slate-200" />
                    <div className="h-full w-full bg-white rounded-3xl border border-slate-200 shadow-sm" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-8 rounded-3xl glass backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-white fill-white" />
                      </div>
                      <span className="font-bold text-indigo-900">Interactive Preview</span>
                   </div>
                </div>
              </div>
            </div>
            {/* Soft shadow background */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-indigo-400/20 blur-[100px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
