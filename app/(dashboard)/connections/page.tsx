"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SocialCard, PlatformConfig, SocialAccount } from "@/components/dashboard/social-card";
import { Loader2, Info, Link2, ExternalLink, Zap } from "lucide-react";

// Brand icons from react-icons
import { FaXTwitter } from "react-icons/fa6";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaDiscord,
  FaSlack,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const PLATFORMS: PlatformConfig[] = [
  {
    id: "twitter",
    name: "Twitter / X",
    Icon: FaXTwitter,
    brandColor: "#000000",
    bgColor: "#f0f0f0",
    description: "Post tweets & threads",
  },
  {
    id: "instagram",
    name: "Instagram",
    Icon: FaInstagram,
    brandColor: "#E1306C",
    bgColor: "#fdf0f5",
    description: "Photos, reels & stories",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    Icon: FaLinkedinIn,
    brandColor: "#0077B5",
    bgColor: "#eef6fb",
    description: "Professional posts & articles",
  },
  {
    id: "facebook",
    name: "Facebook",
    Icon: FaFacebookF,
    brandColor: "#1877F2",
    bgColor: "#eef3fd",
    description: "Posts, photos & page updates",
  },
  {
    id: "youtube",
    name: "YouTube",
    Icon: FaYoutube,
    brandColor: "#FF0000",
    bgColor: "#fff0f0",
    description: "Video uploads & Shorts",
  },
  {
    id: "tiktok",
    name: "TikTok",
    Icon: SiTiktok,
    brandColor: "#010101",
    bgColor: "#f0f0f0",
    description: "Short-form video content",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    Icon: FaPinterestP,
    brandColor: "#E60023",
    bgColor: "#fff0f1",
    description: "Pins, boards & ideas",
  },
  {
    id: "discord",
    name: "Discord",
    Icon: FaDiscord,
    brandColor: "#5865F2",
    bgColor: "#f0f1fd",
    description: "Server announcements & bots",
  },
  {
    id: "slack",
    name: "Slack",
    Icon: FaSlack,
    brandColor: "#4A154B",
    bgColor: "#f5eef5",
    description: "Workspace & channel updates",
  },
];

function ConnectionsContent() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) toast.success("Account connected successfully!");
    if (error) toast.error(`Connection failed: ${decodeURIComponent(error)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/social/accounts");
      if (!res.ok) throw new Error(res.statusText);
      setAccounts(await res.json());
    } catch {
      toast.error("Could not load connected accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (platformId: string) => {
    // For platforms connected via Zernio, redirect to Zernio dashboard
    window.open("https://zernio.com/dashboard/connections", "_blank");
    toast.info("Connect your account on the Zernio dashboard, then refresh this page.");
  };

  const handleDisconnect = async (accountId: string) => {
    const res = await fetch(`/api/social/accounts/${accountId}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      toast.success("Account disconnected.");
    } else {
      toast.error("Failed to disconnect account.");
    }
  };

  const connectedCount = accounts.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-6 h-6 text-[#2d6a4f] animate-spin" />
        <p className="text-sm text-[#8792a2]">Loading connections…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-1 space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1f36]">
            Connected Accounts
          </h1>
          <p className="text-sm text-[#8792a2] mt-1">
            Manage your social media integrations — powered by{" "}
            <a
              href="https://zernio.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2d6a4f] hover:underline inline-flex items-center gap-1"
            >
              Zernio <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.06)]">
            <span className="text-sm font-semibold text-[#1a1f36]">{connectedCount}</span>
            <span className="text-sm text-[#8792a2]">/ {PLATFORMS.length} connected</span>
            {connectedCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#09825d] shrink-0 ml-1" />
            )}
          </div>
          <a
            href="https://zernio.com/dashboard/connections"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a42] transition-all shadow-[0_1px_3px_rgba(45,106,79,0.3)] active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5" />
            Manage on Zernio
          </a>
        </div>
      </div>

      {/* ── Platform Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const account = accounts.find(
            (a) => a.platform === platform.id || 
                   (platform.id === "twitter" && a.platform === "twitter")
          );
          return (
            <SocialCard
              key={platform.id}
              platform={platform}
              account={account}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          );
        })}
      </div>

      {/* ── Info callout — Zernio-powered ── */}
      <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]">
        <div className="mt-0.5 shrink-0">
          <Info className="w-4 h-4 text-[#8792a2]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[#3c4257]">Powered by Zernio</p>
          <ul className="text-sm text-[#697386] space-y-1 leading-relaxed">
            <li>
              All social accounts are connected and managed through the{" "}
              <a
                href="https://zernio.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#2d6a4f] hover:underline"
              >
                Zernio Dashboard
              </a>
              . Zernio handles OAuth, token refresh, and platform-specific requirements.
            </li>
            <li>
              <span className="font-medium text-[#3c4257]">Currently connected:</span>{" "}
              Twitter/X (@EZolomon) and Instagram (@noloman395).
            </li>
            <li>
              To add more platforms (LinkedIn, TikTok, YouTube, etc.), click{" "}
              <span className="font-medium text-[#3c4257]">"Manage on Zernio"</span>{" "}
              above and connect them from the Zernio dashboard.
            </li>
            <li>
              After connecting a new account on Zernio, <span className="font-medium text-[#3c4257]">refresh this page</span>{" "}
              to see it appear here automatically.
            </li>
          </ul>
        </div>
      </div>

      {/* ── API Integration badge ── */}
      <div className="rounded-xl border border-[#e3e8ef] bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#f0f3f7] bg-[#f6f9fc]">
          <Link2 className="w-3.5 h-3.5 text-[#8792a2]" />
          <p className="text-xs font-semibold text-[#697386] uppercase tracking-wide">
            Publishing integration
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1a1f36]">Zernio Unified API</p>
            <p className="text-xs text-[#8792a2] mt-0.5">
              Posts are published directly via Zernio's API — no per-platform OAuth required.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
            <span className="text-xs font-semibold text-[#065f46]">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-5 h-5 text-[#2d6a4f] animate-spin" />
        </div>
      }
    >
      <ConnectionsContent />
    </Suspense>
  );
}
