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
    <section className="py-16 bg-background border-y border-slate-100 dark:border-white/5 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
         <motion.p 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]"
         >
           Seamless integrations with 9+ platforms
         </motion.p>
      </div>
      
      <div className="relative flex overflow-x-hidden group select-none">
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-10 group-hover:pause">
          {[...platforms, ...platforms].map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:bg-white dark:hover:bg-white/10 transition-all duration-500 cursor-pointer group/item"
            >
              <platform.icon className={`w-6 h-6 text-slate-400 dark:text-slate-500 transition-colors duration-500 group-hover/item:text-slate-900 dark:group-hover/item:text-white`} />
              <span className="text-base font-bold tracking-tight text-slate-500 dark:text-slate-500 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
