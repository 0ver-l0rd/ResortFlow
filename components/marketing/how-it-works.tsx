"use client";

import { Link2, PenSquare, Share2 } from "lucide-react";

const steps = [
  {
    title: "Connect Accounts",
    description: "Securely link all your social platforms in seconds using our seamless OAuth integrations.",
    icon: Link2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Compose & Schedule",
    description: "Write once, add media, and let AI help you optimize for each platform. Schedule for the perfect time.",
    icon: PenSquare,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Publish Everywhere",
    description: "Sit back as your content goes live across all selected platforms simultaneously, automated and reliable.",
    icon: Share2,
    color: "from-emerald-500 to-teal-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-[#7c3aed] uppercase mb-4">The Workflow</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Simple, Fast, Effortless</h3>
          <p className="text-lg text-slate-400">
            A 3-step visual flow designed for speed and productivity.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between relative">
          {/* Horizontal line for desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 -z-10" />

          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center group">
              <div className="relative mb-10">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-[#0f0f1a] border border-border flex items-center justify-center font-bold text-lg text-purple-500 shadow-xl group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                
                {/* Icon Circle */}
                <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${step.color} p-px shadow-2xl shadow-purple-500/10 transition-all group-hover:scale-105`}>
                  <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                    <step.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">{step.title}</h4>
              <p className="max-w-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
