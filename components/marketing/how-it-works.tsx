"use client";

import { Link2, PenSquare, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Connect Accounts",
    description: "Securely link all your social platforms in seconds using our seamless OAuth integrations.",
    icon: Link2,
    color: "bg-indigo-600 shadow-indigo-200",
  },
  {
    title: "Compose & Schedule",
    description: "Write once, add media, and let AI help you optimize for each platform. Schedule for the perfect time.",
    icon: PenSquare,
    color: "bg-violet-600 shadow-violet-200",
  },
  {
    title: "Publish Everywhere",
    description: "Sit back as your content goes live across all selected platforms simultaneously, automated and reliable.",
    icon: Share2,
    color: "bg-cyan-500 shadow-cyan-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export function HowItWorks() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-indigo-600 font-bold tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-indigo-50 inline-block">
            The Workflow
          </h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-8">
            Simple, Fast, Effortless
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Transform your content strategy with a simplified, 3-step automated workflow.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16 lg:gap-12 justify-center items-center lg:items-start"
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              variants={stepVariants}
              className="flex-1 flex flex-col items-center text-center group max-w-sm"
            >
              <div className="relative mb-12">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-lg text-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-500 z-10">
                  0{i + 1}
                </div>
                
                {/* Icon Circle */}
                <div className={`w-40 h-40 rounded-[2.5rem] ${step.color} flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-500 relative`}>
                    <div className="absolute inset-0 bg-white/10 rounded-[2.5rem]" />
                    <step.icon className="w-16 h-16 text-white z-10" />
                </div>

                {/* Connecting arrow for desktop (only between steps) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-[calc(100%+2rem)] w-16 h-px bg-slate-200 -translate-y-1/2">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                )}
              </div>

              <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                {step.title}
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium group-hover:text-slate-700 transition-colors duration-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
