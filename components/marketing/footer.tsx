"use client";

import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-32 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative gradient for a premium feel */}
      <div className="absolute bottom-0 left-0 w-full h-[600px] bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Logo Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                ✦
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">
                SocialCopilot
              </span>
            </Link>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              Empowering creators and brands with AI-powered tools. 
              Schedule, track, and engage with total confidence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaTwitter, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaGithub, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600 mb-10">Product</h5>
            <ul className="space-y-5">
              {["Features", "Pricing", "Testimonials", "API Docs", "Changelog"].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-base font-bold text-slate-500 hover:text-indigo-600 transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600 mb-10">Resources</h5>
            <ul className="space-y-5">
              {["Blog", "Guides", "Support Center", "Community", "Brand Assets"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-base font-bold text-slate-500 hover:text-indigo-600 transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h5 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600 mb-10">Stay Updated</h5>
            <p className="text-base font-medium text-slate-600 leading-relaxed">
              Subscribe for the latest social media tips and feature updates.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="you@email.com" 
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 placeholder:text-slate-400 transition-all shadow-sm"
              />
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl text-sm transition-all shadow-xl shadow-slate-200 active:scale-95">
                Join our newsletter
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-bold text-slate-400">
            <span>© 2025 SocialCopilot</span>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span>Built with ✦ for modern creators</span>
          </div>
          <div className="flex gap-10">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <Link key={link} href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors duration-300">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
