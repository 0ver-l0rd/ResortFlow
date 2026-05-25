"use client";

import { startOfWeek, endOfWeek, eachDayOfInterval, eachHourOfInterval, format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FaXTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

const getPlatformColor = (platforms: string[]) => {
  if (!platforms || platforms.length === 0) return "bg-gray-100 text-gray-800 border-gray-200";
  const mainPlatform = platforms[0].toLowerCase();
  switch (mainPlatform) {
    case "instagram": return "bg-pink-100 text-pink-800 border-pink-200";
    case "twitter": return "bg-blue-100 text-blue-800 border-blue-200";
    case "linkedin": return "bg-blue-50 text-blue-900 border-blue-200";
    case "facebook": return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "facebook": return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default: return "bg-purple-100 text-purple-800 border-purple-200";
  }
};

const PlatformIcon = ({ platforms }: { platforms?: string[] }) => {
  if (!platforms || platforms.length === 0) return <span className="text-gray-400">📝</span>;
  const p = platforms[0].toLowerCase();
  
  switch (p) {
    case "twitter": return <FaXTwitter className="w-3 h-3" />;
    case "instagram": return <FaInstagram className="w-3 h-3" />;
    case "linkedin": return <FaLinkedinIn className="w-3 h-3" />;
    case "facebook": return <FaFacebookF className="w-3 h-3" />;
    default: return <span className="text-[10px]">📝</span>;
  }
};

interface WeekViewProps {
  currentDate: Date;
  posts: any[];
  onEventClick: (post: any) => void;
  onDayClick: (date: Date) => void;
}

export function WeekView({ currentDate, posts, onEventClick, onDayClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex border-b border-gray-200 bg-gray-50/50 pr-4">
        <div className="w-16 shrink-0 border-r border-gray-200"></div>
        <div className="grid grid-cols-7 flex-1">
          {days.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toString()} className="py-3 px-2 text-center border-r border-gray-100 last:border-r-0">
                <div className="text-xs font-medium text-gray-500 uppercase">{format(day, "eee")}</div>
                <div className={`mt-1 text-lg font-semibold ${isToday ? "text-emerald-800" : "text-gray-900"}`}>
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-1 overflow-y-auto relative no-scrollbar">
        <div className="w-16 shrink-0 border-r border-gray-200 bg-white sticky left-0 z-10">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b border-gray-100 relative">
              <span className="absolute -top-3 left-2 text-xs font-medium text-gray-400">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 relative min-w-[700px]">
          {/* Background grid lines */}
          {hours.map((hour) => (
            <div key={hour} className="col-span-7 h-20 border-b border-gray-100 pointer-events-none"></div>
          ))}
          
          {/* Day Columns */}
          <div className="absolute inset-0 grid grid-cols-7">
            {days.map((day) => {
              const dayPosts = posts.filter(post => isSameDay(new Date(post.scheduledAt || post.createdAt), day));
              
              return (
                <div 
                  key={day.toString()} 
                  className="relative border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50/30"
                  onClick={() => onDayClick(day)}
                >
                  {dayPosts.map((post, idx) => {
                    const postDate = new Date(post.scheduledAt || post.createdAt);
                    const topPercent = ((postDate.getHours() * 60 + postDate.getMinutes()) / (24 * 60)) * 100;
                    
                    return (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(post);
                        }}
                        className={`absolute p-1.5 rounded border shadow-sm cursor-pointer overflow-hidden flex flex-col ${getPlatformColor(post.platforms)}`}
                        style={{ 
                          top: `${topPercent}%`, 
                          minHeight: "40px",
                          left: `calc(0.25rem + ${idx * 8}px)`,
                          right: "0.25rem",
                          zIndex: 10 + idx
                        }}
                        title={post.content}
                      >
                        <div className="text-[10px] font-bold mb-0.5 opacity-80 leading-tight flex items-center gap-1">
                          <PlatformIcon platforms={post.platforms} />
                          {format(postDate, "h:mma").toLowerCase()}
                          <span className="opacity-70 font-normal truncate">{post.content || "Media"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DayViewProps {
  currentDate: Date;
  posts: any[];
  onEventClick: (post: any) => void;
}

export function DayView({ currentDate, posts, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const dayPosts = posts.filter(post => isSameDay(new Date(post.scheduledAt || post.createdAt), currentDate));

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="py-4 px-6 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">{format(currentDate, "EEEE, MMMM do")}</h2>
      </div>
      
      <div className="flex flex-1 overflow-y-auto relative no-scrollbar">
        <div className="w-20 shrink-0 border-r border-gray-200 bg-white sticky left-0 z-10">
          {hours.map((hour) => (
            <div key={hour} className="h-24 border-b border-gray-100 relative">
              <span className="absolute -top-3 left-4 text-sm font-medium text-gray-400">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex-1 relative">
          {/* Grid lines */}
          {hours.map((hour) => (
            <div key={hour} className="h-24 border-b border-gray-100"></div>
          ))}
          
          {/* Post Blocks */}
          <div className="absolute inset-0 pl-4 pr-6 pt-0">
            {dayPosts.map((post, idx) => {
              const postDate = new Date(post.scheduledAt || post.createdAt);
              const topPercent = ((postDate.getHours() * 60 + postDate.getMinutes()) / (24 * 60)) * 100;
              
              return (
                <div
                  key={post.id}
                  onClick={() => onEventClick(post)}
                  className={`absolute p-3 rounded-lg border shadow-sm cursor-pointer ${getPlatformColor(post.platforms)}`}
                  style={{ 
                    top: `${topPercent}%`, 
                    minHeight: "60px",
                    left: `calc(1rem + ${idx * 12}px)`,
                    right: `calc(1.5rem - ${idx * 4}px)`,
                    zIndex: 10 + idx
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="bg-white/50 border-white/20 capitalize font-medium text-[10px] px-1.5 py-0 h-4 flex items-center gap-1">
                      <PlatformIcon platforms={post.platforms} />
                      {post.platforms[0] || "General"}
                    </Badge>
                    <span className="text-xs font-bold opacity-80">{format(postDate, "h:mma").toLowerCase()}</span>
                    {(post.status === "published") && (
                      <Badge className="ml-auto bg-green-500/20 text-green-700 hover:bg-green-500/30 font-medium text-[10px] h-4">Published</Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{post.content}</p>
                </div>
              );
            })}
            
            {dayPosts.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-gray-400">
                No posts scheduled for this day. Click anywhere to schedule one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
