"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const plans = [
  {
    name: "STARTER",
    price: "$49",
    description: "Perfect for boutique resorts starting with AI automation.",
    features: [
      { text: "3 Social Channels", available: true },
      { text: "500 AI Guest Responses/mo", available: true },
      { text: "Basic AI Content Compose", available: true },
      { text: "Guest Reach Analytics", available: true },
      { text: "Team Shared Dashboard", available: true },
    ],
    buttonText: "Start Growth Phase",
    featured: false,
  },
  {
    name: "GROWTH",
    price: "$129",
    description: "Ideal for established resorts scaling booking revenue.",
    features: [
      { text: "Unlimited Channels", available: true },
      { text: "Unlimited AI Responses", available: true },
      { text: "Advanced AI Campaign Builder", available: true },
      { text: "WhatsApp & SMS Integration", available: true },
      { text: "AI Guest Segmentation", available: true },
      { text: "Priority Support", available: true },
    ],
    buttonText: "Join Top 1% Resorts",
    featured: true,
  },
  {
    name: "PRO",
    price: "$299",
    description: "Enterprise-grade autonomy for high-volume resorts.",
    features: [
      { text: "Everything in Growth", available: true },
      { text: "Dedicated AI Growth Agent", available: true },
      { text: "Custom API & CRM Sync", available: true },
      { text: "White-label Analytics", available: true },
      { text: "Multi-Location Support", available: true },
      { text: "24/7 Account Management", available: true },
    ],
    buttonText: "Scale to Enterprise",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#f6f9fc] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[#635bff] font-black tracking-tight text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-[#635bff]/10 inline-block">
            Pricing
          </h2>
          <h3 className="text-[32px] md:text-[54px] font-black tracking-tight text-[#1a1f36] leading-tight mb-8">
            Strategic Growth Plans for <br />
            <span className="text-[#635bff]">Modern Resorts.</span>
          </h3>
          <p className="text-xl text-[#3c4257] font-medium leading-relaxed opacity-80">
            Choose the plan that's right for your property's expansion.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl ${
                plan.featured
                  ? "bg-white border-[#635bff] ring-4 ring-[#635bff]/5 shadow-xl shadow-[#635bff]/10 z-10"
                  : "bg-white border-black/5 hover:border-[#635bff]/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-5 py-2 rounded-full bg-[#635bff] text-[10px] font-black text-white shadow-xl shadow-[#635bff]/20 uppercase tracking-widest leading-none">
                  ✦ Most Popular
                </div>
              )}
 
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{plan.name}</span>
                <div className="mt-4 mb-4 flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tight text-[#1a1f36]">{plan.price}</span>
                  <span className="text-slate-500 font-bold">/mo</span>
                </div>
                <p className="text-sm font-semibold text-[#3c4257] leading-relaxed opacity-70">{plan.description}</p>
              </div>
 
              <div className="flex-1 space-y-5 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${feature.available ? "bg-[#635bff]/10 text-[#635bff]" : "bg-slate-50 text-slate-300"}`}>
                        {feature.available ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                    </div>
                    <span className={`text-sm font-semibold ${feature.available ? "text-[#3c4257]" : "text-slate-400 font-medium"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
 
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className={`w-full rounded-2xl h-16 font-black transition-all hover:scale-[1.02] active:scale-[0.98] text-[15px] shadow-2xl ${
                    plan.featured 
                      ? "bg-[#635bff] hover:bg-[#4f46e5] text-white shadow-[#635bff]/30" 
                      : "bg-[#1a1f36] hover:bg-black text-white shadow-black/10"
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
