"use client";

import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="py-20 border-t border-border bg-background relative overflow-hidden">
      {/* Dynamic background element */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-all">
                ✦
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                SocialCopilot
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering creators and brands with AI-powered multi-platform management tools. 
              Schedule, track, and engage with confidence.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-purple-500 hover:border-purple-500/20 transition-all">
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-purple-500 hover:border-purple-500/20 transition-all">
                <FaLinkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-purple-500 hover:border-purple-500/20 transition-all">
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-purple-500 hover:border-purple-500/20 transition-all">
                <FaGithub className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="font-bold text-sm uppercase tracking-widest text-[#7c3aed] mb-8">Product</h5>
            <ul className="space-y-4">
              {["Features", "Pricing", "Testimonials", "API Docs", "Changelog"].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-bold text-sm uppercase tracking-widest text-[#7c3aed] mb-8">Resources</h5>
            <ul className="space-y-4">
              {["Blog", "Guides", "Support Center", "Community", "Brand Assets"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h5 className="font-bold text-sm uppercase tracking-widest text-[#7c3aed] mb-8">Stay Updated</h5>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest social media tips and product updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="you@email.com" 
                className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 placeholder:text-muted-foreground/50 transition-all"
              />
              <button className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © 2025 SocialCopilot. Built with ✦ for modern creators.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
