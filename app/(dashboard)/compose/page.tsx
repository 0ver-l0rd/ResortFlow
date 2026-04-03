"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Hash, Smile, Upload, Calendar, Send, Clock,
  ChevronRight, ChevronLeft, Check, X, AlertTriangle,
  Eye, Bot, Wand2, Loader2, Film, FileImage, ZapIcon,
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

function AIDialog({ onClose, onApply, platforms }: {
  onClose: () => void; onApply: (c: string) => void; platforms: string[];
}) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const TONES = ["engaging", "professional", "humorous", "inspirational", "informative", "casual"];

  const generate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/ai/generate-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, tone, platforms }) });
      const d = await r.json();
      if (d.content) setResult(d.content); else toast.error("Try again");
    } catch { toast.error("Generation failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,31,54,0.45)", backdropFilter: "blur(6px)" }}>
      <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
        className="bg-white rounded-xl border border-[#e3e8ef] shadow-[0_20px_60px_rgba(60,66,87,0.15)] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f3f7] bg-[#f6f9fc]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1f36]">AI Post Generator</p>
              <p className="text-[10px] text-[#8792a2]">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-[#e3e8ef] flex items-center justify-center text-[#8792a2] hover:bg-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-[#3c4257] mb-1.5">Topic or idea *</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
              placeholder="e.g. Summer sale, productivity tips, new product launch…"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#e3e8ef] bg-[#f6f9fc] text-[#1a1f36] placeholder:text-[#c2c8d0] resize-none focus:outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/10 transition-all" />
          </div>
          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-[#3c4257] mb-1.5">Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all capitalize ${tone === t ? "border-[#635bff] bg-[#635bff]/8 text-[#635bff]" : "border-[#e3e8ef] text-[#697386] hover:border-[#635bff]/40 hover:text-[#635bff]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Result */}
          {result && (
            <div className="rounded-lg border border-[#e3e8ef] bg-[#f6f9fc] p-3.5">
              <p className="text-[10px] font-semibold text-[#8792a2] uppercase tracking-wide mb-1.5">Generated</p>
              <p className="text-sm text-[#1a1f36] whitespace-pre-wrap leading-relaxed">{result}</p>
            </div>
          )}
          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={generate} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-all active:scale-[0.98] shadow-[0_1px_3px_rgba(99,91,255,0.25)]"
              style={{ background: "linear-gradient(135deg,#635bff,#7f78ff)" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating…" : result ? "Regenerate" : "Generate Post"}
            </button>
            {result && (
              <button onClick={() => { onApply(result); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#635bff] text-[#635bff] hover:bg-[#635bff]/5 transition-all active:scale-[0.98]">
                <Check className="w-4 h-4" /> Use this
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Platform Preview ──────────────────────────────────────────────────────────

function PlatformPreview({ platform, content, media }: { platform: PlatformDef; content: string; media: UploadedMedia[]; }) {
  const img = media.find(m => m.type === "image");
  const noContent = <span className="text-[#c2c8d0]">Your post will appear here…</span>;

  if (platform.id === "twitter") return (
    <div className="rounded-xl border border-[#e3e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(60,66,87,0.05)]">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#635bff] to-[#7f78ff] shrink-0 flex items-center justify-center text-white text-xs font-bold">U</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5"><span className="text-sm font-bold text-[#1a1f36]">Your Account</span><FaXTwitter className="w-3 h-3 text-[#697386]" /></div>
          <p className="text-sm text-[#1a1f36] leading-relaxed whitespace-pre-wrap">{content || noContent}</p>
          {img && <img src={img.url} alt="" className="mt-3 rounded-xl w-full object-cover max-h-44" />}
          <div className="flex items-center gap-5 mt-3 text-xs text-[#8792a2]"><span>💬 0</span><span>🔁 0</span><span>❤️ 0</span></div>
        </div>
      </div>
    </div>
  );

  if (platform.id === "instagram") return (
    <div className="rounded-xl border border-[#e3e8ef] bg-white overflow-hidden shadow-[0_1px_3px_rgba(60,66,87,0.05)]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#f0f3f7]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] flex items-center justify-center text-white text-[10px] font-bold">U</div>
        <span className="text-xs font-semibold text-[#1a1f36]">youraccount</span>
      </div>
      {img ? <img src={img.url} alt="" className="w-full object-cover max-h-56" /> : <div className="w-full h-36 bg-[#f6f9fc] flex items-center justify-center"><FileImage className="w-7 h-7 text-[#c2c8d0]" /></div>}
      <div className="px-4 py-3"><p className="text-sm text-[#1a1f36] whitespace-pre-wrap leading-relaxed line-clamp-3">{content || noContent}</p></div>
    </div>
  );

  return (
    <div className="rounded-xl border border-[#e3e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(60,66,87,0.05)]">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: platform.bg }}>
          <platform.Icon className="w-4 h-4" style={{ color: platform.color }} />
        </div>
        <span className="text-sm font-semibold text-[#1a1f36]">{platform.name}</span>
      </div>
      <p className="text-sm text-[#1a1f36] leading-relaxed whitespace-pre-wrap">{content || noContent}</p>
      {img && <img src={img.url} alt="" className="mt-3 rounded-xl w-full object-cover max-h-44" />}
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
  const [showAI, setShowAI] = useState(false);

  // Media
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingLib, setLoadingLib] = useState(false);
  const [mediaTab, setMediaTab] = useState<"upload" | "library">("upload");

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
    setEnhancing(true);
    try {
      const r = await fetch("/api/ai/enhance-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const d = await r.json();
      if (d.enhancedContent) { setContent(d.enhancedContent); toast.success("Enhanced! ✨"); }
    } catch { toast.error("Failed"); } finally { setEnhancing(false); }
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
      const authR = await fetch("/api/imagekit/auth");
      if (!authR.ok) throw new Error("Auth failed");
      const { token, expire, signature } = await authR.json();
      const pk = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
      const ep = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
      if (!pk || !ep) {
        // Demo mode
        const objectUrl = URL.createObjectURL(file);
        setMedia(p => [...p, { url: objectUrl, fileId: `demo-${Date.now()}`, type: file.type.startsWith("video") ? "video" : "image", name: file.name, size: file.size }]);
        toast.success("Media added (demo mode)"); return;
      }
      const fd = new FormData();
      fd.append("file", file); fd.append("fileName", file.name);
      fd.append("publicKey", pk); fd.append("signature", signature);
      fd.append("expire", String(expire)); fd.append("token", token);
      fd.append("folder", "/social-copilot");
      const up = await fetch(`${ep}/api/v1/files/upload`, { method: "POST", body: fd });
      if (!up.ok) throw new Error("Upload failed");
      const u = await up.json();
      const isVid = file.type.startsWith("video");
      setMedia(p => [...p, { url: u.url, fileId: u.fileId, type: isVid ? "video" : "image", name: file.name, size: file.size }]);
      await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageKitFileId: u.fileId, url: u.url, type: isVid ? "video" : "image", size: file.size }) });
      fetchLibrary();
      toast.success("Uploaded! 🖼️");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
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
      const r = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, mediaUrls: media.map(m => m.url), platforms: selected, status: scheduledAt ? "scheduled" : "published", scheduledAt }) });
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
        <button onClick={() => setShowAI(true)}
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
                <button onClick={() => setShowAI(true)}
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
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#e3e8ef] group shadow-[0_1px_2px_rgba(60,66,87,0.06)]">
                        {m.type === "video" ? <div className="w-full h-full bg-[#1a1f36] flex items-center justify-center"><Film className="w-5 h-5 text-white/50" /></div> : <img src={m.url} alt="" className="w-full h-full object-cover" />}
                        <button onClick={() => setMedia(p => p.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                          <X className="w-3 h-3" />
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
                        {(() => { const p = PLATFORMS.find(pl => pl.id === previewPlatform); return p ? <PlatformPreview platform={p} content={content} media={media} /> : null; })()}
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
        {showAI && <AIDialog onClose={() => setShowAI(false)} onApply={c => { setContent(c); toast.success("Content applied ✨"); }} platforms={selected} />}
      </AnimatePresence>
    </div>
  );
}
