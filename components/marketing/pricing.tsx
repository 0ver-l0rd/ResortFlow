"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

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
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-[#7c3aed] uppercase mb-4">Pricing</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple, Transparent Pricing</h3>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for you. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 ${
                plan.featured
                  ? "bg-[#0f0f1a] border-[#7c3aed] scale-105 z-10"
                  : "bg-card/50 border-border hover:border-purple-500/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-[10px] font-bold text-white shadow-xl">
                  ✦ MOST POPULAR
                </div>
              )}

              <div className="mb-0">
                <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">{plan.name}</span>
                <div className="mt-4 mb-2 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    {feature.available ? (
                      <Check className="w-5 h-5 text-[#7c3aed]" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30" />
                    )}
                    <span className={feature.available ? "" : "text-muted-foreground font-light"}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  variant={plan.featured ? "default" : "outline"}
                  className={`w-full rounded-2xl h-12 font-bold transition-all hover:scale-105 active:scale-95 ${
                    plan.featured ? "bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 border-none shadow-lg shadow-purple-500/20" : ""
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
