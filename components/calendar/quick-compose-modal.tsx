"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CalendarClock, ArrowRight } from "lucide-react";

interface QuickComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSave: (content: string, date: Date) => void;
}

export function QuickComposeModal({ isOpen, onClose, selectedDate, onSave }: QuickComposeModalProps) {
  const [content, setContent] = useState("");
  const router = useRouter();

  if (!selectedDate) return null;

  const handleFullComposer = () => {
    // Rediect to full composer with date
    router.push(`/compose?date=${selectedDate.toISOString()}`);
    onClose();
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content, selectedDate);
    setContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Draft Setup</DialogTitle>
          <DialogDescription>
            Scheduling for <span className="font-semibold text-gray-900">{format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="What do you want to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
          <Button variant="ghost" className="text-gray-500 justify-start px-2 hover:text-indigo-600 hover:bg-indigo-50" onClick={handleFullComposer}>
            Open full composer <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!content.trim()} className="bg-indigo-600 hover:bg-indigo-700">
              <CalendarClock className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
