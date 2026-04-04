"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Hash, Smile, Upload, Calendar, Send, Clock,
  ChevronRight, ChevronLeft, Check, X, AlertTriangle,
  Eye, Bot, Wand2, Loader2, Film, FileImage, ZapIcon,
  Heart, MessageCircle, Repeat2, Share, Bookmark, ThumbsUp, MoreHorizontal, BarChart2,
  Crop, Sliders, Sun, Move, Maximize, Scissors, Eraser
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaPinterestP } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useDropzone } from "react-dropzone";

// ── Types ────────────────────────────────────────────────────────────────────

interface PlatformDef {
  id: string; name: string; Icon: React.ElementType;
  color: string; bg: string; charLimit: number | null;
  requiresVideo?: boolean; requiresMedia?: boolean;
}
interface MediaAsset { id: string; url: string; type: string; imageKitFileId: string; }
interface UploadedMedia { url: string; fileId: string; type: "image" | "video"; name: string; size?: number; }

// ── Config ───────────────────────────────────────────────────────────────────

const PLATFORMS: PlatformDef[] = [
  { id: "twitter",   name: "X (Twitter)",  Icon: FaXTwitter,   color: "#000000", bg: "#f0f0f0", charLimit: 280 },
  { id: "instagram", name: "Instagram",    Icon: FaInstagram,  color: "#E1306C", bg: "#fdf0f5", charLimit: 2200, requiresMedia: true },
  { id: "linkedin",  name: "LinkedIn",     Icon: FaLinkedinIn, color: "#0077B5", bg: "#eef6fb", charLimit: 3000 },
  { id: "facebook",  name: "Facebook",     Icon: FaFacebookF,  color: "#1877F2", bg: "#eef3fd", charLimit: 63206 },
  { id: "youtube",   name: "YouTube",      Icon: FaYoutube,    color: "#FF0000", bg: "#fff0f0", charLimit: 5000, requiresVideo: true },
  { id: "tiktok",    name: "TikTok",       Icon: SiTiktok,     color: "#010101", bg: "#f0f0f0", charLimit: 2200, requiresVideo: true },
  { id: "pinterest", name: "Pinterest",    Icon: FaPinterestP, color: "#E60023", bg: "#fff0f1", charLimit: 500, requiresMedia: true },
];

const STEPS = ["Content", "Media", "Platforms", "Schedule"] as const;
type Step = 0 | 1 | 2 | 3;
const DRAFT_KEY = "sc_compose_draft";

// ── AI Dialog ────────────────────────────────────────────────────────────────

function AIDialog({ onClose, onApply, platforms: selectedPlatforms, mode = "generate", initialContent = "" }: {
  onClose: () => void; onApply: (c: string, p: string) => void; platforms: string[]; mode?: "generate" | "enhance"; initialContent?: string;
}) {
  const [topic, setTopic] = useState(mode === "enhance" ? "Refining existing draft..." : "");
  const [tone, setTone] = useState("engaging");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState(selectedPlatforms[0] || "twitter");
  const TONES = ["engaging", "professional", "humorous", "inspirational", "informative", "casual"];

  const generate = async () => {
    if (mode === "generate" && !topic.trim()) { toast.error("Enter a topic first"); return; }
    setLoading(true);
    try {
      const endpoint = mode === "enhance" ? "/api/ai/enhance-post" : "/api/ai/generate-post";
      const body = mode === "enhance" 
        ? { content: initialContent, primaryPlatform }
        : { topic, tone, platforms: selectedPlatforms, primaryPlatform };

      const r = await fetch(endpoint, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body) 
      });
      const d = await r.json();
      const content = mode === "enhance" ? d.enhancedContent : d.content;
      if (content) setResult(content); else toast.error("Try again");
    } catch { toast.error("Processing failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-[#635bff44]" style={{ background: "rgba(26,31,54,0.45)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
        className="bg-white rounded-[24px] border border-[#e3e8ef] shadow-[0_32px_120px_-20px_rgba(60,66,87,0.25)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f3f7] bg-[#fcfdfe]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg shadow-[#635bff]/20" style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-black tracking-tight text-[#1a1f36]">{mode === "enhance" ? "Enhance with AI" : "Writer with AI"}</p>
              <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-widest">Platform-Specific Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3e8ef] flex items-center justify-center text-[#8792a2] hover:bg-white hover:text-[#635bff] hover:border-[#635bff]/20 transition-all active:scale-[0.95]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#8792a2]">Target Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.slice(0, 4).map(p => {
                const active = primaryPlatform === p.id;
                return (
                  <button key={p.id} onClick={() => setPrimaryPlatform(p.id)}
                    className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl border-2 transition-all ${active ? "border-[#635bff] bg-[#635bff]/4 shadow-sm" : "border-[#e3e8ef] hover:border-[#635bff]/20 bg-[#fcfdfe]"}`}>
                    <p.Icon className={`w-4 h-4 ${active ? "text-[#635bff]" : "text-[#8792a2]"}`} />
                    <span className={`text-[10px] font-bold tracking-tight ${active ? "text-[#1a1f36]" : "text-[#8792a2]"}`}>{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "generate" && (
            <div className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#8792a2]">Topic or idea</label>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
                placeholder="e.g. Summer sale, productivity tips, new product launch…"
                className="w-full px-4 py-3 text-[14px] font-medium leading-relaxed rounded-2xl border border-[#e3e8ef] bg-[#fcfdfe] text-[#1a1f36] placeholder:text-[#c4cdd6] resize-none focus:outline-none focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 transition-all" />
            </div>
          )}

          {mode === "generate" && (
            <div className="space-y-4">
              <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#8792a2]">Tone & Style</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`px-4 py-2 text-[12px] font-bold rounded-xl border transition-all capitalize ${tone === t ? "border-[#635bff] bg-[#635bff] text-white shadow-md shadow-[#635bff]/20" : "border-[#e3e8ef] text-[#697386] hover:border-[#635bff]/20 bg-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-[#635bff]/15 bg-[#fcfdfe] p-5 shadow-sm relative group">
                <div className="flex items-center justify-between mb-3">
                   <p className="text-[10px] font-black text-[#635bff] uppercase tracking-[0.3em]">AI Output: {primaryPlatform.toUpperCase()}</p>
                </div>
                <p className="text-[14px] text-[#3c4257] font-medium whitespace-pre-wrap leading-relaxed">{result}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-[#f0f3f7] bg-[#fcfdfe] flex gap-3">
          <button onClick={generate} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-extrabold text-white disabled:opacity-60 transition-all active:scale-[0.98] shadow-lg shadow-[#635bff]/25"
            style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Tailoring..." : result ? "Regenerate" : mode === "enhance" ? "Enhance for Platform" : "Generate Post"}
          </button>
          
          {result && (
            <button onClick={() => { onApply(result, topic); onClose(); }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-extrabold border-2 border-[#635bff] text-[#635bff] hover:bg-[#635bff]/5 transition-all active:scale-[0.98]">
              <Check className="w-4 h-4" /> Use This
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
// ── Image Editor Dialog ──────────────────────────────────────────────────────

function ImageEditorDialog({ 
  url, 
  onClose, 
  onSave 
}: { 
  url: string; 
  onClose: () => void; 
  onSave: (newUrl: string) => void; 
}) {
  // Extract base URL if it already has transformations
  const baseUrl = url.split("?")[0];
  const [aspect, setAspect] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [bgRemove, setBgRemove] = useState(false);
  const [smartFocus, setSmartFocus] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [appliedAiPrompt, setAppliedAiPrompt] = useState("");
  const [optimizing, setOptimizing] = useState(false);

  const ASPECT_RATIOS = [
    { name: "Original", value: null, icon: Maximize },
    { name: "Square", value: "1-1", icon: Crop, desc: "Instagram" },
    { name: "Portrait", value: "4-5", icon: ChevronLeft, desc: "IG / FB" },
    { name: "Story", value: "9-16", icon: Move, desc: "Reels / TikTok" },
    { name: "Landscape", value: "16-9", icon: ChevronRight, desc: "YouTube / X" },
  ];

  const FILTERS = [
    { name: "None", value: null },
    { name: "Grayscale", value: "e-grayscale" },
    { name: "Blur", value: "bl-10" },
    { name: "Sharpen", value: "e-sharpen" },
    { name: "Warm", value: "e-tint-red" },
  ];

  const optimizePrompt = async () => {
    if (!aiPrompt.trim()) return;
    setOptimizing(true);
    try {
      const r = await fetch("/api/ai/optimize-edit-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawPrompt: aiPrompt })
      });
      const d = await r.json();
      if (d.optimizedPrompt) {
        setAiPrompt(d.optimizedPrompt);
        toast.success("Prompt optimized ✨");
      }
    } catch { toast.error("Failed to optimize"); }
    finally { setOptimizing(false); }
  };

  const previewUrl = useMemo(() => {
    const tr = [];
    if (aspect) tr.push(`ar-${aspect},cm-extract`);
    if (smartFocus) tr.push("fo-auto");
    if (bgRemove) tr.push("bg-remove");
    if (filter) tr.push(filter);
    
    // AI Generative Edit - Only apply if manually triggered
    if (appliedAiPrompt.trim()) {
      const b64 = btoa(appliedAiPrompt.trim()).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      tr.push(`e-edit-prompte-${b64}`);
    }
    
    if (tr.length === 0) return baseUrl;
    return `${baseUrl}?tr=${tr.join(",")}`;
  }, [aspect, filter, bgRemove, smartFocus, appliedAiPrompt, baseUrl, filter]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(26,31,54,0.6)", backdropFilter: "blur(12px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] border border-[#e3e8ef] shadow-[0_32px_128px_-20px_rgba(60,66,87,0.3)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* Left: Preview */}
        <div className="flex-1 bg-[#f6f9fc] flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#635bff 1px, transparent 0)", backgroundSize: "16px 16px" }} />
          <div className="relative group">
             <img src={previewUrl} alt="Preview" className="max-w-full max-h-full rounded-xl shadow-2xl transition-all duration-500" style={{ transform: "translateZ(0)" }} />
             <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-80 border-l border-[#f0f3f7] flex flex-col bg-white">
          <div className="p-6 border-b border-[#f0f3f7] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight text-[#1a1f36]">Edit Image</h3>
              <p className="text-[11px] font-bold text-[#8792a2] uppercase tracking-widest">ImageKit Engine</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#f6f9fc] flex items-center justify-center text-[#8792a2] transition-colors"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Aspect Ratio */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                <Crop className="w-3 h-3" /> Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map(a => (
                  <button key={a.name} onClick={() => setAspect(a.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${aspect === a.value ? "border-[#635bff] bg-[#635bff]/4 shadow-sm" : "border-[#e3e8ef] hover:border-[#635bff]/20"}`}>
                    <a.icon className={`w-4 h-4 ${aspect === a.value ? "text-[#635bff]" : "text-[#8792a2]"}`} />
                    <div>
                      <p className={`text-[12px] font-bold ${aspect === a.value ? "text-[#1a1f36]" : "text-[#8792a2]"}`}>{a.name}</p>
                      {a.desc && <p className="text-[10px] text-[#c2c8d0] font-medium">{a.desc}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Features */}
            <div className="space-y-4">
               <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                <Wand2 className="w-3 h-3" /> AI Enhancements
              </label>
              <div className="space-y-2">
                <button onClick={() => setSmartFocus(!smartFocus)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${smartFocus ? "border-[#635bff] bg-[#635bff]/4" : "border-[#e3e8ef]"}`}>
                  <span className="text-xs font-bold text-[#3c4257]">Smart Object Focus</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${smartFocus ? "bg-[#635bff]" : "bg-[#e3e8ef]"}`}>
                    <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${smartFocus ? "right-1" : "left-1"}`} />
                  </div>
                </button>
                <button onClick={() => setBgRemove(!bgRemove)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${bgRemove ? "border-[#635bff] bg-[#635bff]/4" : "border-[#e3e8ef]"}`}>
                  <span className="text-xs font-bold text-[#3c4257]">Remove Background</span>
                  <Eraser className={`w-4 h-4 ${bgRemove ? "text-[#635bff]" : "text-[#8792a2]"}`} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#8792a2]">
                <Sliders className="w-3 h-3" /> Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map(f => (
                  <button key={f.name} onClick={() => setFilter(f.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${filter === f.value ? "border-[#635bff] bg-[#635bff] text-white shadow-md shadow-[#635bff]/20" : "border-[#e3e8ef] text-[#697386] hover:border-[#635bff]/20"}`}>
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Magic AI Edit */}
            <div className="space-y-4">
               <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#635bff]">
                <Sparkles className="w-3 h-3" /> Magic AI Edit
              </label>
              <div className="relative group">
                <textarea 
                  value={aiPrompt} 
                  onChange={e => setAiPrompt(e.target.value)} 
                  placeholder="e.g. Change posture to sitting, add a sunset background..."
                  rows={2}
                  className="w-full px-4 py-3 text-[12px] font-medium leading-relaxed rounded-xl border-2 border-[#635bff]/10 bg-[#fcfdfe] text-[#1a1f36] placeholder:text-[#c4cdd6] focus:border-[#635bff]/40 focus:outline-none transition-all pr-20"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <button onClick={optimizePrompt} disabled={optimizing || !aiPrompt}
                    title="Optimize with AI"
                    className="text-[#635bff] hover:text-[#7f78ff] disabled:opacity-30 transition-all p-1.5 rounded-lg hover:bg-[#635bff]/10">
                    {optimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setAppliedAiPrompt(aiPrompt); toast.success("AI Edit Applied! ✨"); }} 
                    disabled={!aiPrompt || aiPrompt === appliedAiPrompt}
                    title="Apply Magic Edit"
                    className="bg-[#635bff] text-white p-1.5 rounded-lg hover:bg-[#7f78ff] disabled:opacity-30 transition-all shadow-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-[#8792a2] font-semibold flex items-center gap-1.5 leading-tight">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Wait 5-8s for generative processing.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-[#f0f3f7] bg-[#fcfdfe] flex gap-3">
             <button onClick={onClose} className="flex-1 px-6 py-3 rounded-2xl text-[13px] font-extrabold text-[#697386] hover:bg-[#f6f9fc] transition-all active:scale-[0.98]">Cancel</button>
             <button onClick={() => onSave(previewUrl)}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-extrabold text-white transition-all active:scale-[0.98] shadow-lg shadow-[#635bff]/25"
              style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
               <Check className="w-4 h-4" /> Save Changes
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Platform Preview ──────────────────────────────────────────────────────────

function PlatformPreview({ platform, content, media, accounts = [] }: { platform: PlatformDef; content: string; media: UploadedMedia[]; accounts?: any[]; }) {
  const images = media.filter(m => m.type === "image").slice(0, 4);
  const video = media.find(m => m.type === "video");
  const noContent = <span className="text-[#c2c8d0] italic">Your post will appear here…</span>;

  const currentAccount = accounts.find(a => a.platform.toLowerCase() === platform.id.toLowerCase() || (platform.id === 'twitter' && a.platform.toLowerCase() === 'twitter / x'));

  // TWITTER
  if (platform.id === "twitter") return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden w-full max-w-lg shadow-sm font-sans mx-auto">
      <div className="p-4 flex gap-3">
        {currentAccount?.avatarUrl ? (
          <img src={currentAccount.avatarUrl} alt="" className="w-12 h-12 rounded-full shrink-0 object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0"></div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#0f1419] text-[15px]">{currentAccount?.username || "Your Name"}</span>
              <span className="text-[#536471] text-[15px]">@{currentAccount?.username || "YourHandle"}</span>
              <span className="text-[#536471] text-[15px]">·</span>
              <span className="text-[#536471] text-[15px]">Now</span>
            </div>
            <MoreHorizontal className="w-5 h-5 text-[#536471]" />
          </div>
          <div className="text-[#0f1419] text-[15px] whitespace-pre-wrap leading-[20px] mt-1 mb-3">
            {content || noContent}
          </div>
          {images.length > 0 && !video && (
            <div className={`grid gap-0.5 rounded-2xl overflow-hidden border border-[#cfd9de] mt-3 ${images.length === 1 ? 'grid-cols-1 aspect-[16/9]' : images.length === 2 ? 'grid-cols-2 aspect-[8/4]' : images.length === 3 ? 'grid-cols-2 aspect-[8/4]' : 'grid-cols-2 aspect-[8/4]'}`}>
              {images.map((img, i) => (
                <div key={i} className={`relative bg-slate-100 ${images.length === 3 && i === 0 ? 'row-span-2' : ''}`}>
                  <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {video && (
            <div className="rounded-2xl border border-[#cfd9de] overflow-hidden mt-3 aspect-video bg-black relative">
               <Film className="w-8 h-8 text-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
          <div className="flex justify-between items-center mt-3 text-[#536471] w-full max-w-[425px]">
            <span className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><MessageCircle className="w-[18px] h-[18px] group-hover:bg-blue-500/10 rounded-full" /></span>
            <span className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors"><Repeat2 className="w-[18px] h-[18px] group-hover:bg-green-500/10 rounded-full" /></span>
            <span className="flex items-center gap-2 group cursor-pointer hover:text-pink-500 transition-colors"><Heart className="w-[18px] h-[18px] group-hover:bg-pink-500/10 rounded-full" /></span>
            <span className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><BarChart2 className="w-[18px] h-[18px] group-hover:bg-blue-500/10 rounded-full" /></span>
            <span className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><Share className="w-[18px] h-[18px] group-hover:bg-blue-500/10 rounded-full" /></span>
          </div>
        </div>
      </div>
    </div>
  );

  // INSTAGRAM
  if (platform.id === "instagram") return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden w-full max-w-[350px] shadow-sm font-sans mx-auto pb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
            <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden bg-slate-200"></div>
          </div>
          <span className="font-semibold text-sm text-black">your_handle</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-black" />
      </div>
      <div className="w-full aspect-square bg-[#fafafa] relative flex items-center justify-center">
        {images.length > 0 ? (
          <img src={images[0].url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : video ? (
          <Film className="w-10 h-10 text-slate-300 relative z-10" />
        ) : (
          <FileImage className="w-10 h-10 text-slate-300 relative z-10" />
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <Heart className="w-[24px] h-[24px] text-black hover:text-slate-500 cursor-pointer" />
            <MessageCircle className="w-[24px] h-[24px] text-black hover:text-slate-500 cursor-pointer" style={{ transform: "scaleX(-1)" }} />
            <Send className="w-[24px] h-[24px] text-black hover:text-slate-500 cursor-pointer" />
          </div>
          <Bookmark className="w-[24px] h-[24px] text-black hover:text-slate-500 cursor-pointer" />
        </div>
        <div className="font-semibold text-[14px] leading-none mb-2 text-black">1,337 likes</div>
        <div className="text-[14px] text-black">
          <span className="font-semibold mr-1.5">your_handle</span>
          <span className="whitespace-pre-wrap">{content || noContent}</span>
        </div>
      </div>
    </div>
  );

  // LINKEDIN
  if (platform.id === "linkedin") return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden w-full max-w-lg shadow-sm font-sans mx-auto">
      <div className="p-4 flex gap-3 pb-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0"></div>
        <div className="flex-1">
          <div className="font-semibold text-[14px] text-black/90">Your Name</div>
          <div className="text-[12px] text-black/60">Your Professional Title</div>
          <div className="text-[12px] text-black/60 flex items-center gap-1">Just now • 🌐</div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-black/60" />
      </div>
      <div className="px-4 pb-2 text-[14px] text-black/90 whitespace-pre-wrap">
        {content || noContent}
      </div>
      {images.length > 0 && (
        <img src={images[0].url} alt="" className="w-full max-h-[400px] object-cover" />
      )}
      {video && !images.length && (
         <div className="w-full aspect-video bg-black flex items-center justify-center"><Film className="w-10 h-10 text-white/50" /></div>
      )}
      <div className="px-4 py-1.5 border-t border-slate-200 mt-2 flex justify-between">
        {[
          { label: "Like", icon: ThumbsUp },
          { label: "Comment", icon: MessageCircle },
          { label: "Repost", icon: Repeat2 },
          { label: "Send", icon: Send }
        ].map(action => (
          <button key={action.label} className="flex items-center gap-1.5 text-[#666666] text-[14px] font-semibold hover:bg-slate-100 px-3 py-2 rounded-md transition-colors">
            <action.icon className="w-[18px] h-[18px] -scale-x-100" /> {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  // FACEBOOK
  if (platform.id === "facebook") return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden w-full max-w-lg shadow-sm font-sans mx-auto pb-2">
      <div className="p-4 pb-2 flex gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
        <div className="flex-1">
          <div className="font-semibold text-[15px] text-[#050505]">Your Page</div>
          <div className="text-[13px] text-[#65676B] flex items-center gap-1">Just now • 🌍</div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-[#65676B]" />
      </div>
      <div className="px-4 pb-3 text-[15px] text-[#050505] whitespace-pre-wrap">
        {content || noContent}
      </div>
      {images.length > 0 && (
        <img src={images[0].url} alt="" className="w-full max-h-[500px] object-cover border-y border-[#e3e8ef]" />
      )}
      {video && !images.length && (
         <div className="w-full aspect-video bg-black flex items-center justify-center border-y border-[#e3e8ef]"><Film className="w-10 h-10 text-white/50" /></div>
      )}
      <div className="px-4 mt-2">
        <div className="flex justify-between border-y border-[#CED0D4] py-1 mt-2">
          {[
            { label: "Like", icon: ThumbsUp },
            { label: "Comment", icon: MessageCircle },
            { label: "Share", icon: Share }
          ].map(action => (
            <button key={action.label} className="flex flex-1 justify-center items-center gap-1.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#F2F2F2] py-1.5 rounded-md transition-colors">
               <action.icon className="w-5 h-5" /> {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // TIKTOK
  if (platform.id === "tiktok") return (
    <div className="w-[300px] aspect-[9/16] bg-black rounded-xl overflow-hidden relative mx-auto font-sans shadow-lg">
      {video ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900"><Film className="w-12 h-12 text-white/30" /></div>
      ) : images.length > 0 ? (
        <img src={images[0].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800"><p className="text-white/50 text-sm">Video Required</p></div>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
        <div className="font-semibold text-white mb-2">@your_account</div>
        <div className="text-white text-sm line-clamp-3 mb-2">{content || noContent}</div>
        <div className="flex items-center gap-2 text-white text-xs font-semibold">
          <span className="bg-white/20 px-2 py-1 rounded">♫ original sound</span>
        </div>
      </div>
      <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center">
        <div className="w-10 h-10 bg-white rounded-full border-2 border-white mb-2"></div>
        {[
          { icon: Heart, val: "0" },
          { icon: MessageCircle, val: "0" },
          { icon: Bookmark, val: "0" },
          { icon: Share, val: "0" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <item.icon className="text-white w-7 h-7" fill={idx === 0 ? "white" : "none"} />
            <span className="text-white text-[11px] font-semibold">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // YOUTUBE
  if (platform.id === "youtube") return (
    <div className="bg-white rounded-xl overflow-hidden w-full max-w-lg shadow-sm font-sans mx-auto border border-[#e3e8ef]">
      <div className="w-full aspect-video bg-black relative flex items-center justify-center">
         {video || images.length > 0 ? (
           <>
              {images.length > 0 ? <img src={images[0].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" /> : null}
              <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg relative z-10"><div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div></div>
           </>
         ) : (
           <p className="text-white/50 text-sm">Video Required</p>
         )}
      </div>
      <div className="p-4 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
        <div className="flex-1 pr-6 relative">
          <div className="font-semibold text-[16px] text-[#0f0f0f] line-clamp-2 leading-tight mb-1">{content ? content.split('\n')[0] : <span className="italic text-slate-400">Video Title</span>}</div>
          <div className="text-[14px] text-[#606060]">Your Channel • 0 views • Just now</div>
          {content && content.includes('\n') && (
            <div className="text-[12px] text-[#606060] line-clamp-1 mt-1 bg-slate-100 px-2 py-1 rounded">
               {content.split('\n').slice(1).join(' ')}
            </div>
          )}
          <MoreHorizontal className="w-5 h-5 text-[#0f0f0f] absolute top-0 right-0 rotate-90" />
        </div>
      </div>
    </div>
  );

  // PINTEREST
  if (platform.id === "pinterest") return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden w-full max-w-xs shadow-sm font-sans mx-auto p-4 flex flex-col">
       {images.length > 0 ? (
         <img src={images[0].url} alt="" className="w-full rounded-2xl object-cover mb-4" />
       ) : (
         <div className="w-full aspect-[2/3] bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">Image Required</div>
       )}
       <div className="flex items-center justify-between mb-2">
         <MoreHorizontal className="w-6 h-6 text-[#111]" />
         <button className="bg-[#E60023] text-white font-bold text-[15px] px-4 py-3 rounded-full leading-none hover:bg-red-700 transition-colors">Save</button>
       </div>
       {content && (
         <div className="text-[#111] text-[20px] font-semibold leading-tight line-clamp-2 mt-2 px-1">
           {content.split('\n')[0]}
         </div>
       )}
    </div>
  );

  // FALLBACK
  return (
    <div className="rounded-xl border border-[#e3e8ef] bg-white p-4 shadow-sm mx-auto w-full max-w-lg">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: platform.bg }}>
          <platform.Icon className="w-4 h-4" style={{ color: platform.color }} />
        </div>
        <span className="text-sm font-semibold text-[#1a1f36]">{platform.name}</span>
      </div>
      <p className="text-sm text-[#1a1f36] leading-relaxed whitespace-pre-wrap">{content || noContent}</p>
      {images.length > 0 && <img src={images[0].url} alt="" className="mt-3 rounded-xl w-full object-cover max-h-44" />}
    </div>
  );
}

// ── Card wrapper matching dashboard style ─────────────────────────────────────

function Card({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
          <p className="text-sm font-semibold text-[#1a1f36]">{title}</p>
          {subtitle && <p className="text-xs text-[#8792a2] mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ComposePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);

  // Content
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [hashtagging, setHashtagging] = useState(false);
  const [showAI, setShowAI] = useState<"generate" | "enhance" | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);

  // Fetch Connected Accounts
  useEffect(() => {
    fetch("/api/social/accounts")
      .then(r => r.ok ? r.json() : [])
      .then(acc => setAccounts(acc))
      .catch(console.error);
  }, []);

  // Media
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingLib, setLoadingLib] = useState(false);
  const [mediaTab, setMediaTab] = useState<"upload" | "library">("upload");
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(null);

  // Platforms
  const [selected, setSelected] = useState<string[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState("twitter");

  // Schedule
  const [mode, setMode] = useState<"now" | "scheduled">("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [bestTime, setBestTime] = useState<{ datetime: string; reason: string } | null>(null);
  const [loadingBest, setLoadingBest] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Draft restore
  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); if (d.content) setContent(d.content); } catch { /**/ }
  }, []);
  useEffect(() => {
    const t = setInterval(() => { if (content.trim()) localStorage.setItem(DRAFT_KEY, JSON.stringify({ content })); }, 30000);
    return () => clearInterval(t);
  }, [content]);

  // Library
  const fetchLibrary = useCallback(async () => {
    setLoadingLib(true);
    try { const r = await fetch("/api/media"); if (r.ok) setLibrary(await r.json()); } catch { /**/ }
    finally { setLoadingLib(false); }
  }, []);
  useEffect(() => { if (step === 1) fetchLibrary(); }, [step, fetchLibrary]);

  // Emoji
  const onEmoji = (e: EmojiClickData) => {
    const ta = textareaRef.current; if (!ta) return;
    const s = ta.selectionStart, en = ta.selectionEnd;
    setContent(p => p.slice(0, s) + e.emoji + p.slice(en));
    setShowEmoji(false);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + e.emoji.length; }, 0);
  };

  // AI Enhance
  const enhance = async () => {
    if (!content.trim()) { toast.error("Write something first"); return; }
    setShowAI("enhance");
  };

  // Hashtags
  const hashtags = async () => {
    if (!content.trim()) { toast.error("Write something first"); return; }
    setHashtagging(true);
    try {
      const r = await fetch("/api/ai/suggest-hashtags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, platforms: selected }) });
      const d = await r.json();
      if (d.hashtags) { setContent(p => p + "\n\n" + d.hashtags); toast.success("Hashtags added! #️⃣"); }
    } catch { toast.error("Failed"); } finally { setHashtagging(false); }
  };

  // Upload
  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const r = await fetch("/api/media/upload", {
        method: "POST",
        body: fd
      });

      if (!r.ok) {
        const errData = await r.json();
        throw new Error(errData.error || "Upload failed");
      }

      const u = await r.json();
      const isVid = file.type.startsWith("video");
      
      setMedia(p => [...p, { 
        url: u.url, 
        fileId: u.fileId, 
        type: u.type || (isVid ? "video" : "image"), 
        name: u.name || file.name, 
        size: file.size 
      }]);
      
      fetchLibrary();
      toast.success("Uploaded & Saved! 🖼️");
    } catch (e: unknown) {
      console.error("Upload fail:", e);
      // Fallback for missing backend/config
      const objectUrl = URL.createObjectURL(file);
      setMedia(p => [...p, { 
        url: objectUrl, 
        fileId: `fallback-${Date.now()}`, 
        type: file.type.startsWith("video") ? "video" : "image", 
        name: file.name, 
        size: file.size 
      }]);
      toast.error(e instanceof Error ? e.message : "Upload failed - using proxy");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/gif": [], "video/mp4": [], "video/quicktime": [] },
    maxSize: 100 * 1024 * 1024,
    onDrop: files => files.forEach(uploadFile),
    onDropRejected: () => toast.error("Unsupported file or too large"),
  });

  // Best Time
  const fetchBest = async () => {
    setLoadingBest(true);
    try {
      const r = await fetch("/api/ai/best-time", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ platforms: selected }) });
      const d = await r.json();
      if (d.datetime) { setBestTime(d); const [dd, tt] = d.datetime.split("T"); setDate(dd); setTime(tt?.slice(0, 5) || "10:00"); setMode("scheduled"); }
    } catch { toast.error("Could not suggest best time"); } finally { setLoadingBest(false); }
  };

  // Submit
  const submit = async () => {
    if (!content.trim() && media.length === 0) { toast.error("Add content or media"); return; }
    if (selected.length === 0) { toast.error("Select at least one platform"); return; }
    setSubmitting(true);
    try {
      const scheduledAt = mode === "scheduled" && date ? `${date}T${time}:00` : null;
      const r = await fetch("/api/posts", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          content, 
          mediaUrls: media.map(m => m.url), 
          platforms: selected, 
          status: scheduledAt ? "scheduled" : "published", 
          scheduledAt,
          isAiGenerated,
          aiPrompt
        }) 
      });
      if (!r.ok) throw new Error((await r.json()).error || "Failed");
      localStorage.removeItem(DRAFT_KEY);
      toast.success(scheduledAt ? "Post scheduled! 📅" : "Post published! 🎉");
      router.push("/dashboard");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSubmitting(false); }
  };

  const warnings = (id: string) => {
    const p = PLATFORMS.find(pl => pl.id === id); if (!p) return [];
    const w: string[] = [];
    if (p.charLimit && content.length > p.charLimit) w.push(`Over character limit (${content.length}/${p.charLimit})`);
    if (p.requiresVideo && media.every(m => m.type !== "video")) w.push("Video content required");
    if (p.requiresMedia && media.length === 0) w.push("Media strongly recommended");
    return w;
  };

  const canNext = () => {
    if (step === 0) return content.trim().length > 0;
    if (step === 2) return selected.length > 0;
    return true;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* Page heading — matches dashboard */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8792a2] mb-1">Composer</p>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1f36]">Create Post</h1>
          <p className="text-sm text-[#8792a2] mt-1">Compose and schedule across all your connected platforms.</p>
        </div>
        {/* AI Generate CTA */}
        <button onClick={() => setShowAI("generate")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.07)] active:scale-[0.98]">
          <Bot className="w-3.5 h-3.5 text-[#635bff]" />
          Write with AI
        </button>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] px-6 py-4">
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button onClick={() => { if (i <= step || (i === step + 1 && canNext())) setStep(i as Step); }}
                className="flex flex-col items-center gap-1.5 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < step ? "bg-[#09825d] border-[#09825d] text-white"
                  : i === step ? "bg-[#635bff] border-[#635bff] text-white shadow-[0_0_0_3px_rgba(99,91,255,0.15)]"
                  : "bg-white border-[#e3e8ef] text-[#c2c8d0]"}`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap ${
                  i === step ? "text-[#635bff]" : i < step ? "text-[#09825d]" : "text-[#c2c8d0]"}`}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-5 transition-all ${i < step ? "bg-[#09825d]" : "bg-[#e3e8ef]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.16 }}>

          {/* ── STEP 0: Content ── */}
          {step === 0 && (
            <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                <div>
                  <p className="text-sm font-semibold text-[#1a1f36]">Write your post</p>
                  <p className="text-xs text-[#8792a2] mt-0.5">Draft auto-saves every 30 seconds</p>
                </div>
                <button onClick={() => setShowAI("generate")}
                  className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#635bff] border border-[#635bff]/30 bg-[#635bff]/5 hover:bg-[#635bff]/10 transition-all">
                  <Bot className="w-3.5 h-3.5" /> AI
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1 px-4 py-2.5 border-b border-[#f0f3f7]">
                <div className="relative">
                  <button onClick={() => setShowEmoji(s => !s)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#697386] hover:bg-[#f6f9fc] hover:text-[#1a1f36] transition-colors">
                    <Smile className="w-3.5 h-3.5" /> Emoji
                  </button>
                  {showEmoji && <div className="absolute top-9 left-0 z-30 shadow-[0_8px_30px_rgba(60,66,87,0.12)] rounded-xl overflow-hidden"><EmojiPicker onEmojiClick={onEmoji} height={360} width={320} /></div>}
                </div>
                <div className="w-px h-4 bg-[#e3e8ef] mx-1" />
                <button onClick={enhance} disabled={enhancing}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#635bff] hover:bg-[#635bff]/8 transition-colors disabled:opacity-50">
                  {enhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />} AI Enhance
                </button>
                <button onClick={hashtags} disabled={hashtagging}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#697386] hover:bg-[#f6f9fc] hover:text-[#1a1f36] transition-colors disabled:opacity-50">
                  {hashtagging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Hash className="w-3.5 h-3.5" />} Hashtags
                </button>
              </div>

              {/* Textarea */}
              <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} rows={10}
                placeholder="What would you like to share today?"
                className="w-full px-5 py-4 text-sm text-[#1a1f36] placeholder:text-[#c2c8d0] resize-none focus:outline-none leading-relaxed" />

              {/* Character counter pills */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f3f7] bg-[#f6f9fc]">
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.filter(p => p.charLimit && p.charLimit <= 3000).map(p => (
                    <span key={p.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      p.charLimit && content.length > p.charLimit
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-white text-[#697386] border-[#e3e8ef]"}`}>
                      <p.Icon className="w-2.5 h-2.5" />{content.length}/{p.charLimit}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-[#c2c8d0] font-medium">{content.length} chars</span>
              </div>
            </div>
          )}

          {/* ── STEP 1: Media ── */}
          {step === 1 && (
            <div className="space-y-4">
              <Card title="Add media" subtitle="Attach images or videos to your post">
                {/* Tab bar */}
                <div className="flex gap-1 p-1 bg-[#f6f9fc] rounded-lg border border-[#e3e8ef] w-fit mb-5">
                  {(["upload", "library"] as const).map(t => (
                    <button key={t} onClick={() => setMediaTab(t)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${mediaTab === t ? "bg-white text-[#1a1f36] shadow-[0_1px_2px_rgba(60,66,87,0.08)] border border-[#e3e8ef]" : "text-[#697386] hover:text-[#1a1f36]"}`}>
                      {t === "upload" ? "Upload" : "My Library"}
                    </button>
                  ))}
                </div>

                {mediaTab === "upload" && (
                  <div
                    {...getRootProps()}
                    className={`rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-all ${isDragActive ? "border-[#635bff] bg-[#635bff]/4" : "border-[#e3e8ef] hover:border-[#635bff]/40 hover:bg-[#f8f7ff]"}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                      {uploading
                        ? <Loader2 className="w-7 h-7 text-[#635bff] animate-spin" />
                        : <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] border border-[#e3e8ef] flex items-center justify-center"><Upload className="w-5 h-5 text-[#8792a2]" /></div>}
                      <div>
                        <p className="text-sm font-semibold text-[#1a1f36]">{isDragActive ? "Drop files here" : uploading ? "Uploading…" : "Drag & drop or click to browse"}</p>
                        <p className="text-xs text-[#8792a2] mt-1">JPG, PNG, GIF, MP4, MOV · Max 100 MB</p>
                      </div>
                    </div>
                  </div>
                )}

                {mediaTab === "library" && (
                  loadingLib
                    ? <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 text-[#635bff] animate-spin" /></div>
                    : library.length === 0
                    ? <div className="flex flex-col items-center justify-center py-12 text-center"><FileImage className="w-9 h-9 text-[#c2c8d0] mb-3" /><p className="text-sm font-medium text-[#697386]">No uploads yet</p><p className="text-xs text-[#c2c8d0] mt-1">Upload files to build your library</p></div>
                    : <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                        {library.map(a => {
                          const sel = media.some(m => m.fileId === a.imageKitFileId);
                          return (
                            <button key={a.id} onClick={() => sel ? setMedia(p => p.filter(m => m.fileId !== a.imageKitFileId)) : setMedia(p => [...p, { url: a.url, fileId: a.imageKitFileId, type: a.type as "image"|"video", name: a.imageKitFileId }])}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${sel ? "border-[#635bff] shadow-[0_0_0_2px_rgba(99,91,255,0.15)]" : "border-transparent hover:border-[#635bff]/30"}`}>
                              {a.type === "video" ? <div className="w-full h-full bg-[#1a1f36] flex items-center justify-center"><Film className="w-5 h-5 text-white/50" /></div> : <img src={a.url} alt="" className="w-full h-full object-cover" />}
                              {sel && <div className="absolute inset-0 bg-[#635bff]/20 flex items-center justify-center"><Check className="w-4 h-4 text-white drop-shadow" /></div>}
                            </button>
                          );
                        })}
                      </div>
                )}
              </Card>

              {/* Selected preview row */}
              {media.length > 0 && (
                <Card title={`Selected files (${media.length})`}>
                  <div className="flex flex-wrap gap-3">
                    {media.map((m, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#e3e8ef] group shadow-[0_4px_12px_rgba(60,66,87,0.08)] transition-all hover:border-[#635bff]/30">
                        {m.type === "video" ? (
                          <div className="w-full h-full bg-[#1a1f36] flex items-center justify-center"><Film className="w-6 h-6 text-white/50" /></div>
                        ) : (
                          <>
                            <img src={m.url} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => setEditingMediaIndex(i)} />
                            <button onClick={() => setEditingMediaIndex(i)}
                              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                              <Scissors className="w-5 h-5 text-white mb-1" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Edit Image</span>
                            </button>
                          </>
                        )}
                        <button onClick={() => setMedia(p => p.filter((_, j) => j !== i))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95 z-10">
                          <X className="w-3.5 h-3.5 font-bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Platform format guide */}
              <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                  <p className="text-xs font-semibold text-[#697386] uppercase tracking-wide">Platform format guide</p>
                </div>
                <div className="divide-y divide-[#f0f3f7]">
                  {[
                    { Icon: FaInstagram, color:"#E1306C", name:"Instagram", note:"Square 1:1 or portrait 4:5" },
                    { Icon: FaXTwitter,  color:"#000",    name:"X (Twitter)", note:"Max 4 images or 1 video" },
                    { Icon: SiTiktok,    color:"#010101", name:"TikTok",    note:"Vertical 9:16 video required" },
                    { Icon: FaYoutube,   color:"#FF0000", name:"YouTube",   note:"Horizontal 16:9 video preferred" },
                  ].map(({ Icon, color, name, note }) => (
                    <div key={name} className="flex items-center gap-3 px-5 py-3 hover:bg-[#f6f9fc] transition-colors">
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                      <span className="text-xs font-semibold text-[#3c4257] w-24 shrink-0">{name}</span>
                      <span className="text-xs text-[#8792a2]">{note}</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-[#f5a623] ml-auto shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Platforms ── */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Left: platform toggles */}
              <div className="lg:col-span-2 space-y-4">
                <Card title="Select platforms" subtitle="Toggle the accounts to publish to">
                  <div className="space-y-2">
                    {PLATFORMS.map(p => {
                      const on = selected.includes(p.id);
                      const ws = warnings(p.id);
                      return (
                        <div key={p.id} className={`rounded-lg border-2 overflow-hidden transition-all ${on ? "border-[#635bff]" : "border-[#e3e8ef] hover:border-[#635bff]/30"}`}>
                          <div className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer ${on ? "bg-[#635bff]/4" : "bg-white"}`}
                            onClick={() => setSelected(p2 => on ? p2.filter(x => x !== p.id) : [...p2, p.id])}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.bg }}>
                              <p.Icon className="w-4 h-4" style={{ color: p.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1a1f36]">{p.name}</p>
                              {p.charLimit && <p className="text-[10px] text-[#8792a2]">{p.charLimit.toLocaleString()} char limit</p>}
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${on ? "bg-[#635bff] border-[#635bff]" : "border-[#d1d5db]"}`}>
                              {on && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          {on && ws.map(w => (
                            <div key={w} className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border-t border-amber-100">
                              <AlertTriangle className="w-3 h-3 text-[#f5a623] shrink-0" />
                              <span className="text-[10px] text-amber-800">{w}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Right: live preview */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                    <div>
                      <p className="text-sm font-semibold text-[#1a1f36]">Live preview</p>
                      <p className="text-xs text-[#8792a2] mt-0.5">How your post will look</p>
                    </div>
                    <Eye className="w-4 h-4 text-[#8792a2]" />
                  </div>
                  <div className="p-5">
                    {selected.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Eye className="w-8 h-8 text-[#c2c8d0] mb-3" />
                        <p className="text-sm font-medium text-[#697386]">Pick a platform to preview</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Tab switcher */}
                        <div className="flex flex-wrap gap-1.5">
                          {selected.map(pid => {
                            const p = PLATFORMS.find(pl => pl.id === pid)!;
                            return (
                              <button key={pid} onClick={() => setPreviewPlatform(pid)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  previewPlatform === pid ? "border-[#635bff] text-[#635bff] bg-[#635bff]/8" : "border-[#e3e8ef] text-[#697386] hover:border-[#635bff]/30 hover:text-[#635bff]"}`}>
                                <p.Icon className="w-3 h-3" />{p.name}
                              </button>
                            );
                          })}
                        </div>
                        {/* Preview card */}
                        {PLATFORMS.filter(p => p.id === previewPlatform).map(p => (
                          <PlatformPreview 
                            key={p.id} 
                            platform={p} 
                            content={content} 
                            media={media} 
                            accounts={accounts} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Schedule ── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Mode selector */}
              <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                  <p className="text-sm font-semibold text-[#1a1f36]">When to publish</p>
                  <p className="text-xs text-[#8792a2] mt-0.5">Post immediately or schedule for later</p>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  {([
                    { v: "now", icon: Send, label: "Publish Now", desc: "Post immediately to all selected platforms" },
                    { v: "scheduled", icon: Calendar, label: "Schedule for Later", desc: "Choose a specific date and time" },
                  ] as const).map(({ v, icon: Icon, label, desc }) => (
                    <button key={v} onClick={() => setMode(v)}
                      className={`flex flex-col items-start gap-3 p-4 rounded-lg border-2 text-left transition-all ${mode === v ? "border-[#635bff] bg-[#635bff]/4" : "border-[#e3e8ef] hover:border-[#635bff]/30 bg-white"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${mode === v ? "bg-[#635bff] text-white" : "bg-[#f6f9fc] text-[#8792a2]"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1f36]">{label}</p>
                        <p className="text-xs text-[#8792a2] mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date/time picker */}
              {mode === "scheduled" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                    <p className="text-sm font-semibold text-[#1a1f36]">Date &amp; time</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#3c4257] mb-1.5">Date</label>
                        <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#e3e8ef] bg-[#f6f9fc] text-[#1a1f36] focus:outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/10 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3c4257] mb-1.5">Time</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#e3e8ef] bg-[#f6f9fc] text-[#1a1f36] focus:outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/10 transition-all" />
                      </div>
                    </div>

                    {date && time && (
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#635bff]/8 border border-[#635bff]/20">
                        <Clock className="w-4 h-4 text-[#635bff] shrink-0" />
                        <span className="text-sm font-medium text-[#635bff]">
                          {format(new Date(`${date}T${time}`), "EEEE, MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1 border-t border-[#f0f3f7]">
                      <button onClick={fetchBest} disabled={loadingBest}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#e3e8ef] text-[#3c4257] bg-white hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.07)] disabled:opacity-50 active:scale-[0.98]">
                        {loadingBest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ZapIcon className="w-3.5 h-3.5 text-[#635bff]" />}
                        AI Best Time
                      </button>
                      {bestTime && <p className="text-xs text-[#8792a2] leading-relaxed flex-1">{bestTime.reason}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              <div className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
                  <p className="text-sm font-semibold text-[#1a1f36]">Post summary</p>
                </div>
                <div className="divide-y divide-[#f0f3f7]">
                  {[
                    { label: "Content", value: content ? <span className="line-clamp-1">{content.slice(0, 80)}{content.length > 80 ? "…" : ""}</span> : <span className="text-[#c2c8d0]">None</span> },
                    { label: "Media", value: `${media.length} file${media.length !== 1 ? "s" : ""}` },
                    { label: "Platforms", value: selected.length === 0 ? <span className="text-[#c2c8d0]">None</span> : (
                      <div className="flex flex-wrap gap-1.5">
                        {selected.map(pid => { const p = PLATFORMS.find(pl => pl.id === pid)!; return (
                          <span key={pid} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#e3e8ef]" style={{ color: p.color }}>
                            <p.Icon className="w-2.5 h-2.5" />{p.name}
                          </span>
                        ); })}</div>) },
                    { label: "Timing", value: mode === "now" ? "Immediately" : date ? format(new Date(`${date}T${time}`), "MMM d, yyyy 'at' h:mm a") : <span className="text-[#c2c8d0]">Not set</span> },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f6f9fc] transition-colors">
                      <span className="text-xs font-semibold text-[#8792a2] w-20 shrink-0">{label}</span>
                      <span className="text-sm text-[#3c4257] flex-1 min-w-0">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => setStep(s => (s - 1) as Step)} disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-[#3c4257] bg-white border border-[#e3e8ef] hover:bg-[#f6f9fc] hover:border-[#c9d0ef] transition-all shadow-[0_1px_2px_rgba(60,66,87,0.07)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 3 ? (
          <button onClick={() => setStep(s => (s + 1) as Step)} disabled={!canNext()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-[0_1px_3px_rgba(99,91,255,0.25)]"
            style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting || selected.length === 0}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-[0_1px_3px_rgba(99,91,255,0.25)]"
            style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "now" ? <Send className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            {submitting ? "Publishing…" : mode === "now" ? "Publish Now" : "Schedule Post"}
          </button>
        )}
      </div>

      {/* AI Dialog */}
      <AnimatePresence>
        {showAI && (
          <AIDialog 
            onClose={() => setShowAI(null)} 
            onApply={(c, p) => { 
              setContent(c); 
              setIsAiGenerated(true);
              setAiPrompt(p);
              toast.success("AI Content applied ✨"); 
            }} 
            platforms={selected} 
            mode={showAI}
            initialContent={content}
          />
        )}
      </AnimatePresence>

      {/* Image Editor */}
      <AnimatePresence>
        {editingMediaIndex !== null && media[editingMediaIndex] && (
          <ImageEditorDialog 
            url={media[editingMediaIndex].url}
            onClose={() => setEditingMediaIndex(null)}
            onSave={(newUrl: string) => {
              const updated = [...media];
              updated[editingMediaIndex] = { ...updated[editingMediaIndex], url: newUrl };
              setMedia(updated);
              setEditingMediaIndex(null);
              toast.success("Image updated ✨");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
