"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, CalendarClock, ExternalLink, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between mt-4">
            <Badge className={`${getStatusColor(post.status)} capitalize text-sm px-3 py-1 font-semibold`}>
              {post.status || 'Draft'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-8">
          {/* Schedule Info */}
          {post.scheduledAt && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Scheduling details</h3>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{format(new Date(post.scheduledAt), "EEEE, MMMM do, yyyy")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{format(new Date(post.scheduledAt), "h:mm a")}</span>
              </div>
            </div>
          )}

          {/* Platforms */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Platforms selected</h3>
            <div className="flex flex-wrap gap-2">
              {post.platforms?.map((p: string) => (
                <Badge key={p} variant="outline" className="capitalize">
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Content</h3>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {post.content || <span className="italic text-gray-400">No text content...</span>}
            </div>
          </div>

          {/* Media Info */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Media ({post.mediaUrls.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {post.mediaUrls.map((url: string, i: number) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                    {/* Assuming image. Should check type in a real app */}
                    <img src={url} alt="Post media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleEdit} className="w-full font-medium">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Request
            </Button>
            <Button variant="outline" className="w-full font-medium text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(post.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            {post.status !== "published" && (
              <Button onClick={handleEdit} className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
                <CalendarClock className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            )}
            {post.status === "published" && (
              <Button variant="outline" className="col-span-2 w-full font-medium">
                <ExternalLink className="w-4 h-4 mr-2" />
                View live post
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
