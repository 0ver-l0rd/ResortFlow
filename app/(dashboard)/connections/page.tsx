"use client";

import { useEffect, useState } from "react";
import { SocialCard } from "@/components/dashboard/social-card";
import { 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { 
  NewTwitterIcon, 
  InstagramIcon, 
  Linkedin02Icon, 
  YoutubeIcon, 
  TiktokIcon, 
  PinterestIcon, 
  DiscordIcon, 
  SlackIcon 
} from "hugeicons-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"; // If sonner is installed, else use a simple alert

const PLATFORMS = [
  { id: "twitter", name: "Twitter / X", icon: NewTwitterIcon, color: "bg-[#1DA1F2]" },
  { id: "instagram", name: "Instagram", icon: InstagramIcon, color: "bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin02Icon, color: "bg-[#0077B5]" },
  { id: "youtube", name: "YouTube", icon: YoutubeIcon, color: "bg-[#FF0000]" },
  { id: "tiktok", name: "TikTok", icon: TiktokIcon, color: "bg-[#000000]" },
  { id: "pinterest", name: "Pinterest", icon: PinterestIcon, color: "bg-[#E60023]" },
  { id: "discord", name: "Discord", icon: DiscordIcon, color: "bg-[#5865F2]" },
  { id: "slack", name: "Slack", icon: SlackIcon, color: "bg-[#4A154B]" },
];

interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  avatarUrl: string | null;
  expiresAt: string | null;
}

export default function ConnectionsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
    
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success("Account connected successfully!");
    }
    if (error) {
      toast.error(`Connection failed: ${error}`);
    }
  }, [searchParams]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/social/accounts");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (platformId: string) => {
    window.location.href = `/api/social/${platformId}/auth`;
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social/accounts/${accountId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAccounts(accounts.filter(a => a.id !== accountId));
        toast.success("Account disconnected");
      } else {
        toast.error("Failed to disconnect account");
      }
    } catch (error) {
      console.error("Failed to disconnect account:", error);
      toast.error("An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 font-medium">Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Social Connections</h1>
        <p className="text-slate-400">
          Connect your social media accounts to enable cross-platform scheduling and AI auto-replies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PLATFORMS.map((platform) => {
          const account = accounts.find(a => a.platform === platform.id);
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

      <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-[#1e1e2e]/50 to-[#0f0f1a]/80 border border-[#334155]/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Important Note</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
              Some platforms like Instagram and Facebook require a Professional/Business account. 
              Make sure your accounts are properly linked and have the necessary permissions 
              for scheduling content. If a token expires, you can simply reconnect your account 
              to refresh the connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
