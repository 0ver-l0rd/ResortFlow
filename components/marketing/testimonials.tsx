"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
        >
          <h2 className="text-indigo-600 font-bold tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-indigo-50 inline-block">
            Testimonials
          </h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-8">
            Trusted by Creators Worldwide
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Join thousands of professionals who trust Social Copilot to manage their digital presence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group cursor-pointer relative"
            >
              <div className="absolute top-8 right-10 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                <Quote className="w-12 h-12 fill-current" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                ))}
              </div>
              
              <blockquote className="flex-1 text-slate-700 leading-relaxed font-medium mb-10 text-lg relative z-10">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4 relative z-10">
                <Avatar className="w-14 h-14 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                  <AvatarImage src={testimonial.image} />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-slate-900 font-black text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 font-bold tracking-tight">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
