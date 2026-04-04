"use client";

import React from "react";
import { 
  FaInstagram, 
  FaFacebook, 
  FaTiktok, 
  FaYoutube, 
  FaLinkedin, 
  FaXTwitter, 
  FaPinterest, 
  FaSnapchat, 
  FaThreads, 
  FaWhatsapp,
  FaGoogle,
  FaYelp
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "#E1306C" },
  { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { name: "TikTok", icon: FaTiktok, color: "#000000" },
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
  { name: "X", icon: FaXTwitter, color: "#000000" },
  { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
  { name: "Google", icon: FaGoogle, color: "#4285F4" },
  { name: "Yelp", icon: FaYelp, color: "#FF1A1A" },
  { name: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
];

export function PlatformBar() {
  // Triple the items for a truly seamless loop on high-res / ultra-wide screens
  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <div className="w-full bg-[#fcfdfe] py-16 md:py-20 border-y border-black/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-center text-[10px] font-black text-[#8792a2] uppercase tracking-[0.4em] opacity-80">
          Seamlessly Connected with 10+ Leading Platforms
        </p>
      </div>

      <div className="relative group">
        {/* Fading Edges / Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fcfdfe] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fcfdfe] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden select-none"
             style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <motion.div 
            className="flex items-center gap-16 md:gap-28 px-4"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {duplicatedPlatforms.map((platform, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 transition-all duration-500 filter grayscale opacity-30 hover:grayscale-0 hover:opacity-100 cursor-pointer group/item flex-shrink-0"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center transition-all duration-500 group-hover/item:shadow-xl group-hover/item:-translate-y-1">
                   <platform.icon 
                     className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover/item:scale-110" 
                     style={{ color: platform.color }} 
                   />
                </div>
                <span className="text-sm font-black text-[#1a1f36] tracking-tight hidden lg:block opacity-60 group-hover/item:opacity-100 transition-opacity">
                  {platform.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
