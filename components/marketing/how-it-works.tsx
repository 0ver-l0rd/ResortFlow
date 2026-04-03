"use client";

import React from "react";
import { 
  Database, 
  Target, 
  Zap, 
  TrendingUp, 
  Layers,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const workflowSteps = [
  {
    title: "Sync Ecosystem",
    desc: "Connect your Resort PMS, Social Hub, and Guest Databases to create a unified data layer.",
    icon: Database,
    color: "text-[#635bff]",
    bg: "bg-[#635bff]/10",
  },
  {
    title: "Define Strategy",
    desc: "Tell your Agent your objective: 'Increase weekday spa bookings' or 'Recover lost RevPAR'.",
    icon: Target,
    color: "text-[#09825d]",
    bg: "bg-[#efffee]",
  },
  {
    title: "Autonomous Build",
    desc: "Your Agent constructs, schedules, and executes the entire campaign strategy in seconds.",
    icon: Zap,
    color: "text-[#f5a623]",
    bg: "bg-[#fef3c7]",
  },
  {
    title: "Revenue Pulse",
    desc: "Real-time AI optimization tracking every dollar of influenced revenue and guest engagement.",
    icon: TrendingUp,
    color: "text-[#e1306c]",
    bg: "bg-[#fdf0f5]",
  }
];

export function HowItWorks() {
  return (
    <section id="workflow" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 border border-black/5 mb-6">
            <Layers className="w-3.5 h-3.5 text-[#1a1f36]" />
            <span className="text-[11px] font-black text-[#1a1f36] uppercase tracking-widest">Resort Orchestration</span>
          </div>
          
          <h2 className="text-[40px] md:text-[64px] font-black text-[#1a1f36] leading-[1.05] tracking-tight mb-8">
            The Resort AI Workflow. <br />
            <span className="text-[#635bff] italic">Simple & Strategic.</span>
          </h2>
          <p className="text-xl text-[#3c4257] font-medium leading-relaxed opacity-80 max-w-2xl mx-auto">
            Transform your resort growth with a simplified, 4-step autonomous strategy that captures every revenue opportunity.
          </p>
        </div>

        {/* High-Fidelity Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto relative px-4">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-slate-100 -z-10" />

           {workflowSteps.map((step, i) => (
             <div 
                key={i} 
                className="flex flex-col items-center text-center group"
             >
                <div className="mb-8 relative">
                   {/* Step Number */}
                   <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center font-black text-[10px] text-[#1a1f36] shadow-xl group-hover:scale-110 transition-transform z-10">
                      0{i + 1}
                   </div>
                   
                   {/* Icon Hex/Circle */}
                   <div className={cn(
                     "w-[120px] h-[120px] rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 relative overflow-hidden bg-white border border-black/5 group-hover:border-[#635bff]/20",
                   )}>
                      <div className={cn("absolute inset-[15%] rounded-3xl opacity-10 blur-xl", step.bg)} />
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center relative z-10", step.bg)}>
                         <step.icon className={cn("w-8 h-8", step.color)} />
                      </div>
                   </div>

                   {/* Desktop Arrow Indicator */}
                   {i < workflowSteps.length - 1 && (
                     <div className="hidden lg:flex absolute top-1/2 -right-6 lg:-right-8 items-center text-slate-200">
                        <ChevronRight className="w-5 h-5 leading-none" />
                     </div>
                   )}
                </div>

                <div className="space-y-4 px-4 transition-all duration-300 group-hover:translate-y-[-4px]">
                   <h3 className="text-xl font-black text-[#1a1f36] tracking-tight group-hover:text-[#635bff] transition-colors">{step.title}</h3>
                   <p className="text-sm font-semibold text-[#8792a2] leading-relaxed group-hover:text-slate-600 transition-colors">
                      {step.desc}
                   </p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
