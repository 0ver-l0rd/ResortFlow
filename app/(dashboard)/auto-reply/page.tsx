"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Loader2, 
  Settings2, 
  History, 
  Trash2, 
  MoreVertical, 
  Edit3, 
  MessageSquareOff, 
  Zap, 
  MessageCircle, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

import { RuleBuilderForm } from "@/components/auto-reply/rule-builder-form";
import { ReplyLogsTable } from "@/components/auto-reply/reply-logs-table";

export default function AutoReplyPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auto-reply/rules");
      if (res.ok) {
        setRules(await res.json());
      }
    } catch (error) {
      toast.error("Failed to load auto-reply rules.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/auto-reply/rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
        toast.success(`Rule ${!currentStatus ? "activated" : "deactivated"}`);
      }
    } catch {
      toast.error("Failed to update rule status.");
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const res = await fetch(`/api/auto-reply/rules/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.id !== id));
        toast.success("Rule deleted successfully.");
      }
    } catch {
      toast.error("Failed to delete rule.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary fill-primary/10" />
            Auto-Reply AI
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Automate your social media interactions using personalized templates or Gemini AI agents.
          </p>
        </div>
        <RuleBuilderForm onSuccess={fetchRules} />
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="bg-background p-1 border rounded-xl mb-6 shadow-sm overflow-hidden">
          <TabsTrigger value="rules" className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all">
            <Settings2 className="w-4 h-4" />
            Rules Engine
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all">
            <History className="w-4 h-4" />
            Reply History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4 focus-visible:outline-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Synchronizing rules...</p>
            </div>
          ) : rules.length === 0 ? (
            <Card className="border-2 border-dashed shadow-none bg-muted/30 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center mb-6">
                  <MessageSquareOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">No active rules found</CardTitle>
                <CardDescription className="max-w-xs mt-2">
                  Get started by creating your first auto-reply rule to handle incoming comments automatically.
                </CardDescription>
                <div className="mt-8">
                   <RuleBuilderForm onSuccess={fetchRules} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rules.map((rule) => {
                const keywordCount = Array.isArray(rule.keywords) ? rule.keywords.length : 0;
                
                return (
                  <Card key={rule.id} className={`
                    relative group transition-all duration-200 overflow-hidden
                    ${!rule.isActive ? 'opacity-70 bg-muted/50' : 'bg-background'}
                  `}>
                    {!rule.isActive && (
                      <div className="absolute top-0 right-12 mt-4">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-muted-foreground">Paused</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3 px-6 pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold leading-tight truncate max-w-[180px]">
                            {rule.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize text-[10px] font-bold px-1.5 py-0 border-muted bg-background">
                              {rule.platform}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => toggleRule(rule.id, rule.isActive)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground" />} />
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Edit3 className="w-4 h-4" /> Edit
                              </DropdownMenuItem>
                              
                              <AlertDialog>
                                <AlertDialogTrigger render={
                                  <DropdownMenuItem 
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                    variant="destructive"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </DropdownMenuItem>
                                } />
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This rule and all its associated configuration will be permanently deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteRule(rule.id)}
                                      variant="destructive"
                                    >
                                      Delete Rule
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-6 space-y-4">
                      <div className="flex items-center justify-between py-2 border-y">
                         <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Trigger</p>
                            <p className="text-xs font-semibold">
                              {rule.triggerType === "any_comment" ? "Any incoming comment" : 
                               rule.triggerType === "keyword" ? `${keywordCount} matched words` : 
                               "First comment only"}
                            </p>
                         </div>
                         <div className="text-right space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Replied</p>
                            <p className="text-xs font-bold text-primary flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {rule.replyCount} times
                            </p>
                         </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Response logic</p>
                          {rule.useAI ? (
                            <Badge className="text-[9px] bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none h-4 px-1.5 shadow-sm">AI Agent</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] border-muted text-muted-foreground h-4 px-1.5">Static Template</Badge>
                          )}
                        </div>
                        <div className="p-3 bg-muted/30 border rounded-xl group-hover:border-primary/20 transition-colors">
                           <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                             {rule.useAI ? rule.aiPrompt : rule.replyTemplate}
                           </p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Updated {formatDistanceToNow(new Date(rule.createdAt))} ago</span>
                        </div>
                        <div className="flex gap-1">
                           {rule.keywords?.slice(0, 2).map((k: string) => (
                             <Badge key={k} variant="outline" className="text-[9px] h-4 font-medium border-muted bg-background text-muted-foreground">
                               {k}
                             </Badge>
                           ))}
                           {keywordCount > 2 && (
                             <span className="text-[9px] text-muted-foreground font-bold">+{keywordCount - 2}</span>
                           )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="focus-visible:outline-none">
          <ReplyLogsTable />
        </TabsContent>
      </Tabs>

      {/* ── Guidance Content ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <div className="p-6 rounded-2xl bg-background border shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
             <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">AI Logic Tips</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              When using Gemini AI, describe the persona you want it to adopt. 
              Example: <span className="italic font-medium text-foreground">"Act as a professional support agent. If a user asks about price, point them to our pricing page, otherwise thank them."</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-background border shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
             <Smartphone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold">Platform Coverage</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Auto-replies are currently supported for <span className="font-semibold text-foreground">Instagram, Twitter, and Facebook</span> Business pages. 
              Ensure you have the <span className="font-semibold text-foreground">Manage Comments</span> permission granted in your connection settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
