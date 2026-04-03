"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-background animate-gradient" />
      
      {/* Floating Orbs for extra premium feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-500 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          ✦ AI-Powered Social Media Management
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Manage All Your <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent">
            Social Media
          </span> <br className="hidden md:block" />
          In One Place
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          Connect Instagram, YouTube, TikTok, LinkedIn and more. Compose once, 
          publish everywhere — with AI-powered scheduling and auto-replies.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 text-white border-none shadow-xl shadow-purple-500/20 font-bold rounded-2xl group transition-all hover:scale-105 active:scale-95">
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-border bg-background/50 backdrop-blur-sm hover:bg-muted font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
            <PlayCircle className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Hero Visual (Placeholder or decorative) */}
        <div className="mt-20 relative max-w-5xl mx-auto rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-1000">
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-purple-900/40 via-[#0f0f1a] to-cyan-900/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                <div className="z-10 text-4xl font-bold text-white/20">Dashboard Preview</div>
            </div>
        </div>
      </div>
    </section>
  );
}
