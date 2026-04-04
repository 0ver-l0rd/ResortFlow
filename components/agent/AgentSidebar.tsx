"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Send, Sparkles, Zap, Clock, Loader2, X, Plus,
  CheckCircle2, XCircle, Terminal, ChevronDown, ChevronUp,
  Calendar, BarChart3, MessageSquare, RefreshCw, ArrowRight,
} from "lucide-react";
import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractiveUI } from "./InteractiveUI";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface ToolEvent {
  id: string;
  name: string;
  args: any;
  result?: any;
  success?: boolean;
  status: "running" | "done" | "error";
  startedAt: number;
  finishedAt?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolEvents?: ToolEvent[];
  thinking?: string;
  isStreaming?: boolean;
  error?: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface MessageAction {
  messageId: string;
  toolName: string;
  value: any;
}

interface AgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ──────────────────────────────────────────────
// Tool meta (icon + label per tool name)
// ──────────────────────────────────────────────
const TOOL_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  composePosts:       { label: "Composing post",         icon: <Send className="w-3 h-3" />,        color: "text-violet-600 bg-violet-50 border-violet-200" },
  getPosts:           { label: "Fetching posts",         icon: <MessageSquare className="w-3 h-3" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
  getCalendar:        { label: "Reading calendar",       icon: <Calendar className="w-3 h-3" />,     color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  schedulePost:       { label: "Scheduling post",        icon: <Calendar className="w-3 h-3" />,     color: "text-amber-600 bg-amber-50 border-amber-200" },
  getConnectedAccounts:{ label: "Checking accounts",    icon: <Zap className="w-3 h-3" />,          color: "text-sky-600 bg-sky-50 border-sky-200" },
  listAutoReplyRules: { label: "Loading auto-replies",   icon: <RefreshCw className="w-3 h-3" />,    color: "text-pink-600 bg-pink-50 border-pink-200" },
  getAnalyticsOverview:{ label: "Pulling analytics",    icon: <BarChart3 className="w-3 h-3" />,    color: "text-orange-600 bg-orange-50 border-orange-200" },
  askClarification:   { label: "Asking for clarity",    icon: <MessageSquare className="w-3 h-3" />, color: "text-slate-600 bg-slate-50 border-slate-200" },
  confirmAction:      { label: "Requesting confirmation",icon: <CheckCircle2 className="w-3 h-3" />, color: "text-green-600 bg-green-50 border-green-200" },
  rememberPreference: { label: "Saving preference",     icon: <Terminal className="w-3 h-3" />,     color: "text-purple-600 bg-purple-50 border-purple-200" },
  getBestTime:        { label: "Finding best time",     icon: <Clock className="w-3 h-3" />,        color: "text-teal-600 bg-teal-50 border-teal-200" },
};

// ──────────────────────────────────────────────
// ToolCard component
// ──────────────────────────────────────────────
function ToolCard({ event }: { event: ToolEvent }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TOOL_META[event.name] ?? {
    label: event.name,
    icon: <Terminal className="w-3 h-3" />,
    color: "text-slate-600 bg-slate-50 border-slate-200",
  };

  const duration =
    event.finishedAt && event.startedAt
      ? ((event.finishedAt - event.startedAt) / 1000).toFixed(2)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "rounded-xl border text-[11px] overflow-hidden",
        meta.color
      )}
    >
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="shrink-0">{meta.icon}</span>
        <span className="flex-1 font-semibold truncate">{meta.label}</span>

        {event.status === "running" && (
          <div className="relative flex items-center justify-center w-3 h-3">
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="absolute inset-0 bg-current rounded-full"
             />
             <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0 z-10" />
          </div>
        )}
        {event.status === "done" && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          </motion.div>
        )}
        {event.status === "error" && (
          <XCircle className="w-3 h-3 text-red-500 shrink-0" />
        )}

        {(event.result || event.args) && (
          expanded
            ? <ChevronUp className="w-3 h-3 opacity-40 shrink-0" />
            : <ChevronDown className="w-3 h-3 opacity-40 shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-current/10 overflow-hidden"
          >
            <div className="px-3 py-2 space-y-2">
              {event.args && Object.keys(event.args).length > 0 && (
                <div>
                  <p className="font-bold opacity-60 mb-1">INPUT</p>
                  <pre className="text-[10px] whitespace-pre-wrap break-all opacity-70 font-mono bg-black/5 rounded-lg p-2">
                    {JSON.stringify(event.args, null, 2)}
                  </pre>
                </div>
              )}
              {event.result && (
                <div>
                  <p className="font-bold opacity-60 mb-1">OUTPUT</p>
                  <pre className="text-[10px] whitespace-pre-wrap break-all opacity-70 font-mono bg-black/5 rounded-lg p-2">
                    {JSON.stringify(event.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// MessageBubble component
// ──────────────────────────────────────────────
function MessageBubble({ 
  msg, 
  userImageUrl, 
  onInteractiveAction,
  completedAction
}: { 
  msg: Message; 
  userImageUrl?: string;
  onInteractiveAction?: (toolName: string, value: any) => void;
  completedAction?: any;
}) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <Avatar className="w-7 h-7 border border-[#e3e8ef] bg-white shadow-sm shrink-0 mt-0.5">
        {isUser ? (
          <>
            <AvatarImage src={userImageUrl} />
            <AvatarFallback className="bg-[#1a1f36] text-white text-[10px] font-bold">U</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-[#635bff] to-[#a3a1ff] text-white">
            <Sparkles className="w-3 h-3" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Content */}
      <div className={cn("flex flex-col gap-2 max-w-[88%]", isUser ? "items-end" : "items-start")}>
        {/* Tool events (assistant only) */}
        {!isUser && msg.toolEvents && msg.toolEvents.length > 0 && (
          <div className="w-full space-y-1.5">
            {msg.toolEvents.map((ev) => (
              <ToolCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        {/* Integrated Interactive UI for Clarifications/Confirmations */}
        {!isUser && msg.toolEvents?.map(ev => {
          if ((ev.name === "askClarification" || ev.name === "confirmAction") && ev.status === "done" && ev.result) {
            const data = ev.result;
            const uiType = data.uiType || (data.isConfirmation ? "buttons" : null);
            
            if (uiType) {
              return (
                <InteractiveUI
                  key={`ui-${ev.id}`}
                  type={uiType as any}
                  question={data.question || data.action}
                  postData={data.postData}
                  options={data.options || (data.isConfirmation ? ["Confirm", "Cancel"] : [])}
                  isCompleted={!!completedAction && completedAction.messageId === msg.id && completedAction.toolName === ev.name}
                  selectedValue={completedAction?.messageId === msg.id ? completedAction.value : undefined}
                  onAction={(val) => onInteractiveAction?.(ev.name, val)}
                />
              );
            }
          }
          return null;
        })}

        {/* Thinking status (assistant only) */}
        {!isUser && msg.thinking && !msg.content && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef] shadow-sm"
          >
            <div className="relative flex items-center justify-center w-3 h-3">
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#635bff] rounded-full"
              />
              <Sparkles className="w-2.5 h-2.5 text-[#635bff] animate-pulse z-10" />
            </div>
            <span className="text-[11px] font-bold text-[#635bff] tracking-tight truncate max-w-[180px]">
              {msg.thinking}
            </span>
          </motion.div>
        )}

        {/* Text content */}
        {msg.content && (
          <div className={cn(
            "px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
            isUser
              ? "bg-[#1a1f36] text-white rounded-tr-md"
              : "bg-white border border-[#e3e8ef] text-[#3c4257] shadow-sm rounded-tl-md"
          )}>
            <TextWithMarkdown content={msg.content} />
            {msg.isStreaming && (
              <span className="inline-block w-1 h-3.5 bg-[#635bff] rounded-sm ml-0.5 animate-pulse" />
            )}
          </div>
        )}

        {/* Error */}
        {msg.error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] font-semibold text-red-600">{msg.error}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Simple markdown-ish renderer
// ──────────────────────────────────────────────
function TextWithMarkdown({ content }: { content: string }) {
  // Split on double newlines for paragraphs, handle **bold** and `code`
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-1.5">
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n");
        return (
          <div key={pi} className="space-y-0.5">
            {lines.map((line, li) => {
              // Bold: **text**
              const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
              return (
                <p key={li} className={line.startsWith("- ") || line.startsWith("• ") ? "flex gap-1.5" : ""}>
                  {line.startsWith("- ") || line.startsWith("• ") ? (
                    <>
                      <span className="text-[#635bff] font-bold mt-0.5">•</span>
                      <span>
                        {renderInline(line.replace(/^[-•]\s/, ""))}
                      </span>
                    </>
                  ) : (
                    renderInline(line)
                  )}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-[#1a1f36]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="font-mono text-[11px] bg-[#f0f0ff] text-[#635bff] px-1 rounded">{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ──────────────────────────────────────────────
// Main AgentSidebar
// ──────────────────────────────────────────────
export function AgentSidebar({ isOpen, onClose }: AgentSidebarProps) {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, MessageAction>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 40);
  }, []);

  useEffect(() => { if (isOpen) fetchConversations(); }, [isOpen]);
  useEffect(() => {
    if (currentId) fetchMessages(currentId);
    else setMessages([]);
  }, [currentId]);
  useEffect(scrollToBottom, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/agent/conversations");
      if (res.ok) setConversations(await res.json());
    } catch {}
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`/api/agent/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages((data.messages || []).map((m: any, i: number) => ({
          id: `hist-${i}`,
          role: m.role,
          content: m.content,
        })));
      }
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message immediately
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: "user", content: userMessage }]);

    // Add placeholder assistant message
    const asstMsgId = `asst-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: asstMsgId,
      role: "assistant",
      content: "",
      thinking: "Reading your request...",
      toolEvents: [],
      isStreaming: true,
    }]);
    scrollToBottom();

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, conversationId: currentId }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Agent request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const updateAsst = (updater: (prev: Message) => Message) => {
        setMessages(prev => prev.map(m => m.id === asstMsgId ? updater(m) : m));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let i = 0;
        while (i < lines.length) {
          const line = lines[i].trim();
          if (line.startsWith("event: ")) {
            const eventName = line.slice(7).trim();
            const dataLine = lines[i + 1]?.trim() ?? "";
            if (dataLine.startsWith("data: ")) {
              try {
                const data = JSON.parse(dataLine.slice(6));

                switch (eventName) {
                  case "thinking":
                    updateAsst(m => ({ ...m, thinking: data.status, content: m.content || "" }));
                    break;

                  case "message":
                    updateAsst(m => ({
                      ...m,
                      thinking: undefined,
                      content: (m.content || "") + (data.text || ""),
                    }));
                    scrollToBottom();
                    break;

                  case "tool_call":
                    updateAsst(m => ({
                      ...m,
                      thinking: undefined,
                      toolEvents: [
                        ...(m.toolEvents || []),
                        {
                          id: `tool-${Date.now()}-${data.name}`,
                          name: data.name,
                          args: data.args,
                          status: "running",
                          startedAt: Date.now(),
                        },
                      ],
                    }));
                    scrollToBottom();
                    break;

                  case "tool_result":
                    updateAsst(m => ({
                      ...m,
                      toolEvents: (m.toolEvents || []).map(ev =>
                        ev.name === data.name && ev.status === "running"
                          ? {
                              ...ev,
                              result: data.result,
                              success: data.success,
                              status: data.success ? "done" : "error",
                              finishedAt: Date.now(),
                            }
                          : ev
                      ),
                    }));
                    break;

                  case "done":
                    if (!currentId && data.conversationId) {
                      setCurrentId(data.conversationId);
                      fetchConversations();
                    }
                    updateAsst(m => ({ ...m, isStreaming: false, thinking: undefined }));
                    break;

                  case "error":
                    updateAsst(m => ({
                      ...m,
                      isStreaming: false,
                      thinking: undefined,
                      error: data.message || "An error occurred",
                      content: m.content || "",
                    }));
                    break;
                }
              } catch {}
              i += 2;
              continue;
            }
          }
          i++;
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages(prev => prev.map(m =>
          m.id === asstMsgId
            ? { ...m, isStreaming: false, thinking: undefined, error: err.message || "Connection failed" }
            : m
        ));
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
      // Mark streaming done just in case
      setMessages(prev => prev.map(m =>
        m.id === asstMsgId ? { ...m, isStreaming: false, thinking: undefined } : m
      ));
    }
  };

  const handleInteractiveAction = async (toolName: string, value: any) => {
    // 1. Mark as completed locally
    const lastAsstMsg = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAsstMsg) return;

    setCompletedActions(prev => ({
      ...prev,
      [lastAsstMsg.id]: { messageId: lastAsstMsg.id, toolName, value }
    }));

    // 2. Format as a follow-up message to the agent
    let followUpText = "";
    if (toolName === "askClarification") {
      followUpText = typeof value === "string" && value.startsWith("http") 
        ? `[Media Attached]: ${value}` 
        : `[Choice Selected]: ${value}`;
    } else if (toolName === "confirmAction") {
      followUpText = value === "Confirm" ? "Yes, please proceed." : "No, let's cancel that.";
    }

    // 3. Send to agent
    setInput(followUpText);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setCurrentId(null);
    setMessages([]);
    setShowHistory(false);
  };

  const suggestions = [
    { icon: <FaXTwitter className="w-3.5 h-3.5 text-sky-500" />, text: "Post a tweet about our summer offers now" },
    { icon: <Calendar className="w-3.5 h-3.5 text-violet-500" />, text: "What's on my content calendar this week?" },
    { icon: <BarChart3 className="w-3.5 h-3.5 text-orange-500" />, text: "Give me an analytics overview" },
    { icon: <FaInstagram className="w-3.5 h-3.5 text-pink-500" />, text: "Schedule an Instagram post for tomorrow 9 AM" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 240 }}
          className="fixed top-0 right-0 h-screen w-[420px] bg-white border-l border-[#e3e8ef] shadow-[-20px_0_60px_rgba(17,17,26,0.08)] z-[100] flex flex-col"
        >
          {/* ── Header ── */}
          <div className="h-14 px-5 border-b border-[#e3e8ef] flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#635bff] to-[#a3a1ff] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1a1f36] leading-none">Social Copilot</h2>
                <p className="text-[10px] text-[#8792a2] font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  GPT-4o · Ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon"
                onClick={handleNewChat}
                title="New conversation"
                className="w-8 h-8 rounded-lg text-[#697386] hover:bg-[#f6f9fc]"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={() => setShowHistory(!showHistory)}
                title="History"
                className={cn("w-8 h-8 rounded-lg hover:bg-[#f6f9fc]", showHistory ? "text-[#635bff] bg-[#f6f9fc]" : "text-[#697386]")}
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-[#697386] hover:bg-[#f6f9fc]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* History panel */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="absolute inset-0 z-20 bg-white flex flex-col"
                >
                  <div className="px-5 py-3.5 border-b border-[#e3e8ef] flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#8792a2] uppercase tracking-widest">Conversations</span>
                    <Button onClick={handleNewChat} variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-[#635bff] hover:bg-[#f6f9fc]">
                      + New
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-1">
                      {conversations.length === 0 && (
                        <p className="text-[12px] text-[#8792a2] text-center py-8">No conversations yet</p>
                      )}
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => { setCurrentId(conv.id); setShowHistory(false); }}
                          className={cn(
                            "w-full text-left p-3 rounded-xl transition-all group",
                            currentId === conv.id
                              ? "bg-[#635bff]/5 border border-[#635bff]/20"
                              : "hover:bg-[#f6f9fc] border border-transparent"
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-[#635bff]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <MessageSquare className="w-3 h-3 text-[#635bff]" />
                            </div>
                            <div className="min-w-0">
                              <p className={cn("text-[12px] font-semibold truncate", currentId === conv.id ? "text-[#635bff]" : "text-[#3c4257]")}>
                                {conv.title || "Untitled"}
                              </p>
                              <span className="text-[10px] text-[#8792a2]">
                                {new Date(conv.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat thread */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-5">
                {/* Empty state */}
                {messages.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#635bff]/10 to-[#a3a1ff]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-[#635bff]" />
                    </div>
                    <h3 className="text-[15px] font-black text-[#1a1f36] mb-1.5">Your AI Agent</h3>
                    <p className="text-[12px] text-slate-500 font-medium mb-6 leading-relaxed max-w-[260px] mx-auto">
                      Compose, schedule, and publish posts across your connected platforms — just describe what you want.
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          onClick={() => setInput(s.text)}
                          className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-[#e3e8ef] bg-[#fafbfc] hover:border-[#635bff]/30 hover:bg-white hover:shadow-sm transition-all text-left group"
                        >
                          <span className="shrink-0">{s.icon}</span>
                          <span className="text-[12px] font-semibold text-[#3c4257] group-hover:text-[#635bff] transition-colors">{s.text}</span>
                          <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity text-[#635bff]" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Messages */}
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    userImageUrl={user?.imageUrl} 
                    onInteractiveAction={handleInteractiveAction}
                    completedAction={completedActions[msg.id]}
                  />
                ))}
              </div>
            </div>

            {/* ── Input ── */}
            <div className="p-4 pt-2 shrink-0 border-t border-[#e3e8ef] bg-white">
              <div className="relative">
                <div className="relative bg-[#f6f9fc] border border-[#e3e8ef] rounded-2xl focus-within:border-[#635bff] focus-within:bg-white focus-within:shadow-sm transition-all">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask your copilot to post, schedule, or analyse..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    className="border-none focus-visible:ring-0 resize-none px-4 pt-3 pb-10 text-[13px] font-medium text-[#1a1f36] placeholder:text-[#b0bbc8] bg-transparent min-h-[52px] max-h-32"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    {isLoading ? (
                      <Button
                        onClick={handleStop}
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 px-3"
                      >
                        Stop
                      </Button>
                    ) : null}
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      size="sm"
                      className="h-8 rounded-xl bg-[#635bff] hover:bg-[#4f46e5] text-white text-[11px] font-bold px-3.5 shadow-md shadow-[#635bff]/20 transition-all active:scale-95 disabled:opacity-40"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[9px] font-bold text-[#c4cdd8] uppercase tracking-widest">
                GPT-4o · Social Copilot Agent
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
