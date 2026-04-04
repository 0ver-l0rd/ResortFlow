"use client";

import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-16 md:py-24 bg-white border-t border-[#e3e8ef] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Logo Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-[#635bff] flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-[#635bff]/20">
                <span className="text-white font-black text-xl leading-none">✦</span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#1a1f36]">
                SocialCopilot
              </span>
            </Link>
            <p className="text-[15px] font-semibold text-[#8792a2] leading-relaxed max-w-xs">
              The AI assistant for modern hotels. Grow your social media without the hard work.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaTwitter, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaGithub, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="w-10 h-10 rounded-xl bg-slate-50 border border-[#e3e8ef] flex items-center justify-center text-[#8792a2] hover:text-[#635bff] hover:border-[#635bff]/30 transition-all duration-300">
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
 
          {/* Product Links */}
          <div>
            <h5 className="font-black text-[10px] uppercase tracking-[0.25em] text-[#1a1f36] mb-8">What We Do</h5>
            <ul className="space-y-4">
              {["Features", "Steps", "Autopilot", "Intelligence", "Security"].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-[14px] font-bold text-[#8792a2] hover:text-[#1a1f36] transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Resources */}
          <div>
            <h5 className="font-black text-[10px] uppercase tracking-[0.25em] text-[#1a1f36] mb-8">More Info</h5>
            <ul className="space-y-4">
              {["Case Studies", "Hotel Guides", "Help Center", "System Status", "Brand Assets"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-[14px] font-bold text-[#8792a2] hover:text-[#1a1f36] transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Contact / Newsletter */}
          <div className="space-y-8">
            <h5 className="font-black text-[10px] uppercase tracking-[0.25em] text-[#1a1f36] mb-8">Stay Updated</h5>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="hotel@email.com" 
                className="w-full bg-[#f8fafc] border border-[#e3e8ef] rounded-xl px-5 py-3 text-sm font-bold focus:outline-none focus:border-[#635bff]/30 placeholder:text-[#8792a2] transition-all"
              />
              <button className="w-full bg-[#1a1f36] hover:bg-[#1a1f36]/90 text-white font-black py-3 px-6 rounded-xl text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#1a1f36]/10">
                Join Now
              </button>
            </div>
          </div>
        </div>
 
        <div className="pt-10 border-t border-[#e3e8ef] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[13px] font-bold text-[#8792a2]">
            <span>© 2026 SocialCopilot</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />
            <span>Smart Hotel Assistant</span>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookie Policy"].map((link) => (
              <Link key={link} href="#" className="text-[13px] font-bold text-[#8792a2] hover:text-[#1a1f36] transition-colors duration-300">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
