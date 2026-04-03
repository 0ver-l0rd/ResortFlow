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
import { Badge } from "@/components/ui/badge";

interface MonthViewProps {
  currentDate: Date;
  posts: any[];
  onDayClick: (date: Date) => void;
  onEventClick: (post: any) => void;
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

const getPlatformEmoji = (platforms: string[]) => {
  if (!platforms || platforms.length === 0) return "🌐";
  const mainPlatform = platforms[0].toLowerCase();
  switch (mainPlatform) {
    case "instagram": return "📸";
    case "twitter": return "🐦";
    case "linkedin": return "💼";
    case "facebook": return "📘";
    default: return "📱";
  }
};

export function MonthView({ currentDate, posts, onDayClick, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          
          // Get posts for this day
          const dayPosts = posts.filter(post => 
            post.scheduledAt && isSameDay(new Date(post.scheduledAt), day)
          );

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[120px] p-2 border-b border-r border-gray-100 relative group cursor-pointer transition-colors
                ${!isCurrentMonth ? "bg-gray-50/50" : "bg-white hover:bg-gray-50/30"}
                ${(dayIdx + 1) % 7 === 0 ? "border-r-0" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`
                    w-7 h-7 flex items-center justify-center text-sm rounded-full
                    ${isToday ? "bg-indigo-600 text-white font-semibold shadow-sm" : 
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
              
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[80px] no-scrollbar">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(post);
                    }}
                    className={`
                      text-xs px-2 py-1.5 rounded-md border truncate shadow-sm transition-all
                      ${getPlatformColor(post.platforms)}
                    `}
                    title={post.content || "Media Post"}
                  >
                    <span className="mr-1">{getPlatformEmoji(post.platforms)}</span>
                    <span className="font-medium">
                      {format(new Date(post.scheduledAt), "h:mm a")}
                    </span>
                    {" • "}
                    <span className="opacity-90">{post.content || "Media Post"}</span>
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
