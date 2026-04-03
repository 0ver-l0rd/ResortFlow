"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Digital Strategist",
    image: "https://i.pravatar.cc/150?u=alex",
    quote: "Social Copilot has completely transformed our workflow. What used to take hours now takes minutes. The AI auto-reply is a game changer for engagement.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Content Creator",
    image: "https://i.pravatar.cc/150?u=sarah",
    quote: "The unified analytics and media library are exactly what I needed. It's so easy to reuse assets and track performance across all my platforms in one place.",
    stars: 5,
  },
  {
    name: "Jordan Smith",
    role: "Marketing Director",
    image: "https://i.pravatar.cc/150?u=jordan",
    quote: "Manage everything from one dashboard with total confidence. The scheduling is robust and the platform-specific previews are incredibly accurate.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          <h2 className="text-sm font-bold tracking-widest text-[#7c3aed] uppercase mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Trusted by Creators Worldwide</h3>
          <p className="text-lg text-slate-400">
            Join thousands of professionals who trust Social Copilot to manage their digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="flex flex-col p-8 rounded-3xl bg-card/30 border border-border/50 hover:border-purple-500/20 hover:bg-card/40 transition-all duration-300 group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500 group-hover:scale-110 transition-transform" />
                ))}
              </div>
              
              <blockquote className="flex-1 text-slate-300 leading-relaxed italic mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-purple-500/20">
                  <AvatarImage src={testimonial.image} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
