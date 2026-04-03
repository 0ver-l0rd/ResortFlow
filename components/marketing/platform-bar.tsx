"use client";

import { FaInstagram, FaYoutube, FaTiktok, FaLinkedin, FaTwitter, FaPinterest, FaDiscord, FaSlack, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

const platforms = [
  { name: "Instagram", icon: FaInstagram, color: "group-hover:text-pink-500" },
  { name: "YouTube", icon: FaYoutube, color: "group-hover:text-red-500" },
  { name: "TikTok", icon: FaTiktok, color: "group-hover:text-slate-900" },
  { name: "LinkedIn", icon: FaLinkedin, color: "group-hover:text-blue-600" },
  { name: "Twitter", icon: FaTwitter, color: "group-hover:text-sky-500" },
  { name: "Pinterest", icon: FaPinterest, color: "group-hover:text-red-600" },
  { name: "Discord", icon: FaDiscord, color: "group-hover:text-indigo-500" },
  { name: "Slack", icon: FaSlack, color: "group-hover:text-emerald-500" },
  { name: "Facebook", icon: FaFacebook, color: "group-hover:text-blue-700" },
];

export function PlatformBar() {
  return (
    <section className="py-16 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
         <motion.p 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]"
         >
           Seamless integrations with your favorite platforms
         </motion.p>
      </div>
      
      <div className="relative flex overflow-x-hidden group select-none">
        <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:pause">
          {[...platforms, ...platforms].map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer group/item"
            >
              <platform.icon className={`w-6 h-6 text-slate-400 transition-colors duration-500 ${platform.color}`} />
              <span className="text-base font-bold tracking-tight text-slate-600 group-hover/item:text-slate-900 transition-colors duration-300">{platform.name}</span>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless scrolling */}
        <div className="absolute top-0 py-2 animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:pause" style={{ left: '100%' }}>
          {[...platforms, ...platforms].map((platform, i) => (
            <div
              key={i + platforms.length * 2}
              className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer group/item"
            >
              <platform.icon className={`w-6 h-6 text-slate-400 transition-colors duration-500 ${platform.color}`} />
              <span className="text-base font-bold tracking-tight text-slate-600 group-hover/item:text-slate-900 transition-colors duration-300">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
