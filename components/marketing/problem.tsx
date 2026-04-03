"use client";

import { motion } from "framer-motion";
import { TrendingDown, Clock, Layers } from "lucide-react";

const problems = [
  {
    title: "Low Booking Rates",
    description: "Resorts often struggle with seasonal dips and unoptimized booking funnels that bleed potential revenue.",
    icon: TrendingDown,
    color: "text-red-500 bg-red-50",
  },
  {
    title: "Manual Marketing Grind",
    description: "Teams spend hours manually posting, replying, and managing campaigns across fragmented platforms.",
    icon: Clock,
    color: "text-amber-500 bg-amber-50",
  },
  {
    title: "Disconnected Tools",
    description: "Marketing tools are complex, expensive, and rarely talk to each other, leading to poor guest targeting.",
    icon: Layers,
    color: "text-indigo-500 bg-indigo-50",
  },
];

export function Problem() {
  return (
    <section id="problem" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-[32px] md:text-[54px] font-black tracking-tight text-[#1a1f36] leading-tight mb-6">
            Resort marketing is <br />
            <span className="text-slate-400">broken and disconnected.</span>
          </h2>
          <p className="text-lg md:text-xl text-[#3c4257] font-medium opacity-80">
            Traditional methods are too slow, too manual, and fail to capture the modern guest's attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((prob, i) => (
            <div
              key={i}
              className="p-8 rounded-[2rem] border border-black/5 bg-[#f6f9fc] hover:bg-white hover:shadow-xl transition-all duration-500 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${prob.color} transition-transform group-hover:scale-110`}>
                <prob.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#1a1f36] mb-3">{prob.title}</h4>
              <p className="text-[#3c4257] font-medium opacity-70 leading-relaxed">{prob.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
