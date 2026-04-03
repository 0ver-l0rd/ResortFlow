"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const plans = [
  {
    name: "FREE",
    price: "$0",
    description: "Perfect for personal creators and hobbyists.",
    features: [
      { text: "3 Social Accounts", available: true },
      { text: "10 Scheduled Posts/mo", available: true },
      { text: "Basic Analytics", available: true },
      { text: "Media Library (100MB)", available: true },
      { text: "AI Auto-Reply", available: false },
      { text: "Team Members", available: false },
    ],
    buttonText: "Get Started Free",
    featured: false,
  },
  {
    name: "PRO",
    price: "$29",
    description: "Ideal for power users and growing brands.",
    features: [
      { text: "Unlimited Accounts", available: true },
      { text: "Unlimited Scheduled Posts", available: true },
      { text: "AI Auto-Reply (500/mo)", available: true },
      { text: "Advanced Analytics", available: true },
      { text: "Media Library (10GB)", available: true },
      { text: "Priority Support", available: true },
    ],
    buttonText: "Start Pro Trial",
    featured: true,
  },
  {
    name: "AGENCY",
    price: "$99",
    description: "Best for teams and social media agencies.",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "10 Team Members", available: true },
      { text: "Unlimited AI Replies", available: true },
      { text: "White-label Reports", available: true },
      { text: "API Access", available: true },
      { text: "Dedicated Support", available: true },
    ],
    buttonText: "Contact Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-slate-50/30 dark:bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-indigo-600 font-bold tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 inline-block">
            Pricing
          </h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
            Simple, Transparent Pricing
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Choose the plan that's right for you. No hidden fees.
          </p>
        </motion.div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-indigo-500/5 ${
                plan.featured
                  ? "bg-white dark:bg-card border-indigo-600 dark:border-indigo-500/50 ring-4 ring-indigo-50 dark:ring-indigo-500/10 shadow-2xl shadow-indigo-100 dark:shadow-none z-10"
                  : "bg-white dark:bg-card border-slate-200 dark:border-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-5 py-2 rounded-full bg-indigo-600 text-xs font-black text-white shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-widest leading-none">
                  ✦ Most Popular
                </div>
              )}
 
              <div className="mb-8">
                <span className="text-sm font-black tracking-widest text-slate-400 uppercase">{plan.name}</span>
                <div className="mt-4 mb-4 flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 font-bold">/mo</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">{plan.description}</p>
              </div>
 
              <div className="flex-1 space-y-5 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${feature.available ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600"}`}>
                        {feature.available ? (
                        <Check className="w-4 h-4" />
                        ) : (
                        <X className="w-4 h-4" />
                        )}
                    </div>
                    <span className={`font-medium ${feature.available ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600 font-light"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
 
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className={`w-full rounded-2xl h-14 font-black transition-all hover:scale-[1.02] active:scale-[0.98] text-lg shadow-xl ${
                    plan.featured 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none" 
                      : "bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white shadow-slate-200 dark:shadow-none"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </SignUpButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
