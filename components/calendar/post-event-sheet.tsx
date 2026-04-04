"use client";

import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { 
  Edit2, Trash2, CalendarClock, ExternalLink, 
  Calendar as CalendarIcon, Clock, Share2, 
  AlignLeft, Image as ImageIcon, X
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

interface PostEventSheetProps {
  post: any | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (postId: string) => void;
}

export function PostEventSheet({ post, isOpen, onClose, onDelete }: PostEventSheetProps) {
  const router = useRouter();

  if (!post) return null;

  const handleEdit = () => {
    router.push(`/compose?edit=${post.id}`);
    onClose();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published': return { bg: 'bg-[#ecfdf3]', text: 'text-[#027a48]', dot: 'bg-[#12b76a]', label: 'Published' };
      case 'scheduled': return { bg: 'bg-[#eff8ff]', text: 'text-[#175cd3]', dot: 'bg-[#2e90fa]', label: 'Scheduled' };
      case 'failed': return { bg: 'bg-[#fef3f2]', text: 'text-[#b42318]', dot: 'bg-[#f04438]', label: 'Failed' };
      default: return { bg: 'bg-[#f2f4f7]', text: 'text-[#344054]', dot: 'bg-[#667085]', label: 'Draft' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    const s = platform.toLowerCase();
    if (s.includes("twitter") || s.includes("x")) return <FaXTwitter className="w-3.5 h-3.5 text-[#0f1419]" />;
    if (s.includes("instagram")) return <FaInstagram className="w-3.5 h-3.5 text-[#E1306C]" />;
    if (s.includes("linkedin")) return <FaLinkedinIn className="w-3.5 h-3.5 text-[#0A66C2]" />;
    if (s.includes("youtube")) return <FaYoutube className="w-3.5 h-3.5 text-[#FF0000]" />;
    return <Share2 className="w-3.5 h-3.5 text-[#635bff]" />;
  };

  const statusConfig = getStatusConfig(post.status);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[480px] p-0 border-l border-[#e3e8ef] shadow-[0_24px_80px_rgba(0,0,0,0.12)] bg-[#fcfdfe] overflow-hidden flex flex-col gap-0 outline-none">
        {/* Custom Header */}
        <div className="px-6 py-5 border-b border-[#f0f3f7] bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 ${statusConfig.bg}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
               <span className={`text-[11px] font-bold uppercase tracking-wider ${statusConfig.text}`}>
                 {statusConfig.label}
               </span>
            </div>
            <span className="text-[13px] text-[#8792a2] font-semibold">
              ID: {post.id.slice(0, 8)}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f6f9fc] text-[#8792a2] transition-colors focus:outline-none">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          
          {/* Timeline / Schedule Box */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-[#1a1f36] flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#8792a2]" /> Published At / Scheduled
            </h3>
            <div className="bg-white border border-[#e3e8ef] rounded-2xl p-4 shadow-[0_1px_3px_rgba(34,42,66,0.03)] group transition-all hover:border-[#c9d0ef] hover:shadow-[0_2px_8px_rgba(34,42,66,0.06)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f6f9fc] flex items-center justify-center border border-[#e3e8ef]/50">
                  <CalendarIcon className="w-5 h-5 text-[#635bff]" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#1a1f36]">
                    {post.scheduledAt || post.createdAt 
                      ? format(new Date(post.scheduledAt || post.createdAt), "EEEE, MMMM do, yyyy")
                      : "No Date"}
                  </div>
                  <div className="text-[13px] text-[#697386] font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.scheduledAt || post.createdAt 
                      ? format(new Date(post.scheduledAt || post.createdAt), "h:mm a")
                      : "--:--"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-[#1a1f36] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#8792a2]" /> Distribution Channels
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.platforms?.map((p: string) => (
                <div key={p} className="flex items-center gap-2 bg-white border border-[#e3e8ef] px-3 py-2 rounded-xl shadow-[0_1px_2px_rgba(34,42,66,0.02)]">
                  {getPlatformIcon(p)}
                  <span className="text-[13px] font-bold text-[#3c4257] capitalize">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-[#1a1f36] flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-[#8792a2]" /> Content
            </h3>
            <div className="bg-white border border-[#e3e8ef] rounded-2xl p-5 shadow-[0_1px_3px_rgba(34,42,66,0.03)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#635bff]/20" />
              {post.content ? (
                <p className="text-[14px] text-[#3c4257] leading-[1.6] whitespace-pre-wrap font-medium">
                  {post.content}
                </p>
              ) : (
                <span className="italic text-[#c2c8d0] text-[13px]">No text content...</span>
              )}
            </div>
          </div>

          {/* Media Info */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="space-y-3 pb-4">
              <h3 className="text-[13px] font-bold text-[#1a1f36] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8792a2]" /> Attached Media
              </h3>
              <div className={`grid gap-2 ${post.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.mediaUrls.map((url: string, i: number) => (
                  <div key={i} className={`bg-white border border-[#e3e8ef] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(34,42,66,0.03)] group relative ${post.mediaUrls.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                    <img src={url} alt="Media" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Actions Footer */}
        <div className="p-6 bg-white border-t border-[#f0f3f7] flex flex-col gap-3">
          <div className="flex gap-3">
            <button 
              onClick={handleEdit} 
              className="flex-1 flex justify-center items-center gap-2 bg-white text-[#3c4257] text-[13px] font-bold px-4 py-3 rounded-xl border border-[#e3e8ef] hover:border-[#c9d0ef] hover:bg-[#f6f9fc] hover:text-[#1a1f36] transition-all active:scale-[0.98] shadow-[0_1px_2px_rgba(34,42,66,0.04)]"
            >
              <Edit2 className="w-4 h-4" /> Edit Request
            </button>
            <button 
              onClick={() => onDelete(post.id)}
              className="flex-none flex justify-center items-center gap-2 bg-white text-[#d92d20] text-[13px] font-bold px-4 py-3 rounded-xl border border-[#e3e8ef] hover:border-[#fecdca] hover:bg-[#fef3f2] transition-all active:scale-[0.98] shadow-[0_1px_2px_rgba(34,42,66,0.04)]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {post.status !== "published" ? (
            <button 
              onClick={handleEdit} 
              className="w-full flex justify-center items-center gap-2 bg-[#635bff] text-white text-[13px] font-bold px-4 py-3 rounded-xl hover:bg-[#4f46e5] hover:shadow-[0_4px_12px_rgba(99,91,255,0.2)] transition-all active:scale-[0.98] shadow-[0_2px_4px_rgba(99,91,255,0.1)]"
            >
              <CalendarClock className="w-4 h-4" /> Reschedule Post
            </button>
          ) : (
            <button 
              className="w-full flex justify-center items-center gap-2 bg-white text-[#1a1f36] text-[13px] font-bold px-4 py-3 rounded-xl border border-[#e3e8ef] hover:border-[#c9d0ef] hover:bg-[#f6f9fc] transition-all active:scale-[0.98] shadow-[0_1px_2px_rgba(34,42,66,0.04)]"
            >
              <ExternalLink className="w-4 h-4" /> View Live Post
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
