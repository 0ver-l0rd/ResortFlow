"use client";

import { Calendar, Bot, BarChart3, Image as ImageIcon, LayoutGrid, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Scheduling",
    description: "Schedule posts at optimal times across all platforms with one click and smart AI recommendations.",
    icon: Calendar,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "AI Auto-Reply",
    description: "Gemini AI replies to comments automatically based on keywords or context, maintaining your brand voice.",
    icon: Bot,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Unified Analytics",
    description: "Track engagement, reach, and growth across all platforms in one beautiful, unified dashboard.",
    icon: BarChart3,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Media Library",
    description: "Upload, transform, and reuse media assets powered by ImageKit for blazing fast loading.",
    icon: ImageIcon,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Content Calendar",
    description: "A visual calendar view of all your scheduled and published posts for perfect content planning.",
    icon: LayoutGrid,
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "Multi-Platform",
    description: "Post to 9+ platforms simultaneously with platform-specific formatting and previews.",
    icon: Zap,
    color: "bg-cyan-50 text-cyan-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section id="features" className="py-32 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-indigo-600 font-bold tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-indigo-50 inline-block">
            Everything You Need
          </h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-slate-900">
            Built for Modern Creators
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            A comprehensive suite of tools designed to help you scale your social media presence without the manual work.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group p-10 rounded-[2.5rem] border border-slate-200 bg-white hover:border-indigo-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-6 -mr-6 -mt-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                 <feature.icon className="w-32 h-32 rotate-12 text-indigo-600" />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-7 h-7" />
              </div>
              
              <h4 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                {feature.title}
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium group-hover:text-slate-700 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
