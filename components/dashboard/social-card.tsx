"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, RefreshCw, Unlink, Plus, CheckCheck } from "lucide-react";

export interface PlatformConfig {
  id: string;
  name: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  brandColor: string;
  bgColor: string;        // light tint for the icon wrapper
  description: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  avatarUrl: string | null;
  expiresAt: string | null;
}

interface SocialCardProps {
  platform: PlatformConfig;
  account?: SocialAccount;
  onConnect: (platformId: string) => void;
  onDisconnect: (accountId: string) => void;
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export function SocialCard({ platform, account, onConnect, onDisconnect }: SocialCardProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const isConnected = !!account;
  const expired = isConnected && isExpired(account?.expiresAt ?? null);
  const { Icon } = platform;

  const handleDisconnect = async () => {
    if (!account) return;
    setIsDisconnecting(true);
    try {
      await onDisconnect(account.id);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col bg-white rounded-xl border transition-all duration-200
        ${expired
          ? "border-orange-200 shadow-[0_1px_6px_rgba(234,88,12,0.08)]"
          : isConnected
            ? "border-[#e3e8ef] shadow-[0_1px_6px_rgba(60,66,87,0.08)]"
            : "border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)]"
        }
        hover:shadow-[0_4px_24px_rgba(60,66,87,0.12)] hover:border-[#c9d0ef]/80 hover:-translate-y-px
      `}
    >
      {/* Connected accent bar at top */}
      {isConnected && !expired && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
          style={{ backgroundColor: platform.brandColor }}
        />
      )}
      {expired && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-orange-400" />
      )}

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Platform Icon + Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: platform.bgColor }}
            >
              <Icon className="w-5 h-5" style={{ color: platform.brandColor }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1f36] leading-tight">{platform.name}</p>
              <p className="text-xs text-[#8792a2] mt-0.5 leading-tight">{platform.description}</p>
            </div>
          </div>

          {/* Status indicator */}
          {expired ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 shrink-0 mt-0.5">
              <AlertTriangle className="w-2.5 h-2.5" />
              Expired
            </span>
          ) : isConnected ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#efffee] text-[#09825d] border border-[#c1f5cd] shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09825d]" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f6f9fc] text-[#8792a2] border border-[#e3e8ef] shrink-0 mt-0.5">
              Not connected
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="h-px bg-[#f0f3f7]" />

        {/* Account info or empty state */}
        {isConnected ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden"
              style={{ backgroundColor: platform.brandColor }}
            >
              {account.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={account.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{account.username?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1a1f36] truncate">
                @{account.username ?? "Unknown"}
              </p>
              {expired ? (
                <p className="text-[10px] text-orange-500 font-medium">Re-authorize to restore</p>
              ) : account.expiresAt ? (
                <p className="text-[10px] text-[#8792a2]">
                  Expires {new Date(account.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              ) : (
                <p className="text-[10px] text-[#09825d] font-medium flex items-center gap-1">
                  <CheckCheck className="w-2.5 h-2.5" />
                  Token active
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#8792a2] leading-relaxed">
            Connect your {platform.name} account to schedule posts and track engagement.
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-1.5">
          {expired && (
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: platform.brandColor }}
              onClick={() => onConnect(platform.id)}
            >
              <RefreshCw className="w-3 h-3" />
              Reconnect
            </button>
          )}

          {!isConnected && (
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all active:scale-[0.98] shadow-[0_1px_2px_rgba(60,66,87,0.08)]"
              onClick={() => onConnect(platform.id)}
            >
              <Plus className="w-3.5 h-3.5" style={{ color: platform.brandColor }} />
              Connect {platform.name}
            </button>
          )}

          {isConnected && (
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8792a2] hover:text-[#e63757] hover:bg-[#fff5f5] transition-all active:scale-[0.98] disabled:opacity-50"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Unlink className="w-3 h-3" />
              }
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
