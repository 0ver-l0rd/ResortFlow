"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Send, 
  Plus, 
  Search, 
  MoreVertical, 
  Settings, 
  Sparkles,
  Zap,
  Clock,
  Loader2,
  Calendar,
  BarChart3,
  Repeat,
  ChevronRight,
  X,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCalls?: any[];
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface AgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentSidebar({ isOpen, onClose }: AgentSidebarProps) {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState("");
  const [activeTool, setActiveTool] = useState<{name: string, args: any} | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentId) {
      fetchMessages(currentId);
    } else {
      setMessages([]);
    }
  }, [currentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, activeTool]);

  const fetchConversations = async () => {
    const res = await fetch("/api/agent/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
    }
  };

  const fetchMessages = async (id: string) => {
    const res = await fetch(`/api/agent/conversations/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage, conversationId: currentId }),
      });

      if (!res.ok) throw new Error("Failed to connect to agent");

      const reader = res.body?.getReader();
      const decoder = new TextEncoder();
      if (!reader) return;

      let fullContent = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            const event = line.replace("event: ", "").trim();
            const dataLine = lines[lines.indexOf(line) + 1];
            if (dataLine && dataLine.startsWith("data: ")) {
              const data = JSON.parse(dataLine.replace("data: ", ""));

              if (event === "thinking") {
                setIsThinking(true);
                setThinkingStatus(data.status);
              } else if (event === "message") {
                setIsThinking(false);
                fullContent += data.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = fullContent;
                  return newMsgs;
                });
              } else if (event === "tool_call") {
                setActiveTool({ name: data.name, args: data.args });
              } else if (event === "tool_result") {
                setActiveTool(null);
              } else if (event === "done") {
                if (!currentId) {
                  setCurrentId(data.conversationId);
                  fetchConversations();
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setActiveTool(null);
    }
  };

  const suggestions = [
    "Schedule a post for next Tuesday at 3 PM.",
    "Show my top posts from last 30 days.",
    "Are there any Instagram auto-reply rules?",
    "Create posts for a summer weekend package."
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-screen w-[400px] bg-white border-l border-[#e3e8ef] shadow-[-16px_0_56px_rgba(17,17,26,0.1)] z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="h-14 px-6 border-b border-[#e3e8ef] flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#635bff]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#635bff]" />
              </div>
              <h2 className="text-sm font-bold text-[#1a1f36]">Social Copilot</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowHistory(!showHistory)}
                className="w-8 h-8 rounded-lg text-[#697386] hover:bg-[#f6f9fc]"
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-[#697386] hover:bg-[#f6f9fc]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* History Overlay */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 z-20 bg-white flex flex-col"
                >
                  <div className="p-4 border-b border-[#e3e8ef] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8792a2] uppercase tracking-widest">History</span>
                    <Button 
                      onClick={() => { setCurrentId(null); setShowHistory(false); }}
                      variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#635bff]"
                    >
                      New Chat
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => { setCurrentId(conv.id); setShowHistory(false); }}
                          className={cn(
                            "w-full text-left p-3 rounded-xl transition-all",
                            currentId === conv.id ? "bg-[#f6f9fc] border border-[#e3e8ef]" : "hover:bg-[#f6f9fc]"
                          )}
                        >
                          <p className={cn("text-sm font-semibold truncate", currentId === conv.id ? "text-[#635bff]" : "text-[#3c4257]")}>
                            {conv.title}
                          </p>
                          <span className="text-[10px] text-[#8792a2]">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Thread */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-6 space-y-6">
                {messages.length === 0 && !isLoading && (
                  <div className="py-12 px-2 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#635bff]/5 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-[#635bff]" />
                    </div>
                    <h3 className="text-lg font-black text-[#1a1f36] mb-2">How can I help today?</h3>
                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">
                      Strategies, schedules, or analytics—just ask.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestions.map((s, i) => (
                        <button 
                          key={i}
                          onClick={() => setInput(s)}
                          className="p-3 rounded-xl border border-[#e3e8ef] bg-white text-[11px] font-bold text-[#3c4257] hover:border-[#635bff] hover:bg-[#fcfdfe] transition-all text-left"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <Avatar className="w-7 h-7 border bg-white shadow-sm shrink-0">
                      {msg.role === "assistant" ? (
                        <AvatarFallback className="bg-white text-[#635bff]"><Zap className="w-3.5 h-3.5" /></AvatarFallback>
                      ) : (
                        <AvatarImage src={user?.imageUrl} />
                      )}
                    </Avatar>
                    <div className={cn(
                      "p-3 rounded-2xl text-[13px] leading-relaxed",
                      msg.role === "user" 
                        ? "bg-[#1a1f36] text-white" 
                        : "bg-[#f6f9fc] text-[#3c4257] border border-[#e3e8ef]"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex gap-3">
                    <Avatar className="w-7 h-7 border bg-white shadow-sm shrink-0">
                      <AvatarFallback className="bg-white text-[#635bff]"><Zap className="w-3.5 h-3.5" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-[#f6f9fc] border border-[#e3e8ef] p-3 rounded-2xl flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-[#635bff] animate-spin" />
                      <span className="text-[10px] font-bold text-[#635bff] uppercase tracking-wider">
                        {thinkingStatus || "Thinking..."}
                      </span>
                    </div>
                  </div>
                )}

                {activeTool && (
                  <Card className="border-[#e3e8ef] shadow-sm rounded-xl overflow-hidden ml-10">
                    <div className="p-3 bg-[#fcfdfe] border-b border-[#e3e8ef] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#635bff]" />
                        <span className="text-[10px] font-bold text-[#1a1f36] uppercase tracking-wider">
                          Tool Call
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-[#635bff]/10 text-[#635bff] border-none font-bold text-[9px]">
                        RUNNING
                      </Badge>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-bold text-[#1a1f36]">{activeTool.name}</p>
                    </div>
                  </Card>
                )}
              </div>
            </ScrollArea>

            {/* Input Box */}
            <div className="p-6 pt-2 shrink-0 bg-white">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#635bff] to-[#a3a1ff] rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition" />
                <div className="relative bg-white border border-[#e3e8ef] rounded-2xl p-2 shadow-sm focus-within:border-[#635bff] transition-all">
                  <Textarea
                    placeholder="Ask your copilot..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="border-none focus-visible:ring-0 resize-none px-3 pt-2 pb-1 text-sm font-medium text-[#1a1f36] placeholder:text-slate-400 min-h-[44px]"
                  />
                  <div className="flex items-center justify-end px-1 pb-1">
                    <Button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      size="sm"
                      className="h-8 rounded-lg bg-[#635bff] hover:bg-[#4f46e5] text-white text-[11px] font-bold transition-all shadow-md active:scale-95 px-4"
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Send</>}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[9px] font-bold text-[#8792a2] uppercase tracking-widest opacity-60">
                Strategic Agent — Gemini 1.5 Flash
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
