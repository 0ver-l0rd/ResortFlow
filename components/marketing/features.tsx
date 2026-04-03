"use client";

import { Calendar, Bot, BarChart3, Image as ImageIcon, LayoutGrid, Zap } from "lucide-react";

const features = [
  {
    title: "Smart Scheduling",
    description: "Schedule posts at optimal times across all platforms with one click and smart AI recommendations.",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "AI Auto-Reply",
    description: "Gemini AI replies to comments automatically based on keywords or context, maintaining your brand voice.",
    icon: Bot,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Unified Analytics",
    description: "Track engagement, reach, and growth across all platforms in one beautiful, unified dashboard.",
    icon: BarChart3,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Media Library",
    description: "Upload, transform, and reuse media assets powered by ImageKit for blazing fast loading.",
    icon: ImageIcon,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Content Calendar",
    description: "A visual calendar view of all your scheduled and published posts for perfect content planning.",
    icon: LayoutGrid,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    title: "Multi-Platform",
    description: "Post to 9+ platforms simultaneously with platform-specific formatting and previews.",
    icon: Zap,
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-purple-500 font-bold tracking-widest text-sm uppercase mb-4">Everything You Need</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for Modern Creators</h3>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed to help you scale your social media presence without the manual work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border border-border bg-card/50 hover:bg-card hover:border-purple-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 -mr-4 -mt-4 opacity-0 group-hover:opacity-10 transition-opacity">
                 <feature.icon className="w-24 h-24 rotate-12" />
              </div>
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h4 className="text-xl font-bold mb-4 group-hover:text-purple-500 transition-colors">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
