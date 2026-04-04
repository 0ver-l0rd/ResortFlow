"use client";

import React, { useState } from "react";
import { 
  Upload, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Clock, 
  Image as ImageIcon,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SocialCardPreview } from "./SocialCardPreview";

interface PostData {
  platform: string;
  content: string;
  mediaUrl?: string;
}

interface InteractiveUIProps {
  type: "media_upload" | "date_picker" | "buttons" | "post_preview";
  options?: string[];
  question?: string;
  onAction: (value: string | any) => void;
  isCompleted?: boolean;
  selectedValue?: string;
  postData?: PostData;
}

export function InteractiveUI({ 
  type, 
  options = [], 
  question, 
  onAction, 
  isCompleted,
  selectedValue,
  postData
}: InteractiveUIProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  if (type === "post_preview") {
    return (
      <div className="space-y-4 mt-2 w-full">
        {postData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-[#e3e8ef] shadow-sm bg-white"
          >
            <SocialCardPreview 
              platform={postData.platform}
              content={postData.content}
              mediaUrl={postData.mediaUrl}
            />
          </motion.div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Button
              key={opt}
              size="sm"
              variant={selectedValue === opt ? "default" : "outline"}
              disabled={isCompleted}
              onClick={() => onAction(opt)}
              className={cn(
                "rounded-xl text-[11px] font-bold h-9 px-4 transition-all active:scale-95 flex items-center gap-2",
                selectedValue === opt 
                  ? "bg-[#635bff] text-white border-[#635bff] shadow-md shadow-[#635bff]/20" 
                  : "bg-white border-[#e3e8ef] text-[#3c4257] hover:border-[#635bff] hover:text-[#635bff]"
              )}
            >
              {opt}
              {selectedValue === opt && <Check className="w-3.5 h-3.5" />}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "buttons") {
    return (
      <div className="space-y-3 mt-2 w-full">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Button
              key={opt}
              size="sm"
              variant={selectedValue === opt ? "default" : "outline"}
              disabled={isCompleted}
              onClick={() => onAction(opt)}
              className={cn(
                "rounded-full text-[11px] font-bold h-8 px-5 transition-all active:scale-95 border-2",
                selectedValue === opt 
                  ? "bg-[#635bff] text-white border-[#635bff] shadow-lg shadow-[#635bff]/30" 
                  : "bg-white border-[#e3e8ef] text-[#3c4257] hover:border-[#635bff]/40 hover:bg-[#f6f9fc] hover:text-[#635bff]"
              )}
            >
              {opt}
              {selectedValue === opt && <Check className="w-3 h-3 ml-1.5" />}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "media_upload") {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        onAction(data.url);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-3 w-full"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <div className={cn(
          "relative group rounded-2xl border-2 border-dashed transition-all duration-300 p-6 flex flex-col items-center justify-center text-center",
          isCompleted 
            ? "border-emerald-100 bg-emerald-50/30" 
            : "border-[#e3e8ef] hover:border-[#635bff] hover:bg-[#f6f9fc] cursor-pointer"
        )}
        onClick={() => !isCompleted && !isUploading && fileInputRef.current?.click()}
        >
          {isCompleted ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                {selectedValue?.startsWith("http") ? (
                  <img src={selectedValue} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <p className="text-[11px] font-bold text-emerald-700">Media attached successfully</p>
            </div>
          ) : (
            <>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all",
                isUploading ? "bg-[#635bff]/10" : "bg-slate-50 group-hover:bg-[#635bff]/10"
              )}>
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-[#635bff] animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-[#8792a2] group-hover:text-[#635bff]" />
                )}
              </div>
              <p className="text-[12px] font-bold text-[#1a1f36] mb-1">Click to upload media</p>
              <p className="text-[10px] text-[#8792a2] font-semibold">Images or Videos (Max 10MB)</p>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  if (type === "date_picker") {
    const suggestions = ["Tonight (8 PM)", "Tomorrow Morning", "Next Weekend"];
    
    return (
      <div className="mt-3 space-y-3">
        <div className="p-4 bg-white border border-[#e3e8ef] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[#1a1f36]">
            <CalendarIcon className="w-4 h-4 text-[#635bff]" />
            <span className="text-[12px] font-bold tracking-tight">Select Schedule Time</span>
          </div>
          
          <div className="space-y-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                disabled={isCompleted}
                onClick={() => onAction(s)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-[11px] font-bold transition-all group",
                  selectedValue === s
                    ? "bg-[#635bff] text-white"
                    : "hover:bg-[#f6f9fc] text-[#3c4257] border border-transparent hover:border-[#e3e8ef]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className={cn("w-3.5 h-3.5", selectedValue === s ? "text-white" : "text-[#8792a2]")} />
                  {s}
                </div>
                <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-40", selectedValue === s && "opacity-100")} />
              </button>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-3 h-10 border border-[#e3e8ef] rounded-xl text-[11px] font-bold text-[#697386] hover:bg-[#f6f9fc] hover:text-[#1a1f36]"
            onClick={() => !isCompleted && onAction("Custom Date Picker Open")}
          >
            Custom Date & Time
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
