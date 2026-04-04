"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SocialCard, PlatformConfig, SocialAccount } from "@/components/dashboard/social-card";
import { Loader2, Info, Link2 } from "lucide-react";

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
    window.location.href = `/api/social/${platformId}/auth`;
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
            Manage your social media integrations for publishing and analytics.
          </p>
        </div>

        {/* Stats badge — Stripe-style */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.06)] self-start sm:self-auto shrink-0">
          <span className="text-sm font-semibold text-[#1a1f36]">{connectedCount}</span>
          <span className="text-sm text-[#8792a2]">/ {PLATFORMS.length} connected</span>
          {connectedCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#09825d] shrink-0 ml-1" />
          )}
        </div>
      </div>

      {/* ── Platform Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const account = accounts.find((a) => a.platform === platform.id);
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

      {/* ── Info callout — Stripe-style banner ── */}
      <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef]">
        <div className="mt-0.5 shrink-0">
          <Info className="w-4 h-4 text-[#8792a2]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[#3c4257]">Platform requirements</p>
          <ul className="text-sm text-[#697386] space-y-1 leading-relaxed">
            <li>
              <span className="font-medium text-[#3c4257]">Instagram</span> — Requires a
              Business/Creator account linked to a Facebook Page.
            </li>
            <li>
              <span className="font-medium text-[#3c4257]">Twitter / X</span> — Enable{" "}
              <code className="font-mono text-xs bg-white border border-[#e3e8ef] px-1 py-0.5 rounded">
                tweet.write
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs bg-white border border-[#e3e8ef] px-1 py-0.5 rounded">
                offline.access
              </code>{" "}
              in your Twitter app settings.
            </li>
            <li>
              <span className="font-medium text-[#3c4257]">YouTube</span> — Enable YouTube
              Data API v3 in Google Cloud Console before connecting.
            </li>
            <li>
              If a token expires, click <span className="font-medium text-[#3c4257]">Reconnect</span> on
              the affected card to re-authorize.
            </li>
          </ul>
        </div>
      </div>

      {/* ── Callback URLs reference ── */}
      <div className="rounded-xl border border-[#e3e8ef] bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#f0f3f7] bg-[#f6f9fc]">
          <Link2 className="w-3.5 h-3.5 text-[#8792a2]" />
          <p className="text-xs font-semibold text-[#697386] uppercase tracking-wide">
            OAuth Callback URLs — register these in your developer portals
          </p>
        </div>
        <div className="divide-y divide-[#f0f3f7]">
          {PLATFORMS.filter((p) => !["discord", "slack"].includes(p.id)).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#f6f9fc] transition-colors"
            >
              <p.Icon className="w-3.5 h-3.5 shrink-0" style={{ color: p.brandColor }} />
              <span className="text-xs font-medium text-[#697386] w-24 shrink-0">{p.name}</span>
              <code className="text-xs font-mono text-[#3c4257] truncate">
                http://localhost:3000/api/social/{p.id}/callback
              </code>
            </div>
          ))}
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
