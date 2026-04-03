"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[#635bff] flex items-center justify-center shadow-lg shadow-[#635bff]/20 group-hover:scale-110 transition-all duration-500">
            <span className="text-white font-black text-xl">✦</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1a1f36] transition-colors">
            SocialCopilot
          </span>
        </Link>

        {/* Centered Navigation */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/50 shadow-sm">
          <Link href="#features" className="px-5 py-2 text-[13px] font-bold text-[#3c4257] hover:text-[#635bff] transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="px-5 py-2 text-[13px] font-bold text-[#3c4257] hover:text-[#635bff] transition-colors">
            Our Strategy
          </Link>
          <Link href="/blog" className="px-5 py-2 text-[13px] font-bold text-[#3c4257] hover:text-[#635bff] transition-colors">
            Updates
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3 relative z-10">
          {!isLoaded ? (
            <div className="w-20 h-8 animate-pulse bg-muted rounded-full" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-bold text-[13px] text-[#3c4257] hover:text-[#1a1f36] hover:bg-transparent">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-[#635bff] hover:bg-[#4f46e5] text-white font-bold px-6 h-10 rounded-full transition-all active:scale-95 shadow-md shadow-[#635bff]/10 border-none">
                  Get Started
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-bold text-[13px] text-[#3c4257] hover:text-[#1a1f36] hover:bg-muted/50 rounded-full px-5">
                  Dashboard
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-black/5 shadow-sm hover:scale-105 transition-transform",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
