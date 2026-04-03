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
  FaWhatsapp 
} from "react-icons/fa6";
import { motion } from "framer-motion";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "#E1306C" },
  { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { name: "TikTok", icon: FaTiktok, color: "#000000" },
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
  { name: "X", icon: FaXTwitter, color: "#000000" },
  { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
  { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
  { name: "Threads", icon: FaThreads, color: "#000000" },
  { name: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
];

export function PlatformBar() {
  // Duplicate platforms for seamless loop
  const duplicatedPlatforms = [...platforms, ...platforms];

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border-y border-black/5 py-10 overflow-hidden group">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-center text-[10px] font-black text-[#8792a2] uppercase tracking-[0.3em]">
          Seamless Integrations with 9+ Platforms
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex items-center gap-16 md:gap-24 px-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedPlatforms.map((platform, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 transition-all duration-300 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 cursor-pointer group/item"
            >
              <platform.icon 
                className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover/item:scale-110 active:scale-95" 
                style={{ color: platform.color }} 
              />
              <span className="text-sm font-black text-[#1a1f36] tracking-tight hidden md:block">
                {platform.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
