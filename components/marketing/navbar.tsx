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
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl transition-all duration-300 border border-transparent",
        isScrolled
          ? "glass py-3 top-2 shadow-xl"
          : "bg-transparent py-5 top-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
            ✦
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
            SocialCopilot
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/docs" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-20 h-8 animate-pulse bg-muted rounded-full" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-semibold text-sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-foreground text-background hover:opacity-90 border-none font-bold px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-foreground/10">
                  Get Started
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-semibold text-sm hover:bg-muted">
                  Dashboard
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border-2 border-background shadow-sm hover:scale-105 transition-transform",
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
