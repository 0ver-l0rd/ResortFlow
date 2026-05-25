"use client";

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { FaXTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface MonthViewProps {
  currentDate: Date;
  posts: any[];
  onDayClick: (date: Date) => void;
  onEventClick: (post: any) => void;
  onEventDrop?: (postId: string, newDate: Date) => void;
}

const getPlatformColor = (platforms: string[]) => {
  if (!platforms || platforms.length === 0) return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
  const mainPlatform = platforms[0].toLowerCase();
  switch (mainPlatform) {
    case "instagram": return "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200";
    case "twitter": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
    case "linkedin": return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100";
    case "facebook": return "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200";
    default: return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
  }
};

const PlatformIcon = ({ platforms }: { platforms?: string[] }) => {
  if (!platforms || platforms.length === 0) return <span className="text-gray-400">📝</span>;
  const p = platforms[0].toLowerCase();
  
  switch (p) {
    case "twitter": return <FaXTwitter className="w-2.5 h-2.5 text-gray-700" />;
    case "instagram": return <FaInstagram className="w-2.5 h-2.5 text-pink-600" />;
    case "linkedin": return <FaLinkedinIn className="w-2.5 h-2.5 text-blue-600" />;
    case "facebook": return <FaFacebookF className="w-2.5 h-2.5 text-blue-500" />;
    default: return <span className="text-[10px]">📝</span>;
  }
};

export function MonthView({ currentDate, posts, onDayClick, onEventClick, onEventDrop }: MonthViewProps) {
  const isMounted = useIsMounted();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" suppressHydrationWarning>
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50" suppressHydrationWarning>
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider" suppressHydrationWarning>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(120px,auto)]" suppressHydrationWarning>
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isMounted ? isSameDay(day, new Date()) : false;
          
          // Get posts for this day
          const dayPosts = posts.filter(post => 
            isSameDay(new Date(post.scheduledAt || post.createdAt), day)
          );

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const postId = e.dataTransfer.getData("postId");
                if (postId && onEventDrop) {
                  onEventDrop(postId, day);
                }
              }}
              className={`
                flex flex-col min-h-[120px] p-1 border-b border-r border-gray-100 relative group transition-colors
                ${!isCurrentMonth ? "bg-gray-50/50" : "bg-white hover:bg-gray-50/30"}
                ${(dayIdx + 1) % 7 === 0 ? "border-r-0" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-1 px-1 pt-1">
                <span
                  className={`
                    w-7 h-7 flex items-center justify-center text-sm rounded-full
                    ${isToday ? "bg-emerald-800 text-white font-semibold shadow-sm" : 
                      !isCurrentMonth ? "text-gray-400" : "text-gray-700 font-medium"}
                  `}
                >
                  {format(day, "d")}
                </span>
                
                {dayPosts.length > 0 && (
                  <span className="text-[10px] font-medium text-gray-400">
                    {dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-[2px] overflow-y-auto no-scrollbar flex-1 pb-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    draggable={post.status !== "published"}
                    onDragStart={(e) => {
                      if (post.status !== "published") {
                        e.dataTransfer.setData("postId", post.id);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(post);
                    }}
                    className={`
                      text-[11px] px-1.5 py-[3px] rounded border transition-all hover:shadow-sm
                      ${post.status !== "published" ? "cursor-move" : "cursor-pointer"}
                      ${getPlatformColor(post.platforms)}
                      ${post.status === "published" ? "opacity-75" : ""}
                    `}
                    title={post.content || "Media Post"}
                  >
                    <div className="flex items-start gap-1 overflow-hidden">
                      <span className="shrink-0 mt-0.5"><PlatformIcon platforms={post.platforms} /></span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-[10px] leading-none shrink-0">
                          {format(new Date(post.scheduledAt || post.createdAt), "h:mma").toLowerCase()}
                        </span>
                        <span className="opacity-90 whitespace-normal line-clamp-2 leading-snug">{post.content || "Media"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
