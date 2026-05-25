"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

const results = [
  {
    metric: "+30%",
    label: "Direct Bookings",
    desc: "AI optimization increases guest conversion across all digital touchpoints.",
    icon: TrendingUp,
    color: "text-[#2d6a4f] bg-[#2d6a4f]/10",
  },
  {
    metric: "2.4x",
    label: "Guest Engagement",
    desc: "Personalized AI messaging drives higher response rates than generic broadcasts.",
    icon: Users,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    metric: "80%",
    label: "Less Manual Work",
    desc: "Autonomous campaign management frees your team for high-value hospitality.",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  {
    metric: "100%",
    label: "Target Accuracy",
    desc: "AI segmentation precisely identifies your most profitable guest personas.",
    icon: Target,
    color: "text-emerald-800 bg-emerald-50",
  }
];

export function Results() {
  return (
    <section className="py-24 md:py-32 bg-[#f6f9fc] border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-[#2d6a4f] font-black tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-[#2d6a4f]/10 inline-block">
             Proven Resilience
          </h2>
          <h3 className="text-[32px] md:text-[54px] font-black tracking-tight text-[#1a1f36] leading-tight mb-8">
             Results that <br />
             <span className="text-[#2d6a4f]">Impact Your Bottom Line.</span>
          </h3>
          <p className="text-lg md:text-xl text-[#3c4257] font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
             Join leading resorts that have modernized their growth strategies using our autonomous marketing agent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
           {results.map((res, i) => (
             <div
               key={i}
               className="p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-xl shadow-black/[0.02] flex flex-col items-center text-center group cursor-default hover:-translate-y-2 transition-transform duration-500"
             >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${res.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                   <res.icon className="w-7 h-7" />
                </div>
                <h4 className="text-5xl font-black text-[#1a1f36] mb-3 tracking-tighter">{res.metric}</h4>
                <p className="text-md font-black text-[#2d6a4f] uppercase tracking-widest mb-4">{res.label}</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{res.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
