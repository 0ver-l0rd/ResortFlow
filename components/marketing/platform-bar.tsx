"use client";

import { FaInstagram, FaYoutube, FaTiktok, FaLinkedin, FaTwitter, FaPinterest, FaDiscord, FaSlack, FaFacebook } from "react-icons/fa";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "hover:text-pink-500" },
  { name: "YouTube", icon: FaYoutube, color: "hover:text-red-500" },
  { name: "TikTok", icon: FaTiktok, color: "hover:text-cyan-400" },
  { name: "LinkedIn", icon: FaLinkedin, color: "hover:text-blue-600" },
  { name: "Twitter/X", icon: FaTwitter, color: "hover:text-blue-400" },
  { name: "Pinterest", icon: FaPinterest, color: "hover:text-red-600" },
  { name: "Discord", icon: FaDiscord, color: "hover:text-indigo-500" },
  { name: "Slack", icon: FaSlack, color: "hover:text-yellow-500" },
  { name: "Facebook", icon: FaFacebook, color: "hover:text-blue-700" },
];

export function PlatformBar() {
  return (
    <section className="py-12 border-y border-border/50 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
         <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Supported Platforms</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:pause">
          {[...platforms, ...platforms].map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer"
            >
              <platform.icon className={`w-5 h-5 text-muted-foreground transition-colors ${platform.color}`} />
              <span className="text-sm font-semibold tracking-tight">{platform.name}</span>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless scrolling */}
        <div className="absolute top-0 py-4 animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:pause" style={{ left: '100%' }}>
          {[...platforms, ...platforms].map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer"
            >
              <platform.icon className={`w-5 h-5 text-muted-foreground transition-colors ${platform.color}`} />
              <span className="text-sm font-semibold tracking-tight">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
