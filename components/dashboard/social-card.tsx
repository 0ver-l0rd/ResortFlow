"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  username: string | null;
  avatarUrl: string | null;
  expiresAt: string | null;
}

interface SocialCardProps {
  platform: {
    id: string;
    name: string;
    icon: any;
    color: string;
  };
  account?: SocialAccount;
  onConnect: (platformId: string) => void;
  onDisconnect: (accountId: string) => void;
}

export function SocialCard({ platform, account, onConnect, onDisconnect }: SocialCardProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const isConnected = !!account;

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
    <Card className="bg-[#0f0f1a] border-[#1e1e2e] hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
      <div className={`h-1.5 w-full ${platform.color}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-opacity-10 ${platform.color} bg-current`}>
            <platform.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">{platform.name}</h3>
            <p className="text-xs text-slate-400">
              {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        {isConnected && (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 px-2">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pb-6">
        {isConnected ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1e1e2e]/50 border border-[#334155]/30">
            <Avatar className="w-10 h-10 border-2 border-purple-500/20">
              <AvatarImage src={account.avatarUrl || ""} />
              <AvatarFallback className="bg-purple-600">
                {account.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">@{account.username}</span>
              <span className="text-[10px] text-slate-500 truncate">ID: {account.id.slice(0, 8)}...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1e1e2e] flex items-center justify-center mb-2 text-slate-600">
              <platform.icon className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-xs text-slate-500 max-w-[180px]">
              Connect your {platform.name} account to start scheduling posts.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {isConnected ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-2 rounded-xl font-bold"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Disconnect
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="w-full bg-white text-black hover:bg-slate-200 gap-2 rounded-xl font-bold"
            onClick={() => onConnect(platform.id)}
          >
            <ExternalLink className="w-4 h-4" />
            Connect {platform.name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
